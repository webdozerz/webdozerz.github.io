/*
 * Подборки — плагин для Lampa 3.x
 * Топы (Letterboxd, IMDb, Кинопоиск) и категории (жанры, настроения, страны, эпохи, студии, сериалы).
 * Топы берутся из снимка podborki.json рядом с плагином; кнопка «Обновить топы» перекачивает
 * списки Letterboxd прямо с устройства (на Android через network.native, без CORS).
 * Категории строятся на лету через встроенный в Lampa TMDB. Ключи не нужны.
 */
(function () {
    'use strict';

    if (window.podborki_plugin) return;
    window.podborki_plugin = true;

    var SRC = 'podborki';
    var STORE = 'podborki_data';
    var PER_PAGE = 20;
    var DAY = 60 * 24;

    var script = document.currentScript && document.currentScript.src;
    var BASE = script ? script.replace(/[^\/]*$/, '') : 'https://andryushov.me/lampa/';

    var ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h4A1.5 1.5 0 0 1 11 5.5v4A1.5 1.5 0 0 1 9.5 11h-4A1.5 1.5 0 0 1 4 9.5v-4ZM13 5.5A1.5 1.5 0 0 1 14.5 4h4A1.5 1.5 0 0 1 20 5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 13 9.5v-4ZM4 14.5A1.5 1.5 0 0 1 5.5 13h4a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 9.5 20h-4A1.5 1.5 0 0 1 4 18.5v-4Z" fill="currentColor"/><path d="M16.5 13.5l.9 1.9 2.1.3-1.5 1.5.4 2.1-1.9-1-1.9 1 .4-2.1-1.5-1.5 2.1-.3.9-1.9Z" fill="currentColor"/></svg>';

    // Списки Letterboxd: ключ должен совпадать с LISTS в scripts/lampa-podborki-seed.mjs
    var LB_LISTS = {
        lb500: { title: 'Letterboxd: Топ-500', path: 'official/list/letterboxds-top-500-films' },
        imdb250: { title: 'IMDb: Топ-250', path: 'dave/list/imdb-top-250' },
        lb2020s: { title: 'Лучшее 2020-х', path: 'official/list/top-250-films-of-the-2020s' },
        lbhorror: { title: 'Топ-250 ужасов', path: 'official/list/top-250-horror-films' },
        lbanim: { title: 'Топ-250 анимации', path: 'official/list/top-250-animated-films' },
        lbdocs: { title: 'Топ-250 документальных', path: 'official/list/top-250-documentary-films' },
        m1001: { title: '1001 фильм, который нужно увидеть', path: 'peterstanley/list/1001-movies-you-must-see-before-you-die' }
    };

    // Списки без обновления с устройства (только из снимка)
    var STATIC_LISTS = {
        kp250: { title: 'Кинопоиск: Топ-250' }
    };

    var TOP_ORDER = ['kp250', 'imdb250', 'lb500', 'lb2020s', 'lbanim', 'lbhorror', 'lbdocs', 'm1001'];

    // Discover-запросы TMDB. Фильтр по голосам отсекает мусор.
    var Q = '&vote_count.gte=300&sort_by=vote_count.desc';

    function mv(title, query) { return { title: title, url: 'discover/movie?' + query + Q }; }
    function tv(title, query) { return { title: title, url: 'discover/tv?' + query + '&vote_count.gte=150&sort_by=vote_count.desc' }; }
    function decade(y) {
        return mv(y + '-е', 'primary_release_date.gte=' + y + '-01-01&primary_release_date.lte=' + (y + 9) + '-12-31');
    }

    var SECTIONS = [
        {
            id: 'tops', title: 'Топы', rows: function () {
                var rows = TOP_ORDER.filter(function (k) { return listIds(k).length; }).map(function (k) {
                    return { title: listTitle(k), url: 'top:' + k, source: SRC };
                });
                rows.push({ title: 'TMDB: лучшие фильмы', url: 'movie/top_rated' });
                rows.push({ title: 'TMDB: лучшие сериалы', url: 'tv/top_rated' });
                return rows;
            }
        },
        {
            id: 'genres', title: 'Жанры', rows: [
                mv('Драмы', 'with_genres=18'), mv('Комедии', 'with_genres=35'), mv('Боевики', 'with_genres=28'),
                mv('Триллеры', 'with_genres=53'), mv('Фантастика', 'with_genres=878'), mv('Фэнтези', 'with_genres=14'),
                mv('Ужасы', 'with_genres=27'), mv('Детективы', 'with_genres=9648'), mv('Криминал', 'with_genres=80'),
                mv('Приключения', 'with_genres=12'), mv('Мелодрамы', 'with_genres=10749'), mv('Мультфильмы', 'with_genres=16'),
                mv('Семейные', 'with_genres=10751'), mv('Военные', 'with_genres=10752'), mv('Исторические', 'with_genres=36'),
                mv('Вестерны', 'with_genres=37'), mv('Музыкальные', 'with_genres=10402'), mv('Документальные', 'with_genres=99')
            ]
        },
        {
            id: 'moods', title: 'Настроения и темы', rows: [
                mv('Ограбления', 'with_keywords=10051'), mv('Путешествия во времени', 'with_keywords=4379'),
                mv('Временная петля', 'with_keywords=10854'), mv('С неожиданным финалом', 'with_keywords=275311'),
                mv('Антиутопии', 'with_keywords=4565'), mv('Постапокалипсис', 'with_keywords=4458'),
                mv('Киберпанк', 'with_keywords=12190'), mv('Искусственный интеллект', 'with_keywords=310'),
                mv('Космос', 'with_keywords=9882'), mv('Выживание', 'with_keywords=10349'),
                mv('Маньяки', 'with_keywords=10714'), mv('Мафия', 'with_keywords=10391'), mv('Тюрьма', 'with_keywords=378'),
                mv('Месть', 'with_keywords=9748'), mv('Шпионы', 'with_keywords=470'), mv('Зомби', 'with_keywords=12377'),
                mv('Роуд-муви', 'with_keywords=7312'), mv('Взросление', 'with_keywords=10683'),
                mv('Маленький город', 'with_keywords=1415'), mv('Основано на реальных событиях', 'with_keywords=9672'),
                mv('Биографии', 'with_keywords=5565'), mv('Вторая мировая', 'with_keywords=1956'),
                mv('Найденная плёнка', 'with_keywords=163053'), mv('Новогодние и рождественские', 'with_keywords=207317')
            ]
        },
        {
            id: 'countries', title: 'Страны', rows: [
                mv('Советское кино', 'with_origin_country=SU'), mv('Российское кино', 'with_origin_country=RU'),
                mv('Корея', 'with_origin_country=KR'), mv('Япония', 'with_origin_country=JP'),
                mv('Франция', 'with_origin_country=FR'), mv('Италия', 'with_origin_country=IT'),
                mv('Великобритания', 'with_origin_country=GB'), mv('Испания', 'with_origin_country=ES'),
                mv('Германия', 'with_origin_country=DE'), mv('Скандинавия', 'with_origin_country=SE|DK|NO|FI|IS'),
                mv('Индия', 'with_origin_country=IN'), mv('Китай и Гонконг', 'with_origin_country=CN|HK|TW'),
                mv('Латинская Америка', 'with_origin_country=MX|AR|BR|CL|CO')
            ]
        },
        {
            id: 'decades', title: 'Эпохи', rows: [
                decade(2020), decade(2010), decade(2000), decade(1990), decade(1980), decade(1970), decade(1960), decade(1950),
                mv('До 1950-х', 'primary_release_date.lte=1949-12-31')
            ]
        },
        {
            id: 'studios', title: 'Студии', rows: [
                mv('A24', 'with_companies=41077'), mv('Studio Ghibli', 'with_companies=10342'), mv('Pixar', 'with_companies=3'),
                mv('Walt Disney Animation', 'with_companies=6125'), mv('DreamWorks Animation', 'with_companies=521'),
                mv('Marvel Studios', 'with_companies=420'), mv('Lucasfilm', 'with_companies=1'),
                mv('Blumhouse', 'with_companies=3172'), mv('Мосфильм', 'with_companies=344|170585'),
                mv('Ленфильм', 'with_companies=10845|170208'), mv('Союзмультфильм', 'with_companies=7501|14599')
            ]
        },
        {
            id: 'series', title: 'Сериалы', rows: [
                { title: 'Лучшие сериалы', url: 'tv/top_rated' },
                tv('HBO', 'with_networks=49'), tv('Netflix', 'with_networks=213'), tv('Apple TV+', 'with_networks=2552'),
                tv('Prime Video', 'with_networks=1024'), tv('AMC', 'with_networks=174'), tv('FX', 'with_networks=88'),
                tv('BBC', 'with_networks=4'), tv('Кинопоиск', 'with_networks=3827'), tv('START', 'with_networks=2493'),
                tv('Корейские дорамы', 'with_origin_country=KR&with_genres=18'), tv('Аниме', 'with_genres=16&with_original_language=ja'),
                tv('Мини-сериалы', 'with_type=2'), tv('Детективные', 'with_genres=9648'), tv('Фантастика и фэнтези', 'with_genres=10765')
            ]
        }
    ];

    var network = new Lampa.Reguest();
    var data = Lampa.Storage.get(STORE, '{}');
    if (typeof data !== 'object' || !data) data = {};

    // ---------- данные топов ----------

    function listIds(key) {
        return (data.lists && data.lists[key]) || [];
    }

    function listTitle(key) {
        return (LB_LISTS[key] || STATIC_LISTS[key] || { title: key }).title;
    }

    function saveData(next) {
        data = next;
        Lampa.Storage.set(STORE, data);
    }

    // Снимок с сайта подхватывается, если он новее того, что лежит на устройстве
    function loadSeed(done) {
        network.silent(BASE + 'podborki.json', function (seed) {
            if (typeof seed === 'string') {
                try { seed = JSON.parse(seed); } catch (e) { seed = null; }
            }
            if (seed && seed.lists && (!data.updated || seed.updated > data.updated)) {
                var merged = { updated: seed.updated, lists: seed.lists, map: seed.map || {} };
                // Ручное обновление на устройстве новее снимка — не затираем
                saveData(merged);
            }
            else if (seed && seed.lists && data.lists) {
                // Статические списки (КП) всегда из снимка
                Object.keys(STATIC_LISTS).forEach(function (k) {
                    if (seed.lists[k]) data.lists[k] = seed.lists[k];
                });
                saveData(data);
            }
            done();
        }, done, false, { cache: { life: DAY } });
    }

    function cardUrl(ref) {
        var type = ref.charAt(0) === 't' ? 'tv' : 'movie';
        return Lampa.TMDB.api(type + '/' + ref.slice(1) + '?api_key=' + Lampa.TMDB.key() + '&language=' + Lampa.Storage.field('tmdb_lang'));
    }

    function loadCards(refs, done) {
        var out = new Array(refs.length);
        var left = refs.length;
        if (!left) return done([]);

        refs.forEach(function (ref, i) {
            network.silent(cardUrl(ref), function (json) {
                if (json && json.id) {
                    json.media_type = ref.charAt(0) === 't' ? 'tv' : 'movie';
                    out[i] = json;
                }
                if (--left === 0) done(out.filter(Boolean));
            }, function () {
                if (--left === 0) done(out.filter(Boolean));
            }, false, { cache: { life: DAY * 7 } });
        });
    }

    function topPage(key, page, ok, err) {
        var ids = listIds(key);
        var total = Math.ceil(ids.length / PER_PAGE);
        if (!ids.length || page > total) return err();

        loadCards(ids.slice((page - 1) * PER_PAGE, page * PER_PAGE), function (results) {
            if (!results.length) return err();
            ok(Lampa.Utils.addSource({
                results: results,
                page: page,
                total_pages: total,
                total_results: ids.length,
                url: 'top:' + key,
                source: SRC
            }, 'tmdb'));
        });
    }

    // ---------- обновление топов с устройства ----------

    function fetchText(url, ok, err) {
        var net = new Lampa.Reguest();
        net.timeout(20000);
        var done = function (text) { ok(typeof text === 'string' ? text : (text && text.responseText) || ''); };
        if (Lampa.Platform.is('android')) net.native(url, done, err, false, { dataType: 'text' });
        else net.silent(url, done, err, false, { dataType: 'text' });
    }

    function fetchList(path, ok, err) {
        var slugs = [];
        (function page(n) {
            fetchText('https://letterboxd.com/' + path + '/page/' + n + '/', function (html) {
                var re = /data-item-slug="([^"]+)"/g, m, found = 0;
                while ((m = re.exec(html))) { slugs.push(m[1]); found++; }
                if (found && html.indexOf('/page/' + (n + 1) + '/') >= 0 && n < 30) page(n + 1);
                else if (slugs.length) ok(slugs);
                else err('пустой список');
            }, function () { err('нет доступа к Letterboxd'); });
        })(1);
    }

    function resolveSlug(slug, ok) {
        fetchText('https://letterboxd.com/film/' + slug + '/', function (html) {
            var id = html.match(/data-tmdb-id="(\d+)"/);
            var type = html.match(/data-tmdb-type="(\w+)"/);
            ok(id ? (type && type[1] === 'tv' ? 't' : 'm') + id[1] : '');
        }, function () { ok(null); });
    }

    var updating = false;

    function updateTops() {
        if (updating) return Lampa.Noty.show('Подборки: обновление уже идёт');
        updating = true;

        var keys = Object.keys(LB_LISTS);
        var map = Object.assign({}, data.map || {});
        var lists = Object.assign({}, data.lists || {});
        var errors = [];

        Lampa.Noty.show('Подборки: обновляю топы…');

        (function nextList(i) {
            if (i >= keys.length) return resolveMissing();
            var key = keys[i];
            Lampa.Noty.show('Подборки: ' + listTitle(key) + ' (' + (i + 1) + '/' + keys.length + ')');
            fetchList(LB_LISTS[key].path, function (slugs) {
                lists[key] = slugs;
                nextList(i + 1);
            }, function (e) {
                errors.push(listTitle(key) + ': ' + e);
                lists[key] = null;
                nextList(i + 1);
            });
        })(0);

        function resolveMissing() {
            var slugs = [];
            keys.forEach(function (k) {
                (lists[k] || []).forEach(function (s) {
                    if (!(s in map) && slugs.indexOf(s) < 0) slugs.push(s);
                });
            });

            var idx = 0, active = 0, done = 0;
            if (!slugs.length) return finish();
            Lampa.Noty.show('Подборки: новых фильмов ' + slugs.length + ', ищу их в TMDB…');

            function pump() {
                while (active < 4 && idx < slugs.length) {
                    (function (slug) {
                        active++;
                        resolveSlug(slug, function (ref) {
                            if (ref !== null) map[slug] = ref;
                            active--; done++;
                            if (done === slugs.length) finish();
                            else pump();
                        });
                    })(slugs[idx++]);
                }
            }
            pump();
        }

        function finish() {
            var out = { updated: new Date().toISOString().slice(0, 10), lists: {}, map: map };
            Object.keys(data.lists || {}).forEach(function (k) { out.lists[k] = data.lists[k]; });
            keys.forEach(function (k) {
                if (lists[k]) out.lists[k] = lists[k].map(function (s) { return map[s]; }).filter(Boolean);
            });
            saveData(out);
            updating = false;

            if (errors.length === keys.length) Lampa.Noty.show('Подборки: не удалось обновить — ' + errors[0]);
            else Lampa.Noty.show('Подборки: топы обновлены' + (errors.length ? ' (ошибок: ' + errors.length + ')' : ''));
        }
    }

    // ---------- источник Lampa ----------

    function sectionRows(id) {
        var section = SECTIONS.filter(function (s) { return s.id === id; })[0] || SECTIONS[0];
        return typeof section.rows === 'function' ? section.rows() : section.rows;
    }

    function rowLoader(row) {
        return function (call) {
            if (row.url.indexOf('top:') === 0) {
                topPage(row.url.slice(4), 1, function (json) {
                    json.title = row.title;
                    call(json);
                }, call);
            }
            else {
                Lampa.Api.sources.tmdb.list({ url: row.url, page: 1 }, function (json) {
                    json.title = row.title;
                    json.url = row.url;
                    json.source = 'tmdb';
                    call(json);
                }, call);
            }
        };
    }

    var source = Object.assign({}, Lampa.Api.sources.tmdb, {
        main: function (params, oncomplite, onerror) {
            var parts = [];
            var load = function (ok, err) { Lampa.Api.partNext(parts, 6, ok, err); };
            var start = function () {
                parts = sectionRows(params.url).map(rowLoader);
                load(oncomplite, onerror);
            };
            if (data.lists) start();
            else loadSeed(start);
            return load;
        },
        list: function (params, oncomplite, onerror) {
            if (params.url && params.url.indexOf('top:') === 0) topPage(params.url.slice(4), params.page || 1, oncomplite, onerror);
            else Lampa.Api.sources.tmdb.list(params, oncomplite, onerror);
        },
        clear: function () { network.clear(); }
    });

    Lampa.Api.sources[SRC] = source;
    try { Object.defineProperty(Lampa.Api.sources, SRC, { get: function () { return source; } }); } catch (e) {}

    // ---------- интерфейс ----------

    function openSection(section) {
        Lampa.Activity.push({
            url: section.id,
            title: 'Подборки · ' + section.title,
            component: 'main',
            source: SRC,
            page: 1
        });
    }

    function openMenu() {
        var items = SECTIONS.map(function (s) { return { title: s.title, section: s }; });
        items.push({
            title: 'Обновить топы',
            subtitle: data.updated ? 'Последнее обновление: ' + data.updated : 'Ещё не обновлялись',
            update: true
        });

        Lampa.Select.show({
            title: 'Топы и подборки',
            items: items,
            onSelect: function (item) {
                if (item.update) {
                    Lampa.Controller.toggle('menu');
                    updateTops();
                }
                else openSection(item.section);
            },
            onBack: function () {
                Lampa.Controller.toggle('menu');
            }
        });
    }

    function addMenu() {
        var item = $('<li class="menu__item selector" data-action="podborki"><div class="menu__ico">' + ICON + '</div><div class="menu__text">Топы и подборки</div></li>');
        item.on('hover:enter', openMenu);
        var list = $('.menu .menu__list').eq(0);
        var anchor = list.find('[data-action="catalog"]');
        if (anchor.length) anchor.after(item);
        else list.append(item);
    }

    function addSettings() {
        Lampa.SettingsApi.addComponent({ component: 'podborki', name: 'Топы и подборки', icon: ICON });

        Lampa.SettingsApi.addParam({
            component: 'podborki',
            param: { name: 'podborki_update', type: 'button' },
            field: {
                name: 'Обновить топы',
                description: 'Скачать свежие списки Letterboxd и IMDb'
            },
            onRender: function (item) {
                item.find('.settings-param__descr').text('Скачать свежие списки Letterboxd и IMDb. Последнее обновление: ' + (data.updated || '—'));
            },
            onChange: updateTops
        });

        TOP_ORDER.forEach(function (key) {
            Lampa.SettingsApi.addParam({
                component: 'podborki',
                param: { name: 'podborki_main_' + key, type: 'trigger', default: false },
                field: { name: 'На главной: ' + listTitle(key) }
            });
        });
    }

    // Ряды топов на главной — по включённым переключателям в настройках
    function addMainRows() {
        if (!Lampa.ContentRows) return;
        Lampa.ContentRows.add({
            name: 'podborki_tops',
            title: 'Подборки: топы',
            index: 1,
            screen: ['main'],
            call: function (params) {
                if (params.source && params.source !== 'tmdb' && params.source !== 'cub') return;
                return TOP_ORDER.filter(function (key) {
                    return Lampa.Storage.field('podborki_main_' + key) && listIds(key).length;
                }).map(function (key) {
                    return rowLoader({ title: listTitle(key), url: 'top:' + key });
                });
            }
        });
    }

    function init() {
        [addMenu, addSettings, addMainRows].forEach(function (fn) {
            try { fn(); }
            catch (e) { Lampa.Noty.show('Подборки: ошибка запуска — ' + e.message); }
        });
        loadSeed(function () {});
    }

    if (window.appready) init();
    else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') init(); });
})();
