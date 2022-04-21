import { ROUTE } from '../storage/constants.js';

export const initRouter = onRoute => {
  window.addEventListener(ROUTE.CHANGE_EVENT_NAME, e => {
    const { nextUrl } = e.detail;

    if (nextUrl) {
      history.pushState(null, null, nextUrl);
      onRoute();
    }
  });
};

export const push = nextUrl => {
  window.dispatchEvent(
    new CustomEvent(ROUTE.CHANGE_EVENT_NAME, {
      detail: { nextUrl: nextUrl },
    }),
  );
};
