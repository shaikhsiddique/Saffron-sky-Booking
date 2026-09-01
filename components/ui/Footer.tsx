
'use client';

import Link from 'next/link';

function Footer() {
  return (
    <>
      {/* =========================
          SUB FOOTER
      ========================== */}
      <section className=" border-t border-[#e8e1d4] my-34">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">

            {/* Image */}
            <div className="relative overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden rounded-sm bg-[#e8e1d4]">
                <img
                  src="https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=1200&auto=format&fit=crop"
                  alt="Saffron Sky Rooftop Multi Cuisine Fine Dine"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>

              {/* Small location label */}
              <div className="absolute bottom-4 left-4 bg-white/95 px-4 py-2 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#a47b2c]">
                  Satara · Maharashtra
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-xl">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-[#a47b2c]">
                Saffron Sky
              </p>

              <h2
                className="mb-6 text-4xl font-normal leading-[1.08] text-[#171613] sm:text-5xl"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                A table above the
                <br />
                ordinary.
              </h2>

              <div className="mb-7 h-px w-14 bg-[#b08a43]" />

              <p className="mb-8 max-w-lg text-[15px] leading-7 text-[#65615a]">
                Welcome to Saffron Sky — a rooftop multi-cuisine fine dining
                experience in Satara. Thoughtfully prepared food, an elevated
                setting and a table worth remembering.
              </p>

              <Link
                href="/booking"
                className="inline-flex items-center gap-5 border border-[#24231f] px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#24231f] transition-all duration-300 hover:bg-[#24231f] hover:text-white"
              >
                Reserve a Table
                <span className="text-base leading-none">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          MAIN FOOTER
      ========================== */}
      <footer className="bg-[#171613] text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

          {/* Main footer content */}
          <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr] lg:gap-16 lg:py-16">

            {/* Brand */}
            <div>
              <div className="mb-6">
                <p
                  className="text-3xl font-normal tracking-wide text-white"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Saffron Sky
                </p>

                <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-[#c39a4a]">
                  Rooftop Multi Cuisine Fine Dine
                </p>
              </div>

              <p className="max-w-sm text-sm font-light leading-6 text-[#aaa69d]">
                An elevated dining experience in Satara, bringing together
                refined ambience, diverse flavours and memorable evenings.
              </p>
            </div>

            {/* Explore */}
            <div>
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.25em] text-[#c39a4a]">
                Explore
              </p>

              <nav className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="w-fit text-sm font-light text-[#d0ccc3] transition-colors hover:text-white"
                >
                  Home
                </Link>

                <Link
                  href="/booking"
                  className="w-fit text-sm font-light text-[#d0ccc3] transition-colors hover:text-white"
                >
                  Reserve a Table
                </Link>

                <Link
                  href="/menu"
                  className="w-fit text-sm font-light text-[#d0ccc3] transition-colors hover:text-white"
                >
                  Menu
                </Link>
              </nav>
            </div>

            {/* Visit */}
            <div>
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.25em] text-[#c39a4a]">
                Visit
              </p>

              <address className="not-italic text-sm font-light leading-6 text-[#aaa69d]">
                Saffron Sky
                <br />
                Landmark Business Centre
                <br />
                Karanje Turf
                <br />
                Satara, Maharashtra 415001
              </address>

              <a
                href="https://maps.app.goo.gl/2TXJuFwcEvX7KxRw9"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#c39a4a] transition-colors hover:text-white"
              >
                Get Directions
                <span>↗</span>
              </a>
            </div>

            {/* Contact */}
            <div>
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.25em] text-[#c39a4a]">
                Contact
              </p>

              <a
                href="tel:+917722020022"
                className="block text-sm font-light text-[#d0ccc3] transition-colors hover:text-white"
              >
                077220 20022
              </a>

              <p className="mt-2 text-xs leading-5 text-[#77736b]">
                Reservations & group bookings
              </p>

              <div className="mt-6">
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#77736b]">
                  Hours
                </p>

                <p className="text-sm font-light text-[#d0ccc3]">
                  11:30 AM — 11:00 PM
                </p>

                <p className="mt-1 text-xs text-[#77736b]">
                  Open daily
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#302e29]" />

          {/* Bottom row */}
          <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-[11px] font-light text-[#77736b]">
              © {new Date().getFullYear()} Saffron Sky. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[11px] uppercase tracking-[0.16em] text-[#aaa69d] transition-colors hover:text-[#c39a4a]"
              >
                Instagram
              </a>

              <a
                href="https://maps.app.goo.gl/2TXJuFwcEvX7KxRw9"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Maps"
                className="text-[11px] uppercase tracking-[0.16em] text-[#aaa69d] transition-colors hover:text-[#c39a4a]"
              >
                Google Maps
              </a>
            </div>

            <p className="text-[10px] uppercase tracking-[0.16em] text-[#55524c]">
              Crafted for memorable evenings
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;

