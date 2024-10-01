export type FeedEntry = {
    uri: string
    cid: string
    author: string,
    text: string,
    rootUri: string,
    rootCid: string
    indexedAt?: Date
}

export type FeedData = {
    data: {feed: FeedEntry[], cursor: string},
}

export type UriCid = {cid: string, uri: string};