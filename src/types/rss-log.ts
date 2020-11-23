export type RssLog = {
    url: string,
    request_time: number,
    amount_returned: number,
    status: "success" | "failure",
}