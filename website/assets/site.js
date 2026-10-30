/* Regal Hotel website – language switch, WhatsApp links and booking calculator */
(() => {
  "use strict";
  const H = window.HOTEL;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

  // ---------------- Hindi translations ----------------
  const HI = {
    "top.addr": "गुरुद्वारा के सामने, दरगाह रोड, गंज, अजमेर 305001",
    "crest.addr": "दरगाह रोड, अजमेर शरीफ़", "crest.c1": "दरगाह तक", "crest.c2": "रिसेप्शन", "crest.c3": "रेस्टोरेंट",
    "cap.0": "आरामदायक AC कमरे", "cap.1": "अजमेर · आना सागर झील, ~3 किमी", "cap.2": "रिवेरा रेस्टोरेंट · घर जैसा खाना", "cap.3": "ज़ियारत के बाद सुकून भरा आराम",
    "ct.time": "चेक-इन / चेक-आउट", "ct.timev": "दोपहर 12 बजे · सामान रखने की सुविधा",
    "ft.credits": "फ़ोटो क्रेडिट", "cr.title": "फ़ोटो क्रेडिट", "cr.uns": "कमरे, रेस्टोरेंट और खाने की फ़ोटो: Unsplash (Unsplash License)।",
    "top.desk": "24 घंटे रिसेप्शन · चेक-इन दोपहर 12 बजे",
    "logo.sub": "दरगाह रोड · अजमेर",
    "nav.home": "होम", "nav.rooms": "कमरे और किराया", "nav.guide": "अजमेर गाइड", "nav.location": "लोकेशन", "nav.contact": "संपर्क", "nav.book": "अभी बुक करें",
    "hero.eyebrow": "दरगाह रोड · अजमेर शरीफ़",
    "hero.title": "शाही ठहराव, दरगाह शरीफ़ से बस कुछ कदम दूर।",
    "hero.lead": "साफ़ AC कमरे, रिवेरा रेस्टोरेंट का घर जैसा खाना और 24 घंटे जागती टीम, ज़ायरीन, परिवारों और यात्रियों के लिए।",
    "chip.dargah": "दरगाह से ~400 मीटर", "chip.station": "रेलवे स्टेशन से 1 किमी", "chip.food": "रिवेरा रेस्टोरेंट", "chip.parking": "फ्री पार्किंग",
    "hero.wa": "WhatsApp पर बुक करें", "hero.rooms": "कमरे और किराया देखें",
    "bb.checkin": "चेक-इन", "bb.nights": "रातें", "bb.guests": "मेहमान", "bb.btn": "किराया देखें →",
    "why.eyebrow": "मेहमान हमें क्यों चुनते हैं", "why.title": "सब कुछ पास में, कोई फ़िक्र नहीं",
    "why.1": "पैदल दरगाह शरीफ़", "why.2": "अजमेर रेलवे स्टेशन से", "why.3": "रिसेप्शन और रूम सर्विस", "why.4b": "फ्री", "why.4": "Wi-Fi और कार पार्किंग",
    "rooms.eyebrow": "कमरे", "rooms.title": "हर ग्रुप के लिए आरामदायक AC कमरे", "rooms.sub": "हमारी वेबसाइट या WhatsApp से सीधे बुक करें और बुकिंग साइट्स से कम दाम पाएँ।",
    "r.popular": "सबसे किफ़ायती", "ph": "यहाँ होटल की फ़ोटो", "r.std": "स्टैंडर्ड AC रूम", "a.double": "डबल बेड", "a.hot": "गर्म पानी", "night": "रात",
    "direct": "✓ सीधे बुक करने पर सबसे कम दाम", "select": "यह कमरा चुनें", "r.most": "सबसे ज़्यादा बुक", "r.dlx": "डीलक्स AC रूम", "a.big": "बड़ा कमरा", "a.seat": "बैठने की जगह",
    "r.fam": "परिवारों के लिए", "r.family": "फ़ैमिली रूम (4 तक)", "a.2beds": "2 बेड", "a.4g": "4 मेहमान",
    "food.eyebrow": "रिवेरा रेस्टोरेंट", "food.title": "होटल से बाहर गए बिना नाश्ता, लंच और डिनर",
    "food.text": "हमारे इन-हाउस रेस्टोरेंट में नॉर्थ इंडियन, मुग़लई और राजस्थानी खाना मिलता है, और मेहमानों के लिए 24 घंटे रूम सर्विस है।",
    "food.1": "दाल बाटी चूरमा, बिरयानी, कोरमा और शुद्ध शाकाहारी विकल्प", "food.2": "फ़ज्र और सुबह की ज़ियारत के लिए जल्दी नाश्ता और चाय", "food.3": "कमरे से QR कोड स्कैन करके ऑर्डर करें", "food.btn": "मेन्यू के बारे में पूछें",
    "urs.title": "उर्स शरीफ़ 2026 में आ रहे हैं?", "urs.text": "उर्स से कई हफ़्ते पहले दरगाह के पास के कमरे भर जाते हैं। WhatsApp पर थोड़ा एडवांस देकर अभी कमरा पक्का करें।", "urs.btn": "उर्स के लिए बुक करें",
    "rev.eyebrow": "मेहमानों की राय", "rev.title": "हमारे मेहमान क्या कहते हैं", "rev.note": "डेमो लेआउट: यहाँ Google के असली रिव्यू दिखेंगे।",
    "rev.1": "\"हम कुछ ही मिनट में पैदल दरगाह पहुँच गए। कमरा साफ़ था और स्टाफ़ ने हर चीज़ में मदद की।\"",
    "rev.2": "\"परिवार के लिए बहुत सुविधाजनक। रेस्टोरेंट का खाना स्वादिष्ट था और रूम सर्विस जल्दी थी।\"",
    "rev.3": "\"स्टेशन के पास, पार्किंग उपलब्ध और पैसे के हिसाब से अच्छा।\"",
    "loc.eyebrow": "लोकेशन", "loc.title": "अजमेर के बीचों-बीच, दरगाह रोड पर", "loc.dargah": "दरगाह शरीफ़", "loc.walk": "पैदल दूरी", "loc.adhai": "अढ़ाई दिन का झोंपड़ा",
    "loc.station": "अजमेर जंक्शन रेलवे स्टेशन", "loc.auto": "ऑटो से 5 मिनट", "loc.ana": "आना सागर झील", "loc.car": "कार से 10 मिनट", "loc.pushkar": "पुष्कर", "loc.pcar": "कार से 30–40 मिनट",
    "loc.air": "किशनगढ़ एयरपोर्ट", "loc.acar": "कार से 40–50 मिनट", "loc.approx": "दूरी अनुमानित है।",
    "faq.title": "अक्सर पूछे जाने वाले सवाल",
    "faq.q1": "चेक-इन और चेक-आउट का समय क्या है?", "faq.a1": "चेक-इन और चेक-आउट दोपहर 12 बजे है। जल्दी चेक-इन या देर से चेक-आउट उपलब्धता के अनुसार हो सकता है।",
    "faq.q2": "चेक-इन पर कौन-सा ID चाहिए?", "faq.a2": "हर वयस्क मेहमान के लिए वैध सरकारी फ़ोटो ID (आधार, वोटर ID, ड्राइविंग लाइसेंस या पासपोर्ट)। विदेशी मेहमानों के लिए पासपोर्ट और वैध वीज़ा।",
    "faq.q3": "होटल दरगाह शरीफ़ से कितनी दूर है?", "faq.a3": "लगभग 400 मीटर, दरगाह रोड पर थोड़ी-सी पैदल दूरी।",
    "faq.q4": "क्या पार्किंग है?", "faq.a4": "हाँ, मेहमानों के लिए होटल में फ्री पार्किंग है।",
    "faq.q5": "क्या एडवांस देना ज़रूरी है?", "faq.a5": "थोड़ा एडवांस देने से कमरा पक्का हो जाता है, ख़ासकर उर्स, पुष्कर मेला और वीकेंड पर। बाक़ी पैसा चेक-इन पर।",
    "faq.q6": "क्या उर्स में किराया ज़्यादा होता है?", "faq.a6": "हाँ, उर्स और पुष्कर मेले में बहुत भीड़ होती है। अपनी तारीख़ों का सही किराया जानने के लिए WhatsApp करें।",
    "ct.eyebrow": "संपर्क", "ct.title": "हम WhatsApp पर कुछ ही मिनट में जवाब देते हैं", "ct.addr": "पता", "ct.phone": "फ़ोन (24 घंटे)", "ct.chat": "हमसे चैट करें", "ct.form": "पूछताछ भेजें",
    "f.name": "आपका नाम", "f.phone": "मोबाइल नंबर", "f.msg": "संदेश", "f.msgph": "तारीख़ें, मेहमानों की संख्या, कोई ख़ास ज़रूरत", "f.send": "WhatsApp पर भेजें",
    "ft.about": "दरगाह शरीफ़ से कुछ कदम दूर, आरामदायक और किफ़ायती ठहराव।", "ft.explore": "देखें", "ft.guests": "मेहमानों के लिए", "ft.urs": "उर्स की जानकारी", "ft.reach": "संपर्क करें", "ft.dir": "रास्ता देखें", "ft.demo": "वेबसाइट डेमो · किराया और फ़ोटो सैंपल हैं",
    // 3D sections
    "why.1bk": "फ़ज्र, जुम्मा और हर ज़ियारत के लिए पैदल जाएँ। टैक्सी की ज़रूरत नहीं।",
    "why.2bk": "ऑटो से 5 मिनट। हम स्टेशन पिकअप का इंतज़ाम कर सकते हैं।",
    "why.3bk": "देर रात पहुँचना हो या सुबह की ट्रेन? रिसेप्शन पर हमेशा कोई मौजूद है।",
    "why.4bk": "कमरों में फ्री Wi-Fi और आपकी कार के लिए सुरक्षित पार्किंग।",
    "flip.hint": "ज़्यादा जानने के लिए कार्ड पर टैप करें",
    "tour.eyebrow": "3D में देखें", "tour.title": "रीगल होटल का 360° टूर करें", "tour.sub": "ड्रैग, स्वाइप या तीरों का इस्तेमाल करें। खोलने के लिए सामने वाले कार्ड पर टैप करें।",
    "tour.from": "शुरुआत", "tour.inhouse": "होटल के अंदर", "tour.near": "पास में", "tour.trip": "एक दिन की सैर",
    "tour.foods": "बिरयानी, दाल बाटी और 24 घंटे रूम सर्विस", "tour.dargahs": "होटल से ~400 मीटर पैदल", "tour.pushs": "~15 किमी, टैक्सी उपलब्ध",
    // rooms page
    "rp.title": "कमरे और किराया", "rp.sub": "सभी कमरे AC हैं, TV, Wi-Fi, अटैच्ड बाथरूम और 24 घंटे गर्म पानी के साथ। सबसे कम दाम के लिए सीधे बुक करें।",
    "rp.std": "कपल और अकेले यात्रियों के लिए साफ़, आरामदायक कमरा।", "a.max2": "2 मेहमान तक", "rp.dlx": "बैठने की जगह के साथ ज़्यादा जगह। एक अतिरिक्त मेहमान आ सकता है।", "a.max3": "3 मेहमान तक",
    "rp.fam": "एक साथ दरगाह आने वाले परिवारों और छोटे ग्रुप के लिए दो बेड।",
    "bk.eyebrow": "सीधे बुक करें", "bk.title": "1 मिनट में किराया देखें और बुक करें", "bk.sub": "अपनी तारीख़ें भरें। हम WhatsApp पर तुरंत कमरा पक्का करते हैं।",
    "bk.form": "आपका ठहराव", "bk.room": "कमरे का प्रकार", "bk.out": "चेक-आउट", "bk.rooms": "कमरे", "bk.req": "ख़ास ज़रूरत (वैकल्पिक)", "bk.reqph": "जल्दी चेक-इन, स्टेशन पिकअप, ग्राउंड फ़्लोर…",
    "bk.send": "WhatsApp पर पक्का करें", "bk.how": "आपकी बुकिंग की जानकारी WhatsApp में खुलेगी। संदेश भेजें, हमारी टीम कमरा पक्का करके एडवांस पेमेंट लिंक भेजेगी।",
    "bk.sum": "किराये का हिसाब", "bk.dates": "तारीख़ें", "bk.nightsrooms": "रातें × कमरे", "bk.ota": "बुकिंग साइट्स पर दाम", "bk.total": "आपका सीधा दाम", "bk.save": "आपकी बचत",
    "bk.final": "अंतिम किराया होटल द्वारा पक्का किया जाएगा। टैक्स लागू अनुसार।",
    "pol.title": "होटल के नियम", "pol.time": "समय", "pol.t1": "चेक-इन: दोपहर 12 बजे", "pol.t2": "चेक-आउट: दोपहर 12 बजे", "pol.t3": "अनुरोध पर जल्दी चेक-इन / देर से चेक-आउट", "pol.t4": "चेक-इन से पहले और चेक-आउट के बाद सामान रखने की सुविधा",
    "pol.id": "ID और पेमेंट", "pol.i1": "हर वयस्क मेहमान के लिए वैध फ़ोटो ID", "pol.i2": "विदेशी मेहमान: पासपोर्ट और वीज़ा", "pol.i3": "UPI, कार्ड और नकद स्वीकार", "pol.i4": "कैंसलेशन की शर्तें बुकिंग के समय बताई जाएँगी",
    // guide page
    "g.title": "अजमेर ज़ियारत और यात्रा गाइड", "g.sub": "दरगाह शरीफ़ और अजमेर शहर की सुकून भरी यात्रा के लिए ज़रूरी जानकारी।",
    "g.d.eyebrow": "दरगाह शरीफ़", "g.d.title": "ख़्वाजा मोईनुद्दीन चिश्ती (र.अ.) की दरगाह",
    "g.d.text": "हज़रत ख़्वाजा मोईनुद्दीन चिश्ती, जिन्हें ख़्वाजा ग़रीब नवाज़ कहा जाता है, की दरगाह दक्षिण एशिया की सबसे ज़्यादा देखी जाने वाली दरगाहों में से एक है। हर धर्म के लोग यहाँ दुआ, चादर और फूल चढ़ाने आते हैं। रीगल होटल लगभग 400 मीटर दूर है, इसलिए आप हर नमाज़ के लिए पैदल दरगाह जा सकते हैं।",
    "g.tips": "ज़ियारत के लिए सुझाव",
    "g.t1": "दरगाह के अंदर सिर ढकें। टोपी और दुपट्टे बाहर मिलते हैं।", "g.t2": "सादे कपड़े पहनें। जूते गेट के पास जूता-स्टैंड पर रखे जाते हैं।",
    "g.t3": "फ़ोन, पर्स और बैग संभाल कर रखें; गलियों में बहुत भीड़ होती है।", "g.t4": "चादर और फूल रास्ते की दुकानों से मिलते हैं। पहले दाम तय कर लें।",
    "g.t5": "गुरुवार शाम और शुक्रवार को सबसे ज़्यादा भीड़ होती है। सुबह जल्दी शांति रहती है।", "g.t6": "समय मौसम के हिसाब से बदलता है। हमारा रिसेप्शन आपको मौजूदा समय बताएगा।",
    "g.u.eyebrow": "उर्स शरीफ़", "g.u.title": "उर्स के दौरान यात्रा",
    "g.u.text": "उर्स ख़्वाजा ग़रीब नवाज़ की पुण्यतिथि है और हर साल इस्लामी महीने रजब में मनाया जाता है। इन दिनों लाखों ज़ायरीन अजमेर आते हैं, इसलिए दरगाह के पास के होटल हफ़्तों पहले भर जाते हैं।",
    "g.u.1b": "जल्दी बुक करें", "g.u.1": "उर्स से 4–6 हफ़्ते पहले थोड़ा एडवांस देकर बुक करें।", "g.u.2b": "पैदल चलें", "g.u.2": "मुख्य दिनों में दरगाह के पास की सड़कें गाड़ियों के लिए बंद रहती हैं।",
    "g.u.3b": "हल्का सामान रखें", "g.u.3": "पानी साथ रखें, क़ीमती सामान होटल में रखें और ग्रुप में चलें।",
    "g.p.eyebrow": "घूमने की जगहें", "g.p.title": "अजमेर के आसपास",
    "g.p.adhai": "नक़्क़ाशीदार खंभों वाली ऐतिहासिक मस्जिद, दरगाह के ठीक आगे।", "g.p.ana": "बाग़ों और संगमरमर की बारादरी वाली बड़ी झील। सूर्यास्त के समय बहुत सुंदर।",
    "g.p.soni": "सोनीजी की नसियाँ (जैन मंदिर)", "g.p.sonit": "जैन मंदिर, जो जैन ब्रह्मांड दिखाने वाले सुनहरे हॉल के लिए मशहूर है।",
    "g.p.fort": "अकबरी क़िला और संग्रहालय", "g.p.fortt": "पुराने शहर में मुग़लकालीन क़िला, अब मूर्तियों और हथियारों का संग्रहालय।",
    "g.p.tara": "तारागढ़ क़िला", "g.p.taram": "पहाड़ी रास्ता, कार से", "g.p.tarat": "पहाड़ी पर क़िला, जहाँ से पूरा अजमेर दिखता है, और मीरान साहब की दरगाह।",
    "g.p.push": "पवित्र झील, घाट और ब्रह्मा मंदिर। कार्तिक में पुष्कर मेले के लिए मशहूर।", "g.taxi": "घूमने के लिए टैक्सी बुक करें",
    "g.r.title": "रीगल होटल कैसे पहुँचें", "g.r.train": "ट्रेन से", "g.r.traint": "अजमेर जंक्शन लगभग 1 किमी दूर है। ऑटो लें या हमसे पिकअप मँगवाएँ।",
    "g.r.air": "हवाई जहाज़ से", "g.r.airt": "किशनगढ़ एयरपोर्ट (~30 किमी) या जयपुर एयरपोर्ट (~130 किमी)। हम टैक्सी का इंतज़ाम कर सकते हैं।",
    "g.r.road": "सड़क से", "g.r.roadt": "जयपुर से हाईवे पर लगभग 2.5 घंटे। होटल में फ्री पार्किंग।", "g.pick": "स्टेशन / एयरपोर्ट पिकअप के लिए पूछें",
  };

  // Strings used by scripts (both languages)
  const STR = {
    en: {
      call: "Call us",
      "msg.hello": "Hello Regal Hotel, I would like to know about room availability.",
      "msg.food": "Hello Regal Hotel, please share the Riviera Restaurant menu.",
      "msg.urs": "Hello Regal Hotel, I want to book a room for Urs Sharif. Please share availability and rates.",
      "msg.taxi": "Hello Regal Hotel, I need a taxi / pickup. Details:",
      adv: (p) => `Advance to confirm (${p}%)`,
      ev: (n) => `Peak dates (${n}): higher rates apply. Book early, rooms sell out fast.`,
      cap: (g, r) => `${g} guests may need ${r} room(s) of this type. Please increase rooms or choose a bigger room.`,
      e: { dates: "Please choose valid check-in and check-out dates.", past: "Check-in date cannot be in the past.", name: "Please enter your name.", phone: "Please enter a valid 10-digit mobile number.", msg: "Please write a short message." },
      nightsX: (n, r) => `${n} night${n > 1 ? "s" : ""} × ${r}`,
      booking: (d) => `Hello Regal Hotel, I want to book a room.\n\nRoom: ${d.room}\nCheck-in: ${d.in}\nCheck-out: ${d.out} (${d.nights} night${d.nights > 1 ? "s" : ""})\nGuests: ${d.guests} · Rooms: ${d.rooms}\nName: ${d.name}\nMobile: ${d.phone}${d.req ? `\nRequest: ${d.req}` : ""}\n\nEstimated direct price: ${d.total}\nPlease confirm availability and send the advance payment link.`,
      enquiry: (d) => `Hello Regal Hotel,\nName: ${d.name}\nMobile: ${d.phone}\n\n${d.msg}`,
    },
    hi: {
      call: "कॉल करें",
      "msg.hello": "नमस्ते रीगल होटल, मुझे कमरे की उपलब्धता जाननी है।",
      "msg.food": "नमस्ते रीगल होटल, कृपया रिवेरा रेस्टोरेंट का मेन्यू भेजें।",
      "msg.urs": "नमस्ते रीगल होटल, मुझे उर्स शरीफ़ के लिए कमरा बुक करना है। कृपया उपलब्धता और किराया बताएँ।",
      "msg.taxi": "नमस्ते रीगल होटल, मुझे टैक्सी / पिकअप चाहिए। जानकारी:",
      adv: (p) => `पक्का करने के लिए एडवांस (${p}%)`,
      ev: (n) => `पीक तारीख़ें (${n}): किराया ज़्यादा है। जल्दी बुक करें, कमरे जल्दी भरते हैं।`,
      cap: (g, r) => `${g} मेहमानों के लिए इस प्रकार के ${r} कमरे लग सकते हैं। कृपया कमरे बढ़ाएँ या बड़ा कमरा चुनें।`,
      e: { dates: "कृपया सही चेक-इन और चेक-आउट तारीख़ चुनें।", past: "चेक-इन की तारीख़ पिछली नहीं हो सकती।", name: "कृपया अपना नाम लिखें।", phone: "कृपया सही 10 अंकों का मोबाइल नंबर लिखें।", msg: "कृपया छोटा-सा संदेश लिखें।" },
      nightsX: (n, r) => `${n} रात × ${r}`,
      booking: (d) => `नमस्ते रीगल होटल, मुझे कमरा बुक करना है।\n\nकमरा: ${d.room}\nचेक-इन: ${d.in}\nचेक-आउट: ${d.out} (${d.nights} रात)\nमेहमान: ${d.guests} · कमरे: ${d.rooms}\nनाम: ${d.name}\nमोबाइल: ${d.phone}${d.req ? `\nअनुरोध: ${d.req}` : ""}\n\nअनुमानित सीधा किराया: ${d.total}\nकृपया उपलब्धता पक्की करें और एडवांस पेमेंट लिंक भेजें।`,
      enquiry: (d) => `नमस्ते रीगल होटल,\nनाम: ${d.name}\nमोबाइल: ${d.phone}\n\n${d.msg}`,
    },
  };

  const EVENT_HI = { "Pushkar Mela": "पुष्कर मेला", "Urs Sharif": "उर्स शरीफ़" };

  let lang = localStorage.getItem("regal-lang") === "hi" ? "hi" : "en";
  const S = () => STR[lang];

  // ---------------- i18n ----------------
  $$("[data-i18n]").forEach((el) => (el.dataset.en = el.innerHTML));
  $$("[data-i18n-ph]").forEach((el) => (el.dataset.enPh = el.placeholder));
  const EN_EXTRA = {
    "cap.0": "Comfortable AC rooms",
    "cap.1": "Ajmer · Ana Sagar Lake, ~3 km away",
    "cap.2": "Riviera Restaurant · home-style food",
    "cap.3": "Rest well after your ziyarat",
  };
  const tr = (el) => {
    const k = el.dataset.i18n;
    el.innerHTML = lang === "hi" && HI[k] ? HI[k] : EN_EXTRA[k] || el.dataset.en;
  };
  window.__i18n = tr;
  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(tr);
    $$("[data-i18n-ph]").forEach((el) => { el.placeholder = lang === "hi" && HI[el.dataset.i18nPh] ? HI[el.dataset.i18nPh] : el.dataset.enPh; });
    $("#langBtn").textContent = lang === "hi" ? "English" : "हिंदी";
    fillContacts();
    if (window.__recalc) window.__recalc();
  }
  $("#langBtn").addEventListener("click", () => {
    lang = lang === "hi" ? "en" : "hi";
    localStorage.setItem("regal-lang", lang);
    applyLang();
  });

  // ---------------- nav ----------------
  $("#burger").addEventListener("click", () => $("#menu").classList.toggle("open"));
  $$("#menu a").forEach((a) => a.addEventListener("click", () => $("#menu").classList.remove("open")));

  // ---------------- contacts, WhatsApp, maps ----------------
  const waUrl = (text) => `https://wa.me/${H.whatsapp ? H.whatsapp.replace(/\D/g, "") : ""}?text=${encodeURIComponent(text)}`;
  const openWa = (text) => window.open(waUrl(text), "_blank", "noopener");
  function fillContacts() {
    $$("[data-phone]").forEach((a) => {
      if (H.phone) { a.href = "tel:" + H.phone.replace(/[^\d+]/g, ""); a.textContent = H.phone; }
      else { a.href = "index.html#contact"; a.textContent = S().call; }
    });
    $$("[data-call]").forEach((a) => { a.href = H.phone ? "tel:" + H.phone.replace(/[^\d+]/g, "") : "index.html#contact"; });
    $$("[data-email]").forEach((a) => { if (H.email) { a.href = "mailto:" + H.email; a.textContent = H.email; } });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-wa]");
    if (!a) return;
    e.preventDefault();
    openWa(S()[a.dataset.wa] || S()["msg.hello"]);
  });
  const mapsLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(H.mapsQuery);
  $$("[data-maps]").forEach((a) => { a.href = mapsLink; a.target = "_blank"; a.rel = "noopener"; });
  const map = $("#map");
  if (map) map.src = "https://maps.google.com/maps?q=" + encodeURIComponent(H.mapsQuery) + "&z=15&output=embed";
  $$("[data-year]").forEach((s) => (s.textContent = new Date().getFullYear()));

  // room prices from config
  $$("[data-rate]").forEach((el) => (el.textContent = inr(H.rooms[el.dataset.rate].direct)));
  $$("[data-ota]").forEach((el) => (el.textContent = inr(H.rooms[el.dataset.ota].ota)));

  // ---------------- date helpers ----------------
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return y ? new Date(y, m - 1, d) : null; };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const today = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
  const fmt = (d) => d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" });
  const eventFor = (d) => H.events.find((e) => d >= parse(e.from) && d <= parse(e.to));
  const round50 = (n) => Math.round(n / 50) * 50;
  const validPhone = (p) => /^(\+?91)?[6-9]\d{9}$/.test(p.replace(/[\s-]/g, ""));

  // ---------------- home: quick booking bar ----------------
  const qb = $("#quickBook");
  if (qb) {
    const inp = $("#qbIn");
    inp.min = iso(today());
    inp.value = iso(addDays(today(), 1));
    qb.addEventListener("submit", (e) => {
      e.preventDefault();
      const p = new URLSearchParams({ in: inp.value, n: $("#qbNights").value, g: $("#qbGuests").value });
      location.href = "rooms.html?" + p.toString() + "#book";
    });
  }

  // ---------------- enquiry form ----------------
  const eq = $("#enquiry");
  if (eq) eq.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#eqName").value.trim(), phone = $("#eqPhone").value.trim(), msg = $("#eqMsg").value.trim();
    const err = $("#eqErr");
    if (!name) return (err.textContent = S().e.name);
    if (!validPhone(phone)) return (err.textContent = S().e.phone);
    if (!msg) return (err.textContent = S().e.msg);
    err.textContent = "";
    openWa(S().enquiry({ name, phone, msg }));
  });

  // ---------------- rooms: booking calculator ----------------
  const bf = $("#bookForm");
  if (bf) {
    const q = new URLSearchParams(location.search);
    const elIn = $("#bkIn"), elOut = $("#bkOut"), elRoom = $("#bkRoom"), elGuests = $("#bkGuests"), elRooms = $("#bkRooms");
    const start = q.get("in") && parse(q.get("in")) >= today() ? parse(q.get("in")) : addDays(today(), 1);
    const n = Math.min(Math.max(parseInt(q.get("n"), 10) || 2, 1), 30);
    elIn.min = iso(today());
    elIn.value = iso(start);
    elOut.value = iso(addDays(start, n));
    if (["standard", "deluxe", "family"].includes(q.get("room"))) elRoom.value = q.get("room");
    if (q.get("g")) elGuests.value = Math.min(Math.max(parseInt(q.get("g"), 10) || 2, 1), 4);
    if (+elGuests.value >= 4 && !q.get("room")) elRoom.value = "family";

    $$("[data-pick]").forEach((b) => b.addEventListener("click", () => {
      elRoom.value = b.dataset.pick;
      recalc();
      $("#book").scrollIntoView({ behavior: "smooth" });
    }));

    function calc() {
      const din = parse(elIn.value), dout = parse(elOut.value);
      if (!din || !dout || dout <= din) return null;
      const r = H.rooms[elRoom.value];
      const rooms = +elRooms.value;
      let direct = 0, ota = 0, nights = 0;
      const events = new Set();
      for (let d = new Date(din); d < dout; d = addDays(d, 1)) {
        const ev = eventFor(d);
        const m = ev ? ev.mult : 1;
        if (ev) events.add(ev.name);
        direct += round50(r.direct * m);
        ota += round50(r.ota * m);
        nights++;
      }
      return { din, dout, nights, rooms, direct: direct * rooms, ota: ota * rooms, events: [...events], need: Math.ceil(+elGuests.value / r.maxGuests) };
    }
    function recalc() {
      const c = calc();
      $("#sRoom").textContent = elRoom.options[elRoom.selectedIndex].textContent;
      $("#sAdvLabel").textContent = S().adv(H.advancePercent);
      const ev = $("#sEvent"), cap = $("#sCap");
      if (!c) {
        ["#sDates", "#sNights", "#sOta", "#sTotal", "#sSave", "#sAdv"].forEach((s) => ($(s).textContent = "—"));
        ev.hidden = cap.hidden = true;
        return;
      }
      $("#sDates").textContent = `${fmt(c.din)} → ${fmt(c.dout)}`;
      $("#sNights").textContent = S().nightsX(c.nights, c.rooms);
      $("#sOta").textContent = inr(c.ota);
      $("#sTotal").textContent = inr(c.direct);
      $("#sSave").textContent = inr(c.ota - c.direct);
      $("#sAdv").textContent = inr(round50((c.direct * H.advancePercent) / 100));
      ev.hidden = !c.events.length;
      if (c.events.length) ev.textContent = S().ev(c.events.map((n) => (lang === "hi" && EVENT_HI[n]) || n).join(", "));
      cap.hidden = c.need <= c.rooms;
      if (c.need > c.rooms) cap.textContent = S().cap(elGuests.value, c.need);
    }
    window.__recalc = recalc;

    elIn.addEventListener("change", () => {
      const din = parse(elIn.value), dout = parse(elOut.value);
      if (din && (!dout || dout <= din)) elOut.value = iso(addDays(din, 1));
      elOut.min = iso(addDays(din || today(), 1));
      recalc();
    });
    [elOut, elRoom, elGuests, elRooms].forEach((el) => el.addEventListener("change", recalc));
    elOut.min = iso(addDays(start, 1));

    bf.addEventListener("submit", (e) => {
      e.preventDefault();
      const err = $("#bkErr");
      const c = calc();
      const name = $("#bkName").value.trim(), phone = $("#bkPhone").value.trim(), req = $("#bkReq").value.trim();
      if (!c) return (err.textContent = S().e.dates);
      if (c.din < today()) return (err.textContent = S().e.past);
      if (!name) return (err.textContent = S().e.name);
      if (!validPhone(phone)) return (err.textContent = S().e.phone);
      err.textContent = "";
      openWa(S().booking({
        room: elRoom.options[elRoom.selectedIndex].textContent, in: fmt(c.din), out: fmt(c.dout), nights: c.nights,
        guests: elGuests.value, rooms: c.rooms, name, phone, req, total: inr(c.direct),
      }));
    });
  }

  applyLang();
})();
