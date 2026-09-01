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
import LandingPage from '@/components/ui/LandingPage';
import Footer from '@/components/ui/Footer';

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

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const guestCount = adults + children;

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
  // AUTO FETCH AVAILABILITY
  // =========================================================

  useEffect(() => {
    fetchBookedTables();
  }, [fetchBookedTables]);


  // =========================================================
  // REFRESH EVERY 30 SECONDS
  // =========================================================

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBookedTables();
    }, 30_000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchBookedTables]);


  // =========================================================
  // SECTION CHANGE
  // =========================================================

  const handleSection = (next: Section) => {
    setSection(next);

    // Clear selected table when switching section
    setSelectedTable('');

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
          nextCount
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
          nextCount
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

    // Never allow booked table
    if (bookedTableIds.includes(id)) {
      addToast(
        'error',
        'Table Unavailable',
        `Table ${id} is already booked for ${timeSlot} on ${
          date || 'the selected date'
        }. Pick another table or time slot.`
      );

      return;
    }


    // Find selected table
    const table = activeTables.find(
      (t) => t.id === id
    );


    // Check capacity
    if (
      table &&
      !isTableAllowedForParty(
        table.capacity,
        guestCount
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

    } catch (error: any) {
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


        <div className="grid w-full grid-cols-1 gap-4 sm:gap-5 lg:gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">

          {/* =================================================
              FLOOR PLAN
          ================================================= */}

          <section className="min-w-0 w-full overflow-hidden rounded-2xl border border-[#d8d0c2] bg-[#fbfaf7] p-3 shadow-[0_12px_40px_rgba(0,0,0,0.07)] sm:p-4">

            <SectionTabs
              section={section}
              selectedTable={selectedTable}
              tables={activeTables}
              onSectionChange={handleSection}
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


          {/* =================================================
              BOOKING FORM
          ================================================= */}

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
              onGuestNameChange={setGuestName}
              onPhoneChange={setPhone}
              onAdultsChange={handleAdultsChange}
              onChildrenChange={handleChildrenChange}
              onDateChange={handleDateChange}
              onTimeSlotChange={handleTimeSlotChange}
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