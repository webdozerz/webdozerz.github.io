// Хиты Яндекс Метрики при навигации внутри Nuxt (счётчик подключает public/metrika.js).
declare global {
  interface Window {
    ymHit?: (url: string, referer: string) => void;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  let referer = document.referrer;

  const hit = () => {
    const url = location.href;
    window.ymHit?.(url, referer);
    referer = url;
  };

  nuxtApp.hook("app:mounted", hit);
  router.afterEach((to, from) => {
    if (to.fullPath !== from.fullPath && from.matched.length) nextTick(hit);
  });
});
