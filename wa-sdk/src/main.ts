import { isBrowser } from "./utils/isBrowser.ts";
import type { AnalyticsConfig } from "./types/Analytics.ts";
import { AnalyticsEvent, EventType } from "./types/Event.ts";

export class Analytics {
  config: AnalyticsConfig;
  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.init(config);
  }

  async init(config: AnalyticsConfig) {
    if (!isBrowser()) {
      return;
    }
    if (!config.id) {
      config.id = await this.generateUserIdentifier();
    }
    await this.registerServiceWorker();

    this.sendEvent({
      type: EventType.PageView, data: {
        timestamp: new Date().getTime(), url: window.location.href
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendEvent({
          type: EventType.PageLeave, data: {
            timestamp: new Date().getTime(), url: window.location.href
          }
        });
      }
    });

    this.registerEvents();
  }

  async generateUserIdentifier() {
    const { language, vendor, appVersion, platform, productSub } = navigator;
    const { width, height, colorDepth } = window.screen;

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
      } catch (error) {
        console.log('Service worker registration failed', error);
      }
    }
  }

  sendEvent(eventData: AnalyticsEvent) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      console.log(this.config)
      eventData.data.id = this.config.id;
      navigator.serviceWorker.controller.postMessage(eventData);
    } else {
      console.error('Service worker is not available');
    }
  }

  registerEvents() {
    if (!isBrowser()) {
      return;
    }
    const links = document.querySelectorAll('a');
    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        this.sendEvent({ type: EventType.LinkClick, data: { timestamp: new Date().getTime(), href: link.href } });
      });
    });

    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      form.addEventListener('submit', (event) => {
        this.sendEvent({
          type: EventType.FormSubmit, data: {
            timestamp: new Date().getTime(), action: form.action, method: form.method
          }
        });
      });
    });

    document.addEventListener('click', (event) => {
      this.sendEvent({
        type: EventType.Click, data: {
          timestamp: new Date().getTime(), x: event.clientX, y: event.clientY
        }
      });
    });
  }
}
