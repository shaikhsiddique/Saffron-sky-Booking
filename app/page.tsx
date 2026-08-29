'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { BookingForm } from '@/components/booking/BookingForm';
import { BookingHeader } from '@/components/booking/BookingHeader';
import { FloorPlanLegend } from '@/components/booking/FloorPlanLegend';
import { SectionTabs } from '@/components/booking/SectionTabs';
import { FloorPlanSVG } from '@/components/floor-plan/FloorPlanSVG';
import { ToastContainer, type ToastMessage } from '@/components/ui/Toast';
import {
  GARDEN_TABLES,
  RESTAURANT_TABLES,
  SECTION_TIME_SLOTS,
  isTableAllowedForParty,
  type Section,
} from '@/lib/tables';

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

  // Tables booked for the currently selected date + time slot
  const [bookedTableIds, setBookedTableIds] = useState<string[]>([]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const guestCount = adults + children;

  const activeTables =
    section === 'restaurant' ? RESTAURANT_TABLES : GARDEN_TABLES;

  // ============================================================
  // TOAST HELPERS
  // ============================================================

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

  // ============================================================
  // FETCH TABLE AVAILABILITY
  //
  // Checks:
  //   selected date
  //   selected time slot
  //   selected section
  //
  // Example:
  // /api/tables?date=2026-08-29&timeSlot=9:30%20%E2%80%93%2010:30&section=restaurant
  // ============================================================

  const fetchBookedTables = useCallback(async () => {
    if (!date || !timeSlot) {
      console.log(
        '⏸️ Availability check skipped - missing date/time:',
        {
          date,
          timeSlot,
        }
      );

      setBookedTableIds([]);
      setSelectedTable('');

      return;
    }

    console.log('\n========================================');
    console.log('🔄 FETCHING TABLE AVAILABILITY');
    console.log('========================================');
    console.log('📅 Date:', date);
    console.log('⏰ Time slot:', timeSlot);
    console.log('🏠 Section:', section);

    try {
      const params = new URLSearchParams({
        date,
        timeSlot,
        section,
      });

      const url = `/api/tables?${params.toString()}`;

      console.log('🌐 Availability request:', url);

      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
      });

      console.log(
        '📡 Availability response status:',
        response.status
      );

      const data = await response.json();

      console.log(
        '📦 Availability response data:',
        data
      );

      if (!response.ok || !data.success) {
        console.error(
          '❌ Availability request failed:',
          data
        );

        setBookedTableIds([]);
        setSelectedTable('');

        return;
      }

      // --------------------------------------------------------
      // Extract booked table IDs from /api/tables response
      // --------------------------------------------------------

      const bookedIds = Array.isArray(data.tables)
        ? data.tables
            .filter(
              (table: any) => table.isAvailable === false
            )
            .map((table: any) => table.id)
        : [];

      const availableIds = Array.isArray(data.tables)
        ? data.tables
            .filter(
              (table: any) => table.isAvailable === true
            )
            .map((table: any) => table.id)
        : [];

      console.log(
        '🔴 BOOKED TABLE IDS:',
        bookedIds
      );

      console.log(
        '🟢 AVAILABLE TABLE IDS:',
        availableIds
      );

      console.log(
        '📊 Total tables:',
        data.totalTables
      );

      console.log(
        '📊 Booked count:',
        data.bookedCount
      );

      console.log(
        '📊 Available count:',
        data.availableCount
      );

      setBookedTableIds(bookedIds);

      // --------------------------------------------------------
      // If the currently selected table became unavailable,
      // remove it from selection.
      // --------------------------------------------------------

      if (
        selectedTable &&
        bookedIds.includes(selectedTable)
      ) {
        console.log(
          `⚠️ Selected table ${selectedTable} is no longer available.`
        );

        setSelectedTable('');

        addToast(
          'error',
          'Table Unavailable',
          `Table ${selectedTable} is already booked for ${timeSlot} on ${date}. Please select another table.`
        );
      }

      console.log(
        '========================================'
      );

      console.log(
        '✅ AVAILABILITY UPDATE COMPLETE'
      );

      console.log(
        '========================================\n'
      );
    } catch (error) {
      console.error(
        '\n========================================'
      );

      console.error(
        '🔥 AVAILABILITY REQUEST ERROR'
      );

      console.error(
        '========================================'
      );

      console.error('Error:', error);

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

  // ============================================================
  // AUTOMATIC AVAILABILITY CHECK
  //
  // Runs whenever:
  //   date changes
  //   timeSlot changes
  //   section changes
  // ============================================================

  useEffect(() => {
    fetchBookedTables();
  }, [fetchBookedTables]);

  // ============================================================
  // REFRESH EVERY 30 SECONDS
  //
  // This catches another customer booking a table while
  // this page is open.
  // ============================================================

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(
        '🔄 30-second availability refresh...'
      );

      fetchBookedTables();
    }, 30_000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchBookedTables]);

  // ============================================================
  // SECTION CHANGE
  // ============================================================

  const handleSection = (next: Section) => {
    console.log(
      '🏠 Section changed:',
      section,
      '→',
      next
    );

    setSection(next);

    // Previously selected table belongs to old section
    setSelectedTable('');
  };

  // ============================================================
  // ADULT COUNT CHANGE
  // ============================================================

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
          nextCount
        )
      ) {
        console.log(
          `⚠️ Table ${selectedTable} no longer matches party size ${nextCount}`
        );

        setSelectedTable('');
      }
    }
  };

  // ============================================================
  // CHILD COUNT CHANGE
  // ============================================================

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
          nextCount
        )
      ) {
        console.log(
          `⚠️ Table ${selectedTable} no longer matches party size ${nextCount}`
        );

        setSelectedTable('');
      }
    }
  };

  // ============================================================
  // TABLE SELECTION
  // ============================================================

  const handleSelectTable = (id: string) => {
    console.log(
      '🪑 Table clicked:',
      id
    );

    console.log(
      '🔴 Currently booked tables:',
      bookedTableIds
    );

    // Never allow selecting a booked table
    if (bookedTableIds.includes(id)) {
      console.log(
        `❌ Table ${id} is already booked`
      );

      addToast(
        'error',
        'Table Unavailable',
        `Table ${id} is already booked for ${timeSlot} on ${
          date || 'the selected date'
        }. Pick another table or time slot.`
      );

      return;
    }

    // Check capacity
    const table = activeTables.find(
      (t) => t.id === id
    );

    if (
      table &&
      !isTableAllowedForParty(
        table.capacity,
        guestCount
      )
    ) {
      console.log(
        `❌ Table ${id} does not match party size ${guestCount}`
      );

      addToast(
        'error',
        'Wrong Table Size',
        `Table ${id} is a ${table.capacity}-seater and does not match your party of ${guestCount}.`
      );

      return;
    }

    console.log(
      `✅ Table ${id} selected`
    );

    setSelectedTable(id);
  };

  // ============================================================
  // DATE CHANGE
  // ============================================================

  const handleDateChange = (value: string) => {
    console.log(
      '📅 Date changed:',
      date,
      '→',
      value
    );

    // Important:
    // A table selected for the old date should not remain
    // selected when changing to another date.
    setSelectedTable('');

    setDate(value);
  };

  // ============================================================
  // TIME SLOT CHANGE
  // ============================================================

  const handleTimeSlotChange = (value: string) => {
    console.log(
      '⏰ Time slot changed:',
      timeSlot,
      '→',
      value
    );

    // Important:
    // A table selected for the old time should not remain
    // selected when changing to another slot.
    setSelectedTable('');

    setTimeSlot(value);
  };

  // ============================================================
  // SUBMIT BOOKING
  // ============================================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    console.log(
      '\n========================================'
    );

    console.log(
      '🚀 SUBMITTING BOOKING FROM FRONTEND'
    );

    console.log(
      '========================================'
    );

    console.log({
      guestName,
      phone,
      adults,
      children,
      guestCount,
      date,
      timeSlot,
      selectedTable,
      section,
    });

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

    // Final frontend check before POST
    if (bookedTableIds.includes(selectedTable)) {
      console.log(
        `❌ FINAL CHECK FAILED: ${selectedTable} is booked`
      );

      addToast(
        'error',
        'Table Unavailable',
        `Table ${selectedTable} has already been booked for this date and time.`
      );

      // Refresh immediately
      fetchBookedTables();

      return;
    }

    setLoading(true);

    try {
      console.log(
        '📡 Sending POST /api/bookings...'
      );

      const response = await fetch(
        '/api/bookings',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
          }),
        }
      );

      console.log(
        '📡 Booking response status:',
        response.status
      );

      const data = await response.json();

      console.log(
        '📦 Booking response:',
        data
      );

      if (!response.ok || !data.success) {
        console.error(
          '❌ BOOKING FAILED:',
          data.error
        );

        addToast(
          'error',
          'Booking Failed',
          data.error ||
            'Could not complete reservation.'
        );

        // Refresh availability because another
        // booking may have happened.
        fetchBookedTables();

        return;
      }

      // ========================================================
      // SUCCESS
      // ========================================================

      console.log(
        '🎉 BOOKING SUCCESSFUL'
      );

      console.log(
        '📌 Booking:',
        data.booking
      );

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

      // Clear current availability because date was reset
      setBookedTableIds([]);

      console.log(
        '🧹 Booking form reset'
      );

    } catch (error: any) {
      console.error(
        '\n========================================'
      );

      console.error(
        '🔥 FRONTEND BOOKING ERROR'
      );

      console.error(
        '========================================'
      );

      console.error(
        'Error:',
        error
      );

      addToast(
        'error',
        'Connection Error',
        `Could not reach the server: ${
          error?.message ||
          'Unknown error'
        }`
      );
    } finally {
      setLoading(false);

      console.log(
        '🏁 Booking request finished'
      );

      console.log(
        '========================================\n'
      );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#eee9df] p-3 text-[#302e2a] sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1520px]">

        <BookingHeader />

        <div
          className="
            grid
            w-full
            grid-cols-1
            gap-4
            sm:gap-5
            lg:gap-6
            2xl:grid-cols-[minmax(0,1fr)_420px]
          "
        >

          {/* ==================================================
              FLOOR PLAN
          ================================================== */}

          <section
            className="
              min-w-0
              w-full
              overflow-hidden
              rounded-2xl
              border
              border-[#d8d0c2]
              bg-[#fbfaf7]
              p-3
              shadow-[0_12px_40px_rgba(0,0,0,0.07)]
              sm:p-4
            "
          >

            <SectionTabs
              section={section}
              onSectionChange={handleSection}
            />

            <div className="w-full min-w-0 overflow-x-auto">

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

          {/* ==================================================
              BOOKING FORM
          ================================================== */}

          <div className="w-full min-w-0">

            <BookingForm
              guestName={guestName}
              phone={phone}
              adults={adults}
              children={children}
              date={date}
              timeSlot={timeSlot}
              selectedTable={selectedTable}
              loading={loading}

              onGuestNameChange={
                setGuestName
              }

              onPhoneChange={
                setPhone
              }

              onAdultsChange={
                handleAdultsChange
              }

              onChildrenChange={
                handleChildrenChange
              }

              onDateChange={
                handleDateChange
              }

              onTimeSlotChange={
                handleTimeSlotChange
              }

              onSubmit={
                handleSubmit
              }
            />

          </div>

        </div>
      </div>

      {/* ======================================================
          TOASTS
      ====================================================== */}

      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />

    </main>
  );
}