const CACHE_NAME = 'escaner-almacen-v1';
// Lista de archivos que se guardarán en el dispositivo
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './data.json',
  './manifest.json'
  // La librería externa de QR se cachea automáticamente en la primera carga,
  // o puedes descargarla y referenciarla localmente si prefieres.
];

// 1. Instalar: Guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache abierto');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Fetch: Intercepta las peticiones. Si está en caché, lo devuelve. Si no, va a la red.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Devuelve el recurso cacheado si existe, sino lo busca en la red
      return response || fetch(event.request);
    })
  );
});

// 3. Activar: Limpia cachés antiguos si cambias la versión (CACHE_NAME)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
