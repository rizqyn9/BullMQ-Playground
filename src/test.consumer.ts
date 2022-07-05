import {
  FlowProducer,
  Worker,
  QueueScheduler,
  QueueEvents,
  Queue,
  Job,
} from "bullmq"
import { connection } from "./config"

export const STEPS = "steps"

let jobCache: Job

const stepWorker = new Worker(
  STEPS,
  async (job: Job) => {
    jobCache = job
    if (job.name == "offeringTalent") {
      return await performOfferingTalent(job)
    } else if (job.name) {
      console.log(job.name)
      return Promise.resolve()
    }
  },
  { connection }
)

const s = new Worker(
  STEPS,
  async (job: Job) => {
    console.log({ jobId: job.id, jobName: job.name })
    return Promise.resolve()
  },
  { connection, prefix: "Invoice" }
)

stepWorker.on("completed", (job) => {
  if (job.name == "offeringTalent") {
    console.log(job.data)
  }
})

setTimeout(async () => {
  jobCache?.update({ ...jobCache.data, approved: true })
}, 1_000)

const performOfferingTalent = async (job: Job): Promise<string | void> => {
  if (typeof job.data.approved == "undefined") return Promise.reject()
  else if (job.data.approved) return Promise.resolve("Approved talent")
  else return Promise.resolve("Rejected by talent")
}
