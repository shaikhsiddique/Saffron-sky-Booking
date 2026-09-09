'use client';

import { useState, useEffect, useCallback, useRef, type FormEvent } from 'react';
import { BookingForm, type BookingFormHandle } from '@/components/booking/BookingForm';
import { BookingHeader } from '@/components/booking/BookingHeader';
import { FloorPlanLegend } from '@/components/booking/FloorPlanLegend';
import { SectionTabs } from '@/components/booking/SectionTabs';
import { FloorPlanSVG } from '@/components/floor-plan/FloorPlanSVG';
import { ToastContainer, type ToastMessage } from '@/components/ui/Toast';
import {
  GARDEN_TABLES,
  RESTAURANT_TABLES,
  SECTION_TIME_SLOTS,
  GARDEN_JOIN_PAIRS,
  isTableAllowedForParty,
  type Section,
} from '@/lib/tables';
import { ExtraChairToggle, JoinTableToggle } from '@/components/booking/BookingAddons';
import LandingPage from '@/components/ui/LandingPage';
import Footer from '@/components/ui/Footer';

function getIndiaNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')),
  };
}

function getIndiaToday() {
  const now = getIndiaNow();
  return `${now.year}-${String(now.month).padStart(2, '0')}-${String(now.day).padStart(2, '0')}`;
}

export default function BookingPage() {
  const [section, setSection] = useState<Section>('restaurant');

  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(SECTION_TIME_SLOTS[0]);

  const [selectedTable, setSelectedTable] = useState('');

  const [loading, setLoading] = useState(false);

  const [bookedTableIds, setBookedTableIds] = useState<string[]>([]);

  const [isBookingEnabled, setIsBookingEnabled] = useState(true);
  const [isRestaurantEnabled, setIsRestaurantEnabled] = useState(true);
  const [isGardenEnabled, setIsGardenEnabled] = useState(true);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookingPauseReason, setBookingPauseReason] = useState('');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [hasExtraChair, setHasExtraChair] = useState(false);
  const [isJoinTableEnabled, setIsJoinTableEnabled] = useState(false);

  const isSameDayClosed = date === getIndiaToday() && getIndiaNow().hour >= 19;

  const bookingFormRef = useRef<BookingFormHandle>(null);

  const guestCount = adults + children;

  // Auto-reset extra chair if guestCount is not 5 or 7
  useEffect(() => {
    if (guestCount !== 5 && guestCount !== 7) {
      setHasExtraChair(false);
    }
  }, [guestCount]);

  // Auto-set join table state based on section and guestCount
  useEffect(() => {
    if (section !== 'garden' || guestCount <= 8) {
      setIsJoinTableEnabled(false);
    } else {
      setIsJoinTableEnabled(true);
    }
  }, [section, guestCount]);

  const activeTables =
    section === 'restaurant'
      ? RESTAURANT_TABLES
      : GARDEN_TABLES;


  // =========================================================
  // TOAST HELPERS
  // =========================================================

  const addToast = useCallback(
    (
      type: ToastMessage['type'],
      title: string,
      message: string
    ) => {
      const id = `toast-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;

      setToasts((prev) => [
        ...prev,
        {
          id,
          type,
          title,
          message,
        },
      ]);
    },
    []
  );


  const dismissToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.filter((t) => t.id !== id)
    );
  }, []);


  // =========================================================
  // FETCH BOOKED TABLES
  // =========================================================

  const fetchBookedTables = useCallback(async () => {
    if (!date || !timeSlot) {
      setBookedTableIds([]);
      setSelectedTable('');
      return;
    }

    try {
      const params = new URLSearchParams({
        date,
        timeSlot,
        section,
      });

      const url = `/api/tables?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setBookedTableIds([]);
        setSelectedTable('');
        return;
      }

      const bookedIds = Array.isArray(data.tables)
        ? data.tables
          .filter(
            (table: any) =>
              table.isAvailable === false
          )
          .map((table: any) => table.id)
        : [];

      setBookedTableIds(bookedIds);

      if (
        selectedTable &&
        bookedIds.includes(selectedTable)
      ) {
        setSelectedTable('');

        addToast(
          'error',
          'Table Unavailable',
          `Table ${selectedTable} is already booked for ${timeSlot} on ${date}. Please select another table.`
        );
      }
    } catch (error) {
      setBookedTableIds([]);
      setSelectedTable('');
    }
  }, [
    date,
    timeSlot,
    section,
    selectedTable,
    addToast,
  ]);


  // =========================================================
  // FETCH SETTINGS
  // =========================================================

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'GET',
        cache: 'no-store',
      });
      const data = await response.json();
      if (data.success && data.settings) {
        const newIsBookingEnabled = data.settings.isBookingEnabled ?? true;
        const newIsRestaurantEnabled = data.settings.isRestaurantEnabled ?? true;
        const newIsGardenEnabled = data.settings.isGardenEnabled ?? true;

        setIsBookingEnabled(newIsBookingEnabled);
        setIsRestaurantEnabled(newIsRestaurantEnabled);
        setIsGardenEnabled(newIsGardenEnabled);
        setBlockedDates(
          Array.isArray(data.settings.blockedDates)
            ? data.settings.blockedDates
            : []
        );
        setBookingPauseReason(data.settings.reason || '');

        // Auto-switch section if the current one becomes disabled
        setSection((prev) => {
          if (prev === 'restaurant' && !newIsRestaurantEnabled && newIsGardenEnabled) return 'garden';
          if (prev === 'garden' && !newIsGardenEnabled && newIsRestaurantEnabled) return 'restaurant';
          return prev;
        });
      }
    } catch (error) {
      console.warn('Could not load booking settings:', error);
    }
  }, []);


  // =========================================================
  // FETCH SETTINGS (ONCE ON WEBSITE LOAD)
  // =========================================================

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // =========================================================
  // AUTO FETCH AVAILABILITY
  // =========================================================

  useEffect(() => {
    fetchBookedTables();
  }, [fetchBookedTables]);


  // =========================================================
  // SECTION CHANGE
  // =========================================================

  const handleSection = (next: Section) => {
    setSection(next);

    // Clear selected table when switching section
    setSelectedTable('');
    setHasExtraChair(false);
    setIsJoinTableEnabled(false);

    // Clear old section availability
    setBookedTableIds([]);
  };


  // =========================================================
  // ADULT COUNT
  // =========================================================

  const handleAdultsChange = (val: number) => {
    setAdults(val);

    const nextCount = val + children;

    if (selectedTable) {
      const current = activeTables.find(
        (t) => t.id === selectedTable
      );

      if (
        current &&
        !isTableAllowedForParty(
          current.capacity,
          nextCount,
          section
        )
      ) {
        setSelectedTable('');
      }
    }
  };


  // =========================================================
  // CHILD COUNT
  // =========================================================

  const handleChildrenChange = (val: number) => {
    setChildren(val);

    const nextCount = adults + val;

    if (selectedTable) {
      const current = activeTables.find(
        (t) => t.id === selectedTable
      );

      if (
        current &&
        !isTableAllowedForParty(
          current.capacity,
          nextCount,
          section
        )
      ) {
        setSelectedTable('');
      }
    }
  };


  // =========================================================
  // TABLE SELECTION
  // =========================================================

  const handleSelectTable = (id: string) => {
    if (!isBookingEnabled) {
      addToast(
        'info',
        'Reservations Paused',
        bookingPauseReason ||
        'Online reservations are temporarily paused by management.'
      );
      return;
    }

    if (date && blockedDates.includes(date)) {
      addToast(
        'error',
        'Date Closed',
        `Reservations are closed for ${date}. Please select another date.`
      );
      return;
    }

    // Never allow booked table
    if (bookedTableIds.includes(id)) {
      addToast(
        'error',
        'Table Unavailable',
        `Table ${id} is already booked for ${timeSlot} on ${date || 'the selected date'
        }. Pick another table or time slot.`
      );

      return;
    }


    // Join Table Logic for Garden Dine when guestCount > 8 and join table is enabled
    if (section === 'garden' && isJoinTableEnabled && guestCount > 8) {
      const preferredPairs = GARDEN_JOIN_PAIRS[id] || [];
      const companion = preferredPairs.find(
        (pairId) => pairId !== id && !bookedTableIds.includes(pairId)
      ) || activeTables.find(
        (t) => t.id !== id && !bookedTableIds.includes(t.id)
      )?.id;

      if (!companion) {
        addToast(
          'error',
          'No Companion Table Available',
          `Could not find an available adjacent table to join with Table ${id} for this time slot.`
        );
        return;
      }

      setSelectedTable(`${id} + ${companion}`);
      addToast(
        'success',
        'Tables Joined! 🌿🔗',
        `Linked Table ${id} and Table ${companion} for your party of ${guestCount}.`
      );
      return;
    }

    // Find selected table
    const table = activeTables.find((t) => t.id === id);

    // Standard capacity check (when not joining tables)
    if (
      table &&
      !isTableAllowedForParty(
        table.capacity,
        guestCount,
        section
      )
    ) {
      addToast(
        'error',
        'Wrong Table Size',
        `Table ${id} is a ${table.capacity}-seater and does not match your party of ${guestCount}.`
      );

      return;
    }

    // Select table
    setSelectedTable(id);
  };


  // =========================================================
  // DATE CHANGE
  // =========================================================

  const handleDateChange = (value: string) => {
    setSelectedTable('');
    setDate(value);
  };


  // =========================================================
  // TIME SLOT CHANGE
  // =========================================================

  const handleTimeSlotChange = (value: string) => {
    setSelectedTable('');
    setTimeSlot(value);
  };


  // =========================================================
  // SUBMIT BOOKING
  // =========================================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!isBookingEnabled) {
      addToast(
        'error',
        'Reservations Paused',
        bookingPauseReason ||
        'Online reservations are currently paused by management. Please call us directly.'
      );
      return;
    }

    if (date && blockedDates.includes(date)) {
      addToast(
        'error',
        'Date Closed',
        `Reservations are closed for ${date}. Please choose another date.`
      );
      return;
    }

    if (!date) {
      addToast(
        'error',
        'Date Required',
        'Please select a reservation date.'
      );

      return;
    }


    if (!timeSlot) {
      addToast(
        'error',
        'Time Required',
        'Please select a reservation time slot.'
      );

      return;
    }


    if (!selectedTable) {
      addToast(
        'error',
        'No Table Selected',
        'Please click a table on the floor plan first.'
      );

      return;
    }


    // Final frontend check
    if (bookedTableIds.includes(selectedTable)) {
      addToast(
        'error',
        'Table Unavailable',
        `Table ${selectedTable} has already been booked for this date and time.`
      );

      fetchBookedTables();

      return;
    }


    setLoading(true);


    try {
      const isJoined = selectedTable.includes('+');
      const tableParts = selectedTable.split('+').map((s) => s.trim()).filter(Boolean);

      const response = await fetch(
        '/api/bookings',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            guestName,
            phone,
            adults,
            children,
            date,
            timeSlot,
            tableId: selectedTable,
            section,
            hasExtraChair,
            extraChair: hasExtraChair,
            isJoinedTable: isJoined,
            tableIds: tableParts,
            joinedTableId: isJoined && tableParts.length > 1 ? tableParts[1] : undefined,
          }),
        }
      );


      const data = await response.json();


      if (
        !response.ok ||
        !data.success
      ) {
        addToast(
          'error',
          'Booking Failed',
          data.error ||
          'Could not complete reservation.'
        );

        fetchBookedTables();

        return;
      }


      // Success
      addToast(
        'success',
        'Reservation Confirmed! 🎉',
        data.booking?.message ||
        `Table ${selectedTable} has been reserved successfully.`
      );


      addToast(
        'info',
        '⏱️ 1-Hour Policy',
        'Please note: your table must be freed after your 1-hour dining slot ends.'
      );


      // Reset form
      setGuestName('');
      setPhone('');
      setAdults(2);
      setChildren(0);
      setDate('');
      setSelectedTable('');
      setBookedTableIds([]);
      setHasExtraChair(false);
      setIsJoinTableEnabled(false);

    } catch (error: any) {
      addToast(
        'error',
        'Connection Error',
        `Could not reach the server: ${error?.message ||
        'Unknown error'
        }`
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#eee9df] text-[#302e2a]">

      <LandingPage />


      <div className="mx-auto my-[10vh] w-full max-w-[1520px] p-3 sm:p-4 md:p-6 lg:p-8">

        <BookingHeader />

        {/* =================================================
            BOOKING STATUS NOTICES
        ================================================= */}

        {/* Master pause */}
        {!isBookingEnabled && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50/95 p-4 shadow-sm sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-200/70 text-xl font-bold">⏸️</div>
            <div>
              <h3 className="text-base font-semibold text-amber-950 sm:text-lg">Online Reservations Temporarily Paused</h3>
              <p className="mt-0.5 text-xs text-amber-800 sm:text-sm">
                {bookingPauseReason || 'Management has temporarily paused online reservations. Please call us directly.'}
              </p>
            </div>
          </div>
        )}

        {/* Fine Dine In closed notice */}
        {isBookingEnabled && !isRestaurantEnabled && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50/95 p-4 shadow-sm sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-200/70 text-xl">🍽️</div>
            <div>
              <h3 className="text-base font-semibold text-orange-950 sm:text-lg">Fine Dine In Temporarily Unavailable</h3>
              <p className="mt-0.5 text-xs text-orange-800 sm:text-sm">
                The Fine Dine In section is currently closed.{isGardenEnabled ? ' Garden Dine is still open for reservations.' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Garden Dine closed notice */}
        {isBookingEnabled && !isGardenEnabled && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/95 p-4 shadow-sm sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-200/70 text-xl">🌿</div>
            <div>
              <h3 className="text-base font-semibold text-emerald-950 sm:text-lg">Garden Dine Temporarily Unavailable</h3>
              <p className="mt-0.5 text-xs text-emerald-800 sm:text-sm">
                The Garden Dine section is currently closed.{isRestaurantEnabled ? ' Fine Dine is still open for reservations.' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Blocked date notice */}
        {isBookingEnabled && date && blockedDates.includes(date) && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-rose-300 bg-rose-50/95 p-4 shadow-sm sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-200/70 text-xl">📅</div>
            <div>
              <h3 className="text-base font-semibold text-rose-950 sm:text-lg">Reservations Closed for {date}</h3>
              <p className="mt-0.5 text-xs text-rose-800 sm:text-sm">
                Online reservations are closed for the selected day. Please select a different date.
              </p>
            </div>
          </div>
        )}

        {/* Same-day 7 PM cutoff notice */}
        {isBookingEnabled && date && isSameDayClosed && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50/95 p-4 shadow-sm sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-200/70 text-xl font-bold">🌙</div>
            <div>
              <h3 className="text-base font-semibold text-amber-950 sm:text-lg">Same-Day Bookings Closed</h3>
              <p className="mt-0.5 text-xs text-amber-800 sm:text-sm">
                Same-day reservations for today close at 7:00 PM. Please select tomorrow or a future date.
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            RESPONSIVE BOOKING AREA
            MOBILE: Form → Section + Floor Plan → Submit button
            DESKTOP (md+): Side-by-side layout unchanged
        ================================================= */}

        {/* ── MOBILE LAYOUT (hidden on md+) ── */}
        <div className="mt-5 flex flex-col gap-4 md:hidden">

          {/* 1. Booking Form (no submit button) */}
          <BookingForm
            ref={bookingFormRef}
            guestName={guestName}
            phone={phone}
            adults={adults}
            children={children}
            date={date}
            timeSlot={timeSlot}
            selectedTable={selectedTable}
            loading={loading}
            section={section}
            hasExtraChair={hasExtraChair}
            isJoinTableEnabled={isJoinTableEnabled}
            isBookingEnabled={isBookingEnabled}
            blockedDates={blockedDates}
            bookingPauseReason={bookingPauseReason}
            hideSubmitButton={true}
            onGuestNameChange={setGuestName}
            onPhoneChange={setPhone}
            onAdultsChange={handleAdultsChange}
            onChildrenChange={handleChildrenChange}
            onDateChange={handleDateChange}
            onTimeSlotChange={handleTimeSlotChange}
            onExtraChairChange={setHasExtraChair}
            onJoinTableToggle={setIsJoinTableEnabled}
            onSubmit={handleSubmit}
          />

          {/* 2. Section Tabs + Floor Plan */}
          <section className="flex min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-[#d8d0c2] bg-[#fbfaf7] p-3 shadow-[0_12px_40px_rgba(0,0,0,0.07)]">

            <SectionTabs
              section={section}
              selectedTable={selectedTable}
              onSectionChange={handleSection}
              isRestaurantEnabled={isRestaurantEnabled}
              isGardenEnabled={isGardenEnabled}
            />

            <div className="my-4 w-full min-w-0 overflow-hidden">
              <FloorPlanSVG
                section={section}
                tables={activeTables}
                selectedTable={selectedTable}
                guestCount={guestCount}
                bookedTableIds={bookedTableIds}
                onSelect={handleSelectTable}
              />
            </div>

            <FloorPlanLegend />

          </section>

          {/* Extra Chair Addon (only for guest size 5 or 7) below table layout, above submit button */}
          <ExtraChairToggle
            guestCount={guestCount}
            hasExtraChair={hasExtraChair}
            onChange={setHasExtraChair}
          />

          {/* Join Table Option (only for Garden Dine & guest size > 8) below table layout, above submit button */}
          <JoinTableToggle
            section={section}
            guestCount={guestCount}
            isJoinTableEnabled={isJoinTableEnabled}
            onToggle={setIsJoinTableEnabled}
          />

          {/* 3. Submit / Book Button */}
          <button
            type="button"
            disabled={
              loading ||
              !isBookingEnabled ||
              (section === 'restaurant' && !isRestaurantEnabled) ||
              (section === 'garden' && !isGardenEnabled) ||
              isSameDayClosed
            }
            onClick={() => bookingFormRef.current?.submitForm()}
            className="w-full rounded-xl bg-gradient-to-r from-[#263126] to-[#2e7d4f] px-4 py-4 font-semibold text-white transition-all hover:from-[#1e271e] hover:to-[#256843] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 text-[15px] tracking-wide shadow-[0_4px_20px_rgba(46,125,79,0.35)]"
          >
            {loading
              ? '⏳ Booking…'
              : !isBookingEnabled
                ? 'Reservations Paused'
                : isSameDayClosed
                  ? 'Same-Day Closed (After 7 PM)'
                  : (section === 'restaurant' && !isRestaurantEnabled)
                    ? 'Fine Dine In Closed'
                    : (section === 'garden' && !isGardenEnabled)
                      ? 'Garden Dine Closed'
                      : '🍽️ Confirm Reservation'}
          </button>

        </div>


        {/* ── DESKTOP LAYOUT (hidden on mobile, visible md+) ── */}
        <div className="mt-5 hidden w-full flex-col gap-4 sm:gap-5 md:flex md:flex-row md:items-start md:gap-6 lg:mt-6">


          {/* =================================================
              FLOOR PLAN — visible on desktop
          ================================================= */}

          <section id='booking' className="flex min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-[#d8d0c2] bg-[#fbfaf7] p-3 shadow-[0_12px_40px_rgba(0,0,0,0.07)] sm:p-4 md:flex-1">

            <SectionTabs
              section={section}
              selectedTable={selectedTable}
              onSectionChange={handleSection}
              isRestaurantEnabled={isRestaurantEnabled}
              isGardenEnabled={isGardenEnabled}
            />


            <div className="my-4 w-full min-w-0 overflow-hidden sm:my-5">

              <FloorPlanSVG
                section={section}
                tables={activeTables}
                selectedTable={selectedTable}
                guestCount={guestCount}
                bookedTableIds={bookedTableIds}
                onSelect={handleSelectTable}
              />

            </div>


            <FloorPlanLegend />

          </section>


          {/* =================================================
              BOOKING FORM (desktop — with submit button)
          ================================================= */}

          <div className="w-full min-w-0 md:w-[400px] md:flex-shrink-0 lg:w-[430px]">

            <BookingForm
              guestName={guestName}
              phone={phone}
              adults={adults}
              children={children}
              date={date}
              timeSlot={timeSlot}
              selectedTable={selectedTable}
              loading={loading}
              section={section}
              hasExtraChair={hasExtraChair}
              isJoinTableEnabled={isJoinTableEnabled}
              isBookingEnabled={isBookingEnabled}
              blockedDates={blockedDates}
              bookingPauseReason={bookingPauseReason}
              onGuestNameChange={setGuestName}
              onPhoneChange={setPhone}
              onAdultsChange={handleAdultsChange}
              onChildrenChange={handleChildrenChange}
              onDateChange={handleDateChange}
              onTimeSlotChange={handleTimeSlotChange}
              onExtraChairChange={setHasExtraChair}
              onJoinTableToggle={setIsJoinTableEnabled}
              onSubmit={handleSubmit}
            />

          </div>


        </div>

      </div>


      {/* =====================================================
          TOASTS
      ===================================================== */}

      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />


      <Footer />

    </main>
  );
}