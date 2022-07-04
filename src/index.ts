import { offeringQueue } from "./qris"
import app, { createBullDashboard } from "./server"
import QRISRouter from "./qris/qris.router"

createBullDashboard(offeringQueue)

app.use("/", QRISRouter)

app.listen(3000, () => console.log("http://localhost:3000"))
