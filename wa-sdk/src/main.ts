import { isBrowser } from "./utils/isBrowser.ts";
import type { AnalyticsConfig } from "./types/Analytics.ts";
import { AnalyticsEvent, EventType } from "./types/Event.ts";

export { EventType };

/**
 * Analytics class
 */
export class Analytics {
  config: AnalyticsConfig;
  constructor(config: AnalyticsConfig) {
    this.config = config;
    if (!config.appId) {
      throw new Error("App ID must be provided");
    } else if (!isBrowser() && !config.appSecret) {
      throw new Error("App secret must be provided for server side analytics");
    } else if (!config.endpoint) {
      throw new Error("Analytics endpoint must be provided");
    }
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
      type: EventType.PageView,
      data: {
        url: window.location.href,
      },
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.sendEvent({
          type: EventType.PageLeave,
          data: {
            url: window.location.href,
          },
        });
      }
    });

    this.registerEvents();
  }

  private async generateUserIdentifier() {
    const { language, vendor, appVersion, platform, productSub } = navigator;
    const { width, height, colorDepth } = window.screen;

    const identifier =
      `${language}${vendor}${appVersion}${platform}${productSub}${width}${height}${colorDepth}`;
    console.log(identifier);
    const msgBuffer = new TextEncoder().encode(identifier);

    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
      "",
    );
    console.log(hashHex);
    return hashHex;
  }

  private async registerServiceWorker() {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      try {
        localStorage.setItem("analyticsConfig", JSON.stringify(this.config));
        const registration = await navigator.serviceWorker.register("/sw.js");
        navigator.serviceWorker.controller.postMessage(this.config);
        console.log("Service worker registration successful", registration);
      } catch (error) {
        console.log("Service worker registration failed", error);
      }
    }
  }

  async sendEvent(eventData: AnalyticsEvent) {
    eventData.data.id = this.config.id || await this.generateUserIdentifier();
    eventData.data.appId = this.config.appId;
    eventData.data.timestamp = new Date().getTime();
    if (
      "serviceWorker" in navigator && navigator.serviceWorker.controller &&
      isBrowser()
    ) {
      navigator.serviceWorker.controller.postMessage(eventData);
    } else {
      eventData.data.appSecret = this.config.appSecret;
      await fetch(this.config.endpoint as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          eventData,
        ),
      });
    }
  }

  private registerEvents() {
    if (!isBrowser()) {
      return;
    }
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        this.sendEvent({
          type: EventType.LinkClick,
          data: { href: link.href },
        });
      });
    });

    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.addEventListener("submit", () => {
        this.sendEvent({
          type: EventType.FormSubmit,
          data: {
            action: form.action,
            method: form.method,
          },
        });
      });
    });

    document.addEventListener("click", (event) => {
      this.sendEvent({
        type: EventType.Click,
        data: {
          x: event.clientX,
          y: event.clientY,
        },
      });
    });
  }
}
