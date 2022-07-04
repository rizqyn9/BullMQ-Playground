import express from "express"
import type { Queue } from "bullmq"
import { createBullBoard } from "@bull-board/api"
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter"
import { ExpressAdapter } from "@bull-board/express"

const app = express()

const createBullDashboard = (...args: Array<Queue>) => {
  const serverAdapter = new ExpressAdapter()
  serverAdapter.setBasePath("/ui")
  createBullBoard({
    queues: [...args.map((val) => new BullMQAdapter(val))],
    serverAdapter,
  })

  app.use("/ui", serverAdapter.getRouter())
}

export default app
export { createBullDashboard }
