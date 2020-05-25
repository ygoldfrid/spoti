import * as Sentry from "@sentry/browser";

function init() {
  Sentry.init({
    dsn:
      "https://0d06705b821a43f0b3077754f3052d37@o382445.ingest.sentry.io/5252111",
  });
}

function log(error) {
  Sentry.captureException(error);
}

export default {
  init,
  log,
};
