import { FirehoseSubscription } from './subscription'
import { Config } from './types/config'
import { ReplyBotFarm } from './util/replyBotFarm'

export class FeedGenerator {
  public firehose: FirehoseSubscription
  public cfg: Config

  constructor(
    firehose: FirehoseSubscription,
    cfg: Config,
  ) {
    this.firehose = firehose
    this.cfg = cfg
  }

  static async create(cfg: Config) {
    const replyBotFarm = new ReplyBotFarm(cfg.replyBots);
    const firehose = new FirehoseSubscription(cfg.subscriptionEndpoint, replyBotFarm)

    return new FeedGenerator(firehose, cfg)
  }

  async start() {
    this.firehose.run(this.cfg.subscriptionReconnectDelay)
  }
}

export default FeedGenerator
