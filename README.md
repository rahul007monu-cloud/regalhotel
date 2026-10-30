# Regal Hotel, Ajmer – Website, Automation Demo & Proposal

**Live link (GitHub Pages on hone ke baad):** https://rahul007monu-cloud.github.io/regalhotel/
- Website: `/website/`
- Automation demo: `/demo/`
- Proposal PDF: `/proposal/Regal-Hotel-Automation-Proposal.pdf`

```
regalhotel/
├── index.html                                 ← landing page (teeno ke links)
├── website/                                   ← hotel ki website (English + Hindi)
│   ├── index.html                             ← home: hero, booking bar, rooms, restaurant, Urs, reviews, map, FAQ, contact
│   ├── rooms.html                             ← rooms + price calculator + "Confirm on WhatsApp"
│   ├── ajmer-guide.html                       ← Dargah ziyarat tips, Urs, ghoomne ki jagah, kaise pahunchein
│   └── assets/
│       ├── config.js                          ← ⚙️ phone, WhatsApp number, rates, Urs/Pushkar dates YAHAN badlein
│       ├── site.js                            ← Hindi translation, WhatsApp links, booking calculator
│       └── site.css
├── demo/                                      ← automation demo (dashboard, bot, room service, housekeeping, reviews, pricing)
├── proposal/
│   ├── Regal-Hotel-Automation-Proposal.pdf   ← client ko bhejne wala PDF (9 pages, A4)
│   └── proposal.html                          ← editable source
└── DEMO_SCRIPT.md                             ← meeting mein kya dikhana aur bolna hai
```

## Website
- **Do bhasha:** upar "हिंदी / English" button. Choice browser mein yaad rehti hai.
- **Booking:** guest dates, room aur guests chunta hai. Rate × nights, Urs/Pushkar Mela ka peak rate, OTA se bachat aur 30% advance apne aap calculate hote hain. "Confirm on WhatsApp" dabane par saari details WhatsApp message mein bhar jaati hain.
- **SEO:** har page ka title/description "hotel near Ajmer Dargah" jaise searches ke hisaab se, aur Google ke liye Hotel schema (JSON-LD).
- **Mobile:** neeche WhatsApp aur Call ke floating buttons.
- **Design:** royal maroon-gold theme, crown logo, Cinzel font.
- **Hero:** asli photos ka slideshow (room, Ana Sagar, Riviera ka khana) jo dheere zoom hota hai, aur saath mein ghoomta hua 3D "REGAL HOTEL" crest (crown, ★★★, sunehra border) jo mouse ke saath jhukta hai.
- **3D effects:** 360° rooms carousel (photos ke saath), flip cards, 3D tilt cards, restaurant ka 3D photo collage, scroll par reveal, scroll progress bar. "Reduce motion" setting par animation band.
- **Photos:** rooms aur khaane ki photos Unsplash se (free license), Ajmer ki jagahon ki photos Wikimedia Commons se. Credits Ajmer Guide page ke neeche aur `assets/commons-credits.json` mein hain.

### Live karne se pehle (sab `website/assets/config.js` mein)
- `whatsapp`: hotel ka WhatsApp number, jaise `"919876543210"`. Khaali rehne par WhatsApp khulta hai aur contact khud chunna padta hai.
- `phone`: abhi +91 145 242 4058 hai (Kayak listing se). Hotel se confirm karein. `email` optional hai.
- `rooms`: asli rates. `direct` = website rate, `ota` = Booking.com/MMT par jo dikhta hai.
- `events`: har saal Urs aur Pushkar Mela ki dates.

Iske alawa:
- **Photos:** rooms aur restaurant ki photos stock (Unsplash) hain, Regal Hotel ki nahi. Live karne se pehle `assets/img/` mein hotel ki asli photos usi naam se rakh dein.
- **Reviews:** teeno reviews demo ke liye likhe gaye hain. Live karne se pehle Google/Booking.com ke asli reviews lagayein.
- **Domain:** jaise `regalhotelajmer.com`, GitHub Pages ya Netlify se joda ja sakta hai.

## Demo kaise chalayein
- `demo/index.html` ya `website/index.html` ko Chrome/Edge mein kholein. Install ki zaroorat nahi.
- Automation demo ka data sample hai. **Reset demo** se sab fresh ho jaata hai.

## Proposal bhejne se pehle
`proposal.html` mein peele highlight wale placeholders: `[Your Company Name]`, `[Your Name]`, `[Phone]`, `[Email]`. Prices (Section 08) aur ROI (Section 09) check karein.
Badlav ke baad Chrome mein kholein → **Ctrl+P** → *Save as PDF* → **Background graphics ON**.

## Facts ka source
Hotel ki details (lagbhag 48 rooms, Dargah Sharif se ~400 m, station se ~1 km, Riviera Restaurant, 24-hr room service, free Wi-Fi/parking) public listings se hain (Booking.com, Hotels.com, Agoda). Owner se confirm karein. Doori (distances) aur Urs/Pushkar Mela 2026 ki dates lagbhag hain.
