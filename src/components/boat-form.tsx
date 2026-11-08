'use client';
import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Upload, Check, Ship, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import VoiceInput from './voice-input';
import { parseBoat } from '@/lib/voice';
import { type Boat, type Sport, type Tariff, durations, durationLabel } from '@/lib/model';
const sports: Sport[] = ['Вейксерф', 'Вейкборд'];
export default function BoatForm({
  onSave,
  onBack,
  notify,
}: {
  onSave: (boat: Boat) => void;
  onBack: () => void;
  notify: (s: string) => void;
}) {
  const [name, setName] = useState(''),
    [school, setSchool] = useState(''),
    [manufacturer, setManufacturer] = useState(''),
    [model, setModel] = useState(''),
    [year, setYear] = useState(2023),
    [location, setLocation] = useState('Строгино, Москва'),
    [image, setImage] = useState('/images/boat.webp'),
    [selectedSports, setSports] = useState<Sport[]>(['Вейксерф']),
    [wave, setWave] = useState(''),
    [open, setOpen] = useState('09:00'),
    [close, setClose] = useState('21:00'),
    [tariffs, setTariffs] = useState<Tariff[]>([
      { duration: 30, price: 8000, sport: 'Вейксерф', service: 'Катание с инструктором' },
    ]),
    [review, setReview] = useState(false),
    [voiceReview, setVoiceReview] = useState(false),
    [error, setError] = useState('');
  function interpret(text: string) {
    const result = parseBoat(text);
    if (!Object.keys(result).length) {
      setError('Не удалось выделить параметры. Укажите марку, модель, спорт или тариф.');
      return;
    }
    if (result.name) setName(result.name);
    if (result.manufacturer) setManufacturer(result.manufacturer);
    if (result.model) setModel(result.model);
    if (result.year) setYear(result.year);
    if (result.sports) setSports(result.sports);
    if (result.tariffs) setTariffs(result.tariffs);
    if (result.open) setOpen(result.open);
    if (result.close) setClose(result.close);
    setVoiceReview(true);
    setError('');
    notify('Распознанные поля заполнены. Проверьте их ниже.');
  }
  function upload(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Выберите изображение.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('Файл слишком большой. Максимум 15 МБ.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 1000 / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setImage(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = () => setError('Не удалось открыть фото. Используйте JPG, PNG или WebP.');
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }
  const update = (i: number, data: Partial<Tariff>) =>
    setTariffs((ts) => ts.map((t, j) => (j === i ? { ...t, ...data } : t)));
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (open >= close) {
      setError('Время закрытия должно быть позже открытия.');
      return;
    }
    if (
      !selectedSports.length ||
      !tariffs.length ||
      tariffs.some(
        (t) =>
          t.price <= 0 ||
          !Number.isFinite(t.price) ||
          !t.service.trim() ||
          !selectedSports.includes(t.sport),
      )
    ) {
      setError(
        'Добавьте хотя бы один спорт и тариф с положительной ценой. Спорт тарифа должен поддерживаться катером.',
      );
      return;
    }
    if (selectedSports.some((s) => !tariffs.some((t) => t.sport === s))) {
      setError('Добавьте тариф для каждого выбранного спорта.');
      return;
    }
    setError('');
    setReview(true);
  }
  function save() {
    const areas: [string, number, number][] = [
      ['Строгин', 55.797, 37.413],
      ['Крылат', 55.756, 37.44],
      ['Химк', 55.879, 37.463],
      ['Пирог', 55.979, 37.69],
      ['Мякинин', 55.815, 37.369],
    ];
    const area = areas.find((a) => location.toLowerCase().includes(a[0].toLowerCase()));
    onSave({
      id: crypto.randomUUID(),
      school: school.trim(),
      name: name.trim(),
      manufacturer: manufacturer.trim(),
      model: model.trim(),
      year,
      image,
      location: location.trim(),
      lat: area?.[1] || 55.797,
      lng: area?.[2] || 37.413,
      coordinateNote: area
        ? 'Примерная точка акватории, не адрес причала'
        : 'Точка условная: район не распознан. Уточните причал у оператора.',
      sports: selectedSports,
      wave,
      services: [...new Set(tariffs.map((t) => t.service))],
      tariffs,
      open,
      close,
      connected: true,
      fictional: true,
      owner: true,
    });
  }
  if (review)
    return (
      <div className="narrow page">
        <button className="back" onClick={() => setReview(false)}>
          <ArrowLeft size={18} /> Изменить
        </button>
        <span className="eyebrow">ПОЧТИ НА ВОДЕ</span>
        <h1>Всё верно?</h1>
        <p className="muted">Катер появится в поиске сразу после добавления.</p>
        <img src={image} alt="Фото нового катера" className="review-photo" />
        <h2>{name}</h2>
        <p>
          {school} · {location}
        </p>
        <div className="summary-card">
          <p>
            {manufacturer} {model} · {year}
          </p>
          <p>{selectedSports.join(' · ')}</p>
          <p>
            Ежедневно {open}–{close}
          </p>
          {tariffs.map((t, i) => (
            <p key={i}>
              {t.sport} · {durationLabel(t.duration)} · {t.price.toLocaleString('ru-RU')} ₽
              <small>{t.service}</small>
            </p>
          ))}
        </div>
        <Button className="full" onClick={save}>
          <Check size={18} /> Да, добавить катер
        </Button>
        <p className="demo-note">
          Демо-публикация только в этом браузере. Реальная школа не подключается.
        </p>
      </div>
    );
  return (
    <div className="narrow page">
      <button className="back" onClick={onBack}>
        <ArrowLeft size={18} /> Мои катера
      </button>
      <span className="eyebrow">КАБИНЕТ ВЛАДЕЛЬЦА</span>
      <h1>Добавить катер</h1>
      <p className="muted">Расскажите о катере. Остальное — пара касаний.</p>
      <VoiceInput owner onInterpret={interpret} />
      {voiceReview && (
        <div className="info-banner">
          <Check size={18} />
          <span>
            Всё верно? Проверьте заполненные поля и дополните недостающее. Ничего повторять не
            нужно.
          </span>
          <button onClick={() => setVoiceReview(false)}>Изменить</button>
        </div>
      )}
      <form onSubmit={submit} className="boat-form">
        <section className="form-section">
          <h2>
            <span>01</span> О катере
          </h2>
          <label>
            Школа / оператор
            <input
              required
              maxLength={80}
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Название вашей школы"
            />
          </label>
          <label>
            Название катера
            <input
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Malibu 23 LSV"
            />
          </label>
          <div className="two-col">
            <label>
              Производитель
              <input
                required
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="Malibu"
              />
            </label>
            <label>
              Модель
              <input
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="23 LSV"
              />
            </label>
          </div>
          <label>
            Год выпуска
            <input
              required
              type="number"
              min="1980"
              max={new Date().getFullYear() + 1}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </label>
          <div className="upload-preview">
            <img src={image} alt="Предпросмотр фотографии" />
            <label className="upload-label">
              <Upload size={18} /> Загрузить фото
              <input type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0])} />
            </label>
          </div>
          <label>
            Район / адрес причала
            <input required value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>
          <p className="field-note">На карте покажем примерную акваторию, а не точный причал.</p>
        </section>
        <section className="form-section">
          <h2>
            <span>02</span> Катание и тарифы
          </h2>
          <div className="chips">
            {sports.map((s) => (
              <button
                type="button"
                key={s}
                className={selectedSports.includes(s) ? 'chip active' : 'chip'}
                onClick={() => {
                  setSports(
                    selectedSports.includes(s)
                      ? selectedSports.filter((x) => x !== s)
                      : [...selectedSports, s],
                  );
                }}
              >
                {selectedSports.includes(s) && <Check size={15} />} {s}
              </button>
            ))}
          </div>
          <label>
            Какая у вас волна? <span className="muted">Необязательно</span>
            <textarea
              value={wave}
              onChange={(e) => setWave(e.target.value)}
              placeholder="Подходит новичкам, регулируемая высота…"
            />
          </label>
          {tariffs.map((t, i) => (
            <div className="tariff-row" key={i}>
              <div className="tariff-title">
                <strong>Тариф {i + 1}</strong>
                <button
                  type="button"
                  aria-label={`Удалить тариф ${i + 1}`}
                  onClick={() => setTariffs(tariffs.filter((_, j) => i !== j))}
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <label>
                Услуга
                <input
                  required
                  value={t.service}
                  onChange={(e) => update(i, { service: e.target.value })}
                />
              </label>
              <label>
                Спорт
                <select
                  value={t.sport}
                  onChange={(e) => update(i, { sport: e.target.value as Sport })}
                >
                  {sports.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <div className="two-col">
                <label>
                  Длительность
                  <select
                    value={t.duration}
                    onChange={(e) => update(i, { duration: Number(e.target.value) })}
                  >
                    {durations.map((d) => (
                      <option key={d} value={d}>
                        {durationLabel(d)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Цена, ₽
                  <input
                    required
                    type="number"
                    min="1"
                    max="1000000"
                    value={t.price}
                    onChange={(e) => update(i, { price: Number(e.target.value) })}
                  />
                </label>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setTariffs([
                ...tariffs,
                {
                  duration: 30,
                  price: 8000,
                  sport: selectedSports[0] || 'Вейксерф',
                  service: 'Катание с инструктором',
                },
              ])
            }
          >
            <Plus size={18} /> Добавить тариф / услугу
          </Button>
        </section>
        <section className="form-section">
          <h2>
            <span>03</span> Когда вы на воде?
          </h2>
          <p className="muted">Ежедневно. Выходные и перерывы можно отметить в расписании.</p>
          <div className="two-col">
            <label>
              Открытие
              <input type="time" required value={open} onChange={(e) => setOpen(e.target.value)} />
            </label>
            <label>
              Закрытие
              <input
                type="time"
                required
                value={close}
                onChange={(e) => setClose(e.target.value)}
              />
            </label>
          </div>
        </section>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <Button className="full">
          <Ship size={18} /> Проверить и опубликовать <ChevronRight size={18} />
        </Button>
        <p className="demo-note">Демонстрация · без оплаты и реального подключения школы</p>
      </form>
    </div>
  );
}
