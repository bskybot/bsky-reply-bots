import { ReplyBot } from "../types/bot"
import { FeedEntry } from "../types/feed"
import { ReplyBotAgent, useReplyBotAgent } from "./replyBot"

export class ReplyBotFarm {
    botAgents: ReplyBotAgent[] = []
    keywords: string[] = []
    constructor(
        public bots: ReplyBot[]
    ){
        bots.forEach(async (bot) => {
            await useReplyBotAgent(bot).then((agent) => {
                this.botAgents.push(agent);
                this.keywords = this.keywords.concat(bot.replies.map((entry) => entry.keyword)); 
            });
        })
    }

    hasKeyword (text: string) {
        return this.keywords.some((keyword) => {
            return text.toLowerCase().includes(keyword.toLowerCase());
        });
    }

    reactToPost (post: FeedEntry) {
        this.botAgents.forEach((botAgent) => {
            botAgent.likeAndReplyIfFollower(post);
        })
    }
}