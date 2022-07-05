import app, { createBullDashboard } from "./server"
import QRISRouter from "./qris/qris.router"
import { offeringQueue } from "./qris"
import ScheduledRouter from "./scheduled/scheduled.router"
import { scheduledQueue } from "./scheduled"
import { test } from "./offering"
import { orderCache } from "./offering"
import stepsCache from "./offering/steps"

createBullDashboard(offeringQueue, scheduledQueue, orderCache, stepsCache)

test().then((val) => {})

// app.use("/", QRISRouter)
app.use("/", ScheduledRouter)

app.listen(3000, () => console.log("http://localhost:3000"))
