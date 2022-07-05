import { Worker, QueueScheduler, QueueEvents, Queue } from "bullmq"
import { connection } from "../config"
import { OFFERING } from "./qris.config"

const delay = (time: number) => new Promise((res) => setTimeout(res, time))

const offeringQueue = new Queue(OFFERING, { connection })
const offeringQueueEvent = new QueueEvents(OFFERING, { connection })
const offeringScheduled = new QueueScheduler(OFFERING, { connection })
const offeringWorker = new Worker(
  OFFERING,
  async (job) => {
    // console.log({ offeringWorker: job })
    // console.log({ name: job.name })

    await delay(5_000)
    return Promise.resolve("Success")
    // throw new Error("asdasd")
  },
  { connection }
)

/* ------------------------------ Worker Event ------------------------------ */

offeringWorker.on("completed", async (job, res) => {
  console.log({ completedWorker: { job, res } })

  // remove Order
  await offeringQueue.removeRepeatableByKey(job.repeatJobKey!).then(
    (res) => {
      if (res) console.log(`Remove ${job.repeatJobKey}`)
    },
    (rej) => console.log(rej)
  )
})

/* ------------------------------- QueueEvent ------------------------------- */
offeringQueueEvent.on("added", (job) => console.log(`New Job ${job.name}`))

offeringQueueEvent.on("delayed", (job, id) =>
  console.log({ delayed: JSON.stringify({ job, id }) })
)

offeringQueueEvent.on("completed", async (job, id) => {
  console.log({ complete: JSON.stringify({ job, id }) })
})

offeringQueueEvent.on("failed", (job, id) =>
  console.log({ failed: JSON.stringify({ job, id }) })
)

/* ------------------------------ Add New Order ----------------------------- */

type OrderProps = { id: string; amount: number }
const addOrder = async (arg: OrderProps) => {
  return await offeringQueue.add(
    arg.id,
    { ...arg },
    {
      repeat: {
        every: 20000,
        limit: 2,
      },
    }
  )
}

export {
  offeringScheduled,
  offeringQueueEvent,
  offeringQueue,
  offeringWorker,
  addOrder,
}
