import type { FormEvent } from 'react';
import { SECTION_TIME_SLOTS } from '@/lib/tables';

const input = 'w-full rounded-lg border border-[#d8cfbf] bg-white px-3 py-3 text-[15px] text-[#302e2a] outline-none focus:border-[#3e6b4f]';

export function BookingForm({
  guestName,
  phone,
  adults,
  children,
  date,
  timeSlot,
  selectedTable,
  loading,
  onGuestNameChange,
  onPhoneChange,
  onAdultsChange,
  onChildrenChange,
  onDateChange,
  onTimeSlotChange,
  onSubmit,
}: {
  guestName: string;
  phone: string;
  adults: number;
  children: number;
  date: string;
  timeSlot: string;
  selectedTable: string;
  loading: boolean;
  onGuestNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
  onDateChange: (value: string) => void;
  onTimeSlotChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className="rounded-2xl border border-[#d8d0c2] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.07)]">
      <h2 className="text-xl font-semibold">Booking Details</h2>
      <p className="mt-1 text-sm text-[#777067]">Select a table on the drawing, then confirm.</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <input className={input} type="text" required placeholder="Full Name" value={guestName} onChange={(e) => onGuestNameChange(e.target.value)} />
        <input className={input} type="tel" required placeholder="Phone Number" value={phone} onChange={(e) => onPhoneChange(e.target.value)} />

        <div className="grid grid-cols-2 gap-3">
          <select className={input} value={adults} onChange={(e) => onAdultsChange(Number(e.target.value))}>
            {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n} Adult{n !== 1 ? 's' : ''}</option>)}
          </select>
          <select className={input} value={children} onChange={(e) => onChildrenChange(Number(e.target.value))}>
            {[0,1,2,3].map((n) => <option key={n} value={n}>{n} Child{n === 1 ? '' : 'ren'}</option>)}
          </select>
        </div>

        <input className={input} type="date" required value={date} onChange={(e) => onDateChange(e.target.value)} />

        <select className={input} value={timeSlot} onChange={(e) => onTimeSlotChange(e.target.value)}>
          {SECTION_TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
        </select>

        <div className="rounded-xl border border-[#d9d2c5] bg-[#f8f5ee] px-4 py-3 text-center text-sm font-semibold">
          {selectedTable ? <>Selected table: <span className="text-[#2e7d4f]">{selectedTable}</span></> : 'Click a table on the floor plan'}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#263126] px-4 py-3 font-semibold text-white transition hover:bg-[#2e7d4f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Booking…' : 'Confirm Reservation'}
        </button>
      </form>
    </section>
  );
}
