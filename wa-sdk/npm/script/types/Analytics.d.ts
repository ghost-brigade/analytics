/**
 * AnalyticsConfig
 *
 * @description
 * Configuration object for the Analytics class.
 *
 * @property {string} id - The ID of the analytics instance.
 * @property {string} endpoint - The endpoint to send analytics events to.
 * @property {string} appId - The ID of the app the analytics instance is for.
 * @property {string} appSecret - The secret key for the analytics instance, only used for server side analytics.
 * @property {number} maxQueueSize - The maximum number of events to queue before sending them to the endpoint.
 * @property {number} maxTime - The maximum time to wait before sending queued events to the endpoint.
 */
export type AnalyticsConfig = {
    id?: string;
    endpoint: string;
    appSecret?: string;
    appId: string;
    maxQueueSize?: number;
    maxTime?: number;
};
