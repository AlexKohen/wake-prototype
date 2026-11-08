'use client';
import { useRef, useState, useEffect } from 'react';
import { Mic, ArrowUpRight, Square, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
type RecognitionEvent = { results: { [n: number]: { [n: number]: { transcript: string } } } };
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
declare global {
  interface Window {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
  }
}
export default function VoiceInput({
  owner = false,
  onInterpret,
}: {
  owner?: boolean;
  onInterpret: (text: string) => void;
}) {
  const [text, setText] = useState(''),
    [listening, setListening] = useState(false),
    [message, setMessage] = useState(''),
    ref = useRef<Recognition | null>(null);
  useEffect(
    () => () => {
      ref.current?.abort();
    },
    [],
  );
  function listen() {
    if (listening) {
      ref.current?.stop();
      return;
    }
    const API = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!API) {
      setMessage('В этом браузере голосовой ввод недоступен. Напишите запрос ниже.');
      return;
    }
    const rec = new API();
    ref.current = rec;
    rec.lang = 'ru-RU';
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      const result = e.results[0]?.[0]?.transcript;
      if (result) {
        setText(result);
        setMessage('Текст распознан. Нажмите стрелку, чтобы проверить параметры.');
      } else setMessage('Не удалось разобрать речь. Попробуйте ещё раз или напишите запрос.');
    };
    rec.onerror = (e) => {
      setListening(false);
      setMessage(
        e.error === 'not-allowed'
          ? 'Разрешите доступ к микрофону или напишите запрос.'
          : 'Не удалось распознать речь. Попробуйте ещё раз или напишите запрос.',
      );
    };
    rec.onend = () => setListening(false);
    try {
      rec.start();
      setListening(true);
      setMessage('Слушаю…');
    } catch {
      setMessage('Микрофон недоступен. Напишите запрос.');
    }
  }
  return (
    <section className="voice-box">
      <div className="voice-heading">
        <span className="eyebrow">
          <Sparkles size={14} /> {owner ? 'МЕНЬШЕ ФОРМ — БОЛЬШЕ ВОДЫ' : 'ПРОСТО СКАЖИ'}
        </span>
        <span className="voice-pill">Голосовой поиск</span>
      </div>
      <div className="voice-line">
        <button
          className={`mic-button ${listening ? 'listening' : ''}`}
          onClick={listen}
          aria-label={listening ? 'Остановить запись' : 'Включить микрофон'}
        >
          {listening ? <Square size={22} /> : <Mic size={24} />}
        </button>
        <div>
          <h3>{owner ? 'Расскажи о своём катере' : 'Скажи, когда и где хочешь покататься'}</h3>
          <p>
            {owner
              ? '«Malibu 23 LSV, вейксерф, 25 минут 7000 рублей»'
              : '«Вейксерф в Строгино завтра в 15:00 на полчаса»'}
          </p>
        </div>
      </div>
      <form
        className="voice-text"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) onInterpret(text);
        }}
      >
        <input
          aria-label="Запрос голосом или текстом"
          placeholder={owner ? 'Или напиши о катере…' : 'Или напиши, как тебе удобно…'}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button size="icon" disabled={!text.trim()} aria-label="Разобрать запрос">
          <ArrowUpRight size={20} />
        </Button>
      </form>
      {message && (
        <p className="voice-message" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
