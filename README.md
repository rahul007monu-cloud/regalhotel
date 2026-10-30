# Regal Hotel, Ajmer – Automation Proposal & Demo

**Live link:** https://rahul007monu-cloud.github.io/regalhotel/ (demo: `/demo/`, proposal PDF: `/proposal/Regal-Hotel-Automation-Proposal.pdf`)

```
regalhotel/
├── index.html                                 ← landing page (demo + proposal links)
├── proposal/
│   ├── Regal-Hotel-Automation-Proposal.pdf   ← client ko bhejne wala PDF (9 pages, A4)
│   └── proposal.html                          ← editable source (browser mein khol kar Ctrl+P → Save as PDF)
├── demo/
│   ├── index.html                             ← clickable demo (double-click karke Chrome mein kholein)
│   ├── styles.css
│   └── app.js
└── DEMO_SCRIPT.md                             ← meeting mein demo kaise dikhana hai (step by step)
```

## Demo kaise chalayein
- `demo/index.html` ko Chrome/Edge mein kholein. Internet, server ya install ki zaroorat nahi.
- Sab data sample hai aur browser memory mein rehta hai. **Reset demo** button se sab fresh ho jata hai.
- Owner ko bhejna ho to `demo` folder ko Netlify Drop (app.netlify.com/drop) ya GitHub Pages par free host kar sakte hain.

## Proposal bhejne se pehle zaroor badlein
`proposal.html` mein peele (yellow) highlight wale placeholders:
- `[Your Company Name]`, `[Your Name]`, `[Phone]`, `[Email]`
- Package prices (Section 08) aur ROI assumptions (Section 09) apne hisaab se check karein.

Badlav ke baad `proposal.html` Chrome mein kholein → **Ctrl+P** → Destination: *Save as PDF* → **More settings → Background graphics ON** → Save.

## Facts ka source
Hotel ki details (lagbhag 48 rooms, Dargah Sharif se ~400 m, station se ~1 km, Riviera Restaurant, 24-hr room service, free Wi-Fi/parking) public listings se li gayi hain (Booking.com, Hotels.com, Agoda). Meeting mein owner se confirm karein.
Urs aur Pushkar Mela 2026 ki dates demo mein approximate hain (lunar calendar).
