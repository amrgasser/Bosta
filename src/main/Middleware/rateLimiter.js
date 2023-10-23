import redisClient from "../../redis-client.js"
const rateLimiter = ({ timeAllowed, numberOfHits }) => {
    return async (req, res, next) => {

        const ip = req.connection.remoteAddress
        const requests = await redisClient.incr(ip)

        let ttl;
        if (requests == 1) {
            await redisClient.expire(ip, timeAllowed)
            ttl = timeAllowed
        } else {
            ttl = await redisClient.ttl(ip)
        }

        if (requests > numberOfHits) {
            console.log("PLEASE WAIT FOR: " + ttl);
            return res.status(503)
        }
        next()
    }

}

export default rateLimiter