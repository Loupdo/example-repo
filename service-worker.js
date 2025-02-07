self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("my-cache").then((cache) => {
      return cache.addAll([
        "/e-commerce.css",
        "/Apple.jpg",
        "/Banana.jpg",
        "/Cherry.jpg",
        "/mango.png",
        "/pomegranate.jpg",
        "/Watermelon.jpg"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});