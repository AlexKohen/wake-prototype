import { localDate, addDays, type Search, type Sport, type Tariff } from './model';
const normalize = (s: string) => s.toLowerCase().replace(/ё/g, 'е');
export function parseSearch(
  text: string,
  now = new Date(),
): { values: Partial<Search>; recognized: string[] } {
  const calendarNow = new Date(`${localDate(now)}T12:00:00Z`);
  const s = normalize(text),
    values: Partial<Search> = {},
    recognized: string[] = [];
  const put = <K extends keyof Search>(key: K, value: Search[K]) => {
    values[key] = value;
    recognized.push(key);
  };
  if (s.includes('послезавтра')) put('date', addDays(localDate(now), 2));
  else if (s.includes('завтра')) put('date', addDays(localDate(now), 1));
  else if (s.includes('сегодня')) put('date', localDate(now));
  const numeric = s.match(/(\d{1,2})[./](\d{1,2})(?:[./](\d{4}))?/);
  const months = [
    'январ',
    'феврал',
    'март',
    'апрел',
    'ма[йя]',
    'июн',
    'июл',
    'август',
    'сентябр',
    'октябр',
    'ноябр',
    'декабр',
  ];
  months.forEach((month, i) => {
    const m = s.match(new RegExp('(\\d{1,2})\\s+' + month));
    if (m) {
      const year = calendarNow.getUTCFullYear() + (i < calendarNow.getUTCMonth() ? 1 : 0);
      const d = new Date(year, i, Number(m[1]), 12);
      if (d.getMonth() === i) put('date', localDate(d));
    }
  });
  if (numeric) {
    const d = new Date(
      Number(numeric[3] || calendarNow.getUTCFullYear()),
      Number(numeric[2]) - 1,
      Number(numeric[1]),
      12,
    );
    if (d.getMonth() === Number(numeric[2]) - 1 && d.getDate() === Number(numeric[1]))
      put('date', localDate(d));
  }
  const clock =
    s.match(/(?:в\s*)?(\d{1,2})[:.](\d{2})(?!\d)/) ||
    s.match(/в\s+(\d{1,2})(?:\s*час(?:а|ов)?)?(?:\s*(утра|вечера|дня))?/);
  if (clock) {
    let h = Number(clock[1]);
    const m = /^\d+$/.test(clock[2] || '') ? Number(clock[2]) : 0;
    if (['вечера', 'дня'].includes(clock[2]) && h < 12) h += 12;
    if (h < 24 && m < 60)
      put('time', `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
  if (/вейк\s*борд/.test(s)) put('sport', 'Вейкборд');
  else if (/вейк\s*серф/.test(s)) put('sport', 'Вейксерф');
  const dm = s.match(/(\d+)\s*мин/),
    hm = s.match(/(?:на\s+)?(\d+)\s*час/);
  if (dm) put('duration', Number(dm[1]));
  else if (/полчаса|полчас/.test(s)) put('duration', 30);
  else if (hm) put('duration', Number(hm[1]) * 60);
  else if (/на час|один час/.test(s)) put('duration', 60);
  else if (/два часа/.test(s)) put('duration', 120);
  else if (/три часа/.test(s)) put('duration', 180);
  const areas: [RegExp, string][] = [
    [/строгин/, 'Строгино'],
    [/крылатск/, 'Крылатское'],
    [/мякинин/, 'Мякинино'],
    [/химк/, 'Химки'],
    [/пирогов/, 'Пирогово'],
    [/красногорск/, 'Красногорск'],
    [/хлебников/, 'Хлебниково'],
    [/троицк/, 'Троицкое'],
    [/серебрян/, 'Серебряный Бор'],
    [/москв/, 'Москва'],
  ];
  for (const [re, place] of areas)
    if (re.test(s)) {
      put('location', place);
      break;
    }
  return { values, recognized };
}
export interface BoatInterpretation {
  name?: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  sports?: Sport[];
  tariffs?: Tariff[];
  open?: string;
  close?: string;
}
export function parseBoat(text: string): BoatInterpretation {
  const s = normalize(text),
    out: BoatInterpretation = {};
  const name = text.match(
    /\b(Malibu|Nautique|MasterCraft|Supra|Axis|Centurion|Moomba)\s+([A-Za-z0-9]+(?:\s+(?:LSV|LS|SL|SA|SS))?)/i,
  );
  if (name) {
    out.manufacturer = name[1];
    out.model = name[2];
    out.name = `${name[1]} ${name[2]}`;
  }
  const year = s.match(/\b(20[0-2]\d|19\d{2})\s*(?:года|год|г\b)/);
  if (year) out.year = Number(year[1]);
  const sports: Sport[] = [];
  if (/вейк\s*серф/.test(s)) sports.push('Вейксерф');
  if (/вейк\s*борд/.test(s)) sports.push('Вейкборд');
  if (sports.length) out.sports = sports;
  const tariffs: Tariff[] = [];
  for (const m of s.matchAll(/(\d+)\s*мин(?:ут[аы]?)?\s*(?:стоит|—|-|за)?\s*(\d[\d\s]*)(?:руб|₽)/g))
    for (const sport of sports.length ? sports : (['Вейксерф'] as Sport[]))
      tariffs.push({
        duration: Number(m[1]),
        price: Number(m[2].replace(/\s/g, '')),
        sport,
        service: 'Катание с инструктором',
      });
  if (tariffs.length) out.tariffs = tariffs;
  const hours = s.match(
    /с\s+(\d{1,2})(?::(\d{2}))?\s*(утра|вечера)?\s*(?:до|-)\s*(\d{1,2})(?::(\d{2}))?\s*(утра|вечера)?/,
  );
  if (hours) {
    let a = Number(hours[1]),
      b = Number(hours[4]);
    if (hours[3] === 'вечера' && a < 12) a += 12;
    if (hours[6] === 'вечера' && b < 12) b += 12;
    if (a < 24 && b < 24 && a < b) {
      out.open = `${String(a).padStart(2, '0')}:${hours[2] || '00'}`;
      out.close = `${String(b).padStart(2, '0')}:${hours[5] || '00'}`;
    }
  }
  return out;
}
