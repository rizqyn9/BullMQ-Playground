import { Worker } from "bullmq"
import { connection } from "./config"
// import Init from "./comsumer.job"

// console.log(Init.isRunning())

new Worker(
  "order",
  async (job) => {
    console.log(job.data)
    await job.data({ test: job.data.test + 1 })
  },
  { connection }
)
