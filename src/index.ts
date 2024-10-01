import dotenv from 'dotenv'
import FeedGenerator from './feed-generator'
import { bots } from './bot'

const run = async () => {
  dotenv.config()
  const feedGenerator = await FeedGenerator.create({
    subscriptionEndpoint:
      maybeStr(process.env.FEEDGEN_SUBSCRIPTION_ENDPOINT) ?? "wss://bsky.network",
    subscriptionReconnectDelay:
      maybeInt(process.env.FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY) ?? 3000,
    replyBots: bots
  })
  await feedGenerator.start()
  console.log(
    `🤖 running feed generator`,
  )
}

const maybeStr = (val?: string) => {
  if (!val) return undefined
  return val
}

const maybeInt = (val?: string) => {
  if (!val) return undefined
  const int = parseInt(val, 10)
  if (isNaN(int)) return undefined
  return int
}

run()
