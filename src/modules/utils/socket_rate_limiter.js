export class RateLimiter {
  constructor() {
    this.requestLimits = new Map();
  }

  limit(socket, eventName, maxRequests, timeWindow, callback) {
    const now = Date.now();
    const userRequests = this.requestLimits.get(socket.id) || {};

    if (!userRequests[eventName]) {
      userRequests[eventName] = [];
    }

    userRequests[eventName] = userRequests[eventName].filter(
      (timestamp) => now - timestamp < timeWindow
    );

    if (userRequests[eventName].length < maxRequests) {
      userRequests[eventName].push(now);
      this.requestLimits.set(socket.id, userRequests);
      callback();
    } else {
      socket.emit("error", {
        message: `Too many requests for ${eventName}, please wait`,
      });
    }
  }

  removeUser(socketId) {
    this.requestLimits.delete(socketId);
  }
}
