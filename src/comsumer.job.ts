import { Worker, Job } from "bullmq"
import { connection } from "./config"

const init = new Worker(
  "test",
  async (job: Job) => {
    console.log({ consumer: job })
    return "testNih"
  },
  { connection }
)

console.log("worker running")

init.on("active", (job) => {
  console.log(job)
})

export default init
