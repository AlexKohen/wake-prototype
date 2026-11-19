'use client';
import type { ChangeEventHandler } from 'react';

type Props = {
 value: string;
 onChange: ChangeEventHandler<HTMLSelectElement>;
 required?: boolean;
 'aria-label'?: string;
};
const slots = Array.from({length:48}, (_,i) => `${String(Math.floor(i/2)).padStart(2,'0')}:${i%2?'30':'00'}`);
/** Always 24-hour clock, half-hour steps, independent of device locale. */
export default function TimeSelect({value,onChange,required,...rest}:Props) {
 return <select value={value} onChange={onChange} required={required} {...rest}>
  <option value="">Выберите время</option>
  {slots.map(time=><option key={time} value={time}>{time}</option>)}
 </select>;
}
