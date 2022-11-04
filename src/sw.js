import {precacheAndRoute, cleanupOutdatedCaches} from "workbox-precaching";
import {clientsClaim} from "workbox-core";
import {registerRoute} from "workbox-routing";
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
  CacheOnly,
} from "workbox-strategies";
import {CacheableResponsePlugin} from "workbox-cacheable-response";
import {ExpirationPlugin} from "workbox-expiration";

// Adds an activate event listener which will clean up incompatible precaches that were created by older versions of Workbox.
cleanupOutdatedCaches();

// manually clear all the caches for host for dev:
// console.log("clearing all the caches");
// caches.keys().then((keyList) =>
//   Promise.all(
//     keyList.map((key) => {
//       return caches.delete(key);
//     })
//   )
// );

// let x = ;
let test = self.__WB_MANIFEST;
console.log({test});
precacheAndRoute(test);

// Cache First
registerRoute(
  ({request, url}) => {
    const isSameOrigin = self.origin === url.origin;
    const isNavigation = request.mode === "navigate";
    const isDoc = request.destination === "document";

    // request.headers.forEach(function (val, key) {
    //   console.log(key + " -> " + val);
    // });

    if (isSameOrigin && isNavigation && isDoc) {
      console.log({request});
      return true;
    }
    // return request.mode === "navigate";
    return false;
  },
  new NetworkFirst({
    cacheName: "astro-pages",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

// 404 page:
registerRoute(
  ({request, url}) => {
    const isSameOrigin = self.origin === url.origin;
    const is404 = url.href === location.origin.concat("/404");
    if (isSameOrigin && is404) {
      console.log("caching 404!");
      return true;
    }
    // return request.mode === "navigate";
    return false;
  },
  new StaleWhileRevalidate({
    cacheName: "astro-pages-404",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

// SKIP WAITING prompt comes from the sw update process; Used for updating SW between builds
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
  window.reload();
});
