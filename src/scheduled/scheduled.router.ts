import { Router } from "express"
import { addScheduler, scheduledQueue } from "."

const app = Router()

app.get("/add", async (_, res) => {
  res.json({
    res: await addScheduler("test", { test: "Scheduled" }),
  })
})

app.get("/data", async (_, res) => {
  const a = await scheduledQueue.getJobs("completed")
  const id = await scheduledQueue.getJob((5).toString())
  res.json({ result: a, id })
})
export default app
