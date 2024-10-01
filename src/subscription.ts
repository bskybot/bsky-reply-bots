import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'
import { ReplyBotFarm } from './util/replyBotFarm';

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  constructor(
    public service: string,
    public replyBotFarm: ReplyBotFarm 
  ) {
    super(service); 
  }
  
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return
    const ops = await getOpsByType(evt)

    const posts = ops.posts.creates
      .reduce((entries: any, create) => {
        if(this.replyBotFarm.hasKeyword(create.record.text)) {
          entries.push({
            uri: create.uri,
            cid: create.cid,
            author: create.author,
            text: create.record.text,
            rootUri: create.record.reply?.root.uri ?? create.uri,
            rootCid: create.record.reply?.root.cid ?? create.cid,
            indexedAt: new Date().toISOString(),
          })
        }
        return entries;
      }, [])

    if (posts.length > 0) {
      posts.forEach((post) => {
        this.replyBotFarm.reactToPost(post);
      })
    }
  }
}
