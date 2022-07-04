import { Router } from "express"
import { addOrder } from "./index"

const app = Router()

app.get("/add", async (_, res) => {
  res.json(
    await addOrder({ id: Math.random().toFixed(), amount: Math.random() })
  )
})

export default app
