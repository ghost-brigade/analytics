import { Analytics, EventType } from "wa-sdk";

const analytics = new Analytics({ appId: "SOME_APP_ID", endpoint: "http://localhost:3000/events" });

analytics.sendEvent({type: EventType.PageView, data: { url: "value" }});
