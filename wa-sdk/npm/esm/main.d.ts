import type { AnalyticsConfig } from "./types/Analytics.js";
import { AnalyticsEvent, EventType } from "./types/Event.js";
export { EventType };
/**
 * Analytics class
 */
export declare class Analytics {
    config: AnalyticsConfig;
    constructor(config: AnalyticsConfig);
    init(config: AnalyticsConfig): Promise<void>;
    private generateUserIdentifier;
    private registerServiceWorker;
    sendEvent(eventData: AnalyticsEvent): Promise<void>;
    private registerEvents;
}
