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
  {"slug":"wave-motion","name":"Wave Motion","address":"Московская область, Мытищи, Болтино, Парусная улица","website":"https://wave-motion.ru/","sports":["Вейксерф","Вейкборд"],"source":"https://riamo.ru/articles/istorii/top-12-mest-dlja-katanija-na-vejkborde-i-vejkserfe-v-podmoskove/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wake-time","name":"WakeTime","address":"Московская область, Мытищи, Болтино, Ореховая бухта","website":"https://waketime.ru/","sports":["Вейксерф"],"source":"https://riamo.ru/articles/istorii/top-12-mest-dlja-katanija-na-vejkborde-i-vejkserfe-v-podmoskove/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"marabou","name":"Марабу","address":"Московская область, Мытищи, Болтино, Ореховая улица","website":"https://marabou.ru/","sports":["Вейксерф"],"source":"https://riamo.ru/articles/istorii/top-12-mest-dlja-katanija-na-vejkborde-i-vejkserfe-v-podmoskove/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"istrawake","name":"Istrawake","address":"Московская область, Солнечногорск, Лопотово","website":"http://www.istrawake.ru/","sports":["Вейкборд"],"source":"https://riamo.ru/articles/istorii/top-12-mest-dlja-katanija-na-vejkborde-i-vejkserfe-v-podmoskove/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"gagarin-water-school","name":"Гагарин","address":"Московская область, Королёв, Первомайский, Кирова, 2А","website":"https://gagarin-waterschool.ru/","sports":["Вейкборд"],"source":"https://riamo.ru/articles/istorii/top-12-mest-dlja-katanija-na-vejkborde-i-vejkserfe-v-podmoskove/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"round-lake","name":"Круглое озеро","address":"Московская область, Солнечногорск, Мышецкое","website":"https://round-lake.ru/vodnyye_razvlecheniya","sports":["Вейкборд"],"source":"https://riamo.ru/articles/istorii/top-12-mest-dlja-katanija-na-vejkborde-i-vejkserfe-v-podmoskove/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"gorchukhino","name":"Горчухино","address":"Московская область, Наро-Фоминский округ, Горчухино","website":null,"sports":["Вейкборд"],"source":"https://welcome.mosreg.ru/stories/wake-board-podmoskovie","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakesurfstar","name":"ВейкСерфСтар","address":"Московская область, Серпухов, Павленское озеро","website":"https://wakesurfstar.ru/","sports":["Вейксерф"],"source":"https://welcome.mosreg.ru/stories/wake-board-podmoskovie","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"fenix-wakeschool","name":"Fenix Wakeschool","address":"Москва, Карамышевская набережная, 13с2","website":"https://wakeschool.ru/","sports":["Вейксерф","Вейкборд"],"source":"https://wakeschool.ru/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakephoria","name":"Wakephoria","address":"Москва, Авиационная улица, 79к1с3","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wake-start","name":"WakeStart","address":"Москва, Лётная улица, 99","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"malibu-wake-club","name":"Malibu Wake Club","address":"Московская область, Красногорск, улица Согласия, 13","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"endless-summer","name":"Endless Summer","address":"Москва, Островная улица, 2","website":null,"sports":["Вейксерф"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"surf-like-pro","name":"Surf Like Pro","address":"Москва, 66-й км МКАД, яхт-клуб Shore House","website":null,"sports":["Вейксерф"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"lawave","name":"Lawave","address":"Москва, 66-й км МКАД, яхт-клуб Shore House","website":null,"sports":["Вейксерф"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wake-home","name":"Wake Home","address":"Москва, Мякининское шоссе, вл. 1","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"navolne","name":"NAVOLNE","address":"Москва, 66-й км МКАД, яхт-клуб Shore House","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"stroginowakepark","name":"Строгино Wake Park","address":"Москва, улица Исаковского, 37к2с1","website":null,"sports":["Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"moscow-wake-school","name":"Moscow Wake School","address":"Москва, Авиационная улица","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"go-wake-rublevo","name":"GO-WAKE Парк Рублёво","address":"Московская область, Красногорск, улица Согласия, 13","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakesummer-borisovo","name":"Wakesummer Park — Борисовские пруды","address":"Москва, Наташинская улица","website":"https://wakesummer.ru/","sports":["Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"party-wake-krekshino","name":"Party Wake Крёкшино","address":"Москва, Крёкшино, Озёрная улица, 2","website":null,"sports":["Вейкборд"],"source":"https://podolsk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"greenwood-wake-park","name":"Greenwood Wake Park","address":"Московская область, Люберцы, Наташинский парк","website":null,"sports":["Вейкборд"],"source":"https://podolsk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wake-park-orlovsky","name":"Вейк-парк Орловский","address":"Московская область, Ленинский округ, Дальние Прудищи","website":null,"sports":["Вейкборд"],"source":"https://domodedovo.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakedivision-strogino","name":"WakeDivision — Строгино","address":"Москва, Строгино","website":"https://wakedivision.ru/","sports":["Вейксерф","Вейкборд"],"source":"https://wakedivision.ru/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakedivision-serbor","name":"WakeDivision — Серебряный Бор","address":"Москва, Серебряный Бор","website":"https://wakedivision.ru/","sports":["Вейксерф","Вейкборд"],"source":"https://wakedivision.ru/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakedivision-crocus","name":"WakeDivision — Крокус","address":"Москва, МКАД, 66-й километр, корпус 5","website":"https://wakedivision.ru/","sports":["Вейксерф","Вейкборд"],"source":"https://wakedivision.ru/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakedivision-pirogovo","name":"WakeDivision — Пирогово","address":"Московская область, Пироговское водохранилище","website":"https://wakedivision.ru/","sports":["Вейксерф","Вейкборд"],"source":"https://wakedivision.ru/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakedivision-sbercity","name":"WakeDivision — СберСити","address":"Москва, СберСити","website":"https://wakedivision.ru/","sports":["Вейксерф","Вейкборд"],"source":"https://wakedivision.ru/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakedivision-secretspot","name":"WakeDivision — Secretspot","address":"Москва и Московская область, точный адрес уточняется","website":"https://wakedivision.ru/","sports":["Вейксерф","Вейкборд"],"source":"https://wakedivision.ru/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wave-hunters","name":"Wave Hunters","address":"Москва, Лётная улица, владение 99А","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wake-best","name":"Wake Best","address":"Москва, Авиационная улица, 79к1с2","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakestyle-club","name":"Wakestyle Club","address":"Москва, Авиационная улица, 79к1","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"surf-brothers","name":"Surf Brothers","address":"Москва, Сколково, Большой бульвар, 40","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wake-chance","name":"ВейкШанс","address":"Москва, Авиационная улица, 79к1с2","website":"https://wake-surf.club/","sports":["Вейксерф","Вейкборд"],"source":"https://wake-surf.club/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wake-team-pool","name":"WakeTeamPool","address":"Москва, Сиреневый бульвар, 2с1Б","website":null,"sports":["Вейкборд"],"source":"https://sportschools.ru/gorod-Moscow/sport-Wakeboard","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wake-team","name":"WakeTeam","address":"Москва, Ленинградское шоссе, 25А, строение 1","website":null,"sports":["Вейкборд","Вейксерф"],"source":"https://www.pinkov.ru/arenda/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"gloria-wake-park","name":"Gloria Wake Park","address":"Москва, Новомосковский округ, Проектируемый проезд №389","website":null,"sports":["Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wake-local","name":"Вейксерф-клуб Локал","address":"Москва, Строгинский мост, 37","website":null,"sports":["Вейксерф"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"connect-wake-park","name":"Connect Wake Park","address":"Москва, проспект Мира, 119с27А","website":null,"sports":["Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"surfjam-moscow","name":"SurfJam Moscow","address":"Москва, улица Исаковского, 37к2с1","website":null,"sports":["Вейксерф"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"best-wave","name":"Best Wave","address":"Москва, Карамышевская набережная, 13к2с1","website":null,"sports":["Вейксерф"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wake-city","name":"Wake City","address":"Москва, Карамышевская набережная, владение 13к2","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"relaxika-surf","name":"Релаксика серф","address":"Москва, Карамышевская набережная, 13к2с1","website":null,"sports":["Вейксерф"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"dream-island-wake-park","name":"Dream Island Wake Park","address":"Москва, проспект Андропова, 1","website":null,"sports":["Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakers-club","name":"Wakers Club","address":"Московская область, Красногорск, Новорижское шоссе, 1-й км","website":"https://wakers.club/","sports":["Вейксерф","Вейкборд"],"source":"https://welcome.mosreg.ru/stories/wake-board-podmoskovie","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"jolie-wake-club","name":"Jolie Wake Club","address":"Московская область, Мытищи, 1-й Пироговский залив, зона отдыха Дубрава","website":"https://joliewakeclub.ru/","sports":["Вейксерф","Вейкборд"],"source":"https://welcome.mosreg.ru/stories/wake-board-podmoskovie","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakejump","name":"WakeJump","address":"Московская область, Солнечногорск, Лопотово, база отдыха Объект 3030","website":"https://www.wakejump.ru/","sports":["Вейксерф","Вейкборд"],"source":"https://welcome.mosreg.ru/stories/wake-board-podmoskovie","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"moswake","name":"Moswake","address":"Московская область, Мытищи, Троицкое, база отдыха Троицкое","website":"https://moswake.ru/","sports":["Вейкборд"],"source":"https://welcome.mosreg.ru/stories/wake-board-podmoskovie","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wake-up-moscow","name":"WakeUP","address":"Москва, Авиационная улица, 79","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://actiongid.com/ru/listing-category/wakesurf/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"xstarclub","name":"Xstarclub","address":"Москва, Авиационная улица, 79к2","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"xwave","name":"Xwave","address":"Московская область, Долгопрудный, Старое Дмитровское шоссе, 1","website":null,"sports":["Вейксерф"],"source":"https://actiongid.com/ru/listing-category/wakesurf/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"river-club-surf","name":"RiverClubSurf","address":"Москва, Авиационная улица, 79к1с2","website":null,"sports":["Вейксерф"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"port-moscow","name":"Порт Москва","address":"Москва, Карамышевская набережная, 13к2с1","website":null,"sports":["Вейксерф","Вейкборд"],"source":"https://msk.spravker.ru/veik-kluby/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakepool","name":"Wake Pool","address":"Москва, Сиреневый бульвар, 2с1А","website":"http://wakepool.ru/","sports":["Вейкборд"],"source":"https://www.h2osport.ru/places/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"aquafly-moscow","name":"Aquafly-Moscow","address":"Москва, Мякининское шоссе, 3","website":null,"sports":["Вейкборд"],"source":"https://mestam.info/ru/moskva-8515/parki-dlya-vodnih-vidov-sporta","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"sunset-beach-water","name":"Сансет Бич Water","address":"Московская область, Мытищи, посёлок Менжинец","website":null,"sports":["Вейкборд"],"source":"https://www.pinkov.ru/arenda/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"wakeboard-pravdinsky","name":"Вейкборд — Правдинский","address":"Московская область, Пушкино, посёлок Правдинский","website":null,"sports":["Вейкборд"],"source":"https://www.pinkov.ru/arenda/","connection":"unclaimed","verifiedAt":"2026-11-19"},
  {"slug":"supboardist-povedniki","name":"САПбордист — Поведники","address":"Московская область, Мытищи, Поведники, Санаторная улица, строение 6","website":null,"sports":["Вейкборд"],"source":"https://www.pinkov.ru/arenda/","connection":"unclaimed","verifiedAt":"2026-11-19"},
];
