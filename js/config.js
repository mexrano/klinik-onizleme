// ============================================================
//  Универсальный базовый шаблон для всех стоматологических клиник.
//  Индивидуальные данные каждой клиники лежат в /clinics/<slug>.json
//  Открытие: https://<твой-домен>.vercel.app/<slug>  (или /?c=<slug>)
// ============================================================
export function buildConfig(clinicData) {
  const c = clinicData;
  const hours = c.hours || [
    null,
    ["09:00", "20:00"],
    ["09:00", "20:00"],
    ["09:00", "20:00"],
    ["09:00", "20:00"],
    ["09:00", "20:00"],
    ["09:00", "20:00"]
  ];

  const openDaysCount = hours.filter(Boolean).length;
  const openSun = Boolean(hours[0]);
  const sampleHours = hours.find(Boolean) || ["09:00", "20:00"];
  const closeTime = sampleHours[1];
  const openTime = sampleHours[0];

  const district = c.district || "İstanbul";
  const districtAr = c.districtAr || "إسطنبول";
  const shortName = c.shortName || "Diş Polikliniği";
  const shortNameAr = c.shortNameAr || shortName;
  const neighborhood = c.neighborhood || district;
  const neighborhoodAr = c.neighborhoodAr || districtAr;

  const lat = c.coords?.lat ?? 41.1190951;
  const lng = c.coords?.lng ?? 28.7669229;
  const mapsEmbedUrl = c.mapsEmbedUrl || `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  const mapsLink = c.mapsLink || (c.placeId
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${c.placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);

  const hoursChip = {
    tr: c.hoursNote?.tr || (openSun ? `Pazar dahil her gün ${openTime}–${closeTime} açık` : `Cumartesi dahil ${closeTime}'ye kadar açık`),
    en: c.hoursNote?.en || (openSun ? `Open 7 days a week (${openTime}–${closeTime})` : `Open Mon–Sat until ${closeTime}`),
    ar: c.hoursNote?.ar || (openSun ? `مفتوح طوال الأسبوع ${openTime}–${closeTime}` : `مفتوح حتى ${closeTime} (اثنين–سبت)`)
  };

  const whyHoursTitle = {
    tr: openSun ? "Haftanın 7 günü" : "Hafta içi & Cumartesi",
    en: openSun ? "Open 7 days a week" : "Mon–Sat hours",
    ar: openSun ? "7 أيام في الأسبوع" : "الاثنين إلى السبت"
  };

  const whyHoursDesc = {
    tr: c.hoursNote?.tr || (openSun ? `Pazar günü dahil her gün ${openTime}–${closeTime} saatleri arasında hizmet.` : `Pazartesi–Cumartesi ${openTime}–${closeTime} saatleri arasında hizmet.`),
    en: c.hoursNote?.en || (openSun ? `Open every day including Sunday from ${openTime} to ${closeTime}.` : `Open Monday to Saturday from ${openTime} to ${closeTime}.`),
    ar: c.hoursNote?.ar || (openSun ? `مفتوح يوميًا بما في ذلك يوم الأحد من ${openTime} حتى ${closeTime}.` : `مفتوح من الاثنين إلى السبت من ${openTime} حتى ${closeTime}.`)
  };

  const accessNote = {
    tr: c.accessNote?.tr || `${c.address} adresinde kolay ulaşım ve otopark imkânı.`,
    en: c.accessNote?.en || `Conveniently located in ${district} with public transport and parking nearby.`,
    ar: c.accessNote?.ar || `موقع مميز في ${districtAr} مع سهولة الوصول وتوفر موقف سيارات.`
  };

  const localAreas = c.localAreas || [district, "İstanbul"];
  const localAreasAr = c.localAreasAr || [districtAr, "إسطنبول"];

  const defaultDoctors = [
    {
      photo: "/img/doc1.webp",
      title: { tr: "Diş Hekimi", en: "Dentist", ar: "طبيب أسنان" },
      name: `${shortName} Hekim Kadrosu`,
      uni: { tr: c.name, en: c.name, ar: shortNameAr },
      tags: { tr: ["İmplant & Cerrahi", "Zirkonyum", "Estetik"], en: ["Implants & Surgery", "Zirconia", "Aesthetics"], ar: ["زراعة الأسنان", "زركونيوم", "تجميل الأسنان"] },
      langs: ["TR", "EN", "AR"]
    },
    {
      photo: "/img/doc3.webp",
      title: { tr: "Uzman Kadro", en: "Specialist Team", ar: "الفريق المتخصص" },
      name: "Ortodonti & Pedodonti",
      uni: { tr: c.name, en: c.name, ar: shortNameAr },
      tags: { tr: ["Ortodonti", "Şeffaf Plak", "Çocuk Diş Hekimliği"], en: ["Orthodontics", "Aligners", "Pediatric Care"], ar: ["تقويم الأسنان", "التقويم الشفاف", "طب أسنان الأطفال"] },
      langs: ["TR", "EN", "AR"]
    }
  ];

  const baseFaq = [
    { tr: ["Tedavi sırasında acı hisseder miyim?", "İşlemler lokal anestezi altında yapılır; çoğu hasta yalnızca hafif basınç hisseder. Kaygınız varsa önceden bize söyleyin, temponuzu buna göre ayarlarız."],
      en: ["Will I feel pain?", "Procedures are done under local anaesthesia; most patients feel only slight pressure. Tell us beforehand if you feel anxious and we will adjust the pace."],
      ar: ["هل سأشعر بالألم؟", "تتم الإجراءات تحت التخدير الموضعي، ومعظم المرضى يشعرون بضغط خفيف فقط. أخبرنا مسبقًا إذا كنت تشعر بالقلق وسنراعي ذلك."] },
    { tr: ["İmplant kaç seansta tamamlanır?", "Genellikle 3–4 seans ve 3–6 aylık iyileşme süreci gerekir. Kesin plan muayene ve 3D tarama sonrası belirlenir."],
      en: ["How many visits does an implant take?", "Usually 3–4 visits over 3–6 months of healing. The exact plan is set after an exam and a 3D scan."],
      ar: ["كم جلسة تحتاج الزراعة؟", "عادة 3–4 جلسات خلال 3–6 أشهر من الالتئام، وتُحدد الخطة بعد الفحص والمسح ثلاثي الأبعاد."] },
    { tr: ["Taksit imkânı var mı?", "Kredi kartına taksit seçenekleri için lütfen bizimle iletişime geçin; size uygun ödeme planını birlikte konuşalım."],
      en: ["Do you offer instalments?", "Please contact us for credit card instalment options; we will go through a payment plan that suits you."],
      ar: ["هل يوجد تقسيط؟", "يرجى التواصل معنا لمعرفة خيارات التقسيط بالبطاقة؛ سنتفق على خطة دفع مناسبة لك."] },
    { tr: ["Özel sağlık sigortası geçerli mi?", c.insuranceNote?.tr || "Anlaşmalı sigortalar için WhatsApp'tan bilgi alabilirsiniz. Poliçenizi iletirseniz kapsamı birlikte kontrol ederiz."],
      en: ["Is private insurance accepted?", c.insuranceNote?.en || "Ask us on WhatsApp about partner insurers. Send us your policy and we will check the coverage together."],
      ar: ["هل يُقبل التأمين الخاص؟", c.insuranceNote?.ar || "اسألنا عبر واتساب عن شركات التأمين المتعاقدة. أرسل لنا وثيقتك وسنراجع التغطية معًا."] },
    openSun
      ? { tr: ["Pazar günü açık mısınız?", `Evet, polikliniğimiz Pazar dahil haftanın 7 günü ${openTime}–${closeTime} saatleri arasında hizmet vermektedir.`],
          en: ["Are you open on Sundays?", `Yes, our clinic is open 7 days a week, including Sundays, from ${openTime} to ${closeTime}.`],
          ar: ["هل العيادة مفتوحة يوم الأحد؟", `نعم، عيادتنا مفتوحة طوال أيام الأسبوع بما في ذلك يوم الأحد من ${openTime} حتى ${closeTime}.`] }
      : { tr: ["Acil durumda randevusuz gelebilir miyim?", "Acil ağrılarda mümkün olan en kısa sürede sizi kabul etmeye çalışırız; önce aramanızı öneririz."],
          en: ["Can I come without an appointment in an emergency?", "We try to see urgent cases as soon as possible; please call first."],
          ar: ["هل يمكنني الحضور دون موعد في حالة طارئة؟", "نحاول استقبال الحالات الطارئة بأسرع وقت؛ يُفضل الاتصال أولاً."] },
    { tr: ["Yabancı hastalarla çalışıyor musunuz?", "Evet, Türkçe, İngilizce ve Arapça iletişim kurabilen ekibimiz bulunmaktadır."],
      en: ["Do you work with international patients?", "Yes, our team speaks Turkish, English and Arabic."],
      ar: ["هل تستقبلون مرضى أجانب؟", "نعم، فريقنا يتحدث العربية والتركية والإنجليزية."] },
    { tr: ["Çocuklar kaç yaşında diş hekimine gelmeli?", "İlk muayene için ilk dişin çıkmasıyla birlikte, yaklaşık 1 yaşında gelmeniz önerilir. Erken tanışma, çocuğun kliniğe alışmasını kolaylaştırır."],
      en: ["At what age should a child first see a dentist?", "We recommend the first visit around the age of one, when the first tooth appears. Meeting the dentist early makes later visits easier."],
      ar: ["في أي عمر يزور الطفل طبيب الأسنان أول مرة؟", "نوصي بالزيارة الأولى في عمر سنة تقريبًا مع ظهور السن الأول. التعارف المبكر يسهّل الزيارات اللاحقة."] }
  ];

  return {
    isDemo: c.isDemo !== undefined ? c.isDemo : true,

    clinic: {
      name: c.name || "Ağız ve Diş Sağlığı Polikliniği",
      shortName,
      taglineShort: c.taglineShort || "Ağız ve Diş Sağlığı",
      url: c.url || window.location.origin + "/",
      phone: c.phone || "+90 555 000 00 00",
      whatsapp: (c.whatsapp || c.phone || "").replace(/\D/g, ""),
      instagram: c.instagram || "",
      address: c.address || `${district} / İstanbul`,
      district,
      mapsEmbedUrl,
      mapsLink,
      coords: { lat, lng },
      responsibleDoctor: c.responsibleDoctor || "Sorumlu Müdür: Dt. —",
      license: c.license || "Ruhsat No: —"
    },

    hours,

    stats: [
      { value: "8", key: "statTreatments" },
      { value: String(openDaysCount), key: "statDays" },
      { value: "3", key: "statLangs" },
      { value: "3D", key: "statScan" }
    ],

    images: {
      hero: c.images?.hero || "/img/g8.webp",
      why: c.images?.why || "/img/why.webp",
      og: c.images?.og || "/img/og.jpg"
    },

    standards: c.standards || ["3Shape 3D", "Straumann", "Invisalign", "B-Class Steril"],

    showReviews: c.showReviews !== false,
    rating: c.rating || 4.9,
    reviewsCount: c.reviewsCount || 120,
    reviews: c.reviews || [
      {
        name: "Merve K.",
        initials: "MK",
        date: { tr: "2 hafta önce · Google", en: "2 weeks ago · Google", ar: "منذ أسبوعين · Google" },
        text: {
          tr: `${shortName} kliniğinde implant ve zirkonyum sürecimi tamamladım. İlk muayeneden son kontrole kadar her adımı detaylı anlattılar, hiç ağrı hissetmedim. Temizlik ve ilgi gerçekten üst düzey.`,
          en: `Completed my implant and zirconia treatment at ${shortName}. Every step was explained clearly from the first exam to the final check-up, completely pain-free and spotless clinic.`,
          ar: `أكملت علاج الزراعة والزركونيوم في ${shortNameAr}. شرحوا لي كل خطوة بوضوح من الفحص الأول حتى المراجعة النهائية، العيادة نظيفة جدًا والعلاج بدون ألم.`
        }
      },
      {
        name: "Hakan Y.",
        initials: "HY",
        date: { tr: "1 ay önce · Google", en: "1 month ago · Google", ar: "منذ شهر · Google" },
        text: {
          tr: `Diş hekimi korkum vardı ama ekibin sakin yaklaşımı sayesinde kanal tedavim ve dolgularım çok rahat geçti. Randevu saatine tam uyuluyor, ${district} çevresinde gönül rahatlığıyla tavsiye ederim.`,
          en: `I used to be anxious about dentists, but the team's calm approach made my root canal and fillings effortless. Appointments always run on time in ${district}.`,
          ar: `كنت أشعر بالتوتر من طبيب الأسنان لكن تعامل الفريق الهادئ جعل علاج العصب والحشوات مريحًا جدًا. الالتزام بالمواعيد ممتاز.`
        }
      },
      {
        name: "Ayşe T.",
        initials: "AT",
        date: { tr: "1 ay önce · Google", en: "1 month ago · Google", ar: "منذ شهر · Google" },
        text: {
          tr: `Çocuğumun ilk diş muayenesi için geldik, o kadar sabırlı ve güler yüzlü ilgilendiler ki hiç korkmadı. 3D tarama ile ölçü alınması da büyük konfor.`,
          en: `Brought my child for their very first dental check-up. Everyone was patient and kind so there were zero tears, and the 3D digital scan was super quick.`,
          ar: `أحضرت طفلي لأول فحص أسنان وكان الفريق صبورًا ولطيفًا للغاية ولم يشعر بأي خوف، والمسح الرقمي ثلاثي الأبعاد سريع ومريح.`
        }
      },
      {
        name: "Ömer A.",
        initials: "ÖA",
        date: { tr: "2 ay önce · Google", en: "2 months ago · Google", ar: "منذ شهرين · Google" },
        text: {
          tr: `Hem hijyen standartları hem de tedavi planının baştan net şekilde paylaşılması güven veriyor. WhatsApp üzerinden sorulara da çok hızlı dönüş yapıyorlar.`,
          en: `High hygiene standards and a transparent treatment plan from day one. They also answer questions on WhatsApp very quickly.`,
          ar: `معايير التعقيم عالية وخطة العلاج واضحة منذ اليوم الأول، كما أنهم يردون بسرعة كبيرة على الاستفسارات عبر واتساب.`
        }
      }
    ],

    gallery: c.gallery || [
      { src: "/img/g1.webp", w: 1000, h: 668, alt: { tr: `${shortName} tedavi odası`, en: `${shortName} treatment room`, ar: `غرفة علاج في ${shortNameAr}` } },
      { src: "/img/g2.webp", w: 800, h: 1200, alt: { tr: "Modern diş üniti ve aydınlatma", en: "Modern dental unit and lighting", ar: "كرسي الأسنان الحديث والإضاءة" } },
      { src: "/img/why.webp", w: 1100, h: 825, alt: { tr: "Dijital görüntüleme ve planlama", en: "Digital imaging and planning", ar: "التصوير والتخطيط الرقمي" } },
      { src: "/img/g3.webp", w: 1000, h: 667, alt: { tr: "Steril dental el aletleri", en: "Sterile dental instruments", ar: "أدوات أسنان معقمة" } },
      { src: "/img/g7.webp", w: 1000, h: 667, alt: { tr: "Poliklinik muayene odası", en: "Clinic examination room", ar: "غرفة الفحص في العيادة" } },
      { src: "/img/g6.webp", w: 900, h: 1200, alt: { tr: "Kullanıma hazır steril tepsi", en: "Sterile tray ready for use", ar: "صينية معقمة جاهزة" } }
    ],

    treatments: [
      { id: "implant", icon: "anchor", photo: "/img/g1.webp", duration: { tr: "3–6 ay", en: "3–6 months", ar: "3–6 أشهر" }, sessions: "3–4",
        tr: { t: "İmplant", s: "Eksik dişlerin yerine kalıcı, doğal görünümlü titanyum kök.", d: ["Muayene ve 3D tarama", "İmplantın yerleştirilmesi", "İyileşme süreci", "Kalıcı protezin takılması"] },
        en: { t: "Dental Implants", s: "A permanent, natural-looking titanium root for missing teeth.", d: ["Exam and 3D scan", "Implant placement", "Healing period", "Final crown fitting"] },
        ar: { t: "زراعة الأسنان", s: "جذر تيتانيوم دائم بمظهر طبيعي لتعويض الأسنان المفقودة.", d: ["الفحص والمسح ثلاثي الأبعاد", "وضع الزرعة", "فترة الالتئام", "تركيب التاج النهائي"] } },
      { id: "zirconia", icon: "crown", photo: "/img/g2.webp", duration: { tr: "1–2 hafta", en: "1–2 weeks", ar: "1–2 أسبوع" }, sessions: "2–3",
        tr: { t: "Zirkonyum Kaplama", s: "Dayanıklı ve ışığı doğal geçiren estetik kaplamalar.", d: ["Planlama", "Diş hazırlığı ve ölçü", "Prova", "Yapıştırma"] },
        en: { t: "Zirconia Crowns", s: "Durable crowns with natural light transmission.", d: ["Planning", "Preparation and scan", "Try-in", "Cementation"] },
        ar: { t: "تيجان الزركونيوم", s: "تيجان متينة تعكس الضوء بشكل طبيعي.", d: ["التخطيط", "تحضير السن والمسح", "التجربة", "التثبيت"] } },
      { id: "smile", icon: "sparkle", photo: "/img/why.webp", duration: { tr: "1–2 hafta", en: "1–2 weeks", ar: "1–2 أسبوع" }, sessions: "2–3",
        tr: { t: "Gülüş Tasarımı / Lamina", s: "Yüz hatlarınıza uygun, kişiye özel gülüş planı.", d: ["Dijital gülüş analizi", "Prova (mock-up)", "Lamina hazırlığı", "Uygulama"] },
        en: { t: "Smile Design / Veneers", s: "A personalised smile plan matched to your face.", d: ["Digital smile analysis", "Mock-up", "Veneer preparation", "Placement"] },
        ar: { t: "تصميم الابتسامة / الفينير", s: "خطة ابتسامة مخصصة تناسب ملامح وجهك.", d: ["تحليل رقمي للابتسامة", "تجربة مبدئية", "تحضير الفينير", "التركيب"] } },
      { id: "ortho", icon: "align", photo: "/img/g6.webp", duration: { tr: "6–24 ay", en: "6–24 months", ar: "6–24 شهرًا" }, sessions: "—",
        tr: { t: "Ortodonti & Şeffaf Plak", s: "Çapraşık dişler için tel veya görünmez plak tedavisi.", d: ["Muayene ve tarama", "Tedavi planı", "Düzenli kontroller", "Pekiştirme"] },
        en: { t: "Orthodontics & Aligners", s: "Braces or clear aligners for crooked teeth.", d: ["Exam and scan", "Treatment plan", "Regular check-ups", "Retention"] },
        ar: { t: "تقويم الأسنان والتقويم الشفاف", s: "تقويم تقليدي أو شفاف للأسنان غير المنتظمة.", d: ["الفحص والمسح", "خطة العلاج", "مراجعات دورية", "التثبيت"] } },
      { id: "canal", icon: "shield", duration: { tr: "1–2 seans", en: "1–2 visits", ar: "1–2 جلسة" }, sessions: "1–2",
        tr: { t: "Kanal Tedavisi", s: "Ağrıyan dişi çekmeden kurtarmaya yönelik tedavi.", d: ["Röntgen", "Lokal anestezi", "Kanalların temizlenmesi", "Dolgu"] },
        en: { t: "Root Canal", s: "Saving a painful tooth instead of extracting it.", d: ["X-ray", "Local anaesthesia", "Canal cleaning", "Filling"] },
        ar: { t: "علاج العصب", s: "إنقاذ السن المؤلم بدلاً من خلعه.", d: ["أشعة", "تخدير موضعي", "تنظيف القنوات", "الحشو"] } },
      { id: "white", icon: "sun", duration: { tr: "1 seans", en: "1 visit", ar: "جلسة واحدة" }, sessions: "1",
        tr: { t: "Diş Beyazlatma", s: "Hekim kontrolünde güvenli beyazlatma.", d: ["Diş eti koruması", "Jel uygulaması", "Aktivasyon", "Kontrol"] },
        en: { t: "Teeth Whitening", s: "Safe whitening under dentist supervision.", d: ["Gum protection", "Gel application", "Activation", "Check"] },
        ar: { t: "تبييض الأسنان", s: "تبييض آمن تحت إشراف الطبيب.", d: ["حماية اللثة", "وضع الجل", "التفعيل", "المراجعة"] } },
      { id: "kids", icon: "smile", duration: { tr: "30–45 dk", en: "30–45 min", ar: "30–45 دقيقة" }, sessions: "—",
        tr: { t: "Çocuk Diş Hekimliği", s: "Çocuklar için sakin, korkusuz ilk deneyim.", d: ["Tanışma", "Muayene", "Koruyucu uygulamalar", "Aileye bilgilendirme"] },
        en: { t: "Pediatric Dentistry", s: "A calm, fear-free first visit for children.", d: ["Getting acquainted", "Exam", "Preventive care", "Parent guidance"] },
        ar: { t: "طب أسنان الأطفال", s: "تجربة أولى هادئة وخالية من الخوف للأطفال.", d: ["التعارف", "الفحص", "الوقاية", "إرشاد الأهل"] } },
      { id: "gum", icon: "leaf", duration: { tr: "1–3 seans", en: "1–3 visits", ar: "1–3 جلسات" }, sessions: "1–3",
        tr: { t: "Diş Eti Tedavisi", s: "Kanama ve diş eti çekilmesine karşı tedavi.", d: ["Muayene", "Diş taşı temizliği", "Kök yüzey düzeltme", "Kontrol"] },
        en: { t: "Gum Treatment", s: "Treatment for bleeding and receding gums.", d: ["Exam", "Scaling", "Root planing", "Follow-up"] },
        ar: { t: "علاج اللثة", s: "علاج نزيف اللثة وانحسارها.", d: ["الفحص", "إزالة الجير", "تسوية الجذور", "المتابعة"] } }
    ],

    doctors: c.doctors || defaultDoctors,
    faq: c.faq || baseFaq,

    texts: {
      tr: {
        metaTitle: `${district} Diş Kliniği | ${shortName} – İmplant, Zirkonyum, Ortodonti`,
        metaDesc: `${district} bölgesinde ağız ve diş sağlığı polikliniği. İmplant, zirkonyum kaplama, ortodonti, çocuk diş hekimliği. WhatsApp'tan bilgi alın.`,
        nav: ["Tedaviler", "Hekimler", "Klinik", "SSS", "İletişim"],
        skip: "İçeriğe geç", menu: "Menü",
        call: "Hemen Ara", wa: "WhatsApp'tan Bilgi Alın", waShort: "WhatsApp", route: "Yol Tarifi", book: "Bilgi alın",
        heroEyebrow: `${district} · ${neighborhood}`,
        heroTitle: `${district}'de güven veren, konforlu`,
        heroTitleAccent: "diş hekimliği",
        heroSub: "Dijital tarama, kişiye özel tedavi planı ve deneyimli hekim kadrosuyla ağız ve diş sağlığınız güvende.",
        chips: ["Deneyimli hekim kadrosu", "Dijital 3D tarama", hoursChip.tr],
        heroCardTitle: "Dijital 3D tarama",
        heroCardText: "Ölçü maddesi olmadan, dakikalar içinde.",
        open: "Şu an açık", closed: "Şu an kapalı", today: "Bugün", closedDay: "Kapalı",
        statTreatments: "tedavi alanı",
        statDays: openSun ? "gün hizmet (Pzt–Paz)" : "gün hizmet (Pzt–Cmt)",
        statLangs: "dil (TR · EN · AR)",
        statScan: "dijital planlama",
        stripNote: c.stripNote?.tr || "Sterilizasyon · Dijital röntgen · 3D ağız tarayıcı · Otopark",
        treatEyebrow: "Hizmetler", treatTitle: "Tedavilerimiz",
        treatSub: "Her tedavinin süresi ve seyri farklıdır. Size uygun olanı birlikte planlayalım.",
        duration: "Ortalama süre", sessions: "Seans", details: "Detayları gör", info: "WhatsApp'tan sor",
        steps: "Süreç nasıl işler?",
        waTreat: "Merhaba, {t} hakkında bilgi almak istiyorum.",
        waDoctor: "Merhaba, {d} hakkında bilgi almak istiyorum.",
        whyEyebrow: "Klinik", whyTitle: `Neden ${shortName}?`,
        whySub: "Tedavinin her adımında ne olduğunu bilmeniz bizim için önemli. Kullandığımız yöntemleri ve çalışma biçimimizi açıkça anlatıyoruz.",
        why: [
          ["Sterilizasyon", "Uluslararası standartlarda sterilizasyon ve tek kullanımlık malzemeler."],
          ["Dijital röntgen", "Düşük radyasyonlu, anında sonuç veren görüntüleme."],
          ["3D ağız tarayıcı", "Rahatsız edici ölçü maddeleri yerine dijital tarama."],
          ["Kişisel plan", "Her hasta için ayrı, şeffaf tedavi planı."],
          [whyHoursTitle.tr, whyHoursDesc.tr],
          ["Kolay ulaşım", accessNote.tr]
        ],
        docEyebrow: "Ekip", docTitle: "Hekimlerimiz",
        docSub: "Tedavinizi planlayan ve yürüten hekimleri tanıyın.",
        langs: "Diller", doctorBook: "Bilgi alın",
        procEyebrow: "Süreç", procTitle: "Tedavi nasıl ilerler?",
        proc: [["WhatsApp'tan yazın", "Birkaç dakikada size dönüş yapalım."], ["Muayene ve tarama", "Dijital tarama ile detaylı inceleme."], ["Kişisel plan", "Seçenekleri ve süreyi açıkça konuşalım."], ["Tedavi ve kontrol", "Tedavi sonrası düzenli takip."]],
        quizEyebrow: "Yönlendirme", quizTitle: "Hangi tedavi bana uygun?", quizSub: "3 kısa soruyu yanıtlayın, hekimimiz size dönsün.",
        q1: "Şikayetiniz nedir?", q1o: ["Eksik diş", "Dişlerimin görünümü", "Ağrı", "Çapraşık dişler", "Kontrol ve temizlik", "Çocuğum için"],
        q2: "Ne zaman başlamak istersiniz?", q2o: ["Bu hafta", "Bu ay", "Sadece bilgi almak istiyorum"],
        q3: "Size nasıl ulaşalım?", name: "Adınız", tel: "Telefon (5XX XXX XX XX)",
        kvkk: "Kişisel verilerimin işlenmesine ilişkin {link}'ni okudum.", kvkkLink: "Aydınlatma Metni",
        back: "Geri", next: "Devam", send: "WhatsApp ile Gönder",
        errName: "Lütfen adınızı girin.", errTel: "Geçerli bir telefon numarası girin.", errKvkk: "Devam etmek için onay gerekli.",
        thanks: "Teşekkürler! WhatsApp açılıyor…", thanksSub: "Pencere açılmadıysa aşağıdaki butona dokunun.",
        waQuiz: "Merhaba, adım {n}. Şikayetim: {a}. Başlamak istediğim zaman: {b}. Telefonum: {p}.",
        galEyebrow: "Klinik", galTitle: "Kliniğimiz", galSub: `${district} polikliniğimizden kareler.`,
        faqEyebrow: "SSS", faqTitle: "Sıkça sorulan sorular",
        faqSub: "Aklınızdaki soruları burada topladık. Cevabını bulamazsanız yazın.",
        localTitle: `${district} ve çevresinde diş sağlığı`,
        localText: c.localText?.tr || `Kliniğimiz ${c.address} adresinde yer alır. ${localAreas.join(", ")} ve çevre mahallelerden gelen hastalarımızı kabul ediyoruz.`,
        localAreas,
        contactTitle: "İletişim", contactSub: "Örnek sayfa ve sorularınız için yazın veya arayın.",
        hoursT: "Çalışma saatleri", days: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
        mapTitle: `${shortName} konumu`,
        footerNav: "Menü", footerTreat: "Tedaviler", footerContact: "İletişim",
        disclaimer: "Bu sitedeki bilgiler yalnızca bilgilendirme amaçlıdır. Tanı ve tedavi için hekiminize başvurunuz.",
        kvkkTitle: "KVKK Aydınlatma Metni",
        kvkkText: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında; adınız ve telefon numaranız yalnızca randevu ve bilgilendirme amacıyla, veri sorumlusu sıfatıyla kliniğimiz tarafından işlenir. Bu site verilerinizi sunucuda saklamaz; form bilgileri doğrudan sizin WhatsApp uygulamanız üzerinden kliniğe iletilir. Kanunun 11. maddesi kapsamındaki haklarınız için kliniğimizle iletişime geçebilirsiniz.",
        demoNotice: `${shortName} için özel tasarım önizlemesi · Bilgiler kliniğinize göre güncellenir`,
        techEyebrow: "Teknoloji & Konfor",
        techTitle: "Dijital diş hekimliği standartları",
        techSub: "Klinik protokollerimizi ve modern ekipman altyapımızı şeffaf biçimde inceleyin.",
        techTabs: [
          {
            num: "01", short: "3D Ağız İçi Tarayıcı", sub: "Ölçü maddesi olmadan dijital hassasiyet",
            badge: "Dijital Tarama", title: "Dakikalar içinde milimetrik 3D ağız modeli",
            desc: "Klasik ölçü kaşıkları ve macunlar yerine optik 3D tarayıcı kullanıyoruz. Zirkonyum, lamina ve şeffaf plak planlaması hem çok daha konforlu hem de yüksek hassasiyetle hazırlanır.",
            metrics: [["3 dk", "Tarama süresi"], ["0%", "Bulantı hissi"], ["3D", "Anlık önizleme"]]
          },
          {
            num: "02", short: "Dijital Gülüş Tasarımı", sub: "Tedaviye başlamadan sonucu önizleyin",
            badge: "Estetik Planlama", title: "Yüz oranlarınıza özel dijital prova",
            desc: "Dişlerinize herhangi bir işlem uygulamadan önce dijital analiz ve mock-up ile hedef gülüş görünümünü birlikte değerlendirip onaylıyoruz.",
            metrics: [["Mock-up", "Canlı prova"], ["1–2 hafta", "Ortalama süreç"], ["100%", "Kişiye özel"]]
          },
          {
            num: "03", short: "Ağrısız & Sakin Yaklaşım", sub: "Diş hekimi kaygısı olanlar için konfor",
            badge: "Hasta Konforu", title: "Her adımı önceden anlatan şeffaf süreç",
            desc: "Modern lokal anestezi teknikleri ve acele etmeyen sakin randevu temposuyla tedavi sürecini mümkün olan en rahat hale getiriyoruz.",
            metrics: [["Lokal", "Modern anestezi"], ["1-1", "Birebir takip"], ["TR·EN·AR", "Kendi dilinizde"]]
          },
          {
            num: "04", short: "Uluslararası Sterilizasyon", sub: "B-Class otoklav ve tek kullanımlık setler",
            badge: "Klinik Hijyen", title: "Her hasta için bağımsız steril protokol",
            desc: "Tüm el aletleri B-Class otoklav döngüsünden geçirilir, steril paketler hastanın önünde açılır ve tek kullanımlık sarf malzemeler tercih edilir.",
            metrics: [["B-Class", "Otoklav döngüsü"], ["Tek", "Kullanımlık set"], ["ISO", "Klinik standart"]]
          }
        ],
        revEyebrow: "Hasta Deneyimleri",
        revTitle: "Google değerlendirmeleri",
        revSub: "Kliniğimizi tercih eden hastalarımızın paylaştığı deneyimlerden öne çıkanlar.",
        revCountLabel: "{n}+ Google yorumu",
        revBtn: "Tüm Google yorumlarını gör",
        revNote: "Örnek önizleme bloğudur; yayına alınırken klinik tercihinize ve mevzuata göre düzenlenir veya kaldırılabilir.",
        close: "Kapat", rights: "Tüm hakları saklıdır."
      },
      en: {
        metaTitle: `${district} Dental Clinic | ${shortName} – Implants, Zirconia, Orthodontics`,
        metaDesc: `Dental clinic in ${district}. Implants, zirconia crowns, orthodontics, pediatric dentistry. Get information on WhatsApp.`,
        nav: ["Treatments", "Doctors", "Clinic", "FAQ", "Contact"],
        skip: "Skip to content", menu: "Menu",
        call: "Call Us", wa: "Get Info on WhatsApp", waShort: "WhatsApp", route: "Directions", book: "Get info",
        heroEyebrow: `${district} · ${neighborhood}`,
        heroTitle: "Modern, reassuring dental care in",
        heroTitleAccent: district,
        heroSub: "Digital scanning, a personalised treatment plan and an experienced team — your oral health in safe hands.",
        chips: ["Experienced dentists", "Digital 3D scanning", hoursChip.en],
        heroCardTitle: "Digital 3D scanning",
        heroCardText: "No impression trays, results in minutes.",
        open: "Open now", closed: "Closed now", today: "Today", closedDay: "Closed",
        statTreatments: "treatment areas",
        statDays: openSun ? "days open (Mon–Sun)" : "days open (Mon–Sat)",
        statLangs: "languages (TR · EN · AR)",
        statScan: "digital planning",
        stripNote: c.stripNote?.en || "Sterilisation · Digital X-ray · 3D intraoral scanner · Parking",
        treatEyebrow: "Services", treatTitle: "Our Treatments",
        treatSub: "Every treatment has its own timeline. Let's plan the one that fits you.",
        duration: "Average duration", sessions: "Visits", details: "See details", info: "Ask on WhatsApp",
        steps: "How does it work?",
        waTreat: "Hello, I would like information about {t}.",
        waDoctor: "Hello, I would like information about {d}.",
        whyEyebrow: "The clinic", whyTitle: `Why ${shortName}?`,
        whySub: "You should know what happens at every step. We explain our methods and the way we work in plain language.",
        why: [
          ["Sterilisation", "International sterilisation standards and single-use materials."],
          ["Digital X-ray", "Low-radiation imaging with instant results."],
          ["3D intraoral scanner", "Digital scans instead of uncomfortable impressions."],
          ["Personal plan", "A separate, transparent plan for every patient."],
          [whyHoursTitle.en, whyHoursDesc.en],
          ["Easy access", accessNote.en]
        ],
        docEyebrow: "Team", docTitle: "Our Doctors",
        docSub: "Meet the dentists who plan and carry out your treatment.",
        langs: "Languages", doctorBook: "Get info",
        procEyebrow: "The process", procTitle: "How treatment works",
        proc: [["Message us", "We reply within minutes."], ["Exam and scan", "Detailed digital examination."], ["Personal plan", "We discuss options and timing clearly."], ["Treatment and follow-up", "Regular check-ups after treatment."]],
        quizEyebrow: "Guidance", quizTitle: "Which treatment suits me?", quizSub: "Answer 3 quick questions and our dentist will get back to you.",
        q1: "What is your concern?", q1o: ["Missing tooth", "Appearance of my teeth", "Pain", "Crooked teeth", "Check-up & cleaning", "For my child"],
        q2: "When would you like to start?", q2o: ["This week", "This month", "Just looking for information"],
        q3: "How can we reach you?", name: "Your name", tel: "Phone (+90 5XX XXX XX XX)",
        kvkk: "I have read the {link} on personal data.", kvkkLink: "Privacy Notice",
        back: "Back", next: "Next", send: "Send via WhatsApp",
        errName: "Please enter your name.", errTel: "Please enter a valid phone number.", errKvkk: "Consent is required.",
        thanks: "Thank you! Opening WhatsApp…", thanksSub: "If the window did not open, tap the button below.",
        waQuiz: "Hello, my name is {n}. Concern: {a}. Preferred start: {b}. Phone: {p}.",
        galEyebrow: "The clinic", galTitle: "Our Clinic", galSub: `A look inside our practice in ${district}.`,
        faqEyebrow: "FAQ", faqTitle: "Frequently asked questions",
        faqSub: "We collected the questions patients ask most. If yours is missing, just write to us.",
        localTitle: `Dental care in ${district} and nearby`,
        localText: c.localText?.en || `Our clinic is located at ${c.address}. We welcome patients from ${localAreas.join(", ")} and nearby neighbourhoods.`,
        localAreas,
        contactTitle: "Contact", contactSub: "Write or call us about this sample page and your questions.",
        hoursT: "Opening hours", days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        mapTitle: `${shortName} location`,
        footerNav: "Menu", footerTreat: "Treatments", footerContact: "Contact",
        disclaimer: "Information on this site is for general purposes only. Please consult your dentist for diagnosis and treatment.",
        kvkkTitle: "Privacy Notice (KVKK)",
        kvkkText: "Under Turkish Law No. 6698, your name and phone number are processed by our clinic as data controller solely for appointments and information. This website does not store your data; the form is sent directly from your own WhatsApp app to the clinic. Contact us to exercise your rights under Article 11.",
        demoNotice: `Personalised design preview for ${shortName} · Details are updated for your clinic`,
        techEyebrow: "Technology & Comfort",
        techTitle: "Digital dentistry standards",
        techSub: "Explore the clinical protocols and modern diagnostic tools behind every treatment.",
        techTabs: [
          {
            num: "01", short: "3D Intraoral Scanner", sub: "Optical precision without impression trays",
            badge: "Digital Scanning", title: "Millimetre-accurate 3D model in minutes",
            desc: "Instead of messy impression trays, we use optical 3D scanning for crowns, veneers and clear aligners — faster, cleaner and far more comfortable.",
            metrics: [["3 min", "Scan duration"], ["0%", "Gag reflex"], ["3D", "Instant preview"]]
          },
          {
            num: "02", short: "Digital Smile Design", sub: "Preview the plan before starting",
            badge: "Aesthetic Planning", title: "Personalised mock-up matched to your face",
            desc: "Before any tooth preparation begins, we review digital proportions and a live mock-up together so you know exactly what to expect.",
            metrics: [["Mock-up", "Live try-in"], ["1–2 wks", "Typical timeline"], ["100%", "Tailored plan"]]
          },
          {
            num: "03", short: "Calm, Pain-Free Care", sub: "Built for anxious dental patients",
            badge: "Patient Comfort", title: "Transparent steps at an unhurried pace",
            desc: "Modern local anaesthesia combined with clear step-by-step explanations ensures every visit feels predictable and relaxed.",
            metrics: [["Local", "Modern numbing"], ["1-on-1", "Dedicated care"], ["TR·EN·AR", "Your language"]]
          },
          {
            num: "04", short: "Clinical Sterilisation", sub: "B-Class autoclave and sealed packs",
            badge: "Hygiene Protocol", title: "Independent sterile setup for every visit",
            desc: "All instruments complete B-Class autoclave cycles, sealed pouches are opened chairside, and single-use disposables protect every patient.",
            metrics: [["B-Class", "Autoclave cycle"], ["Sealed", "Chairside packs"], ["ISO", "Clinical grade"]]
          }
        ],
        revEyebrow: "Patient Feedback",
        revTitle: "Google reviews",
        revSub: "Highlights from patients who visited our clinic for routine and aesthetic care.",
        revCountLabel: "{n}+ Google reviews",
        revBtn: "See all Google reviews",
        revNote: "Preview showcase block; can be customised or hidden upon launch based on your clinic's preference.",
        close: "Close", rights: "All rights reserved."
      },
      ar: {
        metaTitle: `عيادة أسنان ${districtAr} | ${shortNameAr} – زراعة، زركونيوم، تقويم`,
        metaDesc: `عيادة أسنان في ${districtAr}. زراعة، تيجان زركونيوم، تقويم، طب أسنان الأطفال. اطلب المعلومة عبر واتساب.`,
        nav: ["العلاجات", "الأطباء", "العيادة", "الأسئلة", "تواصل"],
        skip: "تخطَّ إلى المحتوى", menu: "القائمة",
        call: "اتصل بنا", wa: "اطلب المعلومة عبر واتساب", waShort: "واتساب", route: "الاتجاهات", book: "اطلب المعلومة",
        heroEyebrow: `${districtAr} · ${neighborhoodAr}`,
        heroTitle: "رعاية أسنان حديثة ومريحة في",
        heroTitleAccent: districtAr,
        heroSub: "مسح رقمي، خطة علاج مخصصة، وفريق أطباء ذو خبرة — صحة فمك في أيدٍ أمينة.",
        chips: ["أطباء ذوو خبرة", "مسح رقمي ثلاثي الأبعاد", hoursChip.ar],
        heroCardTitle: "مسح رقمي ثلاثي الأبعاد",
        heroCardText: "بدون طبعات مزعجة، والنتيجة خلال دقائق.",
        open: "مفتوح الآن", closed: "مغلق الآن", today: "اليوم", closedDay: "مغلق",
        statTreatments: "مجالات علاج",
        statDays: openSun ? "أيام عمل (طوال الأسبوع)" : "أيام عمل (اثنين–سبت)",
        statLangs: "لغات (TR · EN · AR)",
        statScan: "تخطيط رقمي",
        stripNote: c.stripNote?.ar || "تعقيم · أشعة رقمية · ماسح فموي ثلاثي الأبعاد · موقف سيارات",
        treatEyebrow: "الخدمات", treatTitle: "علاجاتنا",
        treatSub: "لكل علاج مدته وطريقته. لنخطط معًا لما يناسبك.",
        duration: "المدة التقريبية", sessions: "الجلسات", details: "عرض التفاصيل", info: "اسأل عبر واتساب",
        steps: "كيف تتم العملية؟",
        waTreat: "مرحبًا، أود الاستفسار عن {t}.",
        waDoctor: "مرحبًا، أود الاستفسار عن {d}.",
        whyEyebrow: "العيادة", whyTitle: `لماذا ${shortNameAr}؟`,
        whySub: "يهمنا أن تعرف ما يحدث في كل خطوة. نشرح طرق عملنا بوضوح.",
        why: [
          ["التعقيم", "معايير تعقيم دولية ومواد تُستخدم مرة واحدة."],
          ["أشعة رقمية", "تصوير منخفض الإشعاع بنتائج فورية."],
          ["ماسح فموي ثلاثي الأبعاد", "مسح رقمي بدلاً من الطبعات المزعجة."],
          ["خطة شخصية", "خطة علاج واضحة لكل مريض."],
          [whyHoursTitle.ar, whyHoursDesc.ar],
          ["سهولة الوصول", accessNote.ar]
        ],
        docEyebrow: "الفريق", docTitle: "أطباؤنا",
        docSub: "تعرّف على الأطباء الذين يخططون علاجك وينفذونه.",
        langs: "اللغات", doctorBook: "اطلب المعلومة",
        procEyebrow: "المسار", procTitle: "كيف يسير العلاج؟",
        proc: [["راسلنا", "نرد خلال دقائق."], ["الفحص والمسح", "فحص رقمي مفصل."], ["خطة شخصية", "نناقش الخيارات والمدة بوضوح."], ["العلاج والمتابعة", "مراجعات منتظمة بعد العلاج."]],
        quizEyebrow: "إرشاد", quizTitle: "ما العلاج المناسب لي؟", quizSub: "أجب عن 3 أسئلة قصيرة وسيتواصل معك طبيبنا.",
        q1: "ما هي شكواك؟", q1o: ["سن مفقود", "مظهر أسناني", "ألم", "أسنان غير منتظمة", "فحص وتنظيف", "لطفلي"],
        q2: "متى تريد البدء؟", q2o: ["هذا الأسبوع", "هذا الشهر", "أريد معلومات فقط"],
        q3: "كيف نتواصل معك؟", name: "الاسم", tel: "الهاتف (+90 5XX XXX XX XX)",
        kvkk: "قرأت {link} الخاص بالبيانات الشخصية.", kvkkLink: "إشعار الخصوصية",
        back: "رجوع", next: "التالي", send: "إرسال عبر واتساب",
        errName: "يرجى إدخال الاسم.", errTel: "يرجى إدخال رقم هاتف صحيح.", errKvkk: "الموافقة مطلوبة.",
        thanks: "شكرًا! جارٍ فتح واتساب…", thanksSub: "إذا لم تُفتح النافذة، اضغط الزر أدناه.",
        waQuiz: "مرحبًا، اسمي {n}. الشكوى: {a}. موعد البدء: {b}. هاتفي: {p}.",
        galEyebrow: "العيادة", galTitle: "عيادتنا", galSub: `لقطات من عيادتنا في ${districtAr}.`,
        faqEyebrow: "الأسئلة", faqTitle: "الأسئلة الشائعة",
        faqSub: "جمعنا هنا الأسئلة الأكثر تكرارًا. إن لم تجد سؤالك، راسلنا.",
        localTitle: `رعاية الأسنان في ${districtAr} والمناطق المجاورة`,
        localText: c.localText?.ar || `تقع عيادتنا في ${districtAr} ونستقبل المرضى من ${localAreasAr.join(" و")} والأحياء المجاورة.`,
        localAreas: localAreasAr,
        contactTitle: "تواصل معنا", contactSub: "راسلنا أو اتصل بنا للاستفسار عن هذه الصفحة التجريبية.",
        hoursT: "ساعات العمل", days: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
        mapTitle: `موقع ${shortNameAr}`,
        footerNav: "القائمة", footerTreat: "العلاجات", footerContact: "تواصل",
        disclaimer: "المعلومات في هذا الموقع لأغراض التوعية فقط. يرجى استشارة طبيبك للتشخيص والعلاج.",
        kvkkTitle: "إشعار الخصوصية (KVKK)",
        kvkkText: "وفقًا للقانون التركي رقم 6698، تتم معالجة اسمك ورقم هاتفك من قبل عيادتنا فقط لغرض المواعيد والمعلومات. لا يخزن هذا الموقع بياناتك؛ يتم إرسال النموذج مباشرة من تطبيق واتساب الخاص بك إلى العيادة.",
        demoNotice: `معاينة تصميم مخصصة لـ ${shortNameAr} · يتم تحديث جميع البيانات لعيادتكم`,
        techEyebrow: "التقنية والراحة",
        techTitle: "معايير طب الأسنان الرقمي",
        techSub: "اطّلع بوضوح على بروتوكولات التعقيم والتقنيات الحديثة المستخدمة في عيادتنا.",
        techTabs: [
          {
            num: "01", short: "ماسح فموي ثلاثي الأبعاد", sub: "دقة رقمية بدون طبعات مزعجة",
            badge: "المسح الرقمي", title: "نموذج ثلاثي الأبعاد دقيق خلال دقائق",
            desc: "بدلاً من الطبعات التقليدية المزعجة نستخدم الماسح الضوئي ثلاثي الأبعاد لتخطيط الزركونيوم والفينير والتقويم الشفاف براحة ودقة عالية.",
            metrics: [["3 دقائق", "مدة المسح"], ["0%", "انزعاج الطبعات"], ["3D", "معاينة فورية"]]
          },
          {
            num: "02", short: "تصميم الابتسامة الرقمي", sub: "شاهد النتيجة قبل بدء العلاج",
            badge: "التخطيط التجميلي", title: "تجربة مبدئية مخصصة لملامح وجهك",
            desc: "قبل البدء بأي إجراء، نراجع معك التناسب الرقمي والتجربة المبدئية لتكون واثقًا تمامًا من النتيجة النهائية.",
            metrics: [["Mock-up", "تجربة حية"], ["1–2 أسبوع", "المدة التقريبية"], ["100%", "خطة مخصصة"]]
          },
          {
            num: "03", short: "علاج هادئ بدون ألم", sub: "مثالي لمن يشعر بالقلق من طبيب الأسنان",
            badge: "راحة المريض", title: "شرح واضح لكل خطوة ووتيرة هادئة",
            desc: "مع التخدير الموضعي الحديث والشرح المسبق لكل مرحلة تصبح الزيارة مريحة وواضحة دون أي توتر.",
            metrics: [["موضعي", "تخدير حديث"], ["متابعة", "رعاية فردية"], ["TR·EN·AR", "بلغتك"]]
          },
          {
            num: "04", short: "التعقيم الدولي", sub: "أوتوكلاف الفئة B وأدوات مغلفة",
            badge: "معايير النظافة", title: "بروتوكول تعقيم مستقل لكل مريض",
            desc: "تمر جميع الأدوات بدورات تعقيم B-Class وتُفتح الأكياس المعقمة أمام المريض مع استخدام مستلزمات لمرة واحدة.",
            metrics: [["B-Class", "دورة أوتوكلاف"], ["مغلف", "يُفتح أمامك"], ["ISO", "معيار طبي"]]
          }
        ],
        revEyebrow: "آراء المرضى",
        revTitle: "تقييمات Google",
        revSub: "مقتطفات من تجارب المرضى الذين زاروا عيادتنا للعلاج والتجميل.",
        revCountLabel: "+{n} تقييم على Google",
        revBtn: "عرض جميع تقييمات Google",
        revNote: "قسم معاينة تجريبي؛ يمكن تعديله أو إخفاؤه عند الإطلاق حسب رغبة العيادة.",
        close: "إغلاق", rights: "جميع الحقوق محفوظة."
      }
    }
  };
}
