let eventQueue = [];
let lastSendTime = Date.now();
const ANALYTICS_ENDPOINT = 'http://localhost:3000/analytics-endpoint';
const MAX_QUEUE_SIZE = 10;
const MAX_TIME = 5000;

self.addEventListener('message', event => {
  eventQueue.push(event.data);
  
  if (shouldSendEvents()) {
    sendEvents();
  }
});

function shouldSendEvents() {
  const timeSinceLastSend = Date.now() - lastSendTime;
  return eventQueue.length >= MAX_QUEUE_SIZE || timeSinceLastSend >= MAX_TIME;
}

function sendEvents() {
  fetch(ANALYTICS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(eventQueue),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    console.log('Sent analytics data');
    eventQueue = [];
    lastSendTime = Date.now();
  }).catch(error => {
    console.log('Failed to send analytics data', error);
    lastSendTime = Date.now();
  });
}

setInterval(() => {
  if (eventQueue.length > 0) {
    sendEvents();
  }
}, MAX_TIME);
