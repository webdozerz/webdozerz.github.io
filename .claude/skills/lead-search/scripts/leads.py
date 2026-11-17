#!/usr/bin/env python3
"""Технические проверки для поиска лидов. Только стандартная библиотека.

  python3 -I leads.py norm <url|домен> ...       канонический домен (без www, IDN в punycode)
  python3 -I leads.py check <url> ...            GET с редиректами: код, итоговый адрес, title,
                                                 размер, viewport, маркеры платформы, парковка
  python3 -I leads.py seen <seen.md> <dir>       сверка seen.md с выгрузкой трекера
                                                 (<dir> — out_dir ArtifactData list коллекций
                                                 sites и removed: sites/*.json, removed/*.json)
  python3 -I leads.py validate <file.json>       проверка JSON агента: поля, ниши, fit, дубли
  python3 -I leads.py catalog <с> <по> [seen.md] страницы <с>..<по> списка производителей
                                                 aboutpartner.ru: компании с сайтом,
                                                 TSV домен (punycode)/регион/город/название/карточка,
                                                 без доменов из seen.md

Решений скрипт не принимает: печатает наблюдения, отбор делает сессия по criteria.md.
"""
import glob
import json
import os
import re
import socket
import sys
import urllib.error
import urllib.parse
import urllib.request

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'

# Маркеры платформ: имя → regex по HTML. Megagroup — и латиницей, и кириллицей.
PLATFORMS = {
    'Megagroup': r'megagroup|/g/s3/|shop2|мегагрупп',
    '1С-Битрикс': r'/bitrix/',
    'WordPress': r'/wp-content/|/wp-includes/',
    'Tilda': r'tildacdn|tilda\.ws|data-tilda',
    'Wix': r'wixstatic|wix\.com|_wixCssImports',
    'Taplink': r'taplink',
    'Creatium': r'creatium',
    'LPmotor': r'lpmotor',
    'uKit': r'ukit\.com|ukit-',
    'Nethouse': r'nethouse',
    'OpenCart': r'catalog/view/theme|route=product',
    'InSales': r'insales',
    'Drupal': r'/sites/default/files|drupal',
    'Joomla': r'/media/jui/|joomla',
    'MODX': r'modx|/assets/components/',
    'Adobe Muse': r'muse_|adobe muse',
}
PARKED = r'домен (продаётся|продается|припаркован)|this domain (is|may be) for sale|parked domain|reg\.ru.*домен|сайт заблокирован|account suspended|hosting.*заглушк'
# Только страницы-заглушки защиты: обычная reCAPTCHA в форме обратной связи — не стена.
BOT_WALL = r'ddos-guard|attention required|just a moment\.\.\.|checking your browser|cf-chl|проверка браузера|smartcaptcha.*подтвердите'


def norm(s):
    s = s.strip().lower()
    if '//' not in s:
        s = '//' + s
    host = urllib.parse.urlsplit(s).hostname or ''
    host = host.rstrip('.')
    if host.startswith('www.'):
        host = host[4:]
    try:
        host = host.encode('idna').decode('ascii')
    except UnicodeError:
        pass
    return host


def show(d):
    """Канонический домен + кириллица в скобках, чтобы агент узнал его в выдаче поиска."""
    try:
        u = d.encode('ascii').decode('idna')
    except UnicodeError:
        u = d
    return d if u == d else '%s (%s)' % (u, d)


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'ru'})
    try:
        # Живой .ru-сайт отвечает за ~5 с; дольше — блок иностранных IP или мёртв.
        with urllib.request.urlopen(req, timeout=10) as r:
            body = r.read(1_500_000)
            return r.status, r.geturl(), body
    except urllib.error.HTTPError as e:
        return e.code, url, e.read(200_000) if e.fp else b''


def decode(body):
    m = re.search(rb'charset=["\']?([\w-]+)', body[:4000], re.I)
    enc = m.group(1).decode() if m else 'utf-8'
    try:
        return body.decode(enc, 'replace'), enc
    except LookupError:
        return body.decode('utf-8', 'replace'), 'utf-8'


def unreachable(url):
    """Нет DNS — домен мёртв. DNS есть, а соединения нет — часто сайт не пускает иностранные
    IP: при включённом VPN это не отказ, а повод открыть без VPN."""
    try:
        socket.gethostbyname(urllib.parse.urlsplit(url).hostname or '')
        return 'no_connect'
    except OSError:
        return 'unreachable'


def check(url):
    if '//' not in url:
        url = 'https://' + url
    host = urllib.parse.urlsplit(url).hostname or ''
    try:
        url = url.replace(host, host.encode('idna').decode('ascii'), 1)
    except UnicodeError:
        pass
    out = {'url': url}
    # Быстрая проба: живой сайт принимает соединение за ~5 с. Без неё urllib ждёт таймаут
    # на каждом IP домена по очереди (mail.ru — 30 с).
    host = urllib.parse.urlsplit(url).hostname or ''
    try:
        ip = socket.gethostbyname(host)
    except OSError:
        out.update(status='unreachable', error='нет DNS')
        return out
    for port in (443, 80):
        try:
            socket.create_connection((ip, port), 6).close()
            break
        except OSError:
            continue
    else:
        out.update(status='no_connect', error='нет соединения за 6 с по 443 и 80')
        return out
    try:
        code, final, body = fetch(url)
    except Exception as e:  # сеть, TLS, таймаут — сайт мог открыться бы в браузере
        # Таймаут по http не лечится — повторяем только при ошибках TLS и сертификата.
        if url.startswith('https://') and 'timed out' not in str(e):
            try:
                code, final, body = fetch('http://' + url[8:])
                out['note'] = 'первый запрос по https упал, через http открылся'
            except Exception as e2:
                out.update(status=unreachable(url), error=str(e2)[:120])
                return out
        else:
            out.update(status=unreachable(url), error=str(e)[:120])
            return out
    html, enc = decode(body)
    low = html.lower()
    title = re.search(r'<title[^>]*>(.*?)</title>', html, re.I | re.S)
    vp = re.search(r'<meta[^>]+name=["\']viewport["\'][^>]*>', html, re.I)
    out.update(
        code=code,
        final=final,
        https=final.startswith('https://'),
        title=re.sub(r'\s+', ' ', title.group(1)).strip()[:100] if title else '',
        size_kb=round(len(body) / 1024),
        charset=enc,
        viewport=vp.group(0)[:140] if vp else None,
        zoom_blocked=bool(vp and re.search(r'user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b', vp.group(0), re.I)),
        fixed_width=bool(vp and re.search(r'width\s*=\s*\d{3,4}', vp.group(0))),
        tables=low.count('<table'),
        jquery=(re.search(r'jquery[-.]?(\d\.\d+(\.\d+)?)', low) or [None, None])[1],
        platforms={k: re.search(p, low).group(0) for k, p in PLATFORMS.items() if re.search(p, low)},
    )
    if re.search(PARKED, low):
        out['status'] = 'parked'
    elif re.search(BOT_WALL, low) and out['size_kb'] < 40:
        out['status'] = 'manual_check'
        out['note'] = 'похоже на антибот — открыть в браузере'
    elif code != 200 or out['size_kb'] < 3:
        out['status'] = 'manual_check' if code in (403, 405, 429, 503) else 'dead'
    else:
        out['status'] = 'ok'
    return out


def seen_groups(path):
    """Разделы seen.md → списки групп доменов. Пункт списка — одна компания: домены до « — »
    через запятую (алиасы одной компании, например rybasibiri.ru, style-product.ru)."""
    sections, cur = {}, None
    for line in open(path, encoding='utf-8'):
        if line.startswith('## '):
            cur = line[3:].strip()
            sections[cur] = []
        elif cur and line.lstrip().startswith('- '):
            head = line.strip()[2:].split(' — ')[0]
            group = {norm(p.strip().split()[0]) for p in head.split(',') if '.' in p}
            if group:
                sections[cur].append(group)
    return sections


def load(dump, collection):
    """Документы одной коллекции из out_dir ArtifactData: <dump>/<collection>/*.json."""
    out = []
    for f in sorted(glob.glob(os.path.join(dump, collection, '*.json'))):
        d = json.load(open(f, encoding='utf-8'))
        d = d.get('data', d) if isinstance(d.get('data'), dict) else d
        out.append(d)
    return out


def seen(path, dump):
    tracker = {norm(d['url']): d.get('name', '') for d in load(dump, 'sites') if d.get('url')}
    # removed — журнал кнопки «Удалить» в трекере: причина, комментарий, дата
    removed = {norm(d['url']): d for d in load(dump, 'removed') if d.get('url')}
    sec = seen_groups(path)
    added = next((v for k, v in sec.items() if k.startswith('Добавлены')), [])
    gone = next((v for k, v in sec.items() if k.startswith('Удалены')), [])
    every = set(tracker).union(set(removed), *[g for v in sec.values() for g in v])
    known = set().union(*[g for v in sec.values() for g in v]) if sec else set()
    print('В трекере, но нет в seen.md (дописать в «Добавлены»):')
    for d in sorted(set(tracker) - known):
        print('  ', d, '—', tracker[d])

    def why(g):
        r = next((removed[d] for d in sorted(g) if d in removed), None)
        if not r:
            return 'причина не записана'
        note = (' — ' + r['note']) if r.get('note') else ''
        return '%s%s, %s' % (r.get('reasonLabel') or r.get('reason') or 'Другое', note,
                             '.'.join(reversed((r.get('removedAt') or '')[:10].split('-'))))

    print('В «Добавлены», но ни одного домена группы нет в трекере (удалены пользователем → перенести с причиной):')
    for g in added:
        if not g & set(tracker):
            print('  ', ', '.join(sorted(g)), '—', why(g))
    lost = [d for d in sorted(removed) if not any(d in g for g in added + gone)]
    if lost:
        print('В журнале removed, но нет ни в «Добавлены», ни в «Удалены» (дописать в «Удалены»):')
        for d in lost:
            r = removed[d]
            print('  ', d, '—', r.get('name', ''), r.get('city', ''), '—', why({d}))
    print('Все домены для исключения у агентов (%d):' % len(every))
    print('  ', ', '.join(show(d) for d in sorted(every)))


def validate(path):
    data = json.load(open(path, encoding='utf-8'))
    leads = data.get('leads', data) if isinstance(data, dict) else data
    need = ['doc_id', 'name', 'url', 'city', 'niche', 'platform', 'fit', 'alive_date', 'alive_url', 'why', 'why_evidence']
    seen_d, bad = {}, 0
    for i, l in enumerate(leads):
        errs = [f for f in need if not l.get(f)]
        if l.get('niche') and len(l['niche']) > 30:
            errs.append('ниша «%s» — нужна короткая группа' % l['niche'])
        if l.get('fit') not in (3, 4, 5):
            errs.append('fit %r' % l.get('fit'))
        if l.get('alive_date') and not re.match(r'\d{4}-\d{2}(-\d{2})?$', str(l['alive_date'])):
            errs.append('alive_date не ГГГГ-ММ-ДД')
        for e in l.get('why_evidence') or []:
            if not str(e.get('url', '')).startswith('http'):
                errs.append('why_evidence без url')
                break
        d = norm(l.get('url', ''))
        if d in seen_d:
            errs.append('дубль с #%d' % seen_d[d])
        seen_d[d] = i
        if errs:
            bad += 1
            print('#%d %s: %s' % (i, l.get('name') or d, '; '.join(errs)))
    print('Проверено %d, с ошибками %d' % (len(leads), bad))


AP = 'https://www.aboutpartner.ru'
AP_LIST = AP + '/producers?page=%d'
# Не сайт компании: соцсети, карты, мессенджеры, сам каталог.
AP_SKIP = re.compile(r'aboutpartner|vk\.com|vkontakte|t\.me|telegram|yandex|google|ok\.ru|'
                     r'whatsapp|wa\.me|instagram|youtube|rutube|dzen|max\.ru|resize-web|'
                     r'schema\.org|2gis|avito|ozon|wildberries', re.I)


def catalog(first, last, seen_path=None):
    from concurrent.futures import ThreadPoolExecutor
    skip = set()
    if seen_path:
        for groups in seen_groups(seen_path).values():
            for g in groups:
                skip |= g

    def page(n):
        try:
            return decode(fetch(AP_LIST % n)[2])[0]
        except Exception:
            return ''

    def card(pid):
        try:
            html = decode(fetch('%s/producer/%s' % (AP, pid))[2])[0]
        except Exception:
            return None
        site = next((u for u in re.findall(r'href="(https?://[^"]+)"', html)
                     if not AP_SKIP.search(u)), None)
        if not site:
            return None
        reg = re.search(r'"addressRegion":"([^"]*)"', html)
        city = re.search(r'"addressLocality":"([^"]*)"', html)
        return site, reg.group(1) if reg else '', city.group(1) if city else ''

    with ThreadPoolExecutor(10) as ex:
        pages = list(ex.map(page, range(int(first), int(last) + 1)))
        found = {}
        for html in pages:
            for pid, name in re.findall(r'/producer/(pc-producer-\d+)">([^<]{3,120})<', html):
                found[pid] = re.sub(r'&quot;|&amp;', '"', name).strip()
        cards = dict(zip(found, ex.map(card, found)))
    total, out = 0, {}
    for pid, c in cards.items():
        if not c:
            continue
        total += 1
        d = norm(c[0])
        if not re.fullmatch(r'[a-z0-9.-]+\.[a-z0-9-]+', d) or d in skip or d in out:
            continue
        out[d] = '\t'.join([d, c[1], c[2], found[pid], '%s/producer/%s' % (AP, pid)])
    for line in out.values():
        print(line)
    print('# страницы %s–%s: компаний %d, с сайтом %d, новых доменов %d'
          % (first, last, len(found), total, len(out)), file=sys.stderr)


if __name__ == '__main__':
    cmd, args = (sys.argv[1], sys.argv[2:]) if len(sys.argv) > 1 else ('', [])
    if cmd == 'norm':
        for a in args:
            print(norm(a))
    elif cmd == 'check':
        for a in args:
            print(json.dumps(check(a), ensure_ascii=False))
    elif cmd == 'seen' and len(args) == 2:
        seen(*args)
    elif cmd == 'validate' and args:
        validate(args[0])
    elif cmd == 'catalog' and len(args) in (2, 3):
        catalog(*args)
    else:
        print(__doc__)
        sys.exit(1)
