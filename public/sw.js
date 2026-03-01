self.addEventListener('push', (event) => {
    event.waitUntil((async () => {
      let raw = '';
      let data = {};
  
      if (event.data) {
        raw = event.data.text();
        
        try { data = raw ? JSON.parse(raw) : {}; }
        catch { console.warn('[SW] payload não é JSON. A usar como body.'); data = { body: raw }; }
      } else {
        console.warn('[SW] push sem event.data');
      }
  
      const p = data.payload || data;
  
      const sane = (v, fb) =>
        (typeof v === 'string' && v.trim() && !['undefined','null'].includes(v.trim().toLowerCase())) ? v : fb;
  
      const title = sane(p.title, 'Notification');
      const options = {
        body: sane(p.body ?? p.message, 'You have a new message!'),
        icon: 'push-icon/test.png'
      };
  

      await self.registration.showNotification(title, options);
    })());
  });
  
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil((async () => {
      const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });
      if (all.length) {
        await all[0].focus();
        try { await all[0].navigate(url); } catch {}
        return;
      }
      await clients.openWindow(url);
    })());
  });
  
  // Atualização imediata do SW (evita SW antigo em cache)
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));