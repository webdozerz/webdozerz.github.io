// Яндекс Метрика для всего andryushov.me: Nuxt-страниц и статичных концептов в public/redesign/.
// Номер счётчика задаётся здесь, в одном месте.
(function () {
  var YM_ID = 113726820;
  if (!YM_ID || location.hostname === "localhost" || location.hostname === "127.0.0.1") return;

  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) return;
    }
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=" + YM_ID, "ym");

  ym(YM_ID, "init", {
    defer: true, // первый и последующие хиты в Nuxt шлёт плагин plugins/metrika.client.ts
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });

  // Статичным HTML-страницам плагин не нужен: хит отправляем сразу, если Nuxt на странице нет.
  window.ymHit = function (url, referer) {
    ym(YM_ID, "hit", url, { referer: referer });
  };
  document.addEventListener("DOMContentLoaded", function () {
    if (!window.__NUXT__ && !document.getElementById("__nuxt")) window.ymHit(location.href, document.referrer);
  });
})();
