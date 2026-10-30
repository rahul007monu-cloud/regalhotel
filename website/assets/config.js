/* ============================================================
 * HOTEL SETTINGS — edit these before going live
 * ============================================================ */
window.HOTEL = {
  name: "Regal Hotel",
  // WhatsApp number with country code, digits only, e.g. "919876543210".
  // Leave empty for the demo: WhatsApp will open and let you pick a contact.
  whatsapp: "",
  // Front desk number as listed publicly for Regal Hotel (Kayak). Confirm with the hotel.
  phone: "+91 145 242 4058",
  email: "",            // e.g. "stay@regalhotelajmer.com" (optional)
  address: "Opp. Gurudwara, Dargah Road, Ganj, Ajmer 305001, Rajasthan",
  mapsQuery: "Regal Hotel Dargah Road Ajmer",

  // Sample rates (₹ per night). Confirm with the hotel.
  // "direct" = website/WhatsApp rate, "ota" = typical price on booking sites.
  rooms: {
    standard: { direct: 1700, ota: 1950, maxGuests: 2 },
    deluxe:   { direct: 2350, ota: 2700, maxGuests: 3 },
    family:   { direct: 3300, ota: 3800, maxGuests: 4 },
  },

  // Peak periods (approximate, set every year). Multiplies the rate.
  events: [
    { name: "Pushkar Mela", from: "2026-11-17", to: "2026-11-24", mult: 1.3 },
    { name: "Urs Sharif",   from: "2026-12-11", to: "2026-12-18", mult: 2.0 },
  ],
  advancePercent: 30,
};
