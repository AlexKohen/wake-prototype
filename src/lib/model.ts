export type Sport = 'Вейксерф' | 'Вейкборд';
export interface Tariff {
  duration: number;
  price: number;
  sport: Sport;
  service: string;
}
export interface Boat {
  id: string;
  school: string;
  name: string;
  manufacturer: string;
  model: string;
  year: number;
  image: string;
  location: string;
  lat: number;
  lng: number;
  coordinateNote?: string;
  sports: Sport[];
  wave: string;
  services: string[];
  tariffs: Tariff[];
  open: string;
  close: string;
  connected: boolean;
  website?: string;
  fictional: boolean;
  owner: boolean;
}
export interface Booking {
  id: string;
  boatId: string;
  date: string;
  time: string;
  duration: number;
  sport: Sport;
  service: string;
  price: number;
  status: 'active' | 'cancelled';
  created: string;
}
export interface Block {
  id: string;
  boatId: string;
  date: string;
  start: string;
  end: string;
  allDay: boolean;
}
export interface Store {
  version: 1;
  boats: Boat[];
  bookings: Booking[];
  blocks: Block[];
  favorites: string[];
}
export interface Search {
  location: string;
  date: string;
  time: string;
  sport: Sport;
  duration: number;
  service: string;
}
export const durations = [15, 20, 25, 30, 60, 120, 180];
export const money = (n: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(n);
// All operating schedules are in Moscow, regardless of the visitor's device timezone.
export function localDate(d = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d);
  return ['year', 'month', 'day']
    .map((type) => parts.find((p) => p.type === type)!.value)
    .join('-');
}
export function addDays(date: string, n: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
export const prettyDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
export const durationLabel = (n: number) => (n < 60 ? `${n} мин` : `${n / 60} ч`);
export function minutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
export function timeLabel(n: number) {
  return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
}
export function overlaps(startA: number, endA: number, startB: number, endB: number) {
  return startA < endB && startB < endA;
}
export function quote(boat: Boat, sport: Sport, duration: number, service = ''): number | null {
  return (
    boat.tariffs.find(
      (t) => t.sport === sport && t.duration === duration && (!service || t.service === service),
    )?.price ?? null
  );
}
export function isAvailable(
  store: Store,
  boat: Boat,
  date: string,
  time: string,
  duration: number,
  now = new Date(),
) {
  if (
    !boat.connected ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
    !Number.isFinite(duration) ||
    duration <= 0
  )
    return false;
  const start = minutes(time),
    end = start + duration;
  const instant = new Date(`${date}T${time}:00+03:00`);
  if (
    Number.isNaN(instant.getTime()) ||
    localDate(instant) !== date ||
    instant <= now ||
    start < minutes(boat.open) ||
    end > minutes(boat.close) ||
    end > 1440
  )
    return false;
  return (
    !store.bookings.some(
      (b) =>
        b.boatId === boat.id &&
        b.status === 'active' &&
        b.date === date &&
        overlaps(start, end, minutes(b.time), minutes(b.time) + b.duration),
    ) &&
    !store.blocks.some(
      (b) =>
        b.boatId === boat.id &&
        b.date === date &&
        (b.allDay || overlaps(start, end, minutes(b.start), minutes(b.end))),
    )
  );
}
export function createBooking(
  store: Store,
  boatId: string,
  search: Search,
  now = new Date(),
): { store: Store; booking: Booking } {
  const boat = store.boats.find((b) => b.id === boatId);
  if (!boat || !isAvailable(store, boat, search.date, search.time, search.duration, now))
    throw new Error('Это время уже занято или недоступно. Выберите другой слот.');
  const tariff = boat.tariffs.find(
    (t) =>
      t.sport === search.sport &&
      t.duration === search.duration &&
      (!search.service || t.service === search.service),
  );
  if (!tariff) throw new Error('Для выбранной услуги нет тарифа. Выберите другой сет.');
  const booking: Booking = {
    id: crypto.randomUUID(),
    boatId,
    date: search.date,
    time: search.time,
    duration: search.duration,
    sport: search.sport,
    service: tariff.service,
    price: tariff.price,
    status: 'active',
    created: now.toISOString(),
  };
  return { store: { ...store, bookings: [booking, ...store.bookings] }, booking };
}
export function cancelBooking(store: Store, id: string): Store {
  return {
    ...store,
    bookings: store.bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)),
  };
}
export function filterBoats(store: Store, search: Search) {
  const location = search.location.toLocaleLowerCase('ru').trim();
  return store.boats.filter(
    (b) =>
      (!location ||
        /^(москва|moscow)$/.test(location) ||
        `${b.location} ${b.school} ${b.name}`.toLocaleLowerCase('ru').includes(location)) &&
      b.sports.includes(search.sport) &&
      (quote(b, search.sport, search.duration, search.service) !== null || !b.connected) &&
      (!(search.date && search.time) ||
        (b.connected && isAvailable(store, b, search.date, search.time, search.duration))),
  );
}
