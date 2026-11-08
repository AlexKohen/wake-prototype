'use client';
import { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  LockKeyhole,
  Clock3,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  type Store,
  type Block,
  type Boat,
  localDate,
  addDays,
  prettyDate,
  timeLabel,
  minutes,
  overlaps,
  durationLabel,
} from '@/lib/model';
export default function OwnerCalendar({
  store,
  initialBoatId,
  onUpdate,
  notify,
}: {
  store: Store;
  initialBoatId?: string;
  onUpdate: (s: Store) => void;
  notify: (s: string) => void;
}) {
  const boats = store.boats.filter((b) => b.owner),
    [boatId, setBoatId] = useState(initialBoatId || boats[0]?.id || ''),
    [date, setDate] = useState(localDate()),
    [mode, setMode] = useState<'day' | 'week'>('day'),
    [start, setStart] = useState('13:00'),
    [end, setEnd] = useState('14:00'),
    [allDay, setAllDay] = useState(false),
    [showBlock, setShowBlock] = useState(false),
    [error, setError] = useState('');
  const boat = boats.find((b) => b.id === boatId) || boats[0];
  if (!boat)
    return (
      <div className="empty">
        <CalendarDays />
        <h2>Сначала добавьте катер</h2>
        <p>После публикации здесь появится его расписание.</p>
      </div>
    );
  const blocks = store.blocks.filter((b) => b.boatId === boat.id && b.date === date),
    bookings = store.bookings.filter(
      (b) => b.boatId === boat.id && b.date === date && b.status === 'active',
    );
  function block(e: React.FormEvent) {
    e.preventDefault();
    if (!allDay && (!start || !end || start >= end)) {
      setError('Конец интервала должен быть позже начала.');
      return;
    }
    if (
      bookings.some(
        (b) =>
          allDay ||
          overlaps(minutes(start), minutes(end), minutes(b.time), minutes(b.time) + b.duration),
      )
    ) {
      setError('Здесь уже есть бронь. Сначала отмените её в разделе «Бронирования».');
      return;
    }
    const newBlock: Block = { id: crypto.randomUUID(), boatId: boat.id, date, start, end, allDay };
    onUpdate({ ...store, blocks: [...store.blocks, newBlock] });
    setShowBlock(false);
    setError('');
    notify(allDay ? 'День закрыт для бронирования' : 'Перерыв добавлен');
  }
  function hours(field: 'open' | 'close', value: string) {
    onUpdate({
      ...store,
      boats: store.boats.map((b) => (b.id === boat.id ? { ...b, [field]: value } : b)),
    });
  }
  const days = Array.from({ length: 7 }, (_, i) => addDays(date, i));
  return (
    <div className="calendar-content">
      <div className="calendar-toolbar">
        <label>
          Катер
          <select value={boat.id} onChange={(e) => setBoatId(e.target.value)}>
            {boats.map((b) => (
              <option value={b.id} key={b.id}>
                {b.name} · {b.school}
              </option>
            ))}
          </select>
        </label>
        <div className="segmented">
          <button className={mode === 'day' ? 'selected' : ''} onClick={() => setMode('day')}>
            День
          </button>
          <button className={mode === 'week' ? 'selected' : ''} onClick={() => setMode('week')}>
            Неделя
          </button>
        </div>
      </div>
      <div className="date-navigation">
        <button
          aria-label="Предыдущий день"
          onClick={() => setDate(addDays(date, mode === 'day' ? -1 : -7))}
        >
          <ChevronLeft />
        </button>
        <label>
          <span className="sr-only">Дата расписания</span>
          <input
            aria-label="Дата расписания"
            type="date"
            value={date}
            onChange={(e) => {
              if (e.target.value) setDate(e.target.value);
            }}
          />
        </label>
        <button
          aria-label="Следующий день"
          onClick={() => setDate(addDays(date, mode === 'day' ? 1 : 7))}
        >
          <ChevronRight />
        </button>
      </div>
      <div className="hours-card">
        <Clock3 size={19} />
        <strong>Рабочие часы</strong>
        <label>
          <span className="sr-only">Открытие</span>
          <input
            aria-label="Открытие"
            type="time"
            value={boat.open}
            onChange={(e) => {
              if (e.target.value && e.target.value < boat.close) hours('open', e.target.value);
              else notify('Открытие должно быть раньше закрытия');
            }}
          />
        </label>
        <span>—</span>
        <label>
          <span className="sr-only">Закрытие</span>
          <input
            aria-label="Закрытие"
            type="time"
            value={boat.close}
            onChange={(e) => {
              if (e.target.value && e.target.value > boat.open) hours('close', e.target.value);
              else notify('Закрытие должно быть позже открытия');
            }}
          />
        </label>
      </div>
      <p className="field-note">
        Часы действуют ежедневно. Существующие брони сохраняются при изменении часов.
      </p>
      <div className="calendar-legend">
        <span>
          <i className="dot free" />
          Свободно
        </span>
        <span>
          <i className="dot booked" />
          Бронь
        </span>
        <span>
          <i className="dot blocked" />
          Перерыв
        </span>
      </div>
      {mode === 'week' ? (
        <div className="week-grid">
          {days.map((d) => {
            const reservations = store.bookings.filter(
                (b) => b.boatId === boat.id && b.date === d && b.status === 'active',
              ),
              dayBlocks = store.blocks.filter((b) => b.boatId === boat.id && b.date === d);
            return (
              <button
                className="week-day"
                key={d}
                onClick={() => {
                  setDate(d);
                  setMode('day');
                }}
              >
                <strong>{prettyDate(d)}</strong>
                <small>
                  {new Date(`${d}T12:00:00`).toLocaleDateString('ru-RU', { weekday: 'short' })}
                </small>
                <span className="week-free">
                  {boat.open}–{boat.close}
                </span>
                {reservations.map((b) => (
                  <span className="week-booking" key={b.id}>
                    {b.time} · {durationLabel(b.duration)}
                  </span>
                ))}
                {dayBlocks.map((b) => (
                  <span className="week-block" key={b.id}>
                    {b.allDay ? 'Выходной' : `${b.start}–${b.end}`}
                  </span>
                ))}
                {!reservations.length && !dayBlocks.length && <small>Весь день свободен</small>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="day-timeline">
          {Array.from(
            { length: Math.ceil((minutes(boat.close) - minutes(boat.open)) / 30) },
            (_, i) => {
              const t = minutes(boat.open) + i * 30,
                b = bookings.find((b) =>
                  overlaps(
                    t,
                    Math.min(t + 30, minutes(boat.close)),
                    minutes(b.time),
                    minutes(b.time) + b.duration,
                  ),
                ),
                blocked = blocks.find(
                  (b) => b.allDay || overlaps(t, t + 30, minutes(b.start), minutes(b.end)),
                );
              return (
                <div key={t} className="time-row">
                  <span>{timeLabel(t)}</span>
                  {b ? (
                    <div className="slot booked-slot">
                      <strong>
                        {b.sport} · {b.time}
                      </strong>
                      <span>{durationLabel(b.duration)} · Демо-бронь</span>
                    </div>
                  ) : blocked ? (
                    <div className="slot blocked-slot">
                      <LockKeyhole size={15} />
                      {blocked.allDay ? 'Выходной' : `Перерыв ${blocked.start}–${blocked.end}`}
                    </div>
                  ) : (
                    <button
                      className="slot free-slot"
                      onClick={() => {
                        setStart(timeLabel(t));
                        setEnd(timeLabel(Math.min(t + 30, minutes(boat.close))));
                        setAllDay(false);
                        setShowBlock(true);
                      }}
                    >
                      Свободно <Plus size={15} />
                    </button>
                  )}
                </div>
              );
            },
          )}
        </div>
      )}
      <Button variant="outline" className="full" onClick={() => setShowBlock(!showBlock)}>
        <Plus size={18} /> Закрыть день / добавить перерыв
      </Button>
      {showBlock && (
        <form onSubmit={block} className="form-section block-form">
          <h3>Недоступное время · {prettyDate(date)}</h3>
          <label className="checkbox">
            <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />{' '}
            Закрыть весь день
          </label>
          {!allDay && (
            <div className="two-col">
              <label>
                С
                <input
                  required
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </label>
              <label>
                До
                <input required type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
              </label>
            </div>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <Button className="full">Сохранить перерыв</Button>
        </form>
      )}
      {blocks.length > 0 && (
        <section className="form-section">
          <h3>Перерывы на {prettyDate(date)}</h3>
          {blocks.map((b) => (
            <div className="block-item" key={b.id}>
              <span>{b.allDay ? 'Весь день' : `${b.start}–${b.end}`}</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Удалить перерыв"
                onClick={() => {
                  onUpdate({ ...store, blocks: store.blocks.filter((x) => x.id !== b.id) });
                  notify('Время снова доступно');
                }}
              >
                <Trash2 size={17} />
              </Button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
