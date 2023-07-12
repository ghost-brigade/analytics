let eventQueue = [];
let lastSendTime = Date.now();

self.addEventListener("message", (event) => {
  eventQueue.push(event.data);

  if (shouldSendEvents()) {
    sendEvents();
  }
});

self.addEventListener("config", (event) => {
  ANALYTICS_ENDPOINT = event.data.endpoint;
  MAX_QUEUE_SIZE = event.data.maxQueueSize || 10;
  MAX_TIME = event.data.maxTime || 5000;
});

function shouldSendEvents() {
  const timeSinceLastSend = Date.now() - lastSendTime;
  return eventQueue.length >= MAX_QUEUE_SIZE || timeSinceLastSend >= MAX_TIME;
}

function sendEvents() {
  navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify(eventQueue));
  lastSendTime = Date.now();
  eventQueue = [];
}

setInterval(() => {
  if (eventQueue.length > 0) {
    sendEvents();
  }
}, MAX_TIME);
