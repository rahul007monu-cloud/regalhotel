# Demo Script – Regal Hotel Owner Meeting (15–20 min)

Laptop par `demo/index.html` pehle se khol kar rakhein aur **Reset demo** daba dein.

---

## 1. Owner Dashboard (2 min)
**Bolein:** "Sir, ye aapka poora hotel ek screen par hai, mobile par bhi khulega."
- Upar ke cards dikhayein: occupancy, aaj ke arrivals, revenue, direct bookings %, rating.
- 48 rooms ka colour map: laal = occupied, neela = aaj aane wale, hara = ready, peela = safai, grey = repair.
- **"Preview daily WhatsApp report"** dabayein: "Ye har raat 10 baje aapke WhatsApp par automatic aayega. Desk par phone karne ki zaroorat nahi."
- Right side "Live activity" dikhayein. Har 15 second mein naya event aata hai (OTA booking, bot reply).

## 2. WhatsApp Booking Bot (5 min) – sabse important
**Bolein:** "Raat 11 baje koi zaireen WhatsApp karta hai. Abhi shayad koi reply nahi karta. Ab dekhiye."
1. **🛏️ Book a room** → **Tomorrow** → **2 nights** → **1–2 guests**
2. Bot live availability aur total price dikhata hai. Ek room chunein.
3. Owner se naam poochh kar type karwayein (isse unka involvement badhta hai).
4. **💳 Pay (simulate)** → Booking ID aata hai.
5. **Dashboard** par jaakar dikhayein: ek room abhi neela (arriving) ho gaya hai. "Ye room Booking.com, MakeMyTrip par bhi automatic band ho jayega. Overbooking khatam."
6. Wapas WhatsApp → **⏩ Simulate day-before reminder**: ID upload aur pickup offer.
7. Type karein: `dargah kitni door hai` → bot jawab deta hai.
8. Type karein: `can I bring my pet?` → bot reception ko hand-over karta hai. "Jo bot nahi jaanta, wo staff ko jaata hai."

**Paisa wali baat:** "Har booking jo OTA se WhatsApp par shift hoti hai, us par 15–20% commission bachta hai. 100 room nights ka matlab ~₹40,000 mahina."

## 3. QR Room Service (2 min)
- Room select karein, 2× Dal Baati Churma + Chai add karein → **Place order**.
- Right side kitchen screen par order aata hai. Card par click karein: New → Preparing → Delivered.
- "Bill automatic room mein jud gaya. Koi order miss nahi, koi item unbilled nahi."

## 4. Housekeeping (2 min)
- Dashboard par ek laal room par click → **Check-out guest**.
- Housekeeping tab: naya cleaning task, sabse kam busy staff ko automatic assign.
- **Start → Mark clean** → dashboard par room hara (ready).
- Dashboard par hare room → **Raise repair ticket** → AC: "Mohan ko WhatsApp par turant chala gaya."

## 5. Reviews (3 min)
- Check-out wale guest par **Send feedback request**.
- Pehle 5★ dein → guest ko Google review link milta hai.
- Doosre guest ko 2★ dein → reason chunein → "Ye public nahi gaya. Manager ko alert gaya, wo 30 min mein call karega."
- Neeche Neha S. (3★) ka review chunein → **✨ Draft reply** → "Manager bas check karke post kare."

## 6. Event Pricing (2 min)
- Calendar mein Pushkar Mela (peela) aur Urs (grey) ke din dikhayein. Rates apne aap zyada.
- Urs ka koi din click → **Approve & push** → "Ek click, sab websites par rate update."

## 7. Hotel Website (3 min)
`website/index.html` kholein.
**Bolein:** "Sir, abhi koi Google par 'hotel near Ajmer Dargah' search karta hai to use sirf Booking.com aur MakeMyTrip milte hain. Aapki apni website hogi to guest seedha aapse book karega."
- Upar **हिंदी** button dabakar poori site Hindi mein dikhayein.
- Booking bar mein Urs ki date (December) aur 4 guests daalein → **Check rates**.
- Rooms page par price summary dikhayein: Urs rate apne aap, "booking sites par itna, aapse itna", bachat aur advance.
- Naam aur mobile bharkar **Confirm on WhatsApp** → saari details WhatsApp message mein bhar jaati hain.
- **Ajmer Guide** page: "Ziyarat tips aur Urs ki jaankari wale pages Google par traffic laate hain."
- Mobile par khol kar WhatsApp/Call button dikhayein.

## 8. Proposal par aayein (3 min)
- PDF kholein, Section 08 (packages) aur 09 (ROI).
- **Growth package recommend karein.**
- Close: "Phase 1 teen hafte mein live, Pushkar Mela aur Urs se pehle. Kya hum is hafte kick-off rakh lein?"

---

### Owner ke common sawal
| Sawal | Jawab |
|---|---|
| Hamara WhatsApp number badalna padega? | Nahi, wahi hotel number WhatsApp Business API par shift ho sakta hai (phone wala WhatsApp app us number par band ho jaata hai, isliye chahein to naya number bhi le sakte hain). |
| Staff ko chalana aayega? | Training Hindi mein, sab mobile se chalta hai. Screens bahut simple hain. |
| Guest ka ID data safe hai? | Encrypted storage, sirf authorized staff access, DPDP Act 2023 ke hisaab se. |
| Paisa kiske account mein aayega? | Seedha hotel ke bank account mein (Razorpay/Cashfree). |
| Pehle se software hai to? | Usi ke saath jod denge; naya lena zaroori nahi. |
