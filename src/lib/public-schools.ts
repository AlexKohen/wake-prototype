/** Public directory seed. A listing does NOT imply WAKE partnership or live availability.
 * Sources are public pages; operating status, prices and coordinates require owner verification.
 */
export type PublicSchool = {
  slug: string; name: string; address: string; website: string | null;
  sports: string[]; source: string; connection: 'unclaimed'; verifiedAt: string;
};
export const publicSchools: PublicSchool[] = [
  {
    "slug": "wake-people",
    "name": "Wake People",
    "address": "Москва, улица Лётная, 99А",
    "website": "https://wake-people.ru/",
    "sports": [
      "Вейксерф",
      "Вейкборд"
    ],
    "source": "https://wake-people.ru/",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "wakesummer-pirogovo",
    "name": "Wakesummer — Пирогово",
    "address": "Московская область, деревня Болтино, улица Туристическая, вл. 10",
    "website": "https://wakesummer.ru/",
    "sports": [
      "Вейксерф",
      "Вейкборд"
    ],
    "source": "https://wakesummer.ru/contacts",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "wakesummer-tishkovo",
    "name": "Wakesummer — Тишково",
    "address": "Московская область, Тишково, Учинское водохранилище",
    "website": "https://wakesummer.ru/",
    "sports": [
      "Вейксерф",
      "Вейкборд"
    ],
    "source": "https://wakesummer.ru/",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "wakesummer-ostashkovo",
    "name": "Wakesummer — Осташково",
    "address": "Московская область, деревня Осташково",
    "website": "https://wakesummer.ru/",
    "sports": [
      "Вейксерф",
      "Вейкборд"
    ],
    "source": "https://wakesummer.ru/",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "wake4you",
    "name": "Wake4You",
    "address": "Московская область, Лыткарино, Волкушинский карьер",
    "website": "http://wake4you.ru/",
    "sports": [
      "Вейкборд"
    ],
    "source": "https://welcome.mosreg.ru/stories/wake-board-podmoskovie",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "dolwake",
    "name": "DolWake",
    "address": "Московская область, Долгопрудный, улица Флотская, 2А",
    "website": "https://dolwake.ru/",
    "sports": [
      "Вейкборд"
    ],
    "source": "https://welcome.mosreg.ru/stories/wake-board-podmoskovie",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "kraskovo-wake-park",
    "name": "Kraskovo Wake Park",
    "address": "Московская область, Люберцы, Кореневский карьер",
    "website": "https://vk.com/kraskovowakepark",
    "sports": [
      "Вейкборд"
    ],
    "source": "https://welcome.mosreg.ru/stories/wake-board-podmoskovie",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "teowake",
    "name": "TeoWake",
    "address": "Московская область, Дмитров, 2-я Комсомольская улица, Инженерный пруд",
    "website": "https://teosports.ru/teowake",
    "sports": [
      "Вейкборд"
    ],
    "source": "https://welcome.mosreg.ru/stories/wake-board-podmoskovie",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "wake-park-vozdvizhenskoe",
    "name": "Wake Park — Воздвиженское",
    "address": "Московская область, Серпухов, посёлок Д/О Авангард",
    "website": "https://v-parkhotel.ru/services/veyk-park-vozdvizhenskoye",
    "sports": [
      "Вейкборд"
    ],
    "source": "https://welcome.mosreg.ru/stories/wake-board-podmoskovie",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "park-freestyle",
    "name": "Экстрим-парк Фристайл",
    "address": "Московская область, Дзержинский, улица Угрешская, 19",
    "website": "https://parkfreestyle.ru/",
    "sports": [
      "Вейкборд",
      "Вейксерф"
    ],
    "source": "https://welcome.mosreg.ru/stories/wake-board-podmoskovie",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "reverse-wake",
    "name": "Reverse Wake",
    "address": "Московская область, Дмитровский округ, деревня Шуколово",
    "website": "https://reversewake.ru/",
    "sports": [
      "Вейкборд"
    ],
    "source": "https://welcome.mosreg.ru/stories/wake-board-podmoskovie",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "flat-wake-park",
    "name": "Flat Wake Park",
    "address": "Московская область, Мытищи, посёлок Пироговский, СНТ Пирогово",
    "website": "https://www.wakepirogovo.ru/",
    "sports": [
      "Вейкборд"
    ],
    "source": "https://welcome.mosreg.ru/stories/wake-board-podmoskovie",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "go-wake-park",
    "name": "Go Wake Park",
    "address": "Московская область, Химки, деревня Голиково, улица Шоссейная, стр. 4",
    "website": "https://goparkhotel.ru/relaxation/wake-park/",
    "sports": [
      "Вейкборд"
    ],
    "source": "https://welcome.mosreg.ru/stories/wake-board-podmoskovie",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "we-wake",
    "name": "We-Wake",
    "address": "Московская область, Щёлково, Медвежьи Озёра",
    "website": "http://we-wake.ru/",
    "sports": [
      "Вейкборд"
    ],
    "source": "https://welcome.mosreg.ru/stories/lovi-volnu-v-podmoskov-e-top-7-mest-dla-vejbordinga-i-vejserfinga",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "good-waves-moscow",
    "name": "Good Waves Moscow",
    "address": "Москва, улица Исаковского, 37, корпус 2",
    "website": null,
    "sports": [
      "Вейксерф"
    ],
    "source": "https://msk.spravker.ru/veik-kluby/",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  },
  {
    "slug": "fenix",
    "name": "Fenix",
    "address": "Москва, Карамышевская набережная, 13, корпус 2",
    "website": null,
    "sports": [
      "Вейксерф"
    ],
    "source": "https://msk.spravker.ru/veik-kluby/",
    "connection": "unclaimed",
    "verifiedAt": "2026-11-18"
  }
];
