import { useEffect, useState, type FormEvent } from 'react';
import { SECTION_TIME_SLOTS } from '@/lib/tables';

const input =
  'w-full rounded-lg border border-[#d8cfbf] bg-white px-3 py-3 text-[15px] text-[#302e2a] outline-none focus:border-[#3e6b4f]';

const SLOT_START_TIMES: Record<string, string> = {
  '7:30 – 8:30': '19:30',
  '8:30 – 9:30': '20:30',
  '9:30 – 10:30': '21:30',
};

function getIndiaNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '0';

  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    second: Number(get('second')),
  };
}

function getIndiaToday() {
  const now = getIndiaNow();

  return `${now.year}-${String(now.month).padStart(
    2,
    '0'
  )}-${String(now.day).padStart(2, '0')}`;
}

function getSlotStartTimestamp(
  date: string,
  slot: string
): number | null {
  const time = SLOT_START_TIMES[slot];

  if (!date || !time) {
    return null;
  }

  const timestamp = new Date(
    `${date}T${time}:00+05:30`
  ).getTime();

  return Number.isNaN(timestamp)
    ? null
    : timestamp;
}

function isSlotPast(
  date: string,
  slot: string,
  now: number
) {
  const slotStart = getSlotStartTimestamp(
    date,
    slot
  );

  if (slotStart === null) {
    return true;
  }

  return slotStart <= now;
}

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
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const today = getIndiaToday();

  const getAvailableSlots = () => {
    if (!date) {
      return [];
    }

    if (date > today) {
      return [...SECTION_TIME_SLOTS];
    }

    if (date < today) {
      return [];
    }

    return SECTION_TIME_SLOTS.filter(
      (slot) => !isSlotPast(date, slot, now)
    );
  };

  const availableSlots = getAvailableSlots();

  useEffect(() => {
    if (!date) {
      if (timeSlot) {
        onTimeSlotChange('');
      }

      return;
    }

    if (date < today) {
      onTimeSlotChange('');
      return;
    }

    if (date > today) {
      if (
        !SECTION_TIME_SLOTS.includes(
          timeSlot as (typeof SECTION_TIME_SLOTS)[number]
        )
      ) {
        onTimeSlotChange(
          SECTION_TIME_SLOTS[0]
        );
      }

      return;
    }

    const selectedSlotIsStillValid =
      !!timeSlot &&
      availableSlots.includes(
        timeSlot as (typeof SECTION_TIME_SLOTS)[number]
      );

    if (selectedSlotIsStillValid) {
      return;
    }

    onTimeSlotChange(
      availableSlots[0] ?? ''
    );
  }, [
    date,
    today,
    now,
    timeSlot,
    availableSlots,
    onTimeSlotChange,
  ]);

  const handleDateChange = (
    value: string
  ) => {
    onDateChange(value);

    const currentToday =
      getIndiaToday();

    if (!value) {
      onTimeSlotChange('');
      return;
    }

    if (value < currentToday) {
      onTimeSlotChange('');
      return;
    }

    if (value > currentToday) {
      onTimeSlotChange(
        SECTION_TIME_SLOTS[0]
      );
      return;
    }

    const currentNow = Date.now();

    const firstFutureSlot =
      SECTION_TIME_SLOTS.find(
        (slot) =>
          !isSlotPast(
            value,
            slot,
            currentNow
          )
      );

    onTimeSlotChange(
      firstFutureSlot ?? ''
    );
  };

  const handleTimeSlotChange = (
    value: string
  ) => {
    if (!date) {
      return;
    }

    const currentToday =
      getIndiaToday();

    if (
      date === currentToday &&
      isSlotPast(
        date,
        value,
        Date.now()
      )
    ) {
      const nextFutureSlot =
        SECTION_TIME_SLOTS.find(
          (slot) =>
            !isSlotPast(
              date,
              slot,
              Date.now()
            )
        );

      onTimeSlotChange(
        nextFutureSlot ?? ''
      );

      return;
    }

    onTimeSlotChange(value);
  };

  const validateForm = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const cleanName =
      guestName.trim();

    const cleanPhone =
      phone.replace(/\s+/g, '');

    if (!cleanName) {
      alert(
        'Please enter your full name.'
      );
      return;
    }

    if (
      cleanName.length < 2 ||
      cleanName.length > 50
    ) {
      alert(
        'Name must be between 2 and 50 characters.'
      );
      return;
    }

    const nameRegex =
      /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

    if (!nameRegex.test(cleanName)) {
      alert(
        'Please enter a valid name.'
      );
      return;
    }

    const phoneRegex =
      /^(?:\+91|91)?[6-9]\d{9}$/;

    if (!phoneRegex.test(cleanPhone)) {
      alert(
        'Please enter a valid 10-digit Indian mobile number.'
      );
      return;
    }

    if (
      adults < 1 ||
      adults > 8
    ) {
      alert(
        'Please select between 1 and 8 adults.'
      );
      return;
    }

    if (
      children < 0 ||
      children > 3
    ) {
      alert(
        'Please select between 0 and 3 children.'
      );
      return;
    }

    const totalGuests =
      adults + children;

    if (
      totalGuests < 1 ||
      totalGuests > 11
    ) {
      alert(
        'Total guests must be between 1 and 11.'
      );
      return;
    }

    if (!date) {
      alert(
        'Please select a reservation date.'
      );
      return;
    }

    const currentToday =
      getIndiaToday();

    if (date < currentToday) {
      alert(
        'You cannot book a date in the past.'
      );
      return;
    }

    if (!timeSlot) {
      alert(
        'Please select a future time slot.'
      );
      return;
    }

    const currentNow =
      Date.now();

    const slotStart =
      getSlotStartTimestamp(
        date,
        timeSlot
      );

    if (slotStart === null) {
      alert(
        'Invalid reservation time slot.'
      );
      return;
    }

    if (
      date === currentToday &&
      slotStart <= currentNow
    ) {
      alert(
        `The ${timeSlot} PM slot has already started or passed. Please select a future slot.`
      );

      const nextFutureSlot =
        SECTION_TIME_SLOTS.find(
          (slot) =>
            !isSlotPast(
              currentToday,
              slot,
              currentNow
            )
        );

      onTimeSlotChange(
        nextFutureSlot ?? ''
      );

      return;
    }

    if (!selectedTable) {
      alert(
        'Please select a table from the floor plan.'
      );
      return;
    }

    onSubmit(e);
  };

  const noSlotsLeft =
    !!date &&
    date === today &&
    availableSlots.length === 0;

  const selectedSlotIsInvalid =
    !!date &&
    date === today &&
    !!timeSlot &&
    isSlotPast(
      date,
      timeSlot,
      now
    );

  return (
    <section className="rounded-2xl border border-[#d8d0c2] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.07)]">
      <h2 className="text-xl font-semibold">
        Booking Details
      </h2>

      <p className="mt-1 text-sm text-[#777067]">
        Select a table on the drawing, then confirm.
      </p>

      <form
        onSubmit={validateForm}
        className="mt-5 space-y-4"
      >
        <input
          className={input}
          type="text"
          required
          minLength={2}
          maxLength={50}
          placeholder="Full Name"
          value={guestName}
          onChange={(e) =>
            onGuestNameChange(
              e.target.value
            )
          }
          autoComplete="name"
        />

        <input
          className={input}
          type="tel"
          required
          maxLength={13}
          placeholder="Phone Number"
          value={phone}
          onChange={(e) =>
            onPhoneChange(
              e.target.value
            )
          }
          autoComplete="tel"
          inputMode="tel"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            className={input}
            value={adults}
            onChange={(e) =>
              onAdultsChange(
                Number(e.target.value)
              )
            }
            required
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (n) => (
                <option
                  key={n}
                  value={n}
                >
                  {n} Adult
                  {n !== 1 ? 's' : ''}
                </option>
              )
            )}
          </select>

          <select
            className={input}
            value={children}
            onChange={(e) =>
              onChildrenChange(
                Number(e.target.value)
              )
            }
            required
          >
            {[0, 1, 2, 3].map(
              (n) => (
                <option
                  key={n}
                  value={n}
                >
                  {n} Child
                  {n === 1 ? '' : 'ren'}
                </option>
              )
            )}
          </select>
        </div>

        <input
          className={input}
          type="date"
          required
          min={today}
          value={date}
          onChange={(e) =>
            handleDateChange(
              e.target.value
            )
          }
        />

        <select
          className={input}
          required
          value={
            availableSlots.includes(
              timeSlot as (typeof SECTION_TIME_SLOTS)[number]
            )
              ? timeSlot
              : ''
          }
          onChange={(e) =>
            handleTimeSlotChange(
              e.target.value
            )
          }
        >
          {!date && (
            <option value="">
              Select a date first
            </option>
          )}

          {date &&
            availableSlots.map(
              (slot) => (
                <option
                  key={slot}
                  value={slot}
                >
                  {slot} PM
                </option>
              )
            )}

          {noSlotsLeft && (
            <option value="">
              No remaining slots today
            </option>
          )}
        </select>

        {selectedSlotIsInvalid && (
          <p className="text-xs font-medium text-red-600">
            The selected slot has already started or passed.
          </p>
        )}

        <div className="rounded-xl border border-[#d9d2c5] bg-[#f8f5ee] px-4 py-3 text-center text-sm font-semibold">
          {selectedTable ? (
            <>
              Selected table:{' '}
              <span className="text-[#2e7d4f]">
                {selectedTable}
              </span>
            </>
          ) : (
            'Click a table on the floor plan'
          )}
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-[#e6d8b5] bg-[#fffcf5] p-3 text-xs text-[#6e5d3b]">
          <span className="text-base leading-none">
            ⏱️
          </span>

          <div>
            <strong className="font-semibold text-[#544426]">
              1-Hour Dining Policy:
            </strong>

            <p className="mt-0.5 leading-tight opacity-90">
              Reservations are valid for a{' '}
              <span className="font-semibold text-[#2e7d4f]">
                1-hour slot
              </span>
              . Tables must be freed promptly when
              your 1-hour slot ends for the next
              reservation.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={
            loading ||
            !date ||
            !timeSlot ||
            selectedSlotIsInvalid
          }
          className="w-full rounded-xl bg-[#263126] px-4 py-3 font-semibold text-white transition hover:bg-[#2e7d4f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? 'Booking…'
            : 'Confirm Reservation'}
        </button>
      </form>
    </section>
  );
}