import {
  FlowProducer,
  Worker,
  QueueScheduler,
  QueueEvents,
  Queue,
  Job,
} from "bullmq"
import { connection } from "../config"
import stepsCache, { STEPS } from "./steps"

const offeringFlow = new FlowProducer({ connection })
export const orderCache = new Queue("order", { connection })
const orderCacheEvent = new QueueEvents("order", { connection })

orderCacheEvent.on("added", (job) => console.log(`${job.name} created`))

const createOrder = async () => {
  const order = await orderCache.add("orderData", {})

  const offering = await stepsCache.add(
    "offeringTalent",
    {
      orderCache: order.id,
    },
    {
      attempts: 5,
      backoff: {
        delay: 1000,
        type: "fixed",
      },
    }
  )
}

const flowInvoice = new FlowProducer({ connection })
const createInvoice = async ({ orderCacheId }: { orderCacheId: string }) => {
  // Create Qris
  // Create Render QRIS UI
  // Send to user
  // Run expired invoice
  console.log({ orderCacheId })

  const orderJob = await orderCache.getJob(orderCacheId)

  if (!orderJob) return

  const invoiceJobId = await flowInvoice
    .add({
      name: "Invoice",
      queueName: STEPS,
      data: { orderCacheId },
      children: [
        {
          name: "SendInvoice",
          prefix: "Invoice",
          queueName: STEPS,
          data: { orderCacheId },
          children: [
            {
              name: "GenerateQRCode",
              prefix: "Invoice",
              queueName: STEPS,
              data: { orderCacheId },
              opts: {
                // attempts: 5,
                // backoff: {
                //   delay: 5_000,
                //   type: "fixed",
                // },
              },
              children: [
                {
                  name: "QRISInvoice",
                  prefix: "Invoice",
                  queueName: STEPS,
                  data: { orderCacheId },
                  opts: {},
                },
              ],
            },
          ],
        },
      ],
    })
    .then((val) => val.job.id)

  await orderJob.update({ ...orderJob.data, invoiceJobId })
  return invoiceJobId
}

type TTest = {
  test: number
}

export const woker = new Worker(
  "order",
  async (job: Job<TTest>) => {
    await job.update({ test: job.data.test + 1 })

    console.log(job.data)
    return Promise.reject()
  },
  { connection, skipDelayCheck: false }
)

export const test = async () => {
  const a: Job<TTest> = await orderCache.add(
    "tesc1",
    { test: 1 },
    {
      attempts: 5,
      backoff: {
        delay: 2_000,
        type: "fixed",
      },
      // removeOnFail: true,
    }
  )

  // setTimeout(async () => {
  //   console.log(await orderCache.getRepeatableJobs())
  // }, 2_000)
}

export { createInvoice }
