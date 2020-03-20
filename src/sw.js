import { precacheAndRoute } from 'workbox-prechaing';

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('fetch', e => {});
