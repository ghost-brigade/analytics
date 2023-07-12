export type AnalyticsEvent = {
    type: EventType;
    data: {
        timestamp?: number;
        id?: string;
        appSecret?: string;
        appId?: string;
    } & {
        [key: string]: string | number;
    };
};
export declare enum EventType {
    PageView = "pageview",
    Click = "click",
    FormSubmit = "formsubmit",
    Custom = "custom",
    MouseEvent = "mouseevent",
    PageLeave = "pageleave",
    LinkClick = "linkclick",
    ServerEvent = "serverevent"
}
