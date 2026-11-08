import test from 'node:test';
import assert from 'node:assert/strict';
import { seed } from '../src/lib/data';
import {
  createBooking,
  cancelBooking,
  isAvailable,
  quote,
  overlaps,
  filterBoats,
  type Search,
} from '../src/lib/model';
import { parseSearch, parseBoat } from '../src/lib/voice';
const now = new Date('2026-01-01T08:00:00');
const query: Search = {
  location: 'Москва',
  date: '2026-07-19',
  time: '15:00',
  duration: 30,
  sport: 'Вейксерф',
  service: 'Катание с инструктором',
};
test('half-open intervals permit adjacent sets and prevent all overlap shapes', () => {
  assert.equal(overlaps(900, 930, 930, 960), false);
  for (const [start, end] of [
    [899, 901],
    [900, 930],
    [910, 920],
    [899, 931],
    [929, 940],
  ])
    assert.equal(overlaps(900, 930, start, end), true);
});
test('booking blocks the same boat across sports and services, but not other boats', () => {
  const store = seed(),
    boat = store.boats[0],
    result = createBooking(store, boat.id, query, now);
  assert.equal(result.booking.price, 8000);
  for (const time of ['14:45', '15:00', '15:15'])
    assert.equal(isAvailable(result.store, boat, query.date, time, 30, now), false);
  assert.throws(
    () =>
      createBooking(
        result.store,
        boat.id,
        { ...query, sport: 'Вейкборд', service: 'Катание без инструктора' },
        now,
      ),
    /уже занято/,
  );
  assert.equal(isAvailable(result.store, boat, query.date, '15:30', 30, now), true);
  assert.equal(isAvailable(result.store, store.boats[1], query.date, query.time, 30, now), true);
});
test('cancellation releases the interval and preserves booking history', () => {
  const store = seed(),
    boat = store.boats[0],
    result = createBooking(store, boat.id, query, now),
    cancelled = cancelBooking(result.store, result.booking.id);
  assert.equal(cancelled.bookings[0].status, 'cancelled');
  assert.equal(isAvailable(cancelled, boat, query.date, query.time, 30, now), true);
});
test('manual blocks and whole-day closures share availability with customer bookings', () => {
  const store = seed(),
    boat = store.boats[0];
  store.blocks.push({
    id: 'break',
    boatId: boat.id,
    date: query.date,
    start: '15:00',
    end: '16:00',
    allDay: false,
  });
  assert.equal(isAvailable(store, boat, query.date, '14:45', 30, now), false);
  assert.equal(isAvailable(store, boat, query.date, '16:00', 30, now), true);
  store.blocks[0].allDay = true;
  assert.equal(isAvailable(store, boat, query.date, '10:00', 30, now), false);
});
test('working hours, past slots, invalid dates and overnight sessions are rejected', () => {
  const store = seed(),
    boat = store.boats[0];
  for (const [date, time, duration] of [
    ['2025-07-19', '15:00', 30],
    [query.date, '08:59', 30],
    [query.date, '20:45', 30],
    [query.date, '23:30', 120],
    ['invalid', '15:00', 30],
    [query.date, '29:00', 30],
  ] as const)
    assert.equal(isAvailable(store, boat, date, time, duration, now), false);
  assert.equal(isAvailable(store, boat, query.date, '20:30', 30, now), true);
});
test('prices come from exact sport, duration and service tariffs; unsupported sets are not extrapolated', () => {
  const boat = seed().boats[0];
  assert.equal(quote(boat, 'Вейксерф', 30, 'Катание с инструктором'), 8000);
  assert.equal(quote(boat, 'Вейкборд', 30, 'Катание без инструктора'), 7200);
  assert.equal(quote(boat, 'Вейксерф', 60, 'Катание с инструктором'), 16000);
  assert.equal(quote(boat, 'Вейксерф', 120, 'Катание с инструктором'), 32000);
  assert.equal(quote(boat, 'Вейксерф', 45), null);
  assert.equal(quote(boat, 'Вейксерф', 30, 'Неизвестная услуга'), null);
  assert.throws(
    () => createBooking(seed(), boat.id, { ...query, duration: 45 }, now),
    /нет тарифа/,
  );
});
test('search permits date-free browsing and filters exact availability', () => {
  const store = seed();
  assert.equal(filterBoats(store, { ...query, date: '', time: '' }).length, 10);
  const future = { ...query, date: '2099-07-19' };
  const booked = createBooking(store, store.boats[0].id, future, now).store;
  assert.equal(filterBoats(booked, future).length, 7);
  assert.equal(
    filterBoats(store, { ...query, location: 'Строгино', date: '', time: '' }).length,
    2,
  );
});
test('external listings can be browsed but never claim live availability or direct booking', () => {
  const store = seed();
  store.boats[0].connected = false;
  store.boats[0].website = 'https://example.org';
  assert.equal(filterBoats(store, { ...query, date: '', time: '' }).length, 10);
  assert.equal(isAvailable(store, store.boats[0], query.date, query.time, 30, now), false);
  assert.throws(() => createBooking(store, store.boats[0].id, query, now));
});
test('customer Russian parser extracts common locations, dates, times and durations', () => {
  assert.deepEqual(parseSearch('Хочу вейксерф в Строгино завтра в 15:00 на полчаса', now).values, {
    date: '2026-01-02',
    time: '15:00',
    sport: 'Вейксерф',
    duration: 30,
    location: 'Строгино',
  });
  const result = parseSearch('Найди катер в Крылатском послезавтра в 4 вечера на час', now).values;
  assert.equal(result.date, '2026-01-03');
  assert.equal(result.time, '16:00');
  assert.equal(result.duration, 60);
  assert.equal(result.location, 'Крылатское');
  assert.equal(parseSearch('19 января в 15:00 на 25 минут', now).values.date, '2026-01-19');
  assert.equal(parseSearch('бессмысленный запрос', now).recognized.length, 0);
});
test('owner parser populates boat fields, multiple sports, hours and prices without invention', () => {
  const p = parseBoat(
    'Добавь катер Malibu 23 LSV 2020 года. Вейксерф и вейкборд. Сет 25 минут стоит 7000 рублей. Работаем с 9 утра до 9 вечера',
  );
  assert.equal(p.name, 'Malibu 23 LSV');
  assert.equal(p.year, 2020);
  assert.deepEqual(p.sports, ['Вейксерф', 'Вейкборд']);
  assert.equal(p.tariffs?.length, 2);
  assert.equal(p.tariffs?.[0].price, 7000);
  assert.equal(p.open, '09:00');
  assert.equal(p.close, '21:00');
  assert.deepEqual(parseBoat('Привет'), {});
});

test('Moscow schedules use UTC+3 and invalid calendar dates cannot be booked', () => {
  const store = seed(),
    boat = store.boats[0];
  assert.equal(isAvailable(store, boat, '2099-02-30', '15:00', 30, now), false);
  assert.equal(isAvailable(store, boat, '2099-07-19', '09:99', 30, now), false);
  assert.equal(
    isAvailable(store, boat, '2026-07-19', '15:00', 30, new Date('2026-07-19T12:00:00Z')),
    false,
  );
  assert.equal(
    isAvailable(store, boat, '2026-07-19', '15:01', 30, new Date('2026-07-19T12:00:00Z')),
    true,
  );
  assert.equal(
    parseSearch('завтра в 15:00', new Date('2026-12-31T21:30:00Z')).values.date,
    '2027-01-02',
  );
});
