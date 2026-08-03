type RateLimitEntry = {
    timestamps: number[]
}

const rateLimitMap = new Map<string, RateLimitEntry>()
const WINDOW_SIZE_IN_SECONDS = 60
const MAX_REQUESTS = 300

export function rateLimiter(ip: string): boolean {
    const currentTime = Math.floor(Date.now() / 1000)

    const entry = rateLimitMap.get(ip) || { timestamps: [] }

    entry.timestamps = entry.timestamps.filter(timestamp => timestamp > currentTime - WINDOW_SIZE_IN_SECONDS)

    entry.timestamps.push(currentTime)

    rateLimitMap.set(ip, entry)

    return entry.timestamps.length <= MAX_REQUESTS
}
