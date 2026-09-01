'use client';

import React from 'react';

interface LandingPageProps {
  onBookClick?: () => void;
}

function LandingPage({ onBookClick: _onBookClick }: LandingPageProps) {
  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-black">

      {/* =====================================================
          DESKTOP / LANDSCAPE IMAGE
          Visible on tablet/desktop landscape
      ====================================================== */}
      <img
        src="https://res.cloudinary.com/daai6xwtd/image/upload/v1788290527/IMG_20260831_134801_siquhc.jpg"
        alt="Saffron Sky Rooftop Multi Cuisine Fine Dining"
        className="
          absolute
          inset-0
          z-0
          hidden
          h-full
          w-full
          object-cover
          md:block
        "
      />

      {/* =====================================================
          MOBILE VIDEO
          Visible only on mobile
      ====================================================== */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="
          absolute
          inset-0
          z-0
          block
          h-full
          w-full
          object-contain
          md:hidden
        "
      >
        <source
          src="https://res.cloudinary.com/daai6xwtd/video/upload/v1788290328/Great_food_Stunning_rooftop_views._Unforgettable_moments.Visit_SaffronSky_with_your_family_and_f_jk1puw.mp4"
          type="video/mp4"
        />
      </video>

      {/* =====================================================
          DARK OVERLAYS
      ====================================================== */}

      {/* Overall darkening */}
      <div className="absolute inset-0 z-10 bg-black/35" />

      {/* Left gradient for typography */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-[50%] bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="absolute left-0 right-0 top-0 z-30 px-5 py-5 sm:px-8 sm:py-7 lg:px-12 lg:py-8">

        <div className="flex items-center justify-between">

          {/* BRAND */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Logo */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 sm:h-12 sm:w-12">

              <span
                className="text-[11px] tracking-[0.18em] text-white sm:text-[13px]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                SS
              </span>

            </div>

            {/* Name */}
            <div>

              <h2
                className="text-base text-white sm:text-lg"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Saffron Sky
              </h2>

              <p className="mt-0.5 text-[7px] uppercase tracking-[0.25em] text-white/70 sm:text-[8px]">
                Satara · Maharashtra
              </p>

            </div>

          </div>

          {/* DESKTOP LOCATION */}
          <div className="hidden items-center gap-2 md:flex">

            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />

            <span className="text-[9px] uppercase tracking-[0.25em] text-white/70">
              Karanje Turf · Satara
            </span>

          </div>

        </div>

      </header>

      {/* =====================================================
          HERO CONTENT
      ====================================================== */}
      <section className="absolute inset-0 z-20 flex items-end">

        <div className="w-full px-5 pb-24 sm:px-8 sm:pb-28 md:px-10 md:pb-28 lg:px-16 lg:pb-32">

          <div className="max-w-4xl">

            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3 sm:mb-5 sm:gap-4">

              <div className="h-px w-8 bg-amber-300 sm:w-10" />

              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-amber-200 sm:text-[10px] md:text-[11px]">
                Rooftop Multi-Cuisine Fine Dining
              </p>

            </div>

            {/* Main title */}
            <h1
              className="
                text-[18vw]
                font-normal
                leading-[0.8]
                tracking-[-0.04em]
                text-white
                sm:text-[13vw]
                md:text-[11vw]
                lg:text-[9vw]
              "
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Saffron
              <br />

              <span className="ml-[0.25em] italic text-white">
                Sky
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-[320px] text-[12px] font-light leading-5 text-white/85 sm:mt-8 sm:max-w-md sm:text-sm sm:leading-6 md:text-[15px] md:leading-7">

              An elevated dining experience in Satara,
              where thoughtfully crafted flavours meet
              the atmosphere of the rooftop.

            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          BOTTOM INFORMATION
      ====================================================== */}
      <div className="absolute bottom-5 left-5 right-5 z-30 flex items-end justify-between sm:bottom-7 sm:left-8 sm:right-8 lg:bottom-8 lg:left-12 lg:right-12">

        {/* Scroll */}
        <div className="hidden items-center gap-3 md:flex">

          <span className="text-[9px] uppercase tracking-[0.3em] text-white/60">
            Scroll to explore
          </span>

          <span className="h-px w-8 bg-white/40" />

        </div>

        {/* Information */}
        <div className="ml-auto flex items-end gap-5 sm:gap-8">

          {/* Hours */}
          <div className="hidden text-right sm:block">

            <p className="mb-1 text-[8px] uppercase tracking-[0.25em] text-white/50">
              Open Daily
            </p>

            <p className="text-[10px] text-white/85 sm:text-[11px]">
              11:30 AM — 11:00 PM
            </p>

          </div>

          {/* Location */}
          <div className="text-right">

            <p className="mb-1 text-[8px] uppercase tracking-[0.25em] text-white/50">
              Location
            </p>

            <p className="text-[10px] text-white/85 sm:text-[11px]">
              Satara · Maharashtra
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          DESKTOP SIDE DECORATION
      ====================================================== */}
      <div className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 lg:block">

        <div className="flex flex-col items-center gap-4">

          <div className="h-14 w-px bg-white/40" />

          <span
            className="text-[8px] uppercase tracking-[0.35em] text-white/60"
            style={{ writingMode: 'vertical-rl' }}
          >
            Rooftop Dining
          </span>

          <div className="h-14 w-px bg-white/40" />

        </div>

      </div>

    </main>
  );
}

export default LandingPage;

