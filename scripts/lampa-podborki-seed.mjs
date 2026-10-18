// Собирает стартовый снимок топов для Lampa-плагина «Подборки» (public/lampa/podborki.js).
// Списки берутся с Letterboxd, TMDB id — со страниц фильмов. Ключи не нужны.
// Запуск: node scripts/lampa-podborki-seed.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const OUT = new URL('../public/lampa/podborki.json', import.meta.url)
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'

// Должен совпадать со списком LB_LISTS в плагине
const LISTS = {
    lb500: 'official/list/letterboxds-top-500-films',
    imdb250: 'dave/list/imdb-top-250',
    lb2020s: 'official/list/top-250-films-of-the-2020s',
    lbhorror: 'official/list/top-250-horror-films',
    lbanim: 'official/list/top-250-animated-films',
    lbdocs: 'official/list/top-250-documentary-films',
    m1001: 'peterstanley/list/1001-movies-you-must-see-before-you-die',
}

async function fetchText(url, attempt = 0) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en' } })
    if (res.status === 429 || res.status >= 500) {
        if (attempt > 4) throw new Error(res.status + ' ' + url)
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)))
        return fetchText(url, attempt + 1)
    }
    if (!res.ok) throw new Error(res.status + ' ' + url)
    return res.text()
}

async function listSlugs(path) {
    const slugs = []
    for (let page = 1; page < 30; page++) {
        const html = await fetchText(`https://letterboxd.com/${path}/page/${page}/`)
        const found = [...html.matchAll(/data-item-slug="([^"]+)"/g)].map(m => m[1])
        if (!found.length) break
        slugs.push(...found)
        if (!html.includes(`/page/${page + 1}/`)) break
    }
    return slugs
}

async function resolveSlug(slug) {
    const html = await fetchText(`https://letterboxd.com/film/${slug}/`)
    const id = html.match(/data-tmdb-id="(\d+)"/)
    const type = html.match(/data-tmdb-type="(\w+)"/)
    return id ? (type && type[1] === 'tv' ? 't' : 'm') + id[1] : ''
}

async function pool(items, size, fn) {
    let i = 0
    await Promise.all(Array.from({ length: size }, async () => {
        while (i < items.length) await fn(items[i++])
    }))
}

const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { map: {} }
const map = prev.map || {}
const lists = {}

for (const [key, path] of Object.entries(LISTS)) {
    lists[key] = await listSlugs(path)
    console.log(key, lists[key].length)
}

const missing = [...new Set(Object.values(lists).flat())].filter(s => !(s in map))
let done = 0
await pool(missing, 6, async slug => {
    try { map[slug] = await resolveSlug(slug) }
    catch (e) { console.warn(slug, e.message) }
    if (++done % 100 === 0) console.log('resolved', done, '/', missing.length)
})

const out = {
    updated: new Date().toISOString().slice(0, 10),
    lists: Object.fromEntries(Object.entries(lists).map(([k, slugs]) => [k, slugs.map(s => map[s]).filter(Boolean)])),
    map,
}
writeFileSync(OUT, JSON.stringify(out))
console.log('saved', OUT.pathname)
