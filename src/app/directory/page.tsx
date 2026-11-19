import Link from 'next/link';
import { publicSchools } from '@/lib/public-schools';
export default function Directory() {
 return <main style={{maxWidth:920,margin:'0 auto',padding:'24px 16px 80px',fontFamily:'system-ui'}}>
 <Link href="/">← WAKE</Link><h1>Вейк-школы Москвы и Подмосковья</h1>
 <p>Реальные организации из открытых источников. Не подключены к WAKE: свободные слоты и цены не подтверждены.</p>
 <p>Найдено: {publicSchools.length} площадок. Список пополняется.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:16}}>
 {publicSchools.map(s=><article key={s.slug} style={{border:'1px solid #d8e1e8',borderRadius:16,padding:20}}>
 <h2 style={{fontSize:20,margin:'0 0 8px'}}>{s.name}</h2>
 <p>{s.address}</p><p>{s.sports.join(' · ')}</p>
 <Link href={`/school/${s.slug}`}>Открыть страницу →</Link>
 </article>)}</div></main>
}