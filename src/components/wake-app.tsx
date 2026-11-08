'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Waves,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Search as SearchIcon,
  Map,
  Heart,
  CalendarDays,
  SlidersHorizontal,
  Ship,
  ChevronRight,
  Check,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Sun,
  Plus,
  RotateCcw,
  X,
  ExternalLink,
  Anchor,
  Compass,
  Menu,
  List,
  Info,
} from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import VoiceInput from './voice-input';
import BoatForm from './boat-form';
import OwnerCalendar from './owner-calendar';
import { seed, loadStore, STORAGE_KEY } from '@/lib/data';
import {
  type Store,
  type Boat,
  type Booking,
  type Search,
  type Sport,
  durations,
  durationLabel,
  money,
  quote,
  filterBoats,
  isAvailable,
  createBooking,
  cancelBooking,
  localDate,
  prettyDate,
  minutes,
  timeLabel,
} from '@/lib/model';
import { parseSearch } from '@/lib/voice';
const BoatMap = dynamic(() => import('./boat-map'), {
  ssr: false,
  loading: () => <div className="map-loading">Загружаем карту…</div>,
});
type Page =
  | 'landing'
  | 'search'
  | 'map'
  | 'favorites'
  | 'bookings'
  | 'owner'
  | 'add'
  | 'calendar'
  | 'owner-bookings';
const defaultSearch: Search = {
  location: 'Москва',
  date: '',
  time: '',
  sport: 'Вейксерф',
  duration: 30,
  service: '',
};
export default function WakeApp() {
  const [store, setStore] = useState<Store>(seed),
    [ready, setReady] = useState(false),
    [page, setPage] = useState<Page>('landing'),
    [role, setRole] = useState<'customer' | 'owner'>('customer'),
    [search, setSearch] = useState<Search>(defaultSearch),
    [applied, setApplied] = useState<Search>(defaultSearch),
    [searched, setSearched] = useState(false),
    [sort, setSort] = useState('recommended'),
    [toast, setToast] = useState(''),
    [settings, setSettings] = useState(false),
    [reset, setReset] = useState(false),
    [selected, setSelected] = useState<Boat | null>(null),
    [bookingSearch, setBookingSearch] = useState<Search>(defaultSearch),
    [bookingStep, setBookingStep] = useState<'details' | 'confirm' | 'success'>('details'),
    [success, setSuccess] = useState<Booking | null>(null),
    [bookingError, setBookingError] = useState(''),
    [cancel, setCancel] = useState<Booking | null>(null),
    [interpretation, setInterpretation] = useState<Partial<Search> | null>(null),
    [voiceError, setVoiceError] = useState(''),
    [storageError, setStorageError] = useState(''),
    [info, setInfo] = useState(false),
    [calendarBoatId, setCalendarBoatId] = useState('');
  const notify = useCallback((message: string) => setToast(message), []);
  useEffect(() => {
    setStore(loadStore());
    setReady(true);
    try {
      const savedRole = localStorage.getItem('wake-role');
      if (savedRole === 'owner') setRole('owner');
    } catch {}
    const sync = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setStore(loadStore());
    };
    window.addEventListener('storage', sync);
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production')
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => navigator.serviceWorker.ready)
        .then((reg) => {
          reg.active?.postMessage({
            type: 'CACHE_ASSETS',
            urls: [...document.querySelectorAll<HTMLScriptElement>('script[src]')]
              .map((s) => s.src)
              .concat(
                [...document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')].map(
                  (l) => l.href,
                ),
              ),
          });
        })
        .catch(() => {});
    return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  const update = useCallback((next: Store) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStore(next);
      setStorageError('');
      return true;
    } catch {
      setStorageError(
        'Не удалось сохранить данные. Возможно, память браузера заполнена. Уменьшите фото или освободите место.',
      );
      return false;
    }
  }, []);
  function go(next: Page) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function switchRole(next: 'customer' | 'owner') {
    setRole(next);
    try {
      localStorage.setItem('wake-role', next);
    } catch {}
    setSettings(false);
    go(next === 'owner' ? 'owner' : 'search');
  }
  const results = useMemo(() => {
    const boats = filterBoats(store, applied);
    return sort === 'price'
      ? [...boats].sort(
          (a, b) =>
            (quote(a, applied.sport, applied.duration, applied.service) || 0) -
            (quote(b, applied.sport, applied.duration, applied.service) || 0),
        )
      : boats;
  }, [store, applied, sort]);
  function favorite(id: string) {
    const active = store.favorites.includes(id);
    const saved = update({
      ...store,
      favorites: active ? store.favorites.filter((x) => x !== id) : [...store.favorites, id],
    });
    if (saved) notify(active ? 'Удалено из избранного' : 'Сохранено в избранном');
  }
  const openBoat = useCallback(
    (boat: Boat) => {
      setSelected(boat);
      setBookingError('');
      setSuccess(null);
      setBookingSearch({
        ...applied,
        service:
          applied.service ||
          boat.tariffs.find((t) => t.sport === applied.sport && t.duration === applied.duration)
            ?.service ||
          boat.tariffs[0]?.service ||
          '',
      });
      setBookingStep(applied.date && applied.time && boat.connected ? 'confirm' : 'details');
    },
    [applied],
  );
  function submitSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setApplied({ ...search });
    setSearched(true);
    go(page === 'map' ? 'map' : 'search');
  }
  function interpret(text: string) {
    const parsed = parseSearch(text);
    if (!parsed.recognized.length) {
      setVoiceError(
        'Не удалось понять параметры. Попробуйте: «Вейксерф в Строгино завтра в 15:00 на полчаса».',
      );
      return;
    }
    setVoiceError('');
    setInterpretation(parsed.values);
  }
  function confirmBooking() {
    if (!selected) return;
    try {
      const latest = loadStore();
      const result = createBooking(latest, selected.id, bookingSearch);
      if (!update(result.store)) return;
      setSuccess(result.booking);
      setBookingStep('success');
    } catch (e) {
      setBookingError(e instanceof Error ? e.message : 'Не удалось создать бронь');
    }
  }
  function performCancel() {
    if (!cancel) return;
    if (update(cancelBooking(loadStore(), cancel.id))) {
      notify('Бронирование отменено. Время снова свободно.');
      setCancel(null);
    }
  }
  const nav =
    role === 'owner'
      ? [
          { id: 'owner', label: 'Мои катера', icon: Ship },
          { id: 'calendar', label: 'Расписание', icon: CalendarDays },
          { id: 'owner-bookings', label: 'Бронирования', icon: Anchor },
        ]
      : [
          { id: 'search', label: 'Поиск', icon: SearchIcon },
          { id: 'map', label: 'Карта', icon: Map },
          { id: 'favorites', label: 'Избранное', icon: Heart },
          { id: 'bookings', label: 'Брони', icon: CalendarDays },
        ];
  const owned = store.boats.filter((b) => b.owner),
    activeBookings = store.bookings.filter((b) => b.status === 'active');
  const Header = () => (
    <header className="app-header">
      <div className="header-inner">
        <button className="brand" onClick={() => go('landing')} aria-label="WAKE — главная">
          <Waves size={30} strokeWidth={2.6} />
          <span>
            WAKE<span className="brand-period">.</span>
          </span>
        </button>
        {page === 'landing' ? (
          <nav className="landing-nav">
            <button onClick={() => switchRole('customer')}>Найти катер</button>
            <button onClick={() => switchRole('owner')}>Для владельцев</button>
            <button onClick={() => setInfo(true)}>О проекте</button>
          </nav>
        ) : (
          <nav className="desktop-nav">
            {nav.map(({ id, label, icon: Icon }) => (
              <button
                className={page === id ? 'current' : ''}
                key={id}
                onClick={() => go(id as Page)}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
        )}
        <div className="header-right">
          <span className="header-location">
            <MapPin size={14} /> Москва и область
          </span>
          <button
            className="role-button"
            onClick={() => setSettings(true)}
            aria-label="Роль и настройки"
          >
            <span className="avatar">{role === 'owner' ? 'В' : 'Я'}</span>
            <Menu size={17} />
          </button>
        </div>
      </div>
    </header>
  );
  function Card({ boat, compact = false }: { boat: Boat; compact?: boolean }) {
    const price = quote(boat, applied.sport, applied.duration, applied.service);
    return (
      <article className={`boat-card ${compact ? 'compact' : ''}`}>
        <div className="card-photo-wrap">
          <button
            className="photo-link"
            onClick={() => openBoat(boat)}
            aria-label={`Открыть ${boat.name}`}
          >
            <img
              src={boat.image}
              alt={`${boat.name} — иллюстративное фото катания`}
              loading="lazy"
            />
          </button>
          <span className={`photo-badge ${!boat.connected ? 'external' : ''}`}>
            {boat.connected ? (
              <>
                <span className="live-dot" /> Онлайн-бронирование
              </>
            ) : (
              <>
                <ExternalLink size={12} /> Внешняя школа
              </>
            )}
          </span>
          <button
            className={`heart-button ${store.favorites.includes(boat.id) ? 'saved' : ''}`}
            aria-label={`${store.favorites.includes(boat.id) ? 'Убрать из избранного' : 'В избранное'} ${boat.school}`}
            onClick={() => favorite(boat.id)}
          >
            <Heart size={20} fill={store.favorites.includes(boat.id) ? 'currentColor' : 'none'} />
          </button>
          <span className="photo-count">
            {boat.year} · {boat.sports.length === 2 ? '2 вида катания' : 'Вейксерф'}
          </span>
        </div>
        <div className="card-body">
          <div className="card-school-line">
            <h3>
              <button onClick={() => openBoat(boat)}>{boat.school}</button>
            </h3>
            <span className="demo-tag">Демо</span>
          </div>
          <p className="boat-model">{boat.name}</p>
          <p className="card-location">
            <MapPin size={13} />
            {boat.location}
          </p>
          <div className="sport-tags">
            {boat.sports.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <div className="card-footer">
            <div>
              <strong>{price === null ? 'Тарифы в карточке' : money(price)}</strong>
              <small>
                {price !== null
                  ? `за ${durationLabel(applied.duration)}`
                  : 'Выберите подходящий сет'}
              </small>
            </div>
            <Button size="sm" onClick={() => openBoat(boat)}>
              {!boat.connected
                ? 'О школе'
                : applied.date && applied.time
                  ? 'Забронировать'
                  : 'Выбрать время'}
              <ArrowUpRight size={16} />
            </Button>
          </div>
        </div>
      </article>
    );
  }
  function BookingList({ owner = false }: { owner?: boolean }) {
    const bookings = store.bookings.filter(
      (b) => !owner || store.boats.find((x) => x.id === b.boatId)?.owner,
    );
    return bookings.length ? (
      <div className="bookings-list">
        {bookings.map((b) => {
          const boat = store.boats.find((x) => x.id === b.boatId);
          return (
            <article className="reservation-card" key={b.id}>
              <img src={boat?.image} alt="Иллюстрация катера" />
              <div className="reservation-content">
                <div className="reservation-status">
                  <span className={`status ${b.status === 'active' ? 'active' : 'cancelled'}`}>
                    {b.status === 'active' ? 'Подтверждено · демо' : 'Отменено'}
                  </span>
                  <small>№ {b.id.slice(0, 6).toUpperCase()}</small>
                </div>
                <h3>
                  {boat?.school} · {boat?.name}
                </h3>
                <p>
                  <CalendarDays size={15} />
                  {prettyDate(b.date)} · {b.time}–{timeLabel(minutes(b.time) + b.duration)}
                </p>
                <p>
                  {b.sport} · {durationLabel(b.duration)} · {b.service}
                </p>
                <div className="reservation-bottom">
                  <strong>{money(b.price)}</strong>
                  {b.status === 'active' && (
                    <Button variant="outline" size="sm" onClick={() => setCancel(b)}>
                      Отменить бронь
                    </Button>
                  )}
                </div>
                <small className="muted">Демонстрация. Реальная бронь не отправлялась.</small>
              </div>
            </article>
          );
        })}
      </div>
    ) : (
      <div className="empty">
        <CalendarDays size={38} />
        <h2>{owner ? 'Пока без бронирований' : 'Первый сет ещё впереди'}</h2>
        <p>
          {owner
            ? 'Брони ваших катеров появятся здесь автоматически.'
            : 'Найдите свой катер — и встретимся на воде.'}
        </p>
        <Button onClick={() => (owner ? go('calendar') : go('search'))}>
          {owner ? 'Открыть расписание' : 'Найти катер'}
          <ArrowRight size={17} />
        </Button>
      </div>
    );
  }
  const isCustomer = page === 'search' || page === 'map';
  if (!ready)
    return (
      <div className="splash">
        <Waves size={42} />
        <strong>WAKE.</strong>
        <p>Ловим волну…</p>
      </div>
    );
  return (
    <>
      <Header />
      {storageError && (
        <div className="storage-error" role="alert">
          {storageError}
        </div>
      )}
      {page === 'landing' ? (
        <main className="landing">
          <section className="hero">
            <img
              className="hero-photo"
              src="/images/wake.webp"
              alt="Вейксерфер на волне за катером"
              fetchPriority="high"
            />
            <div className="hero-shade" />
            <div className="hero-content">
              <div className="hero-eyebrow">
                <span className="live-dot" /> БОЛЬШЕ ЖИЗНИ. БЛИЖЕ К ВОДЕ.
              </div>
              <h1>
                Твоя волна.
                <br />
                <em>В любое время.</em>
              </h1>
              <p>
                Найди катер и забронируй
                <br className="mobile-only" /> катание за минуту.
              </p>
              <div className="hero-buttons">
                <Button onClick={() => switchRole('customer')}>
                  Хочу покататься <ArrowUpRight size={20} />
                </Button>
                <Button variant="outline" onClick={() => switchRole('owner')}>
                  Я владелец катера / школы
                </Button>
              </div>
              <div className="hero-meta">
                <span>
                  <MapPin size={15} /> Москва и Подмосковье
                </span>
                <span>
                  <Sun size={16} /> Твой следующий хороший день
                </span>
              </div>
            </div>
            <div className="hero-bottom">
              <span>55°47′ с. ш. &nbsp; 37°25′ в. д.</span>
              <span>
                Поймай момент. Остальное мы упростили. <ArrowRight size={17} />
              </span>
            </div>
            <div className="hero-stamp">
              <Waves size={25} />
              <span>
                МЕНЬШЕ ПЛАНОВ.
                <br />
                БОЛЬШЕ ВОЛН.
              </span>
            </div>
          </section>
          <section className="value-strip">
            <div>
              <div className="feature-icon">
                <SearchIcon />
              </div>
              <span>
                <strong>Твой катер найдётся</strong>
                <small>Сравнивай места, катера и цены</small>
              </span>
            </div>
            <div>
              <div className="feature-icon">
                <Clock3 />
              </div>
              <span>
                <strong>Минута — и ты на волне</strong>
                <small>Выбери сет и бронируй без звонков</small>
              </span>
            </div>
            <div>
              <div className="feature-icon">
                <ShieldCheck />
              </div>
              <span>
                <strong>Всё прозрачно</strong>
                <small>Понятная цена и свободное время</small>
              </span>
            </div>
          </section>
          <section className="landing-discovery">
            <div className="section-heading">
              <div>
                <span className="eyebrow">БЛИЖЕ, ЧЕМ КАЖЕТСЯ</span>
                <h2>Хороший день начинается на воде</h2>
              </div>
              <Button variant="ghost" onClick={() => switchRole('customer')}>
                Найти свою волну <ArrowUpRight size={18} />
              </Button>
            </div>
            <div className="landing-photo-grid">
              <button
                onClick={() => {
                  setSearch({ ...defaultSearch, location: 'Строгино' });
                  setApplied({ ...defaultSearch, location: 'Строгино' });
                  setSearched(true);
                  switchRole('customer');
                }}
              >
                <img src="/images/wake.webp" alt="Катание на воде" />
                <span>
                  Строгино <ArrowUpRight />
                </span>
                <small>Вода рядом с городом</small>
              </button>
              <button
                onClick={() => {
                  setSearch({ ...defaultSearch, location: 'Крылатское' });
                  setApplied({ ...defaultSearch, location: 'Крылатское' });
                  setSearched(true);
                  switchRole('customer');
                }}
              >
                <img src="/images/boat.webp" alt="Катер на воде" />
                <span>
                  Крылатское <ArrowUpRight />
                </span>
                <small>Твой новый любимый маршрут</small>
              </button>
            </div>
          </section>
          <div className="landing-demo">
            <Info size={16} />
            <p>
              Это интерактивный прототип. Все школы, тарифы и бронирования — демонстрационные.
              Оплата не требуется.
            </p>
            <button onClick={() => setInfo(true)}>
              Подробнее <ArrowUpRight size={15} />
            </button>
          </div>
        </main>
      ) : (
        <main className="app-main">
          {isCustomer && (
            <>
              <div className="page-intro">
                <div>
                  <span className="eyebrow">
                    <span className="tiny-wave">≈</span> МОСКВА И ПОДМОСКОВЬЕ
                  </span>
                  <h1>
                    Найди свою волну<span className="blue">.</span>
                  </h1>
                  <p className="muted">Город подождёт. Выбирай катер, время и выходи на воду.</p>
                </div>
                <span className="intro-doodle">
                  <Waves size={62} strokeWidth={1.2} />
                </span>
              </div>
              <VoiceInput onInterpret={interpret} />
              {voiceError && (
                <p className="error" role="alert">
                  {voiceError}
                </p>
              )}
              <form className="search-form" onSubmit={submitSearch}>
                <div className="search-location">
                  <label>
                    <span>
                      <MapPin size={14} /> Где катаемся?
                    </span>
                    <input
                      value={search.location}
                      onChange={(e) => setSearch({ ...search, location: e.target.value })}
                      placeholder="Москва, район или школа"
                    />
                  </label>
                </div>
                <label>
                  <span>
                    <CalendarDays size={14} /> Дата
                  </span>
                  <input
                    aria-label="Дата катания"
                    type="date"
                    min={localDate()}
                    value={search.date}
                    onChange={(e) => setSearch({ ...search, date: e.target.value })}
                  />
                </label>
                <label>
                  <span>
                    <Clock3 size={14} /> Время
                  </span>
                  <input
                    aria-label="Время катания"
                    type="time"
                    value={search.time}
                    onChange={(e) => setSearch({ ...search, time: e.target.value })}
                  />
                </label>
                <label>
                  <span>
                    <Waves size={14} /> Спорт
                  </span>
                  <select
                    aria-label="Спорт"
                    value={search.sport}
                    onChange={(e) => setSearch({ ...search, sport: e.target.value as Sport })}
                  >
                    <option>Вейксерф</option>
                    <option>Вейкборд</option>
                  </select>
                </label>
                <label>
                  <span>Длительность</span>
                  <select
                    aria-label="Длительность"
                    value={search.duration}
                    onChange={(e) => setSearch({ ...search, duration: Number(e.target.value) })}
                  >
                    {durations.map((d) => (
                      <option key={d} value={d}>
                        {durationLabel(d)}
                      </option>
                    ))}
                  </select>
                </label>
                <Button>
                  <SearchIcon size={18} /> Найти катер
                </Button>
              </form>
              {(search.date || search.time) && (
                <button
                  className="clear-search"
                  onClick={() => {
                    const next = { ...search, date: '', time: '' };
                    setSearch(next);
                    setApplied(next);
                  }}
                >
                  Сбросить дату и время <X size={13} />
                </button>
              )}
              <div className="results-toolbar">
                <div>
                  <h2>{searched ? 'Твоя волна уже рядом' : 'Катера для твоего следующего сета'}</h2>
                  <p>
                    {results.length} {results.length === 1 ? 'катер' : 'катеров'} ·{' '}
                    {applied.location || 'Москва и область'}
                    {applied.date ? ` · ${prettyDate(applied.date)}` : ''}
                    {applied.time ? ` в ${applied.time}` : ''} · {durationLabel(applied.duration)}
                  </p>
                </div>
                <div className="results-controls">
                  <label className="sort-select">
                    <SlidersHorizontal size={16} />
                    <select
                      aria-label="Сортировка"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="recommended">Рекомендуем</option>
                      <option value="price">Сначала дешевле</option>
                    </select>
                  </label>
                  <div className="segmented">
                    <button
                      className={page === 'search' ? 'selected' : ''}
                      onClick={() => go('search')}
                    >
                      <List size={16} />
                      <span>Список</span>
                    </button>
                    <button className={page === 'map' ? 'selected' : ''} onClick={() => go('map')}>
                      <Map size={16} />
                      <span>Карта</span>
                    </button>
                  </div>
                </div>
              </div>
              {!applied.date || !applied.time ? (
                <div className="availability-note">
                  <Info size={15} />
                  <span>
                    Исследуй все катера. Для точной доступности укажи дату и время. Время
                    московское.
                  </span>
                </div>
              ) : (
                <div className="availability-note">
                  <CheckCircle2 size={15} />
                  <span>
                    Только свободные катера на выбранное время. Время московское, цены — демо.
                  </span>
                </div>
              )}
              {results.length ? (
                page === 'map' ? (
                  <BoatMap boats={results} search={applied} onSelect={openBoat} />
                ) : (
                  <div className="boats-grid">
                    {results.map((b) => (
                      <Card key={b.id} boat={b} />
                    ))}
                  </div>
                )
              ) : (
                <div className="empty">
                  <Compass size={38} />
                  <h2>Здесь пока тихая вода</h2>
                  <p>Попробуй другой район, время или длительность сета.</p>
                  <Button
                    onClick={() => {
                      setSearch(defaultSearch);
                      setApplied(defaultSearch);
                      setSearched(false);
                    }}
                  >
                    Показать все катера
                  </Button>
                </div>
              )}
              <p className="demo-note">
                <ShieldCheck size={14} /> Все школы в подборке вымышлены. Фотографии иллюстративные,
                цены и доступность смоделированы.
              </p>
            </>
          )}
          {page === 'favorites' && (
            <>
              <div className="page-intro">
                <div>
                  <span className="eyebrow">ТВОИ МЕСТА НА ВОДЕ</span>
                  <h1>
                    Избранное<span className="blue">.</span>
                  </h1>
                  <p className="muted">Сохрани сейчас. Покатайся, когда захочешь.</p>
                </div>
                <Heart size={38} className="blue" />
              </div>
              {store.favorites.length ? (
                <div className="boats-grid">
                  {store.boats
                    .filter((b) => store.favorites.includes(b.id))
                    .map((b) => (
                      <Card boat={b} key={b.id} />
                    ))}
                </div>
              ) : (
                <div className="empty">
                  <Heart size={38} />
                  <h2>Здесь будет твоя коллекция волн</h2>
                  <p>Нажми сердечко на понравившемся катере.</p>
                  <Button onClick={() => go('search')}>
                    Найти катер <ArrowRight size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
          {page === 'bookings' && (
            <>
              <div className="page-intro">
                <div>
                  <span className="eyebrow">ПЛАНЫ НА ХОРОШИЙ ДЕНЬ</span>
                  <h1>
                    Мои бронирования<span className="blue">.</span>
                  </h1>
                  <p className="muted">Все твои сеты в одном месте.</p>
                </div>
              </div>
              <BookingList />
            </>
          )}
          {page === 'owner' && (
            <>
              <div className="page-intro">
                <div>
                  <span className="eyebrow">КАБИНЕТ ВЛАДЕЛЬЦА</span>
                  <h1>
                    Больше людей на воде<span className="blue">.</span>
                  </h1>
                  <p className="muted">Катера, расписание и бронирования. Всё под рукой.</p>
                </div>
                <span className="intro-doodle">
                  <Ship size={54} strokeWidth={1.3} />
                </span>
              </div>
              <div className="owner-actions">
                <button className="owner-action primary-action" onClick={() => go('add')}>
                  <Plus size={26} />
                  <strong>Добавить катер</strong>
                  <span>
                    Расскажи о нём голосом <ArrowUpRight size={17} />
                  </span>
                </button>
                <button className="owner-action" onClick={() => go('calendar')}>
                  <CalendarDays size={26} />
                  <strong>Расписание</strong>
                  <span>
                    Настроить время на воде <ArrowUpRight size={17} />
                  </span>
                </button>
                <button className="owner-action" onClick={() => go('owner-bookings')}>
                  <Anchor size={26} />
                  <strong>Бронирования</strong>
                  <span>
                    {activeBookings.filter((b) => owned.some((x) => x.id === b.boatId)).length}{' '}
                    активных демо-броней <ArrowUpRight size={17} />
                  </span>
                </button>
              </div>
              <div className="section-heading">
                <h2>
                  Мои катера <span className="count">{owned.length}</span>
                </h2>
                <span className="muted">Видны в поиске клиентов</span>
              </div>
              <div className="owned-grid">
                {owned.map((b) => (
                  <article className="owned-card" key={b.id}>
                    <img src={b.image} alt={b.name} />
                    <div>
                      <span className="status active">
                        <span className="live-dot" /> Опубликован · демо
                      </span>
                      <h3>{b.name}</h3>
                      <p>
                        {b.school} · {b.location}
                      </p>
                      <small>
                        {b.open}–{b.close} · от {money(Math.min(...b.tariffs.map((t) => t.price)))}
                      </small>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCalendarBoatId(b.id);
                          go('calendar');
                        }}
                      >
                        Открыть расписание <ChevronRight size={15} />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
              <p className="demo-note">
                В демо вам принадлежат два исходных катера и все добавленные вами. Переключитесь в
                режим клиента, чтобы проверить бронирование.
              </p>
            </>
          )}
          {page === 'add' && (
            <BoatForm
              notify={notify}
              onBack={() => go('owner')}
              onSave={(boat) => {
                if (update({ ...store, boats: [boat, ...store.boats] })) {
                  setCalendarBoatId(boat.id);
                  notify('Катер опубликован и уже доступен в поиске');
                  go('calendar');
                }
              }}
            />
          )}
          {page === 'calendar' && (
            <div className="narrow">
              <div className="page-intro">
                <div>
                  <span className="eyebrow">КАБИНЕТ ВЛАДЕЛЬЦА</span>
                  <h1>
                    Расписание<span className="blue">.</span>
                  </h1>
                  <p className="muted">Оставь время для волн. Перерывы настроим здесь.</p>
                </div>
              </div>
              <OwnerCalendar
                store={store}
                initialBoatId={calendarBoatId}
                onUpdate={update}
                notify={notify}
              />
            </div>
          )}
          {page === 'owner-bookings' && (
            <>
              <div className="page-intro">
                <div>
                  <span className="eyebrow">КАБИНЕТ ВЛАДЕЛЬЦА</span>
                  <h1>
                    Бронирования<span className="blue">.</span>
                  </h1>
                  <p className="muted">Брони твоих катеров из клиентского поиска.</p>
                </div>
              </div>
              <BookingList owner />
            </>
          )}
        </main>
      )}
      <footer className="site-footer">
        <button className="brand small" onClick={() => go('landing')}>
          <Waves size={22} /> WAKE.
        </button>
        <span>Меньше планов. Больше волн.</span>
        <button onClick={() => setInfo(true)}>
          О прототипе <ArrowUpRight size={14} />
        </button>
      </footer>
      {page !== 'landing' && (
        <nav className="bottom-nav" aria-label="Основная навигация">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              aria-label={label}
              className={page === id ? 'active' : ''}
              onClick={() => go(id as Page)}
            >
              <Icon size={21} />
              <span>{label}</span>
              {id === 'bookings' && activeBookings.length > 0 && <i>{activeBookings.length}</i>}
            </button>
          ))}
        </nav>
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {toast}
          <button onClick={() => setToast('')} aria-label="Скрыть уведомление">
            <X size={16} />
          </button>
        </div>
      )}
      <Dialog open={settings} onOpenChange={setSettings}>
        <DialogContent
          title="Твоя сторона волны"
          description="Переключай роли в любой момент. Данные останутся в этом браузере."
        >
          <div className="role-options">
            <button
              className={role === 'customer' ? 'chosen' : ''}
              onClick={() => switchRole('customer')}
            >
              <Waves />
              <span>
                <strong>Хочу покататься</strong>
                <small>Поиск, избранное и мои брони</small>
              </span>
              <ChevronRight />
            </button>
            <button
              className={role === 'owner' ? 'chosen' : ''}
              onClick={() => switchRole('owner')}
            >
              <Ship />
              <span>
                <strong>Я владелец катера / школы</strong>
                <small>Катера, расписание и бронирования</small>
              </span>
              <ChevronRight />
            </button>
          </div>
          <Button
            variant="ghost"
            className="full"
            onClick={() => {
              setSettings(false);
              setReset(true);
            }}
          >
            <RotateCcw size={16} /> Сбросить демо
          </Button>
          <p className="demo-note">Данные хранятся только на этом устройстве.</p>
        </DialogContent>
      </Dialog>
      <Dialog open={reset} onOpenChange={setReset}>
        <DialogContent
          title="Начать с чистой волны?"
          description="Созданные катера, брони, избранное и перерывы будут удалены. Вернём 10 исходных демо-катеров."
        >
          <div className="dialog-actions">
            <Button variant="outline" onClick={() => setReset(false)}>
              Оставить данные
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (update(seed())) {
                  setReset(false);
                  setSelected(null);
                  setSearch(defaultSearch);
                  setApplied(defaultSearch);
                  setSearched(false);
                  notify('Демонстрационные данные восстановлены');
                }
              }}
            >
              Сбросить демо
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!interpretation}
        onOpenChange={(open) => {
          if (!open) setInterpretation(null);
        }}
      >
        <DialogContent
          title="Вот что я понял. Всё верно?"
          description="Можно исправить любое поле. Поиск начнётся только после подтверждения."
        >
          {interpretation && (
            <form
              className="interpret-form"
              onSubmit={(e) => {
                e.preventDefault();
                const next = { ...search, ...interpretation };
                setSearch(next);
                setApplied(next);
                setInterpretation(null);
                setSearched(true);
                go('search');
              }}
            >
              <label>
                Где
                <input
                  value={interpretation.location ?? search.location}
                  onChange={(e) =>
                    setInterpretation({ ...interpretation, location: e.target.value })
                  }
                />
              </label>
              <div className="two-col">
                <label>
                  Дата
                  <input
                    type="date"
                    min={localDate()}
                    value={interpretation.date ?? search.date}
                    onChange={(e) => setInterpretation({ ...interpretation, date: e.target.value })}
                  />
                </label>
                <label>
                  Время
                  <input
                    type="time"
                    value={interpretation.time ?? search.time}
                    onChange={(e) => setInterpretation({ ...interpretation, time: e.target.value })}
                  />
                </label>
              </div>
              <div className="two-col">
                <label>
                  Спорт
                  <select
                    value={interpretation.sport ?? search.sport}
                    onChange={(e) =>
                      setInterpretation({ ...interpretation, sport: e.target.value as Sport })
                    }
                  >
                    <option>Вейксерф</option>
                    <option>Вейкборд</option>
                  </select>
                </label>
                <label>
                  Длительность
                  <select
                    value={interpretation.duration ?? search.duration}
                    onChange={(e) =>
                      setInterpretation({ ...interpretation, duration: Number(e.target.value) })
                    }
                  >
                    {[...new Set([...durations, interpretation.duration ?? search.duration])].map(
                      (d) => (
                        <option key={d} value={d}>
                          {durationLabel(d)}
                        </option>
                      ),
                    )}
                  </select>
                </label>
              </div>
              <p className="field-note">
                Нераспознанные параметры сохранены из формы. Без даты или времени покажем все
                подходящие катера.
              </p>
              <Button className="full">
                Всё верно, найти катер <ArrowRight size={17} />
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        {selected && (
          <DialogContent
            title={
              bookingStep === 'success'
                ? 'Катер забронирован!'
                : bookingStep === 'confirm'
                  ? 'Твоя волна почти забронирована'
                  : selected.school
            }
            description={
              bookingStep === 'success'
                ? 'Отличный план на день. Демо-бронь сохранена в этом браузере.'
                : bookingStep === 'confirm'
                  ? 'Проверь детали. Время московское (UTC+3). Оплата не нужна.'
                  : `${selected.name} · ${selected.location}`
            }
          >
            {bookingStep === 'success' && success ? (
              <div className="success-content">
                <div className="success-icon">
                  <Check size={42} />
                </div>
                <h3>Увидимся на воде</h3>
                <div className="summary-card">
                  <strong>
                    {selected.school} · {selected.name}
                  </strong>
                  <p>
                    {prettyDate(success.date)} · {success.time} · {durationLabel(success.duration)}
                  </p>
                  <p>
                    {success.sport} · {money(success.price)}
                  </p>
                </div>
                <p className="demo-warning">
                  <Info size={17} /> Это демонстрация. Реальное бронирование не отправлено, деньги
                  не списывались.
                </p>
                <Button
                  className="full"
                  onClick={() => {
                    setSelected(null);
                    go('bookings');
                  }}
                >
                  Мои бронирования <ArrowRight size={17} />
                </Button>
                <Button variant="ghost" className="full" onClick={() => setSelected(null)}>
                  Продолжить поиск
                </Button>
              </div>
            ) : bookingStep === 'confirm' ? (
              <>
                <div className="booking-boat">
                  <img src={selected.image} alt="Иллюстрация катания" />
                  <div>
                    <h3>{selected.school}</h3>
                    <p>{selected.name}</p>
                    <small>{selected.location}</small>
                  </div>
                </div>
                <dl className="booking-summary">
                  <div>
                    <dt>Дата</dt>
                    <dd>{prettyDate(bookingSearch.date)}</dd>
                  </div>
                  <div>
                    <dt>Время</dt>
                    <dd>
                      {bookingSearch.time}–
                      {timeLabel(minutes(bookingSearch.time) + bookingSearch.duration)}
                    </dd>
                  </div>
                  <div>
                    <dt>Катание</dt>
                    <dd>
                      {bookingSearch.sport} · {durationLabel(bookingSearch.duration)}
                    </dd>
                  </div>
                  <div>
                    <dt>Услуга</dt>
                    <dd>{bookingSearch.service}</dd>
                  </div>
                  <div className="total">
                    <dt>Итого</dt>
                    <dd>
                      {quote(
                        selected,
                        bookingSearch.sport,
                        bookingSearch.duration,
                        bookingSearch.service,
                      ) !== null
                        ? money(
                            quote(
                              selected,
                              bookingSearch.sport,
                              bookingSearch.duration,
                              bookingSearch.service,
                            )!,
                          )
                        : 'Нет тарифа'}
                    </dd>
                  </div>
                </dl>
                {bookingError && (
                  <p role="alert" className="error">
                    {bookingError}
                  </p>
                )}
                <Button className="full" onClick={confirmBooking}>
                  Подтвердить бронирование <ArrowRight size={17} />
                </Button>
                <Button variant="ghost" className="full" onClick={() => setBookingStep('details')}>
                  Изменить детали
                </Button>
                <p className="demo-note">Демо · без оплаты · отмена в один клик</p>
              </>
            ) : (
              <>
                <img
                  className="detail-photo"
                  src={selected.image}
                  alt="Иллюстративная фотография катания"
                />
                <div className="detail-badges">
                  <span className="status active">
                    {selected.connected ? 'Демо-подключение' : 'Внешняя школа'}
                  </span>
                  <button className="favorite-text" onClick={() => favorite(selected.id)}>
                    <Heart
                      size={17}
                      fill={store.favorites.includes(selected.id) ? 'currentColor' : 'none'}
                    />
                    {store.favorites.includes(selected.id) ? 'Сохранено' : 'В избранное'}
                  </button>
                </div>
                <p>{selected.wave}</p>
                <p className="muted">
                  {selected.sports.join(' · ')} · {selected.open}–{selected.close}
                </p>
                <p className="field-note">
                  {selected.coordinateNote} ·{' '}
                  {selected.fictional
                    ? 'Вымышленная школа. Фотография иллюстративная.'
                    : 'Публичная информация, доступность неизвестна.'}
                </p>
                {!selected.connected ? (
                  <>
                    <p className="info-banner">
                      Школа не подключена к WAKE. Её доступность нам неизвестна.
                    </p>
                    {selected.website && (
                      <Button asChild className="full">
                        <a href={selected.website} target="_blank" rel="noopener noreferrer">
                          Перейти на сайт <ExternalLink size={17} />
                        </a>
                      </Button>
                    )}
                  </>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (
                        !isAvailable(
                          store,
                          selected,
                          bookingSearch.date,
                          bookingSearch.time,
                          bookingSearch.duration,
                        )
                      ) {
                        setBookingError(
                          'Это время недоступно. Проверьте рабочие часы или выберите другой слот.',
                        );
                        return;
                      }
                      if (
                        quote(
                          selected,
                          bookingSearch.sport,
                          bookingSearch.duration,
                          bookingSearch.service,
                        ) === null
                      ) {
                        setBookingError('Для этого сета нет тарифа. Выберите другой вариант.');
                        return;
                      }
                      setBookingError('');
                      setBookingStep('confirm');
                    }}
                    className="interpret-form"
                  >
                    <div className="two-col">
                      <label>
                        Дата
                        <input
                          required
                          type="date"
                          min={localDate()}
                          value={bookingSearch.date}
                          onChange={(e) =>
                            setBookingSearch({ ...bookingSearch, date: e.target.value })
                          }
                        />
                      </label>
                      <label>
                        Время
                        <input
                          required
                          type="time"
                          value={bookingSearch.time}
                          onChange={(e) =>
                            setBookingSearch({ ...bookingSearch, time: e.target.value })
                          }
                        />
                      </label>
                    </div>
                    <label>
                      Спорт
                      <select
                        value={bookingSearch.sport}
                        onChange={(e) => {
                          const sport = e.target.value as Sport,
                            t = selected.tariffs.find((t) => t.sport === sport)!;
                          setBookingSearch({
                            ...bookingSearch,
                            sport,
                            duration: t.duration,
                            service: t.service,
                          });
                        }}
                      >
                        {selected.sports.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Сет и услуга
                      <select
                        value={`${bookingSearch.duration}|${bookingSearch.service}`}
                        onChange={(e) => {
                          const [d, ...s] = e.target.value.split('|');
                          setBookingSearch({
                            ...bookingSearch,
                            duration: Number(d),
                            service: s.join('|'),
                          });
                        }}
                      >
                        {selected.tariffs
                          .filter((t) => t.sport === bookingSearch.sport)
                          .map((t, i) => (
                            <option value={`${t.duration}|${t.service}`} key={i}>
                              {durationLabel(t.duration)} · {money(t.price)} · {t.service}
                            </option>
                          ))}
                      </select>
                    </label>
                    {bookingError && (
                      <p role="alert" className="error">
                        {bookingError}
                      </p>
                    )}
                    <Button className="full">
                      Забронировать <ArrowRight size={17} />
                    </Button>
                  </form>
                )}
              </>
            )}
          </DialogContent>
        )}
      </Dialog>
      <Dialog
        open={!!cancel}
        onOpenChange={(open) => {
          if (!open) setCancel(null);
        }}
      >
        <DialogContent
          title="Отменить этот сет?"
          description="Бронь останется в истории. Время сразу станет доступным для нового бронирования."
        >
          <div className="dialog-actions">
            <Button variant="outline" onClick={() => setCancel(null)}>
              Оставить бронь
            </Button>
            <Button variant="destructive" onClick={performCancel}>
              Да, отменить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={info} onOpenChange={setInfo}>
        <DialogContent
          title="WAKE — ближе к воде"
          description="Интерактивный прототип маркетплейса катеров и вейк-школ Москвы."
        >
          <div className="about-content">
            <p>
              Бронируйте катание, сохраняйте любимые места или переключитесь в режим владельца —
              добавленные катера сразу появятся в поиске.
            </p>
            <p>
              Все 10 школ вымышлены. Модели катеров реальны, изображения созданы ИИ и служат
              иллюстрациями, цены и расписания не проверены. Две школы имитируют неподключённых
              операторов: их доступность неизвестна, а ссылка открывает отдельную демо-страницу
              вместо реального внешнего сайта.
            </p>
            <p>
              Реальная бронь не отправляется, оплата не производится. Данные хранятся только в этом
              браузере и не синхронизируются между устройствами.
            </p>
            <p>
              Голосовой ввод зависит от браузера, разрешения на микрофон и сети. Текстовый ввод
              работает всегда. Микрофон может использовать сервис распознавания вашего браузера.
            </p>
            <Button
              variant="outline"
              className="full"
              onClick={() => {
                setInfo(false);
                setReset(true);
              }}
            >
              <RotateCcw size={16} /> Сбросить демо
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
