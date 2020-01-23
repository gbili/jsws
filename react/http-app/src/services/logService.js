import * as Sentry from '@sentry/browser'

function init({dsn, release}) {
  Sentry.init({ dsn, release, });
}

function log(exception, scope) {
  if (typeof scope === 'undefined') {
    scope = 'debug';
  }
  Sentry.withScope(s => {
    s.setExtra(scope, false);
    Sentry.captureException(exception)
  });
}

export default {
  init,
  log,
};
