"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTimeInFuture = setTimeInFuture;
//accepts a number in minutes and returns a future dateTime
function setTimeInFuture(timeFromEpoch) {
    var currentTime = new Date();
    var futureTime = new Date(currentTime.getTime() + timeFromEpoch * 60000);
    return futureTime;
}
