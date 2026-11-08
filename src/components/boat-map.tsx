'use client';
import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { type Boat, type Search, money, quote } from '@/lib/model';
import { MapPin } from 'lucide-react';
export default function BoatMap({
  boats,
  search,
  onSelect,
}: {
  boats: Boat[];
  search: Search;
  onSelect: (boat: Boat) => void;
}) {
  const element = useRef<HTMLDivElement>(null),
    map = useRef<LeafletMap | null>(null),
    [offline, setOffline] = useState(false);
  useEffect(() => {
    let disposed = false;
    import('leaflet').then((L) => {
      if (disposed || !element.current) return;
      const instance = L.map(element.current, { scrollWheelZoom: false }).setView(
        [55.855, 37.48],
        10,
      );
      map.current = instance;
      instance.createPane('fallback');
      instance.getPane('fallback')!.style.zIndex = '180';
      L.imageOverlay(
        '/map-overview.svg',
        [
          [55.68, 37.25],
          [56.04, 37.85],
        ],
        { pane: 'fallback', interactive: false },
      ).addTo(instance);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
        maxZoom: 18,
      })
        .on('tileerror', () => setOffline(true))
        .addTo(instance);
      const points: [number, number][] = [];
      boats.forEach((boat) => {
        const value = quote(boat, search.sport, search.duration, search.service);
        const marker = L.marker([boat.lat, boat.lng], {
          icon: L.divIcon({
            className: 'price-marker',
            html: `<span>${value === null ? 'Школа' : money(value)}</span>`,
            iconSize: [90, 36],
            iconAnchor: [45, 18],
          }),
        }).addTo(instance);
        marker.on('click', () => onSelect(boat));
        marker.bindTooltip(boat.school, { direction: 'top' });
        points.push([boat.lat, boat.lng]);
      });
      if (points.length)
        instance.fitBounds(L.latLngBounds(points), { padding: [50, 50], maxZoom: 12 });
    });
    return () => {
      disposed = true;
      map.current?.remove();
      map.current = null;
    };
  }, [boats, search, onSelect]);
  return (
    <div className="map-shell">
      <div ref={element} className="boat-map" aria-label="Карта школ Москвы" />
      {offline && (
        <p className="map-notice">
          Онлайн-карта недоступна. Показана условная схема акваторий. Метки работают.
        </p>
      )}
      <div className="map-caption">
        <MapPin size={14} /> Москва и Подмосковье · точки акваторий приблизительные
      </div>
      <div className="map-accessible">
        {boats.map((b) => (
          <button key={b.id} onClick={() => onSelect(b)}>
            {b.school} ·{' '}
            {money(quote(b, search.sport, search.duration, search.service) || b.tariffs[0].price)}
          </button>
        ))}
      </div>
    </div>
  );
}
