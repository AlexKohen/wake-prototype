import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicSchools } from '@/lib/public-schools';
import { MapPin, Waves, CalendarDays, Globe, ShieldCheck, ArrowUpRight } from 'lucide-react';

export function generateStaticParams() { return publicSchools.map(s => ({ slug: s.slug })); }

export default async function PublicSchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = publicSchools.find(s => s.slug === slug);
  if (!school) notFound();
  const card: React.CSSProperties = { border: '1px solid #dce5eb', borderRadius: 20, padding: 22, background: '#fff' };
  const muted: React.CSSProperties = { color: '#64748b', lineHeight: 1.6 };
  return (
    <main style={{ minHeight: '100vh', background: '#f5f8fb', fontFamily: 'system-ui, sans-serif', color: '#102b3a' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e3ebf0' }}>
        <div style={{ maxWidth: 1050, margin: 'auto', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ color: '#0868a7', fontWeight: 900, fontSize: 23, textDecoration: 'none' }}>WAKE.</Link>
          <Link href="/directory" style={{ color: '#23516b', fontSize: 14 }}>Все школы</Link>
        </div>
      </header>
      <div style={{ maxWidth: 1050, margin: 'auto', padding: '24px 16px 80px' }}>
        <Link href="/directory" style={{ fontSize: 14, color: '#44758f' }}>← Каталог школ</Link>
        <div style={{ borderRadius: 24, background: 'linear-gradient(120deg,#093f65,#118ca7)', color: 'white', padding: 'clamp(26px,6vw,58px)', marginTop: 18, marginBottom: 20 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, opacity: .9 }}><Waves size={16}/> Вейксерф и вейкборд</span>
          <h1 style={{ fontSize: 'clamp(30px,5vw,50px)', lineHeight: 1.1, margin: '16px 0' }}>{school.name}</h1>
          <p style={{ display: 'flex', gap: 8, alignItems: 'flex-start', maxWidth: 680 }}><MapPin size={18} style={{ flexShrink: 0 }}/>{school.address}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 18 }}>
            {school.sports.map(s => <span key={s} style={{ padding: '8px 13px', borderRadius: 20, background: 'rgba(255,255,255,.18)', fontSize: 13 }}>{s}</span>)}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 18, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 18 }}>
            <section style={card}>
              <h2 style={{ marginTop: 0 }}>О школе</h2>
              <p style={muted}>Площадка для катания в Москве и Московской области. Контактные данные собраны из открытых источников. Подробное описание, фотографии, инструкторы и расписание появятся после подключения школы к WAKE.</p>
              <p style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><MapPin size={18} style={{ flexShrink: 0 }}/>{school.address}</p>
              {school.website && <a href={school.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#096ca4' }}><Globe size={17}/> Официальный сайт <ArrowUpRight size={16}/></a>}
            </section>
            <section style={card}>
              <h2 style={{ marginTop: 0 }}>Услуги и цены</h2>
              {school.sports.map(s => <div key={s} style={{ padding: '14px 0', borderBottom: '1px solid #e8edf2', display: 'flex', justifyContent: 'space-between', gap: 10 }}><strong>{s}</strong><span style={{ color: '#64748b', fontSize: 13 }}>Цена уточняется</span></div>)}
              <p style={{ ...muted, fontSize: 13 }}>Тарифы и продолжительность занятий пока не подтверждены школой.</p>
            </section>
          </div>
          <aside style={{ ...card, position: 'relative' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#08769a' }}><CalendarDays size={24}/><strong>Онлайн-запись</strong></div>
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>Выберите время катания</h2>
            <p style={muted}>После подключения школы здесь появятся услуги, катера, календарь и доступные слоты — как в системе онлайн-записи.</p>
            <div style={{ borderRadius: 12, background: '#edf4f8', padding: 15, display: 'flex', alignItems: 'flex-start', gap: 10, margin: '18px 0' }}><ShieldCheck size={19} style={{ flexShrink: 0 }}/><span style={{ fontSize: 13 }}>Школа ещё не подключена к WAKE. Мы не принимаем бронирования от её имени.</span></div>
            {school.website ? <a href={school.website} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#086b9d', color: 'white', padding: '15px 20px', borderRadius: 12, textAlign: 'center', fontWeight: 700, textDecoration: 'none' }}>Перейти на сайт школы ↗</a> : <p style={muted}>Контактный сайт пока не указан.</p>}
            <p style={{ ...muted, fontSize: 12, marginTop: 18 }}>Источник: <a href={school.source} target="_blank" rel="noopener noreferrer">открытый справочник или сайт школы</a>. Актуальность уточняйте у оператора.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
