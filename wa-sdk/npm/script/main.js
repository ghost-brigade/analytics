"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analytics = exports.serverSendEvent = void 0;
const isBrowser_js_1 = require("./utils/isBrowser.js");
const Event_js_1 = require("./types/Event.js");
async function serverSendEvent(data, id) {
    Event_js_1.EventType.ServerEvent,
        data.id = id,
        data.timestamp = new Date().getTime();
    await fetch('http://localhost:3000/analytics-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: Event_js_1.EventType.ServerEvent,
            data: data
        })
    });
}
exports.serverSendEvent = serverSendEvent;
class Analytics {
    constructor(config) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.config = config;
        this.init(config);
    }
    async init(config) {
        if (!(0, isBrowser_js_1.isBrowser)()) {
            return;
        }
        if (!config.id) {
            config.id = await this.generateUserIdentifier();
        }
        await this.registerServiceWorker();
        this.sendEvent({
            type: Event_js_1.EventType.PageView, data: {
                timestamp: new Date().getTime(), url: globalThis.location.href
            }
        });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.sendEvent({
                    type: Event_js_1.EventType.PageLeave, data: {
                        timestamp: new Date().getTime(), url: globalThis.location.href
                    }
                });
            }
        });
        this.registerEvents();
    }
    async generateUserIdentifier() {
        const { language, vendor, appVersion, platform, productSub } = navigator;
        const { width, height, colorDepth } = globalThis.screen;
        const identifier = `${language}${vendor}${appVersion}${platform}${productSub}${width}${height}${colorDepth}`;
        console.log(identifier);
        const msgBuffer = new TextEncoder().encode(identifier);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        console.log(hashHex);
        return hashHex;
    }
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service worker registration successful', registration);
            }
            catch (error) {
                console.log('Service worker registration failed', error);
            }
        }
    }
    sendEvent(eventData) {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            console.log(this.config);
            eventData.data.id = this.config.id;
            navigator.serviceWorker.controller.postMessage(eventData);
        }
        else {
            console.error('Service worker is not available');
        }
    }
    registerEvents() {
        if (!(0, isBrowser_js_1.isBrowser)()) {
            return;
        }
        const links = document.querySelectorAll('a');
        links.forEach((link) => {
            link.addEventListener('click', (event) => {
                this.sendEvent({ type: Event_js_1.EventType.LinkClick, data: { timestamp: new Date().getTime(), href: link.href } });
            });
        });
        const forms = document.querySelectorAll('form');
        forms.forEach((form) => {
            form.addEventListener('submit', (event) => {
                this.sendEvent({
                    type: Event_js_1.EventType.FormSubmit, data: {
                        timestamp: new Date().getTime(), action: form.action, method: form.method
                    }
                });
            });
        });
        document.addEventListener('click', (event) => {
            this.sendEvent({
                type: Event_js_1.EventType.Click, data: {
                    timestamp: new Date().getTime(), x: event.clientX, y: event.clientY
                }
            });
        });
    }
}
exports.Analytics = Analytics;
