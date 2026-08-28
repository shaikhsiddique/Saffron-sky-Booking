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
  const [bookedTableIds, setBookedTableIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const guestCount = adults + children;
  const activeTables = section === 'restaurant' ? RESTAURANT_TABLES : GARDEN_TABLES;

  // Toast helpers
  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch booked tables for the currently selected date + timeSlot
  const fetchBookedTables = useCallback(async () => {
    if (!date || !timeSlot) {
      setBookedTableIds([]);
      return;
    }
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        const ids = data.bookings
          .filter((b: any) => b.date === date && b.timeSlot === timeSlot)
          .map((b: any) => b.tableId);
        setBookedTableIds(ids);
      }
    } catch {
      // Silently fail – bookings will still work
    }
  }, [date, timeSlot]);

  useEffect(() => {
    fetchBookedTables();
  }, [fetchBookedTables]);

  // Also refresh booked tables every 30 seconds to catch expiries
  useEffect(() => {
    const interval = setInterval(fetchBookedTables, 30_000);
    return () => clearInterval(interval);
  }, [fetchBookedTables]);

  const handleSection = (next: Section) => {
    setSection(next);
    setSelectedTable('');
  };

  const handleAdultsChange = (val: number) => {
    setAdults(val);
    const nextCount = val + children;
    if (selectedTable) {
      const current = activeTables.find((t) => t.id === selectedTable);
      if (current && !isTableAllowedForParty(current.capacity, nextCount)) {
        setSelectedTable('');
      }
    }
  };

  const handleChildrenChange = (val: number) => {
    setChildren(val);
    const nextCount = adults + val;
    if (selectedTable) {
      const current = activeTables.find((t) => t.id === selectedTable);
      if (current && !isTableAllowedForParty(current.capacity, nextCount)) {
        setSelectedTable('');
      }
    }
  };

  const handleSelectTable = (id: string) => {
    if (bookedTableIds.includes(id)) {
      addToast('error', 'Table Unavailable', `Table ${id} is already booked for ${timeSlot} on ${date || 'the selected date'}. Pick another table or time slot.`);
      return;
    }
    setSelectedTable(id);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!date) {
      addToast('error', 'Date Required', 'Please select a reservation date.');
      return;
    }
    if (!selectedTable) {
      addToast('error', 'No Table Selected', 'Please click a table on the floor plan first.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        addToast('error', 'Booking Failed', data.error || 'Could not complete reservation.');
      } else {
        addToast('success', 'Reservation Confirmed! 🎉', data.message);
        addToast('info', '⏱️ 1-Hour Policy', 'Please note: your table must be freed after your 1-hour dining slot ends.');
        setGuestName('');
        setPhone('');
        setAdults(2);
        setChildren(0);
        setDate('');
        setSelectedTable('');
        // Refresh booked tables
        fetchBookedTables();
      }
    } catch (err: any) {
      addToast('error', 'Connection Error', `Could not reach the server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eee9df] p-4 md:p-8 text-[#302e2a]">
      <div className="mx-auto max-w-[1520px]">
        <BookingHeader />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(720px,1.5fr)_420px] xl:items-start">
          <section className="rounded-2xl border border-[#d8d0c2] bg-[#fbfaf7] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.07)]">
            <SectionTabs section={section} onSectionChange={handleSection} />

            <FloorPlanSVG
              section={section}
              tables={activeTables}
              selectedTable={selectedTable}
              guestCount={guestCount}
              bookedTableIds={bookedTableIds}
              onSelect={handleSelectTable}
            />

            <FloorPlanLegend />
          </section>

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
            onDateChange={setDate}
            onTimeSlotChange={setTimeSlot}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}
