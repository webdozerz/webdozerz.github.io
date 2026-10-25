// Яндекс Метрика для старых статичных концептов в public/redesign/.
// Nuxt-страницы считает модуль @artmizu/yandex-metrika-nuxt (nuxt.config.ts).
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
    defer: true,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });

  ym(YM_ID, "hit", location.href, { referer: document.referrer });
})();
