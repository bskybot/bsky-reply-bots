
export type BotReply = {
    keyword: string
    messages: string[]
}

export type ReplyBot = {
    username: string
    password: string
    did: string
    replies: BotReply[]
}

export type PostBot = {
    username: string
    password: string
    did: string
    messages: string[]
}

export type Bot = ReplyBot | PostBot;