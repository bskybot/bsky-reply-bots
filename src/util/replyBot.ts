import { AtpAgentOpts, BskyAgent } from '@atproto/api';
import { ReplyBot } from '../types/bot';
import type { FeedEntry, UriCid } from "../types/feed"

export class ReplyBotAgent extends BskyAgent {
    constructor(
        public opts: AtpAgentOpts,
        public bot: ReplyBot
    ) {
        super(opts)
    }

    buildReplyToPost (root: UriCid, parent: UriCid, message: string) {    
        return {
            "$type": "app.bsky.feed.post",
            text: message,
            createdAt: new Date().toISOString(),
            reply: {
                "root": root,
                "parent": parent
            }
        }
    }

    hasKeyword (text: string) {
        return this.bot.replies.map((entry) => entry.keyword).some((keyword) => {
            return text.toLowerCase().includes(keyword.toLowerCase());
        })
    }


    likeAndReplyIfFollower (post: FeedEntry) {
        if(this.hasKeyword(post.text)) {
            this.app.bsky.graph.getRelationships({actor: this.bot.did, others: [post.author]}).then((relations) => {
                if (relations.data.relationships[0].followedBy) {
                    let replies: any[] = [];
                    this.bot.replies.forEach((replyCfg) => {
                        if(post.text.toLowerCase().includes(replyCfg.keyword.toLowerCase())){
                            let replyMessage = "";
                            if(replyCfg.messages.length === 1) {
                                replyMessage = replyCfg.messages[0]
                            } else {
                                const randomIndex = Math.floor(Math.random() * replyCfg.messages.length);
                                replyMessage = replyCfg.messages[randomIndex] ?? replyCfg.messages[0];
                            }
    
                            const reply = this.buildReplyToPost(
                                {uri: post.rootUri, cid: post.rootCid}, 
                                {uri: post.uri, cid: post.cid}, 
                                replyMessage
                            );
    
                            replies.push(reply);
                        }
                    });
    
                    const replyTo = replies[Math.floor(Math.random() * replies.length)] ?? replies [0];
                    
                    this.like(post.uri, post.cid);
                    this.post(replyTo);
    
                }
            })
        }
    }
}

export const useReplyBotAgent = async (bot: ReplyBot) => {
    const botAgent = new ReplyBotAgent({
        service: 'https://bsky.social'
    }, bot)

    await botAgent.login({
        identifier: bot.username,
        password: bot.password!
    }).then((response) => {
        if (response.success) {
            console.log(`${bot.username} successfully logged in`);
        }
    }).catch((e) => {
        console.log(`an error occured: ${e}`);
    });
    
    return botAgent;
}