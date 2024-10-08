import { ReplyBot } from "../types/bot";

const nameOfYourBot1: ReplyBot = {
    username: "YourBotUsername", 
    password: "YourBotPassword",
    did: "did:plc:YourBotDid", 
    replies: [
        {
            keyword: "keyword1", 
            messages: ["reply1", "reply2", "reply3"]
        },
        {
            keyword: "keyword2", 
            messages: ["reply"]
        },
    ]
}

const nameOfYourBot2: ReplyBot = {
    username: "YourBotUsername", 
    password: "YourBotPassword",
    did: "did:plc:YourBotDid",
    replies: [
        {
            keyword: "another keywords phrase", 
            messages: ["reply1", "reply2", "reply3"]
        },
    ]
}


// get the did at https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${YOUR_HANDLE}

export const bots: ReplyBot[] = [nameOfYourBot1, nameOfYourBot2];