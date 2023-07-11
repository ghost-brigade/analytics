import { Analytics } from "wa-sdk";

const analytics = new Analytics({ id: "" });

analytics.sendEvent({type: "event_name", data: { key: "value" }});
