export type AnalyticsEvent = {
  type: EventType;
  data: {[key: string]: string | number};
};

export enum EventType {
  PageView = "pageview",
  Click = "click",
  FormSubmit = "formsubmit",
  Custom = "custom",
  MouseEvent = "mouseevent",
  PageLeave = "pageleave",
  LinkClick = "linkclick",
}
