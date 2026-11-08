import { type Boat, type Store, durations } from './model';
const places = [
  ['Своя волна', 'Malibu 23 LSV', 'Строгино, Строгинский затон', 55.797, 37.413],
  ['Сет на закате', 'Nautique G23', 'Крылатское, Гребной канал', 55.756, 37.44],
  ['Синий берег', 'MasterCraft X24', 'Мякинино, Живописная бухта', 55.815, 37.369],
  ['Точка воды', 'Supra SA', 'Химки, Химкинское водохранилище', 55.879, 37.463],
  ['Лето внутри', 'Axis A24', 'Пирогово, Пироговское водохранилище', 55.979, 37.69],
  ['На гребне', 'Centurion Ri230', 'Строгино, Большой Строгинский затон', 55.807, 37.405],
  ['Речной клуб', 'Malibu M220', 'Красногорск, Павшинская пойма', 55.815, 37.391],
  ['Вода и воздух', 'Moomba Makai', 'Хлебниково, Клязьминское водохранилище', 55.977, 37.514],
  ['Волна рядом', 'Nautique GS22', 'Троицкое, Клязьминское водохранилище', 55.976, 37.589],
  ['Тихая бухта', 'MasterCraft NXT22', 'Серебряный Бор, Москва-река', 55.774, 37.411],
] as const;
export function seed(): Store {
  const boats: Boat[] = places.map(([school, name, location, lat, lng], i) => ({
    id: `demo-${i + 1}`,
    school,
    name,
    manufacturer: name.split(' ')[0],
    model: name.split(' ').slice(1).join(' '),
    year: 2022 + (i % 3),
    image: `/images/${i % 3 === 0 ? 'wake.webp' : i % 3 === 1 ? 'boat.webp' : 'wake.webp'}`,
    location,
    lat,
    lng,
    coordinateNote: 'Примерная точка акватории, не адрес причала',
    sports: i === 4 ? ['Вейксерф'] : ['Вейксерф', 'Вейкборд'],
    wave:
      i % 2
        ? 'Мягкая и длинная — идеально для первого сета'
        : 'Объёмная волна с настройкой под ваш уровень',
    services: ['Катание с инструктором', 'Катание без инструктора'],
    tariffs: durations.flatMap((duration) =>
      (i === 4 ? (['Вейксерф'] as const) : (['Вейксерф', 'Вейкборд'] as const)).flatMap((sport) =>
        ['Катание с инструктором', 'Катание без инструктора'].map((service, j) => ({
          duration,
          sport,
          service,
          price: Math.round(((duration / 30) * (8000 + i * 300) * (j ? 0.9 : 1)) / 100) * 100,
        })),
      ),
    ),
    open: '09:00',
    close: '21:00',
    connected: i < 8,
    website: i >= 8 ? `/schools/demo-${i + 1}` : undefined,
    fictional: true,
    owner: i < 2,
  }));
  return { version: 1, boats, bookings: [], blocks: [], favorites: [] };
}
export const STORAGE_KEY = 'wake-demo-v1';
export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (
        data.version === 1 &&
        Array.isArray(data.boats) &&
        Array.isArray(data.bookings) &&
        Array.isArray(data.blocks) &&
        Array.isArray(data.favorites)
      )
        return data;
    }
  } catch {
    /* Keep the app usable with unavailable or corrupt storage. */
  }
  return seed();
}
