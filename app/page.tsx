'use client';

import { useState, type FormEvent } from 'react';
import { BookingForm } from '@/components/booking/BookingForm';
import { BookingHeader } from '@/components/booking/BookingHeader';
import { FloorPlanLegend } from '@/components/booking/FloorPlanLegend';
import { SectionTabs } from '@/components/booking/SectionTabs';
import { FloorPlanSVG } from '@/components/floor-plan/FloorPlanSVG';
import {
  GARDEN_TABLES,
  RESTAURANT_TABLES,
  SECTION_TIME_SLOTS,
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

  const guestCount = adults + children;
  const activeTables = section === 'restaurant' ? RESTAURANT_TABLES : GARDEN_TABLES;

  const handleSection = (next: Section) => {
    setSection(next);
    setSelectedTable('');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTable) {
      alert('Please select a table from the floor plan.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      alert(`Table ${selectedTable} booked for ${guestName}.`);
      setLoading(false);
      setGuestName('');
      setPhone('');
      setAdults(2);
      setChildren(0);
      setDate('');
      setSelectedTable('');
    }, 700);
  };

  return (
    <main className="min-h-screen bg-[#eee9df] p-4 md:p-8 text-[#302e2a]">
      <div className="mx-auto max-w-[1240px]">
        <BookingHeader />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(520px,1.15fr)_420px] xl:items-start">
          <section className="rounded-2xl border border-[#d8d0c2] bg-[#fbfaf7] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.07)]">
            <SectionTabs section={section} onSectionChange={handleSection} />

            <FloorPlanSVG
              section={section}
              tables={activeTables}
              selectedTable={selectedTable}
              guestCount={guestCount}
              onSelect={setSelectedTable}
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
            onAdultsChange={setAdults}
            onChildrenChange={setChildren}
            onDateChange={setDate}
            onTimeSlotChange={setTimeSlot}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </main>
  );
}
