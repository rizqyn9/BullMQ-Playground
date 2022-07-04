import { Worker } from "bullmq"
import { connection } from "./config"

const a = new Worker("asdasd", () => Promise.resolve(), { connection })
console.log("Worker")

export default a
