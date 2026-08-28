
import type { FormEvent } from 'react';
import { SECTION_TIME_SLOTS } from '@/lib/tables';

const input =
  'w-full rounded-lg border border-[#d8cfbf] bg-white px-3 py-3 text-[15px] text-[#302e2a] outline-none focus:border-[#3e6b4f]';

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
  // Get today's date in local time as YYYY-MM-DD
  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const today = getToday();

  const validateForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanName = guestName.trim();
    const cleanPhone = phone.replace(/\s+/g, '');

    // -------------------------
    // Name validation
    // -------------------------
    if (!cleanName) {
      alert('Please enter your full name.');
      return;
    }

    if (cleanName.length < 2) {
      alert('Name must contain at least 2 characters.');
      return;
    }

    if (cleanName.length > 50) {
      alert('Name cannot be longer than 50 characters.');
      return;
    }

    // Allows letters, spaces, apostrophes and hyphens
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

    if (!nameRegex.test(cleanName)) {
      alert('Please enter a valid name.');
      return;
    }

    // -------------------------
    // Phone validation
    // -------------------------
    if (!cleanPhone) {
      alert('Please enter your phone number.');
      return;
    }

    // Accept:
    // 9876543210
    // +919876543210
    // 919876543210
    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;

    if (!phoneRegex.test(cleanPhone)) {
      alert('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    // -------------------------
    // Guest validation
    // -------------------------
    if (adults < 1 || adults > 8) {
      alert('Please select between 1 and 8 adults.');
      return;
    }

    if (children < 0 || children > 3) {
      alert('Please select between 0 and 3 children.');
      return;
    }

    const totalGuests = adults + children;

    if (totalGuests < 1) {
      alert('There must be at least 1 guest.');
      return;
    }

    // -------------------------
    // Date validation
    // -------------------------
    if (!date) {
      alert('Please select a reservation date.');
      return;
    }

    // Date must be today or later
    if (date < today) {
      alert('You cannot book a date in the past. Please select today or a future date.');
      return;
    }

    // -------------------------
    // Time validation
    // -------------------------
    if (!timeSlot) {
      alert('Please select a time slot.');
      return;
    }

    // -------------------------
    // Table validation
    // -------------------------
    if (!selectedTable) {
      alert('Please select a table from the floor plan.');
      return;
    }

    // Everything is valid
    onSubmit(e);
  };

  return (
    <section className="rounded-2xl border border-[#d8d0c2] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.07)]">
      <h2 className="text-xl font-semibold">Booking Details</h2>

      <p className="mt-1 text-sm text-[#777067]">
        Select a table on the drawing, then confirm.
      </p>

      <form onSubmit={validateForm} className="mt-5 space-y-4">

        {/* Full Name */}
        <input
          className={input}
          type="text"
          required
          minLength={2}
          maxLength={50}
          placeholder="Full Name"
          value={guestName}
          onChange={(e) => onGuestNameChange(e.target.value)}
          autoComplete="name"
        />

        {/* Phone */}
        <input
          className={input}
          type="tel"
          required
          maxLength={13}
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          autoComplete="tel"
          inputMode="tel"
        />

        {/* Adults / Children */}
        <div className="grid grid-cols-2 gap-3">

          <select
            className={input}
            value={adults}
            onChange={(e) => onAdultsChange(Number(e.target.value))}
            required
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} Adult{n !== 1 ? 's' : ''}
              </option>
            ))}
          </select>

          <select
            className={input}
            value={children}
            onChange={(e) => onChildrenChange(Number(e.target.value))}
            required
          >
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n} Child{n === 1 ? '' : 'ren'}
              </option>
            ))}
          </select>

        </div>

        {/* Date */}
        <input
          className={input}
          type="date"
          required
          min={today}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />

        {/* Time Slot */}
        <select
          className={input}
          required
          value={timeSlot}
          onChange={(e) => onTimeSlotChange(e.target.value)}
        >
          {SECTION_TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        {/* Selected Table */}
        <div className="rounded-xl border border-[#d9d2c5] bg-[#f8f5ee] px-4 py-3 text-center text-sm font-semibold">
          {selectedTable ? (
            <>
              Selected table:{' '}
              <span className="text-[#2e7d4f]">{selectedTable}</span>
            </>
          ) : (
            'Click a table on the floor plan'
          )}
        </div>

        {/* 1-Hour Dining Policy Notice */}
        <div className="flex items-start gap-2.5 rounded-xl border border-[#e6d8b5] bg-[#fffcf5] p-3 text-xs text-[#6e5d3b]">
          <span className="text-base leading-none">⏱️</span>

          <div>
            <strong className="font-semibold text-[#544426]">
              1-Hour Dining Policy:
            </strong>

            <p className="mt-0.5 leading-tight opacity-90">
              Reservations are valid for a{' '}
              <span className="font-semibold text-[#2e7d4f]">
                1-hour slot
              </span>
              . Tables must be freed promptly when your 1-hour slot ends for
              the next reservation.
            </p>
          </div>
        </div>

        {/* Submit */}
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

