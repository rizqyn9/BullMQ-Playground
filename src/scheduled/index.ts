import {
  Worker,
  QueueScheduler,
  QueueEvents,
  Queue,
  FlowProducer,
  Job,
} from "bullmq"
import { connection } from "../config"
import { DELAYED } from "./scheduled.config"

const scheduledQueue = new Queue(DELAYED, { connection })
const flowProducer = new FlowProducer({ connection })
const scheduledScheduler = new QueueScheduler(DELAYED, { connection })
const scheduledWorker = new Worker(
  DELAYED,
  async (job: Job) => {
    console.log({ job })
    await new Promise((res) => setTimeout(res, 5_000))
    return Promise.resolve()
  },
  { connection }
)

// flowProducer.add({
//   name: "TestFlow",
//   queueName: DELAYED,
//   data: <{ data: string }>{ data: "Parent" },
//   children: [
//     {
//       name: "ChildFlow",
//       queueName: DELAYED,
//       data: {
//         flow: "Child",
//       },
//     },
//   ],
// })

/* --------------------------- Schedule Controller -------------------------- */

const addScheduler = async (id: string, data: Record<string, any>) => {
  return await scheduledQueue.add(id, data, {
    // delay: 5_000,
  })
}

export { scheduledQueue, scheduledScheduler, scheduledWorker, addScheduler }
