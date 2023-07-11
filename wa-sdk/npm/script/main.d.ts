import type { AnalyticsConfig } from "./types/Analytics.js";
import { AnalyticsEvent } from "./types/Event.js";
export declare function serverSendEvent(data: {
    [key: string]: string | number;
}, id: string): Promise<void>;
export declare class Analytics {
    config: AnalyticsConfig;
    constructor(config: AnalyticsConfig);
    init(config: AnalyticsConfig): Promise<void>;
    generateUserIdentifier(): Promise<string>;
    registerServiceWorker(): Promise<void>;
    sendEvent(eventData: AnalyticsEvent): void;
    registerEvents(): void;
}
