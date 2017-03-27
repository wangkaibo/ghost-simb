'use strict';

(function () {
  'use strict';



  /**
   * Service Worker Toolbox caching
   */

  var cacheVersion = '-toolbox-v1';
  var dynamicVendorCacheName = 'dynamic-vendor' + cacheVersion;
  var staticVendorCacheName = 'static-vendor' + cacheVersion;
  var staticAssetsCacheName = 'static-assets' + cacheVersion;
  var contentCacheName = 'content' + cacheVersion;
  var maxEntries = 50;

  self.importScripts('http://7xu5j5.com1.z0.glb.clouddn.com/sw-toolbox.js');

  self.toolbox.options.debug = true;

  // Cache own static assets
  self.toolbox.router.get('/assets/(.*)', self.toolbox.cacheFirst, {
    cache: {
      name: staticAssetsCacheName,
      maxEntries: maxEntries
    }
  });

  // cache dynamic vendor assets, things which have no other update mechanism like filename change/version hash
  self.toolbox.router.get('/css', self.toolbox.fastest, {
    origin: /fonts\.googleapis\.com/,
    cache: {
      name: dynamicVendorCacheName,
      maxEntries: maxEntries
    }
  });

  // Do not cache 网易云跟帖
  self.toolbox.router.get('/(.*)', self.toolbox.networkOnly, {
    origin: /163\.com/
  });
  self.toolbox.router.get('/(.*)', self.toolbox.networkOnly, {
    origin: /jiathis\.com/
  });


  // Cache all static vendor assets, e.g. fonts whose version is bind to the according url
  self.toolbox.router.get('/(.*)', self.toolbox.cacheFirst, {
    origin: /(fonts\.gstatic\.com|www\.google-analytics\.com)/,
    cache: {
      name: staticVendorCacheName,
      maxEntries: maxEntries
    }
  });

  self.toolbox.router.get('/content/(.*)', self.toolbox.fastest, {
    cache: {
      name: contentCacheName,
      maxEntries: maxEntries
    }
  });

  self.toolbox.router.get('/*', function (request, values, options) {
    if (!request.url.match(/(\/ghost\/|\/page\/)/) && request.headers.get('accept').includes('text/html')) {
      return self.toolbox.fastest(request, values, options);
    } else {
      return self.toolbox.networkOnly(request, values, options);
    }
  }, {
    cache: {
      name: contentCacheName,
      maxEntries: maxEntries
    }
  });

  // immediately activate this serviceworker
  self.addEventListener('install', function (event) {
    return event.waitUntil(self.skipWaiting());
  });

  self.addEventListener('activate', function (event) {
    return event.waitUntil(self.clients.claim());
  });

})();