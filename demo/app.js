/* Regal Hotel Ajmer – Automation Demo
 * Pure front-end simulation. All data is sample data held in memory.
 * In production these screens connect to WhatsApp Business API, a PMS/channel
 * manager, UPI payment gateway and Google Business Profile.
 */
(() => {
  "use strict";

  // ---------- helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  const now = () => new Date();
  const hhmm = (d = now()) => d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const fmtDate = (d) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const sameDay = (a, b) => a.toDateString() === b.toDateString();

  // ---------- static config (sample) ----------
  const ROOM_TYPES = {
    Standard: { rate: 1800, label: "Standard AC Room", desc: "Double bed, AC, TV, hot water" },
    Deluxe: { rate: 2500, label: "Deluxe AC Room", desc: "Bigger room, seating area, AC, TV" },
    Family: { rate: 3500, label: "Family Room (4 guests)", desc: "2 beds, fits 4 guests, AC" },
  };
  const typeOf = (no) => (no < 200 ? "Standard" : no < 400 ? "Deluxe" : "Family");
  const STAFF = [
    { name: "Ramesh", role: "Housekeeping" },
    { name: "Sunita", role: "Housekeeping" },
    { name: "Imran", role: "Housekeeping" },
    { name: "Mohan", role: "Maintenance" },
  ];
  const GUEST_NAMES = ["Mr. Shaikh", "Mrs. Agarwal", "Mr. Qureshi", "Mr. Verma", "Ms. Fatima", "Mr. Joshi", "Mr. Ansari", "Mrs. Mehta", "Mr. Khan", "Mr. Sharma", "Mr. Siddiqui", "Mrs. Rathore", "Mr. Patel", "Mr. Rizvi", "Mr. Gupta", "Mr. Pathan"];
  const MENU = {
    "Breakfast": [
      { id: "b1", name: "Aloo Paratha (2) with curd", price: 140 },
      { id: "b2", name: "Poha with tea", price: 90 },
      { id: "b3", name: "Bread Omelette", price: 110, nonveg: true },
    ],
    "Main Course": [
      { id: "m1", name: "Dal Makhani", price: 220 },
      { id: "m2", name: "Paneer Butter Masala", price: 280 },
      { id: "m3", name: "Chicken Biryani", price: 320, nonveg: true },
      { id: "m4", name: "Mutton Korma", price: 380, nonveg: true },
      { id: "m5", name: "Butter Roti", price: 25 },
    ],
    "Rajasthani Special": [
      { id: "r1", name: "Dal Baati Churma", price: 260 },
      { id: "r2", name: "Gatte ki Sabzi", price: 230 },
    ],
    "Drinks & Sweets": [
      { id: "d1", name: "Masala Chai", price: 40 },
      { id: "d2", name: "Sweet Lassi", price: 70 },
      { id: "d3", name: "Sohan Halwa (Ajmer special)", price: 120 },
    ],
  };
  const ALL_DISHES = Object.values(MENU).flat();
  const OTAS = ["Booking.com", "MakeMyTrip", "Agoda", "Goibibo"];

  // Approximate 2026 event windows (demo only; set yearly by the hotel)
  const EVENTS = [
    { key: "pushkar", name: "Pushkar Mela", from: new Date(2026, 10, 17), to: new Date(2026, 10, 24), mult: 1.3 },
    { key: "urs", name: "Urs Sharif (Khwaja Garib Nawaz)", from: new Date(2026, 11, 11), to: new Date(2026, 11, 18), mult: 2.0 },
  ];

  const PUBLIC_REVIEWS = [
    { who: "Abdul R. · Google", stars: 5, text: "Very close to Dargah Sharif, could walk there in 5 minutes. Rooms clean and staff helpful. Food at the restaurant was good." },
    { who: "Neha S. · Booking.com", stars: 3, text: "Location is great but hot water was not working in the morning and the AC was noisy. Staff were polite." },
    { who: "Rahul K. · MakeMyTrip", stars: 2, text: "Check-in took too long and the room was not ready on time. Expected better for the price." },
    { who: "Farhan M. · Google", stars: 4, text: "Good value hotel near the station. Parking available. Breakfast could have more options." },
  ];

  // ---------- state ----------
  let S;
  function freshState() {
    const rooms = [];
    for (let f = 1; f <= 4; f++) for (let i = 1; i <= 12; i++) {
      const no = f * 100 + i;
      const r = Math.random();
      let status = r < 0.62 ? "occupied" : r < 0.72 ? "reserved" : r < 0.84 ? "vacant" : r < 0.95 ? "dirty" : "maintenance";
      rooms.push({ no, type: typeOf(no), status, guest: status === "occupied" || status === "reserved" ? pick(GUEST_NAMES) : null, bill: 0 });
    }
    // guarantee enough ready rooms of each type for the demo
    ["Standard", "Deluxe", "Family"].forEach((t) => {
      const ready = rooms.filter((r) => r.type === t && r.status === "vacant");
      if (ready.length < 2) rooms.filter((r) => r.type === t && r.status === "occupied").slice(0, 2 - ready.length).forEach((r) => { r.status = "vacant"; r.guest = null; });
    });
    rooms.filter((r) => r.status === "occupied").forEach((r) => (r.bill = ROOM_TYPES[r.type].rate));

    const hk = [];
    rooms.filter((r) => r.status === "dirty").forEach((r, i) => hk.push({ room: r.no, staff: STAFF[i % 3].name, state: i % 2 ? "prog" : "pending", since: hhmm(addMinutes(-10 - i * 7)) }));
    const issues = ["AC not cooling", "Geyser not working", "TV remote missing", "Bathroom tap leaking"];
    const mt = rooms.filter((r) => r.status === "maintenance").map((r, i) => ({ room: r.no, issue: issues[i % issues.length], since: hhmm(addMinutes(-40 - i * 15)) }));

    return {
      rooms,
      hk,
      mt,
      feed: [],
      waBookings: [],
      orders: [],
      orderSeq: 1,
      bookingSeq: 1,
      revenueToday: 86400,
      sources: { "Walk-in / Phone": 38, "Booking.com": 41, "MakeMyTrip / Goibibo": 33, "Agoda": 12, "WhatsApp Direct": 6 },
      ratings: { 5: 212, 4: 148, 3: 61, 2: 27, 1: 19 },
      checkouts: [
        { name: "Mr. Iqbal", room: 207, done: false },
        { name: "Mrs. Saxena", room: 112, done: false },
        { name: "Mr. Chauhan", room: 305, done: false },
      ],
      approved: new Set(),
      wa: { step: "start", data: {} },
      cart: {},
    };
  }
  function addMinutes(m) { const d = now(); d.setMinutes(d.getMinutes() + m); return d; }

  // ---------- UI primitives ----------
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 3200);
  }
  function modal(html) { $("#modal").innerHTML = html; $("#modalBg").classList.add("open"); }
  function closeModal() { $("#modalBg").classList.remove("open"); }
  $("#modalBg").addEventListener("click", (e) => { if (e.target.id === "modalBg" || e.target.dataset.close !== undefined) closeModal(); });

  function log(icon, text) {
    S.feed.unshift({ icon, text, time: hhmm() });
    S.feed = S.feed.slice(0, 40);
    renderFeed();
  }

  // ---------- navigation ----------
  $$(".nav-item").forEach((b) => b.addEventListener("click", () => show(b.dataset.view)));
  function show(view) {
    $$(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
    if (view === "dashboard") renderDashboard();
    if (view === "housekeeping") renderHK();
    if (view === "roomservice") renderKitchen();
    if (view === "reviews") renderReviews();
    if (view === "pricing") renderCalendar();
    window.scrollTo(0, 0);
  }

  // =====================================================================
  // DASHBOARD
  // =====================================================================
  function counts() {
    const c = { occupied: 0, reserved: 0, vacant: 0, dirty: 0, maintenance: 0 };
    S.rooms.forEach((r) => c[r.status]++);
    return c;
  }
  function renderDashboard() {
    const h = now().getHours();
    $("#greeting").textContent = (h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening") + ", Owner 👋";
    $("#todayLabel").textContent = now().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " · Regal Hotel, Dargah Road, Ajmer";
    const c = counts();
    const occ = Math.round((c.occupied / 48) * 100);
    const totalSrc = Object.values(S.sources).reduce((a, b) => a + b, 0);
    const direct = Math.round(((S.sources["Walk-in / Phone"] + S.sources["WhatsApp Direct"]) / totalSrc) * 100);
    const rt = ratingAvg();
    $("#kpis").innerHTML = [
      ["Occupancy", occ + "%", `${c.occupied} of 48 rooms`],
      ["Arriving today", c.reserved, "pre-checked-in: " + Math.max(0, Math.floor(c.reserved / 2))],
      ["Revenue today", inr(S.revenueToday), "rooms + restaurant"],
      ["Direct bookings", direct + "%", "no OTA commission"],
      ["Guest rating", rt.toFixed(2) + " ★", "across Google & OTAs"],
    ].map(([l, v, d]) => `<div class="kpi"><div class="label">${l}</div><div class="value">${v}</div><div class="delta">${d}</div></div>`).join("");

    $("#roomGrid").innerHTML = S.rooms.map((r) => `<div class="room ${r.status}" data-room="${r.no}" title="${r.no} · ${r.type} · ${r.status}${r.guest ? " · " + esc(r.guest) : ""}">${r.no}</div>`).join("");
    $$(".room", $("#roomGrid")).forEach((el) => el.addEventListener("click", () => roomModal(+el.dataset.room)));

    $("#sourceBars").innerHTML = Object.entries(S.sources).map(([k, v]) => {
      const p = Math.round((v / totalSrc) * 100);
      const col = k === "WhatsApp Direct" ? "#25d366" : k === "Walk-in / Phone" ? "#b8860b" : "#7a1f2b";
      return `<div class="hbar"><div class="row"><span>${k}</span><b>${v} · ${p}%</b></div><div class="track"><div class="fill" style="width:${p}%;background:${col}"></div></div></div>`;
    }).join("");

    const days = [];
    const seed = [71, 64, 68, 83, 92, 88, 74];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(now(), -i);
      days.push({ label: i === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" }), v: i === 0 ? occ : seed[6 - i] });
    }
    $("#occBars").innerHTML = days.map((d) => `<div class="b"><span class="pct">${d.v}%</span><div class="col" style="height:${d.v}%"></div><small>${d.label}</small></div>`).join("");
    renderFeed();
  }
  function renderFeed() {
    const el = $("#feed");
    if (!el) return;
    el.innerHTML = S.feed.map((f) => `<li><span class="ico">${f.icon}</span><span>${f.text}</span><span class="time">${f.time}</span></li>`).join("") || `<li class="muted">No activity yet.</li>`;
  }
  function flashRoom(no) {
    const el = $(`.room[data-room="${no}"]`);
    if (el) { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
  }

  function roomModal(no) {
    const r = S.rooms.find((x) => x.no === no);
    const label = { occupied: "Occupied", reserved: "Arriving today", vacant: "Ready", dirty: "Cleaning", maintenance: "Under repair" }[r.status];
    let actions = "";
    if (r.status === "vacant") actions = `<button class="btn primary" data-act="walkin">Walk-in check-in</button><button class="btn outline" data-act="repair">Raise repair ticket</button>`;
    if (r.status === "reserved") actions = `<button class="btn primary" data-act="checkin">Check-in guest</button>`;
    if (r.status === "occupied") actions = `<button class="btn primary" data-act="checkout">Check-out guest</button><button class="btn outline" data-act="repair">Raise repair ticket</button>`;
    if (r.status === "dirty") actions = `<button class="btn primary" data-act="clean">Mark cleaned</button>`;
    if (r.status === "maintenance") actions = `<button class="btn primary" data-act="fixed">Mark repaired</button>`;
    modal(`
      <h3>Room ${r.no} · ${r.type}</h3>
      <p><span class="dot ${r.status}"></span>${label}${r.guest ? ` · <b>${esc(r.guest)}</b>` : ""}</p>
      <p class="muted small">Rate: ${inr(ROOM_TYPES[r.type].rate)}/night${r.bill ? ` · Current bill: <b>${inr(r.bill)}</b>` : ""}</p>
      <div class="actions">${actions}<button class="btn outline" data-close>Close</button></div>`);
    $$("[data-act]", $("#modal")).forEach((b) => b.addEventListener("click", () => roomAction(r, b.dataset.act)));
  }

  function roomAction(r, act) {
    if (act === "walkin") {
      r.status = "occupied"; r.guest = pick(GUEST_NAMES); r.bill = ROOM_TYPES[r.type].rate;
      S.revenueToday += r.bill; S.sources["Walk-in / Phone"]++;
      log("🛎️", `Walk-in check-in: <b>${esc(r.guest)}</b> → Room ${r.no}. Digital ID + Form C captured.`);
      toast(`Room ${r.no} checked in`);
    } else if (act === "checkin") {
      r.status = "occupied"; r.bill = ROOM_TYPES[r.type].rate;
      S.revenueToday += r.bill;
      log("🛎️", `Check-in: <b>${esc(r.guest)}</b> → Room ${r.no}. Welcome message sent on WhatsApp.`);
      toast(`Welcome WhatsApp sent to ${r.guest}`);
    } else if (act === "checkout") {
      const g = r.guest;
      const staff = leastBusyStaff();
      log("🧾", `Check-out: <b>${esc(g)}</b> from Room ${r.no}. Invoice ${inr(r.bill)} sent on WhatsApp.`);
      log("🧹", `Cleaning task for Room ${r.no} auto-assigned to <b>${staff}</b>.`);
      log("⭐", `Feedback request scheduled for <b>${esc(g)}</b> (sent 2 hrs after check-out).`);
      S.hk.unshift({ room: r.no, staff, state: "pending", since: hhmm() });
      S.checkouts.unshift({ name: g, room: r.no, done: false });
      r.status = "dirty"; r.guest = null; r.bill = 0;
      toast(`Cleaning assigned to ${staff} · feedback request queued`);
    } else if (act === "clean") {
      completeClean(r.no);
    } else if (act === "fixed") {
      completeRepair(r.no);
    } else if (act === "repair") {
      modal(`<h3>Repair ticket · Room ${r.no}</h3>
        <p class="muted">Select the issue. Maintenance staff get it on WhatsApp instantly.</p>
        <div class="actions">${["AC not cooling", "Geyser / hot water", "TV / Wi-Fi", "Plumbing leak", "Electrical"].map((i) => `<button class="btn outline" data-issue="${i}">${i}</button>`).join("")}</div>`);
      $$("[data-issue]", $("#modal")).forEach((b) => b.addEventListener("click", () => {
        S.mt.unshift({ room: r.no, issue: b.dataset.issue, since: hhmm() });
        if (r.status === "vacant") r.status = "maintenance";
        log("🔧", `Repair ticket: Room ${r.no} · ${b.dataset.issue} → sent to <b>Mohan</b> (Maintenance).`);
        toast("Repair ticket sent to Mohan on WhatsApp");
        closeModal(); renderDashboard(); flashRoom(r.no);
      }));
      return;
    }
    closeModal();
    renderDashboard();
    flashRoom(r.no);
  }
  function leastBusyStaff() {
    const hkStaff = STAFF.filter((s) => s.role === "Housekeeping");
    const load = Object.fromEntries(hkStaff.map((s) => [s.name, 0]));
    S.hk.forEach((t) => (load[t.staff] = (load[t.staff] || 0) + 1));
    return hkStaff.sort((a, b) => load[a.name] - load[b.name])[0].name;
  }

  $("#dailyReportBtn").addEventListener("click", () => {
    const c = counts();
    const fnb = S.orders.reduce((a, o) => a + o.total, 0) + 14250;
    const low = S.checkouts.filter((x) => x.low).length;
    const msg = `📊 *Regal Hotel – Daily Report*
${now().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}

🛏️ Occupancy: *${Math.round((c.occupied / 48) * 100)}%* (${c.occupied}/48)
🛬 Arrivals pending: ${c.reserved}
💰 Revenue: *${inr(S.revenueToday)}*
🍽️ Riviera F&B: ${inr(fnb)}
💬 WhatsApp bookings today: ${S.waBookings.length}
🧹 Rooms to clean: ${c.dirty} · 🔧 Repairs: ${c.maintenance}
⭐ Avg rating: ${ratingAvg().toFixed(2)}${low ? `\n⚠️ Low-rating alerts: ${low}` : ""}

Tomorrow: ${Math.floor(c.reserved * 1.4) + 6} arrivals expected.`;
    modal(`<h3>Daily owner report</h3><p class="muted small">Sent automatically every night at 10:00 PM to the owner's WhatsApp.</p>
      <div class="wa-preview"><div class="msg bot" style="max-width:100%">${esc(msg).replace(/\*(.+?)\*/g, "<b>$1</b>")}<span class="t">10:00 PM</span></div></div>
      <div class="actions"><button class="btn outline" data-close>Close</button></div>`);
  });

  // =====================================================================
  // WHATSAPP BOT
  // =====================================================================
  const waChat = $("#waChat"), waQuick = $("#waQuick");
  function waMsg(who, html, extra = "") {
    const d = document.createElement("div");
    d.className = "msg " + who;
    d.innerHTML = html + extra + (who === "sys" ? "" : `<span class="t">${hhmm()}${who === "user" ? " ✓✓" : ""}</span>`);
    waChat.appendChild(d);
    waChat.scrollTop = waChat.scrollHeight;
    return d;
  }
  function botSay(html, quick = [], delay = 650) {
    setQuick([]);
    const t = document.createElement("div");
    t.className = "typing"; t.innerHTML = "<span></span><span></span><span></span>";
    waChat.appendChild(t); waChat.scrollTop = waChat.scrollHeight;
    return new Promise((res) => setTimeout(() => { t.remove(); waMsg("bot", html); setQuick(quick); res(); }, delay));
  }
  function setQuick(list) {
    waQuick.innerHTML = "";
    list.forEach((q) => {
      const b = document.createElement("button");
      b.textContent = q.label;
      b.addEventListener("click", () => { userSay(q.label); q.fn(); });
      waQuick.appendChild(b);
    });
  }
  function userSay(text) { waMsg("user", esc(text)); }

  const MAIN_MENU = () => [
    { label: "🛏️ Book a room", fn: waStartBooking },
    { label: "💰 Room rates", fn: waRates },
    { label: "📍 Location", fn: waLocation },
    { label: "🍽️ Restaurant", fn: waFood },
    { label: "👤 Talk to reception", fn: waHuman },
  ];

  function waGreet() {
    S.wa = { step: "menu", data: {} };
    botSay(`Assalamu Alaikum / Namaste 🙏
Welcome to *Regal Hotel, Ajmer*. We are opposite the Gurudwara on Dargah Road, a short walk from Dargah Sharif.

How can I help you? (English / हिंदी)`.replace(/\*(.+?)\*/g, "<b>$1</b>"), MAIN_MENU());
  }
  function waRates() {
    S.wa.step = "menu";
    const lines = Object.values(ROOM_TYPES).map((t) => `• <b>${t.label}</b>: ${inr(t.rate)}/night\n   ${t.desc}`).join("\n");
    botSay(`Our room rates (incl. Wi-Fi, parking):\n\n${lines}\n\nCheck-in & check-out: 12 noon. Rates are higher during Urs.`, [{ label: "🛏️ Book a room", fn: waStartBooking }, { label: "⬅️ Main menu", fn: waGreet }]);
  }
  function waLocation() {
    S.wa.step = "menu";
    botSay(`📍 <b>Regal Hotel</b>, opp. Gurudwara, Dargah Road, Ajmer\n\n🕌 Dargah Sharif: ~400 m walk\n🚉 Ajmer Railway Station: ~1 km\n✈️ Kishangarh Airport: ~30 km\n\n<span style="color:#2563eb;text-decoration:underline">📌 Open in Google Maps</span>\n\nFree parking available. We can arrange a taxi from the station or airport.`, [{ label: "🚕 Book pickup", fn: waPickup }, { label: "🛏️ Book a room", fn: waStartBooking }, { label: "⬅️ Main menu", fn: waGreet }]);
  }
  function waPickup() {
    botSay(`Sure! Pickup charges (sample):\n🚉 Station → Hotel: ₹150\n✈️ Kishangarh Airport → Hotel: ₹900\n\nPlease share your train/flight number and time, and reception will confirm the driver.`, [{ label: "⬅️ Main menu", fn: waGreet }]);
    log("🚕", "Pickup enquiry received on WhatsApp. Reception notified.");
  }
  function waFood() {
    S.wa.step = "menu";
    botSay(`🍽️ <b>Riviera Restaurant</b> (inside the hotel)\nBreakfast · Lunch · Dinner · 24-hr room service\n\nTry our Dal Baati Churma, Chicken Biryani and Ajmer's famous Sohan Halwa.\n\nHotel guests can order from their room by scanning the QR code.`, [{ label: "🛏️ Book a room", fn: waStartBooking }, { label: "⬅️ Main menu", fn: waGreet }]);
  }
  function waHuman(text) {
    S.wa.step = "menu";
    log("👤", `WhatsApp chat handed to reception${text ? `: "<i>${esc(text)}</i>"` : ""}.`);
    botSay(`I've passed your message to our reception team. 👍\nA staff member will reply here within 10 minutes.\n\nFor urgent help please call the front desk (24 hours).`, [{ label: "⬅️ Main menu", fn: waGreet }]);
  }

  // booking flow
  function waStartBooking() {
    S.wa = { step: "date", data: {} };
    const t = now(), tm = addDays(t, 1), fri = addDays(t, ((5 - t.getDay() + 7) % 7) || 7);
    botSay("Great! 📅 What is your check-in date?\n(Tap below or type a date)", [
      { label: `Today (${fmtDate(t)})`, fn: () => waSetDate(t) },
      { label: `Tomorrow (${fmtDate(tm)})`, fn: () => waSetDate(tm) },
      { label: `Friday (${fmtDate(fri)})`, fn: () => waSetDate(fri) },
    ]);
  }
  function waSetDate(d, typed) {
    S.wa.data.date = typed || fmtDate(d);
    S.wa.data.dateObj = d || null;
    S.wa.step = "nights";
    botSay("How many nights will you stay? 🌙", [1, 2, 3, 4].map((n) => ({ label: `${n} night${n > 1 ? "s" : ""}`, fn: () => waSetNights(n) })));
  }
  function waSetNights(n) {
    S.wa.data.nights = n;
    S.wa.step = "guests";
    botSay("How many guests? 👨‍👩‍👧", [
      { label: "1–2 guests", fn: () => waSetGuests(2) },
      { label: "3–4 guests", fn: () => waSetGuests(4) },
      { label: "More than 4", fn: () => waSetGuests(5) },
    ]);
  }
  function eventMult(d) {
    if (!d) return { mult: 1, ev: null };
    const e = EVENTS.find((x) => d >= startOfDay(x.from) && d <= endOfDay(x.to));
    return e ? { mult: e.mult, ev: e.name } : { mult: 1, ev: null };
  }
  function waSetGuests(g) {
    S.wa.data.guests = g;
    S.wa.step = "type";
    const avail = (t) => S.rooms.filter((r) => r.type === t && r.status === "vacant").length;
    const { mult, ev } = eventMult(S.wa.data.dateObj);
    const n = S.wa.data.nights;
    const types = g >= 3 ? ["Family", "Deluxe"] : ["Standard", "Deluxe", "Family"];
    const opts = types.filter((t) => avail(t) > 0);
    if (!opts.length) {
      botSay("Sorry, we are fully booked for these dates. 😔 Reception will contact you if a room opens up.", [{ label: "⬅️ Main menu", fn: waGreet }]);
      log("📵", "WhatsApp enquiry: no rooms available. Added to waitlist.");
      return;
    }
    const lines = opts.map((t) => `• <b>${ROOM_TYPES[t].label}</b>\n   ${inr(ROOM_TYPES[t].rate * mult)} × ${n} = <b>${inr(ROOM_TYPES[t].rate * mult * n)}</b>  (${avail(t)} left)`).join("\n");
    const note = g > 4 ? "\n\nFor more than 4 guests we suggest 2 rooms. Reception can arrange this." : "";
    botSay(`✅ Rooms available for <b>${esc(S.wa.data.date)}</b>, ${n} night${n > 1 ? "s" : ""}:${ev ? `\n<i>(${ev} rates apply)</i>` : ""}\n\n${lines}${note}\n\nWhich room would you like?`,
      opts.map((t) => ({ label: ROOM_TYPES[t].label.split(" (")[0], fn: () => waSetType(t, mult) })));
  }
  function waSetType(t, mult) {
    S.wa.data.type = t;
    S.wa.data.total = ROOM_TYPES[t].rate * mult * S.wa.data.nights;
    S.wa.step = "name";
    botSay("Please type the <b>guest name</b> for the booking ✍️");
  }
  function waSetName(name) {
    S.wa.data.name = name.slice(0, 40);
    S.wa.step = "pay";
    const d = S.wa.data, adv = Math.round(d.total * 0.3);
    d.advance = adv;
    botSay(`Thank you, <b>${esc(d.name)}</b>! Here is your booking summary:\n\n🛏️ ${ROOM_TYPES[d.type].label}\n📅 ${esc(d.date)} · ${d.nights} night${d.nights > 1 ? "s" : ""}\n👥 ${d.guests > 4 ? "4+" : d.guests === 4 ? "3–4" : "1–2"} guests\n💰 Total: <b>${inr(d.total)}</b>\n\nTo confirm, please pay a 30% advance of <b>${inr(adv)}</b>. Balance at check-in.
<div class="paycard">🔒 <b>UPI Payment</b><br>Regal Hotel Ajmer · ${inr(adv)}<br><span class="small muted">GPay · PhonePe · Paytm · Card</span></div>`,
      [{ label: `💳 Pay ${inr(adv)} (simulate)`, fn: waPaid }, { label: "🏨 Pay at hotel", fn: () => waConfirm(false) }]);
  }
  function waPaid() {
    waMsg("sys", "💳 Payment of " + inr(S.wa.data.advance) + " received via UPI (simulated)");
    waConfirm(true);
  }
  function waConfirm(paid) {
    const d = S.wa.data;
    const room = S.rooms.find((r) => r.type === d.type && r.status === "vacant");
    if (!room) { botSay("Sorry, that room was just booked by someone else. Please choose again.", [{ label: "🛏️ Book a room", fn: waStartBooking }]); return; }
    const id = "RGL" + String(2600 + S.bookingSeq++);
    room.status = "reserved"; room.guest = d.name;
    S.sources["WhatsApp Direct"]++;
    if (paid) S.revenueToday += d.advance;
    S.waBookings.unshift({ id, name: d.name, room: room.no, total: d.total, paid, date: d.date });
    renderWaBookings();
    log("💬", `New WhatsApp booking <b>${id}</b>: ${esc(d.name)} · Room ${room.no} · ${inr(d.total)}${paid ? " · advance paid" : " · pay at hotel"}. Room blocked on all booking sites.`);
    S.wa.step = "done";
    botSay(`🎉 <b>Booking confirmed!</b>\n\nBooking ID: <b>${id}</b>\nRoom type: ${ROOM_TYPES[d.type].label}\nCheck-in: ${esc(d.date)}, 12:00 noon\n${paid ? `Advance paid: ${inr(d.advance)} ✅` : "Payment: at hotel"}\n\n📄 Invoice PDF sent. Save this number. We'll send a reminder the day before your arrival.\n\nShukriya 🙏`,
      [{ label: "⏩ Simulate day-before reminder", fn: waReminder }, { label: "⬅️ Main menu", fn: waGreet }], 900);
    toast(`Booking ${id} → Room ${room.no} blocked on dashboard`);
  }
  function waReminder() {
    const b = S.waBookings[0];
    waMsg("sys", "⏰ Next day, 6:00 PM · automatic reminder");
    botSay(`Hello ${esc(b.name)} 👋\nReminder: your stay at <b>Regal Hotel, Ajmer</b> starts tomorrow (${esc(b.date)}).\n\n⚡ Save time at the desk: upload your ID now for quick check-in.\n<span style="color:#2563eb;text-decoration:underline">🪪 Upload Aadhaar / Passport</span>\n\nNeed a station pickup?`, [{ label: "🚕 Yes, pickup", fn: waPickup }, { label: "👍 No, thanks", fn: () => botSay("See you tomorrow! 🙏", [{ label: "⬅️ Main menu", fn: waGreet }]) }]);
  }
  function renderWaBookings() {
    const el = $("#waBookings");
    el.innerHTML = S.waBookings.length ? S.waBookings.map((b) => `<li><span><b>${b.id}</b> · ${esc(b.name)}<br><span class="muted small">Room ${b.room} · ${esc(b.date)}</span></span><span>${inr(b.total)} ${b.paid ? "✅" : "🕓"}</span></li>`).join("") : `<li class="muted">None yet. Make one on the phone!</li>`;
  }

  $("#waForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const inp = $("#waInput"), text = inp.value.trim();
    if (!text) return;
    inp.value = "";
    userSay(text);
    handleWaText(text);
  });
  function handleWaText(text) {
    const t = text.toLowerCase();
    const step = S.wa.step;
    if (step === "name") return waSetName(text);
    if (step === "date") return waSetDate(null, text);
    if (step === "nights" && /^\d+$/.test(t)) return waSetNights(Math.min(+t, 15));
    if (/^(hi|hello|hey|namaste|salaam|salam|assalam|aoa|menu|start)/.test(t)) return waGreet();
    if (/(book|room chahiye|room available|kamra|booking)/.test(t)) return waStartBooking();
    if (/(rate|price|kiraya|kitne ka|charges|tariff|cost)/.test(t)) return waRates();
    if (/(location|address|kahan|where|dargah|station|map|direction)/.test(t)) return waLocation();
    if (/(food|restaurant|menu|khana|breakfast|dinner|lunch)/.test(t)) return waFood();
    if (/(taxi|pickup|cab|airport)/.test(t)) return waPickup();
    if (/(parking|car)/.test(t)) return botSay("🚗 Yes, free on-site parking is available for guests.", MAIN_MENU());
    if (/(check.?in|check.?out|timing|time)/.test(t)) return botSay("🕛 Check-in: 12:00 noon · Check-out: 12:00 noon.\nEarly check-in / late check-out on request (subject to availability).", MAIN_MENU());
    if (/(wifi|wi-fi|internet)/.test(t)) return botSay("📶 Free Wi-Fi is available in all rooms and public areas.", MAIN_MENU());
    return waHuman(text);
  }

  // =====================================================================
  // ROOM SERVICE
  // =====================================================================
  function renderMenu() {
    const rooms = S.rooms.filter((r) => r.status === "occupied");
    const sel = $("#rsRoom");
    const prev = sel.value;
    sel.innerHTML = rooms.map((r) => `<option value="${r.no}">Room ${r.no}</option>`).join("");
    if (prev && rooms.some((r) => String(r.no) === prev)) sel.value = prev;
    $("#menu").innerHTML = Object.entries(MENU).map(([cat, items]) => `<h4>${cat}</h4>` + items.map((it) => {
      const q = S.cart[it.id] || 0;
      return `<div class="dish"><div><div class="name"><span class="veg${it.nonveg ? " nv" : ""}"></span>${it.name}</div><div class="price">${inr(it.price)}</div></div>
        <div class="qty">${q ? `<button data-dec="${it.id}">−</button><b>${q}</b><button data-inc="${it.id}">+</button>` : `<button class="add" data-inc="${it.id}">ADD</button>`}</div></div>`;
    }).join("")).join("");
    $$("[data-inc]", $("#menu")).forEach((b) => b.addEventListener("click", () => { S.cart[b.dataset.inc] = (S.cart[b.dataset.inc] || 0) + 1; renderMenu(); }));
    $$("[data-dec]", $("#menu")).forEach((b) => b.addEventListener("click", () => { S.cart[b.dataset.dec]--; if (!S.cart[b.dataset.dec]) delete S.cart[b.dataset.dec]; renderMenu(); }));
    const items = Object.entries(S.cart);
    const total = items.reduce((a, [id, q]) => a + ALL_DISHES.find((d) => d.id === id).price * q, 0);
    const n = items.reduce((a, [, q]) => a + q, 0);
    $("#cartBar").innerHTML = n ? `<span>${n} item${n > 1 ? "s" : ""} · <b>${inr(total)}</b><br><span class="small" style="opacity:.8">Added to room bill</span></span><button class="btn small" id="placeOrder">Place order →</button>` : `<span class="small">Scan QR in room → choose food → order. No phone call needed.</span>`;
    const po = $("#placeOrder");
    if (po) po.addEventListener("click", placeOrder);
  }
  function placeOrder() {
    const roomNo = +$("#rsRoom").value;
    const room = S.rooms.find((r) => r.no === roomNo);
    const lines = Object.entries(S.cart).map(([id, q]) => ({ d: ALL_DISHES.find((x) => x.id === id), q }));
    const total = lines.reduce((a, l) => a + l.d.price * l.q, 0);
    const o = { id: S.orderSeq++, room: roomNo, lines, total, state: "new", time: hhmm() };
    S.orders.unshift(o);
    room.bill += total;
    S.revenueToday += total;
    S.cart = {};
    log("🍽️", `Room service order #${o.id} from Room ${roomNo}: ${lines.map((l) => `${l.q}× ${l.d.name}`).join(", ")} · ${inr(total)} added to bill.`);
    toast(`Order #${o.id} sent to kitchen · ETA 25 min`);
    renderMenu(); renderKitchen();
  }
  function renderKitchen() {
    renderMenu();
    const card = (o) => `<div class="ticket" data-order="${o.id}"><b>#${o.id} · Room ${o.room}</b><div>${o.lines.map((l) => `${l.q}× ${esc(l.d.name)}`).join("<br>")}</div><div class="meta"><span>${o.time}</span><span>${inr(o.total)}</span></div></div>`;
    $("#kNew").innerHTML = S.orders.filter((o) => o.state === "new").map(card).join("") || `<div class="muted small">No new orders. Place one from the phone ←</div>`;
    $("#kPrep").innerHTML = S.orders.filter((o) => o.state === "prep").map(card).join("");
    $("#kDone").innerHTML = S.orders.filter((o) => o.state === "done").map(card).join("");
    $$(".ticket").forEach((t) => t.addEventListener("click", () => {
      const o = S.orders.find((x) => x.id === +t.dataset.order);
      if (o.state === "new") { o.state = "prep"; log("👨‍🍳", `Order #${o.id} being prepared. Guest notified on WhatsApp.`); }
      else if (o.state === "prep") { o.state = "done"; log("✅", `Order #${o.id} delivered to Room ${o.room}.`); }
      renderKitchen();
    }));
  }
  $("#rsRoom").addEventListener("change", renderMenu);

  // =====================================================================
  // HOUSEKEEPING
  // =====================================================================
  function renderHK() {
    $("#hkTasks").innerHTML = S.hk.length ? S.hk.map((t) => `
      <div class="task"><div class="rn">${t.room}</div>
        <div class="info"><b>Clean & prepare room</b><small>Assigned to ${t.staff} · since ${t.since}</small></div>
        <span class="status ${t.state === "prog" ? "prog" : ""}">${t.state === "prog" ? "In progress" : "Pending"}</span>
        ${t.state === "pending" ? `<button class="btn outline small" data-start="${t.room}">Start</button>` : `<button class="btn primary small" data-done="${t.room}">Mark clean</button>`}
      </div>`).join("") : `<p class="muted">All rooms are clean ✨. Check out a guest from the dashboard to see a task appear here.</p>`;
    $("#mtTasks").innerHTML = S.mt.length ? S.mt.map((t) => `
      <div class="task"><div class="rn mt">${t.room}</div>
        <div class="info"><b>${esc(t.issue)}</b><small>Assigned to Mohan · since ${t.since}</small></div>
        <button class="btn primary small" data-fix="${t.room}">Mark repaired</button>
      </div>`).join("") : `<p class="muted">No open repair tickets.</p>`;
    $$("[data-start]").forEach((b) => b.addEventListener("click", () => { S.hk.find((t) => t.room === +b.dataset.start).state = "prog"; log("🧹", `Cleaning started in Room ${b.dataset.start}.`); renderHK(); }));
    $$("[data-done]").forEach((b) => b.addEventListener("click", () => { completeClean(+b.dataset.done); renderHK(); }));
    $$("[data-fix]").forEach((b) => b.addEventListener("click", () => { completeRepair(+b.dataset.fix); renderHK(); }));
    const load = {};
    S.hk.forEach((t) => (load[t.staff] = (load[t.staff] || 0) + 1));
    load.Mohan = S.mt.length;
    $("#staff").innerHTML = STAFF.map((s) => `<div class="p"><div class="av">${s.name[0]}</div><div><b>${s.name}</b><br><span class="muted small">${s.role} · ${load[s.name] || 0} open task(s)</span></div></div>`).join("");
  }
  function completeClean(no) {
    S.hk = S.hk.filter((t) => t.room !== no);
    const r = S.rooms.find((x) => x.no === no);
    if (r.status === "dirty") r.status = "vacant";
    log("✨", `Room ${no} cleaned & inspected. Now <b>Ready</b> for next guest.`);
    toast(`Room ${no} is ready to sell`);
  }
  function completeRepair(no) {
    S.mt = S.mt.filter((t) => t.room !== no);
    const r = S.rooms.find((x) => x.no === no);
    if (r.status === "maintenance") r.status = "vacant";
    log("🔧", `Repair completed in Room ${no}.`);
    toast(`Room ${no} repaired`);
  }

  // =====================================================================
  // REVIEWS
  // =====================================================================
  function ratingAvg() {
    const r = S.ratings; let n = 0, s = 0;
    for (const k in r) { n += r[k]; s += k * r[k]; }
    return s / n;
  }
  function renderReviews() {
    $("#checkouts").innerHTML = S.checkouts.map((c, i) => `<li><span><b>${esc(c.name)}</b><br><span class="muted small">Room ${c.room}${c.done ? ` · rated ${c.rating}★` : ""}</span></span>${c.done ? `<span>${c.low ? "⚠️ Manager alerted" : "✅ Sent to Google"}</span>` : `<button class="btn primary small" data-fb="${i}">Send feedback request</button>`}</li>`).join("");
    $$("[data-fb]").forEach((b) => b.addEventListener("click", () => startFeedback(+b.dataset.fb)));

    const sel = $("#reviewPick");
    if (!sel.options.length) {
      sel.innerHTML = PUBLIC_REVIEWS.map((r, i) => `<option value="${i}">${"★".repeat(r.stars)} · ${r.who}</option>`).join("");
      sel.addEventListener("change", showReview);
      showReview();
    }
    const total = Object.values(S.ratings).reduce((a, b) => a + b, 0);
    $("#ratingSummary").innerHTML = `<div class="big-rating">${ratingAvg().toFixed(2)} <span class="stars">★</span></div><div class="muted small">${total} reviews</div>` +
      [5, 4, 3, 2, 1].map((k) => `<div class="rs-row">${k}★<div class="track"><div class="fill" style="width:${(S.ratings[k] / total) * 100}%"></div></div>${S.ratings[k]}</div>`).join("");
  }
  function showReview() {
    const r = PUBLIC_REVIEWS[+$("#reviewPick").value];
    $("#reviewText").innerHTML = `<span class="stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</span><br>${esc(r.text)}`;
    $("#draftOut").value = "";
  }
  $("#draftBtn").addEventListener("click", () => {
    const r = PUBLIC_REVIEWS[+$("#reviewPick").value];
    const name = r.who.split(" ")[0];
    const t = r.text.toLowerCase();
    const issues = [];
    if (t.includes("hot water")) issues.push("the hot water supply");
    if (t.includes("ac")) issues.push("the AC");
    if (t.includes("check-in")) issues.push("the delay at check-in");
    if (t.includes("not ready")) issues.push("the room not being ready on time");
    if (t.includes("breakfast")) issues.push("our breakfast options");
    let reply;
    if (r.stars >= 4) {
      reply = `Dear ${name},\n\nThank you for your kind words! We're glad you enjoyed being close to Dargah Sharif and found our team helpful.${issues.length ? ` We've noted your suggestion about ${issues.join(" and ")} and are working on it.` : ""}\n\nWe look forward to welcoming you back to Regal Hotel, Ajmer.\n\nWarm regards,\nManagement, Regal Hotel`;
    } else {
      reply = `Dear ${name},\n\nThank you for your honest feedback, and we're sorry about ${issues.length ? issues.join(" and ") : "your experience"}. This is not the standard we aim for. We have shared this with our team and ${issues.some((i) => i.includes("AC") || i.includes("hot water")) ? "the maintenance team has checked the room" : "we have updated our check-in process"}.\n\nWe would be happy to make it right on your next visit. Please contact us directly on WhatsApp.\n\nSincerely,\nManagement, Regal Hotel`;
    }
    const out = $("#draftOut");
    out.value = "";
    let i = 0;
    clearInterval(out._t);
    out._t = setInterval(() => { out.value = reply.slice(0, (i += 6)); if (i >= reply.length) clearInterval(out._t); }, 15);
  });

  const fbChat = $("#fbChat"), fbQuick = $("#fbQuick");
  function fbMsg(who, html) {
    const d = document.createElement("div");
    d.className = "msg " + who;
    d.innerHTML = html + (who === "sys" ? "" : `<span class="t">${hhmm()}</span>`);
    fbChat.appendChild(d); fbChat.scrollTop = fbChat.scrollHeight;
  }
  function fbSetQuick(list) {
    fbQuick.innerHTML = "";
    list.forEach((q) => { const b = document.createElement("button"); b.textContent = q.label; b.addEventListener("click", () => { fbMsg("user", esc(q.label)); fbQuick.innerHTML = ""; setTimeout(q.fn, 500); }); fbQuick.appendChild(b); });
  }
  function startFeedback(i) {
    const c = S.checkouts[i];
    fbChat.innerHTML = "";
    $("#fbGuestLabel").textContent = "Chat with " + c.name;
    fbMsg("sys", "⏰ Sent automatically 2 hours after check-out");
    fbMsg("bot", `Dear ${esc(c.name)}, thank you for staying at <b>Regal Hotel, Ajmer</b> 🙏\n\nHow was your stay? Please rate us:`);
    fbSetQuick([5, 4, 3, 2, 1].map((s) => ({ label: "⭐".repeat(s), fn: () => fbRated(c, s) })));
  }
  function fbRated(c, s) {
    c.rating = s;
    S.ratings[s]++;
    if (s >= 4) {
      fbMsg("bot", `Shukriya! 😊 We're so happy you enjoyed your stay.\n\nCould you take 30 seconds to share this on Google? It really helps other pilgrims and travellers find us.\n\n<span style="color:#2563eb;text-decoration:underline">⭐ Write a Google review</span>`);
      fbSetQuick([{ label: "Opened Google review link", fn: () => { fbMsg("sys", "✅ Guest opened the Google review page"); c.done = true; log("⭐", `<b>${esc(c.name)}</b> rated ${s}★ and was sent to Google Reviews.`); renderReviews(); } }]);
    } else {
      fbMsg("bot", "We're sorry your stay was not perfect. 😔 What went wrong?");
      fbSetQuick(["Room cleanliness", "AC / hot water", "Staff behaviour", "Food", "Noise", "Check-in delay"].map((p) => ({ label: p, fn: () => {
        c.done = true; c.low = true;
        fbMsg("bot", `Thank you for telling us. Our manager has been informed and will call you within 30 minutes to make this right.`);
        log("⚠️", `<b>Low rating alert:</b> ${esc(c.name)} (Room ${c.room}) gave ${s}★ · "${p}". Manager notified on WhatsApp.`);
        toast("⚠️ Manager alerted privately. Not posted publicly.");
        renderReviews();
      } })));
    }
    renderReviews();
  }

  // =====================================================================
  // PRICING CALENDAR
  // =====================================================================
  function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function endOfDay(d) { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; }
  function dayInfo(d) {
    const base = ROOM_TYPES.Deluxe.rate;
    const ev = EVENTS.find((e) => d >= startOfDay(e.from) && d <= endOfDay(e.to));
    const dow = d.getDay();
    const weekend = dow === 4 || dow === 5 || dow === 6; // Thu (Jumeraat), Fri (Jumma), Sat
    let cls = "normal", mult = 1, reason = "Normal demand";
    if (weekend) { cls = "weekend"; mult = 1.15; reason = dow === 4 ? "Thursday (Jumeraat): high Dargah footfall" : dow === 5 ? "Friday (Jumma)" : "Saturday"; }
    if (ev) { cls = ev.key; mult = ev.mult * (weekend ? 1.1 : 1); reason = ev.name + (weekend ? " + weekend" : ""); }
    return { cls, mult, reason, rate: Math.round((base * mult) / 50) * 50 };
  }
  function renderCalendar() {
    const start = startOfDay(now());
    const cal = $("#calendar");
    let html = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<div class="dow">${d}</div>`).join("");
    for (let i = 0; i < start.getDay(); i++) html += `<div class="cday empty"></div>`;
    for (let i = 0; i < 60; i++) {
      const d = addDays(start, i);
      const info = dayInfo(d);
      const key = d.toDateString();
      html += `<div class="cday ${info.cls} ${S.approved.has(key) ? "approved" : ""}" data-i="${i}"><span class="d">${d.getDate()} ${d.getDate() === 1 || i === 0 ? d.toLocaleDateString("en-IN", { month: "short" }) : ""}</span><span class="r">${inr(info.rate)}</span></div>`;
    }
    cal.innerHTML = html;
    $$(".cday[data-i]").forEach((c) => c.addEventListener("click", () => dateDetail(addDays(start, +c.dataset.i))));
    $("#baseRates").innerHTML = Object.values(ROOM_TYPES).map((t) => `<div class="rate-row"><span>${t.label}</span><b>${inr(t.rate)}</b></div>`).join("") +
      `<div class="rate-row"><span>Thu / Fri / Sat</span><b>+15%</b></div><div class="rate-row"><span>Pushkar Mela</span><b>+30%</b></div><div class="rate-row"><span>Urs Sharif</span><b>+100%</b></div>
       <div class="actions" style="margin-top:12px"><button class="btn gold small" id="approveAll">✔ Approve all 60 days & push</button></div>`;
    $("#approveAll").addEventListener("click", () => {
      for (let i = 0; i < 60; i++) S.approved.add(addDays(start, i).toDateString());
      log("📈", "Rates for next 60 days approved and pushed to Booking.com, MakeMyTrip, Goibibo, Agoda and WhatsApp bot.");
      toast("Rates pushed to all booking channels (simulated)");
      renderCalendar();
    });
  }
  function dateDetail(d) {
    const info = dayInfo(d);
    const key = d.toDateString();
    const rows = Object.entries(ROOM_TYPES).map(([k, t]) => `<div class="rate-row"><span>${t.label}</span><span><s class="muted">${inr(t.rate)}</s> → <b>${inr(Math.round((t.rate * info.mult) / 50) * 50)}</b></span></div>`).join("");
    $("#dateDetail").innerHTML = `<h3 style="margin:0">${d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</h3>
      <p class="muted">${info.reason} · multiplier ×${info.mult.toFixed(2)}</p>${rows}
      <div class="actions" style="margin-top:12px">${S.approved.has(key) ? `<span class="pill">✅ Approved & live</span>` : `<button class="btn primary small" id="approveOne">Approve & push to all channels</button>`}</div>`;
    const b = $("#approveOne");
    if (b) b.addEventListener("click", () => {
      S.approved.add(key);
      log("📈", `Rates for ${fmtDate(d)} pushed to all channels (Deluxe ${inr(info.rate)}).`);
      toast("Rate updated on Booking.com, MakeMyTrip, Agoda, Goibibo");
      renderCalendar(); dateDetail(d);
    });
  }

  // =====================================================================
  // LIVE TICKER (simulated background events)
  // =====================================================================
  function tick() {
    const vac = S.rooms.filter((r) => r.status === "vacant");
    const roll = Math.random();
    if (roll < 0.4 && vac.length > 4) {
      const r = pick(vac), ota = pick(OTAS), g = pick(GUEST_NAMES);
      r.status = "reserved"; r.guest = g;
      const key = ota === "MakeMyTrip" || ota === "Goibibo" ? "MakeMyTrip / Goibibo" : ota;
      S.sources[key]++;
      log("🌐", `${ota} booking: ${g} → Room ${r.no}. Availability synced on all other sites.`);
    } else if (roll < 0.6) {
      log("💬", `WhatsApp bot answered "${pick(["room rate kya hai?", "parking hai?", "dargah kitni door hai?", "check-in time?", "is breakfast included?"])}" in 2 sec.`);
    } else if (roll < 0.75) {
      const occ = S.rooms.filter((r) => r.status === "occupied");
      if (occ.length) { const r = pick(occ); const amt = pick([80, 140, 260, 320]); r.bill += amt; S.revenueToday += amt; log("🍽️", `QR order from Room ${r.no} · ${inr(amt)} added to bill.`); }
    }
    if ($("#view-dashboard").classList.contains("active")) renderDashboard();
  }

  // =====================================================================
  // INIT / RESET
  // =====================================================================
  function init() {
    S = freshState();
    log("🔔", "System started. WhatsApp bot, channel sync and housekeeping automation are running.");
    log("🌐", "Booking.com booking: Mr. Rizvi → Room 204. Availability synced on all other sites.");
    log("💬", 'WhatsApp bot answered "dargah kitni door hai?" in 2 sec.');
    waChat.innerHTML = "";
    waMsg("sys", "Guest opens WhatsApp · Today");
    waGreet();
    renderWaBookings();
    fbChat.innerHTML = `<div class="empty-chat">Select a checked-out guest on the right →</div>`;
    fbQuick.innerHTML = "";
    $("#reviewPick").innerHTML = "";
    show("dashboard");
  }
  $("#resetBtn").addEventListener("click", () => { init(); toast("Demo reset"); });

  init();
  setInterval(tick, 15000);
})();
