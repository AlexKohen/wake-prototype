'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowUpRight, Search, Waves } from 'lucide-react';
import { publicSchools } from '@/lib/public-schools';
import styles from './directory.module.css';

type SportFilter = 'Все' | 'Вейксерф' | 'Вейкборд';
const images = ['/images/wake.webp','/images/boat.webp'];
export default function Directory() {
 const [query,setQuery] = useState('');
 const [sport,setSport] = useState<SportFilter>('Все');
 const schools = useMemo(()=>publicSchools.filter(s=>{
  const text=(s.name+' '+s.address).toLocaleLowerCase('ru');
  return text.includes(query.toLocaleLowerCase('ru').trim()) && (sport==='Все'||s.sports.includes(sport));
 }).sort((a,b)=>a.name.localeCompare(b.name,'ru')),[query,sport]);
 return <main className={styles.page}>
  <header className={styles.top}><div className={styles.topInner}><Link href="/" className={styles.logo}>WAKE.</Link><Link href="/" className={styles.back}>← На главную</Link></div></header>
  <div className={styles.wrap}>
   <section className={styles.hero}>
    <span className={styles.eyebrow}>Москва и Московская область</span>
    <h1>Твоя школа. Твоя волна.</h1>
    <p>Исследуй вейксерф- и вейкборд-школы, сравнивай локации и выбирай, где выйти на воду.</p>
    <span className={styles.count}><Waves size={17}/> {publicSchools.length} записей в каталоге</span>
   </section>
   <div className={styles.filters}>
    <label style={{flex:1,display:'flex',alignItems:'center',position:'relative'}}><Search size={18} style={{position:'absolute',left:15,color:'#7b94a3'}}/><input className={styles.input} style={{paddingLeft:43}} placeholder="Название школы или район" aria-label="Поиск школ" value={query} onChange={e=>setQuery(e.target.value)}/></label>
    <div className={styles.tabs} role="group" aria-label="Вид катания">
     {(['Все','Вейксерф','Вейкборд'] as const).map(v=><button key={v} type="button" className={styles.tab+' '+(sport===v?styles.active:'')} onClick={()=>setSport(v)}>{v}</button>)}
    </div>
   </div>
   <p className={styles.summary}>Найдено {schools.length} · Список из открытых источников, наличие услуг и актуальность работы требуют подтверждения</p>
   {schools.length===0?<div className={styles.empty}>По этому запросу школ не найдено. Попробуй другой район или вид катания.</div>:
   <div className={styles.grid}>{schools.map((s,i)=><article className={styles.card} key={s.slug}>
    <Link href={`/school/${s.slug}`} aria-label={`Открыть школу ${s.name}`}>
     <div className={styles.image}><img src={images[i%images.length]} alt="Иллюстративное фото катания на воде, не фотография школы" loading="lazy"/><span className={styles.imageLabel}>Иллюстрация · не фото школы</span></div>
    </Link>
    <div className={styles.body}>
     <h2 className={styles.name}>{s.name}</h2>
     <div className={styles.address}><MapPin size={16} style={{flexShrink:0}}/>{s.address}</div>
     <div className={styles.tags}>{s.sports.map(t=><span key={t} className={styles.tag}>{t}</span>)}</div>
     <div className={styles.foot}><span className={styles.status}>Расписание уточняется</span><Link className={styles.cta} href={`/school/${s.slug}`}>Подробнее <ArrowUpRight size={15}/></Link></div>
    </div>
   </article>)}</div>}
   <p className={styles.note}>WAKE не заявляет партнёрство с перечисленными организациями. Фотографии используются как иллюстрации. Цены, отзывы и свободные слоты не публикуются без подтверждения.</p>
  </div>
 </main>;
}
