import { notFound } from 'next/navigation';
import { seed } from '@/lib/data';
import { money, durationLabel } from '@/lib/model';
import { Waves, ArrowLeft, MapPin, ExternalLink, Info } from 'lucide-react';
export function generateStaticParams() {
  return seed()
    .boats.filter((b) => !b.connected)
    .map((b) => ({ id: b.id }));
}
export default async function SchoolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params,
    boat = seed().boats.find((b) => b.id === id && !b.connected);
  if (!boat) notFound();
  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <a href="/" className="brand">
            <Waves /> WAKE.
          </a>
          <span className="status">Демонстрация внешнего сайта</span>
        </div>
      </header>
      <main className="narrow" style={{ padding: '35px 20px 70px' }}>
        <a className="back" href="/">
          <ArrowLeft size={17} /> Вернуться в WAKE
        </a>
        <span className="eyebrow">
          <ExternalLink size={14} /> НЕ ПОДКЛЮЧЕНА К WAKE
        </span>
        <h1>{boat.school}</h1>
        <p className="muted">Вымышленная школа · отдельная демо-страница</p>
        <img
          src={boat.image}
          alt="Иллюстративное изображение, созданное ИИ"
          className="review-photo"
        />
        <div className="info-banner">
          <Info size={20} />
          <span>
            Эта страница показывает переход на сайт неподключённой школы. Это не настоящий оператор.
            WAKE не знает её доступность и не отправляет брони.
          </span>
        </div>
        <h2>{boat.name}</h2>
        <p className="muted">
          <MapPin size={15} style={{ display: 'inline' }} /> {boat.location}
        </p>
        <div className="summary-card">
          <p>{boat.sports.join(' · ')}</p>
          <p>
            Демонстрационные часы: {boat.open}–{boat.close}
          </p>
          {boat.tariffs
            .filter((t) => t.sport === 'Вейксерф' && t.service === 'Катание с инструктором')
            .map((t) => (
              <p key={t.duration}>
                {durationLabel(t.duration)} — {money(t.price)}{' '}
                <small>Демо-тариф, не реальная цена</small>
              </p>
            ))}
        </div>
        <p className="muted">
          В готовом продукте здесь откроется проверенный сайт школы. Доступные для демо-бронирования
          катера есть в каталоге WAKE.
        </p>
        <a href="/" className="btn btn-primary full">
          Вернуться к выбору катера <ArrowLeft size={16} />
        </a>
      </main>
    </>
  );
}
