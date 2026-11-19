import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicSchools } from '@/lib/public-schools';
import { MapPin, Waves, CalendarDays, Globe, ShieldCheck, ArrowUpRight, Navigation, Clock3 } from 'lucide-react';
import styles from './school.module.css';

export function generateStaticParams() { return publicSchools.map(s => ({ slug: s.slug })); }

export default async function PublicSchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = publicSchools.find(s => s.slug === slug);
  if (!school) notFound();
  const mapsUrl = 'https://yandex.ru/maps/?text=' + encodeURIComponent(school.address);
  return <main className={styles.shell}>
    <header className={styles.top}><div className={styles.topInner}>
      <Link href="/" className={styles.brand}>WAKE.</Link>
      <Link href="/directory" className={styles.back}>Все школы →</Link>
    </div></header>
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <section className={styles.card}>
            <span className={styles.eyebrow}>Школа водных видов спорта</span>
            <h1 className={styles.name}>{school.name}</h1>
            <div className={styles.location}><MapPin size={19} style={{flexShrink:0}}/><span>{school.address}</span></div>
            <div className={styles.tags}>{school.sports.map(s=><span className={styles.tag} key={s}>{s}</span>)}</div>
            <div className={styles.illustration}>
              <img src="/images/wake.webp" alt="Иллюстрация вейксерфинга, не фотография этой школы" />
              <span className={styles.photoNote}>Иллюстрация · не фото школы</span>
            </div>
          </section>
          <section className={styles.card}>
            <h2 className={styles.heading}>О школе</h2>
            <p className={styles.paragraph}>Информация о площадке собрана из открытых источников. После подключения к WAKE здесь появятся описание от команды школы, инструкторы, реальные фотографии и условия катания.</p>
            {school.website && <a href={school.website} target="_blank" rel="noopener noreferrer" className={styles.link} style={{display:'inline-flex',gap:8,alignItems:'center'}}><Globe size={17}/> Официальный сайт <ArrowUpRight size={15}/></a>}
          </section>
          <section className={styles.card}>
            <h2 className={styles.heading}>Услуги и цены</h2>
            {school.sports.map(s=><div className={styles.row} key={s}><strong>{s}</strong><span className={styles.rowValue}>Цена уточняется</span></div>)}
            <p className={styles.paragraph} style={{fontSize:13,marginTop:12}}>Продолжительность сессий, стоимость и наличие инструкторов пока не подтверждены.</p>
          </section>
          <section className={styles.card}>
            <h2 className={styles.heading}>Расположение</h2>
            <p className={styles.location}><MapPin size={18} style={{flexShrink:0}}/>{school.address}</p>
            <div className={styles.map}><Navigation size={28}/><span>Посмотреть расположение и построить маршрут</span><a className={styles.link} href={mapsUrl} target="_blank" rel="noopener noreferrer">Открыть Яндекс Карты ↗</a></div>
          </section>
          <section className={styles.card}>
            <h2 className={styles.heading}>Отзывы</h2>
            <p className={styles.paragraph}>Отзывы клиентов WAKE появятся после подключения школы. Мы не переносим оценки и отзывы из сторонних сервисов без подтверждения.</p>
          </section>
        </div>
        <aside className={styles.aside} id="booking">
          <section className={styles.card}>
            <div className={styles.bookingHeader}><CalendarDays size={23}/> Онлайн-запись</div>
            <h2 className={styles.bookingTitle}>Запишитесь на катание</h2>
            <p className={styles.paragraph}>Выберите услугу, катер, продолжительность и удобное время — когда школа подключит календарь WAKE.</p>
            <div className={styles.notice}><ShieldCheck size={19} style={{verticalAlign:'middle',marginRight:8}}/>Пока школа не подключена к WAKE, свободные слоты и бронирования недоступны.</div>
            {school.website ? <a className={styles.button} href={school.website} target="_blank" rel="noopener noreferrer">Связаться со школой ↗</a> : <p className={styles.paragraph}>Контактный сайт школы не указан.</p>}
            <p className={styles.secondary}><Clock3 size={13} style={{verticalAlign:'middle',marginRight:5}}/>Расписание уточняется у школы</p>
            <p className={styles.foot}>Источник: <a href={school.source} target="_blank" rel="noopener noreferrer">публичная информация</a>. Данные и работа площадки требуют подтверждения.</p>
          </section>
        </aside>
      </div>
    </div>
    <div className={styles.mobileBar}><a href="#booking">Записаться / Контакты</a></div>
  </main>;
}
