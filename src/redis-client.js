import Redis from 'redis'
const redis = Redis.createClient()
await redis.connect()
export default redis