import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://2d77b854e05d11f0bb16f6893da4becc@o4510586915192832.ingest.us.sentry.io/4510586915192832",

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Environment
  environment: import.meta.env.MODE || "development",

  // Enable in production only
  enabled: import.meta.env.PROD,
});
