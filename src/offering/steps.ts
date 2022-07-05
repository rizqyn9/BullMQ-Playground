import {
  FlowProducer,
  Worker,
  QueueScheduler,
  QueueEvents,
  Queue,
  Job,
} from "bullmq"
import { connection } from "../config"
import { createInvoice, orderCache } from "."

export const STEPS = "steps"
const stepsCache = new Queue(STEPS, { connection })
const stepsCacheEvent = new QueueEvents(STEPS, { connection })
const stepsScheduled = new QueueScheduler(STEPS, { connection })

stepsCacheEvent.on("completed", async (data) => {
  const job: Job | undefined = await stepsCache.getJob(data.jobId)

  if (!job) return

  // console.log({ data, job: job?.data.orderCache })
  if (job.name == "offeringTalent" && job?.data.orderCache) {
    await createInvoice({ orderCacheId: job.data.orderCache })
  }
})

export default stepsCache
