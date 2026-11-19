import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicSchools } from '@/lib/public-schools';
export function generateStaticParams() { return publicSchools.map(s=>({slug:s.slug})); }
export default async function PublicSchoolPage({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const school=publicSchools.find(s=>s.slug===slug);
 if(!school) notFound();
 return <main style={{maxWidth:720,margin:'0 auto',padding:'24px 16px 80px',fontFamily:'system-ui'}}>
 <Link href="/directory">← Все школы</Link><h1>{school.name}</h1>
 <p>{school.address}</p><p>{school.sports.join(' · ')}</p>
 <section style={{padding:20,borderRadius:16,background:'#eef5fa',margin:'24px 0'}}>
 <h2>Запись на катание</h2>
 <p>Эта школа пока не подключена к WAKE. Мы не показываем неподтверждённые свободные слоты и не принимаем бронирования от её имени.</p>
 {school.website && <a href={school.website} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',padding:'12px 18px',background:'#114e8c',color:'white',borderRadius:10}}>Перейти на сайт школы ↗</a>}
 </section><p style={{fontSize:13,color:'#52616d'}}>Источник: <a href={school.source} target="_blank" rel="noopener noreferrer">публичная информация</a>. Актуальность работы площадки уточняйте у оператора.</p>
 </main>;
}