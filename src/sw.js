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

//@ DEV DON'T CACHE
if (import.meta.env.DEV) {
  console.log(import.meta.env);
  // Avoid caching on dev: force always go to the server
  registerRoute(
    ({request, url}) => {
      // ultimately true, but if you want to inspect requests in dev, we can use above params:
      return true;
    },
    new NetworkFirst({
      cacheName: "all-dev",
      plugins: [new CacheableResponsePlugin({statuses: [-1]})],
    })
  );
}

// @ PROD ROUTES
if (import.meta.env.PROD) {
  // // todo:   remove test:  This is just to log out the manifest and see what it is:

  let test = self.__WB_MANIFEST;
  console.log({test});
  // todo: see about this 404 needing a revision?
  let route404 = location.origin.concat("/404");
  let page404 = {url: route404};
  precacheAndRoute([...test, page404]);

  //----- HTML DOCS
  registerRoute(
    ({request, url}) => {
      const isSameOrigin = self.origin === url.origin;
      const isDoc = request.destination === "document";

      // request.headers.forEach(function (val, key) {
      //   console.log(key + " -> " + val);
      // });

      if (isSameOrigin && isDoc) {
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
        new ExpirationPlugin({
          purgeOnQuotaError: true,
        }),
      ],
    })
  );
}

// Cache CSS, and (non pre-cached JS)
registerRoute(
  ({request}) => {
    const isStyleOrScript =
      request.destination === "style" || request.destination === "script";
    const isSameOrigin = self.origin === url.origin;
    if (isSameOrigin && isStyleOrScript) {
      return true;
    } else {
      return false;
    }
  },
  new StaleWhileRevalidate({
    cacheName: "astro-lr-assets",
    plugins: [
      new CacheableResponsePlugin({statuses: [200]}),
      new ExpirationPlugin({
        purgeOnQuotaError: true,
        maxEntries: 30,
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
  // window.reload();
});
