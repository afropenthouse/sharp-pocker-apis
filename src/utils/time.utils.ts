//accepts a number in minutes and returns a future dateTime
export function setTimeInFuture(timeFromEpoch:number){
    const currentTime = new Date()
    const futureTime = new Date(currentTime.getTime() + timeFromEpoch * 60000)
    return futureTime
}
