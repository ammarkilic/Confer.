// src/data.js
export const conferences = [
  {
    id: "esa-2026",
    title: "17th ESA Conference",
    organizer: "European Sociological Association",
    domain: "europeansociology.org",
    logo: "/esa-logo.svg",
    link: "https://www.europeansociology.org/conference/2026",
    location: "Varşova, Polonya",
    locationEn: "Warsaw, Poland",
    region: "Avrupa",
    regionEn: "Europe",
    tagsEn: ["Sociology"],
    date: "2026-08-25",
    deadline: "2026-01-15",
    lastUpdated: "2026-05-10",
    tags: ["Sosyoloji"],
    color: "bg-blue-50 text-blue-700",
    grants: true,
    cfpText: "Bu yılki konferansın ana teması sosyolojik krizler, çevresel yönetişim ve yeni ekolojik politikalar üzerine odaklanmaktadır. Sunumlar, geniş bir yelpazede teorik ve ampirik tartışmalara ev sahipliği yapacaktır. Lütfen özetlerinizi sisteme yüklerken yayın koşullarını dikkatlice inceleyin.",
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "17. Avrupa Sosyoloji Derneği (ESA) Konferansı, 'Demokrasileri Güçlendirmek: Sosyal Eylem, Dayanışma ve Sürdürülebilir Gelecekler' ana teması altında toplanmaktadır.",
          text: "Konferans, küresel krizlerin ve toplumsal dönüşümlerin sosyolojik yansımalarını ele alan geniş kapsamlı bir akademik tartışma alanı sunar."
        },
        en: {
          lead: "The 17th European Sociological Association (ESA) Conference is centered on the theme 'Strengthening Democracies: Social Action, Solidarity, and Sustainable Futures.'",
          text: "It provides a major international forum to debate sociological perspectives on contemporary global crises and social transformations."
        }
      },
      dates: [
        {
          date: "2026-01-15",
          tr: { title: "Bildiri Özeti Gönderimi", desc: "Özet gönderimi tamamlandı." },
          en: { title: "Abstract Submission", desc: "Submission window is closed." },
          passed: true
        },
        {
          date: "2026-03-05",
          tr: { title: "Kabul Bildirimi", desc: "Yazarlara bildirimler gönderildi." },
          en: { title: "Acceptance Notification", desc: "Notification sent to authors." },
          passed: true
        },
        {
          date: "2026-04-27",
          tr: { title: "Erken Kayıt Sonu", desc: "İndirimli kayıt dönemi sona erdi." },
          en: { title: "Early-Bird Registration", desc: "Discounted registration closed." },
          passed: true
        },
        {
          date: "2026-05-29",
          tr: { title: "Uzatılmış Son Kayıt", desc: "Normal/Late kayıt dönemi sona erdi." },
          en: { title: "Final Registration Deadline", desc: "Late registration window is closed." },
          passed: true
        },
        {
          date: "2026-08-25",
          tr: { title: "Konferans Başlangıcı", desc: "Varşova'da fiziksel oturumlar başlıyor." },
          en: { title: "Conference Starts", desc: "Physical sessions begin in Warsaw." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "ESA Üyeleri (Band 1)", early: "230 €", late: "310 €" },
          { cat: "ESA Üyeleri (Band 2)", early: "130 €", late: "190 €" },
          { cat: "Öğrenci Üyeler", early: "90 €", late: "120 €" },
          { cat: "Üye Olmayanlar", early: "380 €", late: "485 €" },
          { cat: "Öğrenci (Üye Olmayan)", early: "170 €", late: "230 €" }
        ],
        en: [
          { cat: "ESA Members (Band 1)", early: "€230", late: "€310" },
          { cat: "ESA Members (Band 2)", early: "€130", late: "€190" },
          { cat: "Student Members", early: "€90", late: "€120" },
          { cat: "Non-Members", early: "€380", late: "€485" },
          { cat: "Non-Member Students", early: "€170", late: "€230" }
        ]
      },
      grants: [
        {
          tr: { title: "Seyahat Bursları", desc: "Düşük gelirli ülkelerden (Band 2) katılan araştırmacılar ve öğrenci üyeler için kayıt ücreti muafiyeti ve 300–400 € arası seyahat desteği sunulmaktadır." },
          en: { title: "Travel Grants", desc: "Registration waivers and €300–€400 travel support are offered to student members and researchers from Band 2 countries." }
        },
        {
          tr: { title: "Erken Kariyer Ödülü", desc: "Yarışmayı kazanan araştırmacının konferans katılım ücreti tamamen karşılanmaktadır." },
          en: { title: "Early Career Scholar Award", desc: "The award winner receives a full waiver on the 17th ESA Conference registration fee." }
        },
        {
          tr: { title: "PhD Yaz Okulu", desc: "Seçilen PhD öğrencileri için konaklama, yemek ve kısmi seyahat desteği sağlanan özel bir yaz okulu programı (22–24 Ağustos) mevcuttur." },
          en: { title: "PhD Summer School", desc: "Selected doctoral candidates receive free accommodation, meals, and partial travel support for the summer school (22–24 August)." }
        }
      ],
      conditions: [
        {
          tr: { title: "Yüz Yüze Katılım", desc: "Konferans sadece fiziksel (on-site) olarak gerçekleştirilecektir; online veya hibrit sunum seçeneği yoktur." },
          en: { title: "On-Site Only", desc: "The conference is fully physical; there is no virtual or hybrid presentation option." }
        },
        {
          tr: { title: "Sunum Sınırı", desc: "Bir yazar konferans genelinde en fazla 2 bildiri sunabilir." },
          en: { title: "Presentation Limit", desc: "Authors are restricted to presenting a maximum of 2 papers." }
        },
        {
          tr: { title: "Kayıt ve Üyelik", desc: "İndirimli üye oranlardan yararlanmak için 2026 ESA üyeliğinin aktif olması ve ödemenin ConfTool sistemi üzerinden yapılması gerekir." },
          en: { title: "Membership & Payment", desc: "To qualify for discounted member rates, your 2026 ESA membership must be active, and payment completed via ConfTool." }
        }
      ]
    }
  },
  {
    id: "isa-soc-2027",
    title: "XXI ISA World Congress of Sociology",
    organizer: "International Sociological Association",
    domain: "isa-sociology.org",
    logo: "/isa-logo.webp",
    link: "https://www.isa-sociology.org/en",
    location: "Gwangju, Güney Kore",
    locationEn: "Gwangju, South Korea",
    region: "Asya",
    regionEn: "Asia",
    tagsEn: ["Sociology", "Global studies"],
    date: "2027-07-04",
    deadline: "2026-11-30",
    lastUpdated: "2026-06-12",
    tags: ["Sosyoloji", "Global çalışmalar"],
    color: "bg-rose-50 text-rose-700",
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "XXI. ISA Dünya Sosyoloji Kongresi, küresel eşitsizlikler ve sosyal adalet temalarını merkeze alıyor.",
          text: "Kongre, dünyanın dört bir yanından sosyologları Gwangju'da bir araya getirerek sosyolojik teoriler ve güncel küresel krizler üzerine tartışmalara zemin hazırlamaktadır."
        },
        en: {
          lead: "The XXI ISA World Congress of Sociology centers on themes of global inequalities and social justice.",
          text: "The congress brings together sociologists from all over the world in Gwangju to discuss sociological theories and contemporary global crises."
        }
      },
      dates: [
        {
          date: "Tarih belirlenmedi",
          tr: { title: "Bildiri Özeti Gönderimi", desc: "Özet gönderim tarihleri henüz netleşmemiştir." },
          en: { title: "Abstract Submission", desc: "Abstract submission dates are not yet finalized." },
          passed: false
        },
        {
          date: "2026-12-04",
          tr: { title: "Kabul Bildirimi", desc: "Yazarlara kabul bildirimleri gönderilecektir." },
          en: { title: "Acceptance Notification", desc: "Acceptance notifications will be sent to authors." },
          passed: false
        },
        {
          date: "2027-01-27",
          tr: { title: "Burs Başvurusu", desc: "Kayıt bursu başvuruları için son tarih." },
          en: { title: "Grant Application", desc: "Deadline for registration grant applications." },
          passed: false
        },
        {
          date: "2027-03-23",
          tr: { title: "Kayıt Sonu", desc: "Programa dahil olmak için son kayıt tarihi." },
          en: { title: "Registration Deadline", desc: "Final registration deadline to be included in the program." },
          passed: false
        },
        {
          date: "2027-07-04",
          tr: { title: "Kongre Başlangıcı", desc: "Gwangju'da fiziksel oturumlar başlıyor." },
          en: { title: "Congress Starts", desc: "Physical sessions begin in Gwangju." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Düzenli Üyeler (Kategori A)", early: "349 €", late: "549 €" },
          { cat: "Öğrenci Üyeler (Kategori C)", early: "50 €", late: "69 €" },
          { cat: "Üye Olmayanlar", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "Regular Members (Category A)", early: "€349", late: "€549" },
          { cat: "Student Members (Category C)", early: "€50", late: "€69" },
          { cat: "Non-Members", early: "NA", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Kayıt Bursları", desc: "İyi haldeki ISA üyeleri ve aktif program katılımcıları için sınırlı sayıda kayıt bursu sağlanmaktadır. Kısmi burs verilmemektedir." },
          en: { title: "Registration Grants", desc: "Limited registration grants are available for ISA members in good standing who are active participants. No partial grants are awarded." }
        }
      ],
      conditions: [
        {
          tr: { title: "Fiziksel Katılım", desc: "Kongre tamamen yüz yüze (on-site) yapılacaktır; online veya hibrit katılım seçeneği yoktur." },
          en: { title: "On-Site Only", desc: "The congress is fully in-person; there are no online or hybrid participation options." }
        },
        {
          tr: { title: "Kayıt Zorunluluğu", desc: "Programa dahil edilmek için tüm katılımcıların 23 Mart 2027'ye kadar kayıt işlemlerini tamamlaması gerekmektedir." },
          en: { title: "Registration Requirement", desc: "All participants must complete registration by March 23, 2027 to be included in the program." }
        }
      ]
    }
  }, 
  // PSİKOLOJİ KONFERANSLARI
  {
    id: "apa-2026",
    title: "APA Annual Convention 2026",
    organizer: "American Psychological Association",
    domain: "apa.org",
    logo: "/logos/apa-2026-logo.png",
    link: "https://convention.apa.org/",
    location: "Washington, DC, ABD",
    locationEn: "Washington, DC, USA",
    region: "Kuzey Amerika",
    regionEn: "North America",
    tagsEn: ["Psychology", "Clinical psychology"],
    date: "2026-08-06",
    deadline: "2026-01-10",
    lastUpdated: "2026-06-14",
    tags: ["Psikoloji", "Klinik psikoloji"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Amerika Psikoloji Birliği'nin (APA) yıllık kongresi, klinik, danışmanlık, adli ve okul psikolojisi dahil tüm alt disiplinleri kapsar.",
          text: "Araştırmacılar ve uygulayıcılar için zengin atölye çalışmaları ve ağ kurma fırsatları sunan bu devasa buluşma, psikoloji alanındaki en büyük etkinliklerden biridir."
        },
        en: {
          lead: "The annual convention of the American Psychological Association (APA) covers all sub-disciplines including clinical, counseling, forensic, and school psychology.",
          text: "Offering rich workshops and networking opportunities for researchers and practitioners, this massive gathering is one of the largest events in psychology."
        }
      },
      dates: [
        {
          date: "2026-01-14",
          tr: { title: "Bildiri Çağrısı Kapanışı", desc: "Sunum başvuruları için son tarih." },
          en: { title: "Call for Proposals Closed", desc: "Deadline for presentation submissions." },
          passed: true
        },
        {
          date: "2026-06-24",
          tr: { title: "İptal/İade Tarihi", desc: "Yüz yüze kayıtlar için %50 iade talebi son tarihi." },
          en: { title: "Cancellation/Refund", desc: "Deadline for 50% refund requests for in-person registrations." },
          passed: false
        },
        {
          date: "2026-08-06",
          tr: { title: "Kongre Başlangıcı", desc: "Washington, DC'de etkinliklerin başlaması." },
          en: { title: "Convention Starts", desc: "Events begin in Washington, DC." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Ücretler", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "Fees", early: "NA", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Bölüm Bursları", desc: "Belirli APA bölümleri (örn. Division 15) sunum yapan üyeler ve öğrenciler için kendi seyahat burslarını ve liyakat temelli ödüllerini sunmaktadır (500-1200$).." },
          en: { title: "Division Grants", desc: "Specific APA divisions (e.g., Division 15) offer their own travel grants and merit-based awards for presenting members and students ($500-$1200)." }
        }
      ],
      conditions: [
        {
          tr: { title: "Katılım Şekli", desc: "Kongre hem yüz yüze hem de sanal (virtual) katılım seçenekleri sunmaktadır." },
          en: { title: "Attendance Formats", desc: "The convention offers both in-person and virtual attendance options." }
        },
        {
          tr: { title: "Yaka Kartı", desc: "Yüz yüze katılımcılar, etkinliklere katılabilmek için yaka kartlarını kayıt alanından almalıdır." },
          en: { title: "Badges", desc: "In-person attendees must pick up their badges at the registration area to participate." }
        }
      ]
    }
  },
  {
    id: "aps-2026",
    title: "APS Annual Convention 2026",
    organizer: "Association for Psychological Science",
    domain: "psychologicalscience.org",
    logo: "/logos/Association_for_Psychological_Science.png",
    link: "https://www.psychologicalscience.org/conventions",
    location: "Barselona, İspanya",
    locationEn: "Barcelona, Spain",
    region: "Avrupa",
    regionEn: "Europe",
    tagsEn: ["Psychology", "Experimental psychology"],
    date: "2026-05-28",
    deadline: "2025-12-15",
    lastUpdated: "2026-06-14",
    tags: ["Psikoloji", "Deneysel psikoloji"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Dünyanın önde gelen psikoloji bilimi kongrelerinden biri olan APS, 2026'da Barselona'da gerçekleşecektir.",
          text: "Konferans yapay zeka, ruh sağlığı, dil ve kültür gibi karmaşık soruları ele alan bütünleştirici bilim sempozyumlarına odaklanmaktadır."
        },
        en: {
          lead: "One of the world's leading psychological science conventions, APS will take place in Barcelona in 2026.",
          text: "The conference focuses on integrative science symposia addressing complex questions such as AI, mental health, language, and culture."
        }
      },
      dates: [
        {
          date: "2025-12-10",
          tr: { title: "Bildiri Gönderimi Sonu", desc: "Uzatılmış bildiri gönderim son tarihi." },
          en: { title: "Submission Deadline", desc: "Extended deadline for submissions." },
          passed: true
        },
        {
          date: "2026-04-08",
          tr: { title: "Erken Kayıt Sonu", desc: "Erken kayıt dönemi sona eriyor." },
          en: { title: "Early-Bird Registration", desc: "Early registration period ends." },
          passed: true
        },
        {
          date: "2026-05-06",
          tr: { title: "Son Kayıt Tarihi", desc: "Sunum yapanlar ve normal katılımcılar için son kayıt tarihi." },
          en: { title: "Registration Deadline", desc: "Final registration deadline for presenters and regular attendees." },
          passed: true
        },
        {
          date: "2026-05-28",
          tr: { title: "Kongre Başlangıcı", desc: "Barselona'da oturumlar başlıyor." },
          en: { title: "Convention Starts", desc: "Sessions begin in Barcelona." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Ücretler", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "Fees", early: "NA", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Seyahat Bursları", desc: "APS, öğrencilere ve erken kariyer araştırmacılarına zaman zaman seyahat bursları ve ödüller sunmaktadır. Ayrıca EURAXESS gibi Avrupa merkezli fonlar kullanılabilir." },
          en: { title: "Travel Grants", desc: "APS sometimes offers travel grants and awards to students and early-career researchers. European-based funds like EURAXESS may also be used." }
        }
      ],
      conditions: [
        {
          tr: { title: "Fiziksel Katılım", desc: "Kongre tamamen yüz yüze (in-person) olarak gerçekleştirilecektir." },
          en: { title: "In-Person Only", desc: "The event is held fully in-person." }
        },
        {
          tr: { title: "Kayıt Zorunluluğu", desc: "Sunum yapanlar dahil tüm katılımcıların kongreye kayıt olması zorunludur." },
          en: { title: "Registration Required", desc: "All attendees, including presenters, must register for the convention." }
        }
      ]
    }
  },
  {
    id: "icap-2026",
    title: "International Congress of Applied Psychology 2026",
    organizer: "International Association of Applied Psychology",
    domain: "iaapsy.org",
    logo: "/logos/International_Association_of_Applied_Psychology.png",
    link: "https://iaapsy.org/meetings/icap/",
    location: "Floransa, İtalya",
    locationEn: "Florence, Italy",
    region: "Avrupa",
    regionEn: "Europe",
    tagsEn: ["Psychology", "Applied psychology"],
    date: "2026-07-21",
    deadline: "2026-02-15",
    lastUpdated: "2026-06-14",
    tags: ["Psikoloji", "Uygulamalı psikoloji"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "ICAP, Uygulamalı psikoloji alanında dünyanın en büyük ve en kapsamlı buluşmasıdır.",
          text: "Organizasyonel psikolojiden eğitim psikolojisine kadar birçok farklı alt dalda küresel sorunlara pratik çözümler aranmaktadır."
        },
        en: {
          lead: "ICAP is the world's largest and most comprehensive gathering in the field of applied psychology.",
          text: "Practical solutions to global problems are sought across many sub-disciplines, from organizational psychology to educational psychology."
        }
      },
      dates: [
        {
          date: "Tarih belirlenmedi",
          tr: { title: "Bildiri Gönderimi Sonu", desc: "Özet gönderimleri 2025 sonlarında kapanmıştır." },
          en: { title: "Submission Deadline", desc: "Abstract submissions closed in late 2025." },
          passed: true
        },
        {
          date: "2026-01-18",
          tr: { title: "Erken Kayıt Sonu", desc: "Erken kayıt dönemi sona eriyor." },
          en: { title: "Early Fee Deadline", desc: "Early fee period ends." },
          passed: true
        },
        {
          date: "2026-07-02",
          tr: { title: "Standart Kayıt Sonu", desc: "Standart kayıt dönemi sona eriyor." },
          en: { title: "Standard Fee Deadline", desc: "Standard registration period ends." },
          passed: false
        },
        {
          date: "2026-07-21",
          tr: { title: "Kongre Başlangıcı", desc: "Floransa'da oturumlar başlıyor." },
          en: { title: "Congress Starts", desc: "Sessions begin in Florence." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "IAAP Üyeleri (Yüksek Gelir)", early: "670 €", late: "790 €" },
          { cat: "Üye Olmayanlar (Yüksek Gelir)", early: "890 €", late: "950 €" },
          { cat: "Öğrenciler (Dünya Çapında)", early: "400 €", late: "600 €" }
        ],
        en: [
          { cat: "IAAP Members (High Income)", early: "€670", late: "€790" },
          { cat: "Non-Members (High Income)", early: "€890", late: "€950" },
          { cat: "Students (Worldwide)", early: "€400", late: "€600" }
        ]
      },
      grants: [
        {
          tr: { title: "Burslar", desc: "Öğrenciler ve erken kariyer araştırmacıları için çeşitlilik bursları veya ücret muafiyetleri organizasyon komitesince belirlenmektedir." },
          en: { title: "Grants & Scholarships", desc: "Diversity scholarships or fee waivers for students and early-career researchers are determined by the organizing committee." }
        }
      ],
      conditions: [
        {
          tr: { title: "Katılım Şartları", desc: "Katılımcıların resmi online portal üzerinden kayıt olmaları zorunludur." },
          en: { title: "Registration", desc: "Attendees must register through the official online portal." }
        }
      ]
    }
  },
  {
    id: "ecpp-2026",
    title: "European Conference on Positive Psychology",
    organizer: "European Network for Positive Psychology",
    domain: "enpp.eu",
    logo: "/logos/ecpp-2026-logo.png",
    link: "https://enpp.eu/",
    location: "Dublin, İrlanda",
    locationEn: "Dublin, Ireland",
    region: "Avrupa",
    regionEn: "Europe",
    tagsEn: ["Psychology", "Positive psychology"],
    date: "2026-07-01",
    deadline: "2026-01-31",
    lastUpdated: "2026-06-14",
    tags: ["Psikoloji", "Pozitif psikoloji"],
    grants: false,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Avrupa Pozitif Psikoloji Konferansı (ECPP), psikolojik iyi oluş, dayanıklılık ve insanın gelişimi konularına odaklanır.",
          text: "Konferans, 'Beden Zihinle Buluşuyor: Herkes İçin Pozitif Psikoloji ve Sağlık' teması etrafında araştırmacıları ve profesyonelleri bir araya getiren temel bir platformdur."
        },
        en: {
          lead: "The European Conference on Positive Psychology (ECPP) focuses on psychological well-being, resilience, and human development.",
          text: "The conference is a key platform bringing together researchers and professionals around the theme 'Body Meets Mind: Positive Psychology and Health for Everyone'."
        }
      },
      dates: [
        {
          date: "2026-07-01",
          tr: { title: "Konferans Başlangıcı", desc: "Dublin'de etkinliklerin başlaması." },
          en: { title: "Conference Starts", desc: "Events begin in Dublin." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Ücretler", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "Fees", early: "NA", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Burslar", desc: "Şu an için burs bilgisi belirlenmemiştir." },
          en: { title: "Grants", desc: "Grant information is not yet determined." }
        }
      ],
      conditions: [
        {
          tr: { title: "Katılım Şartları", desc: "Tarih belirlenmedi." },
          en: { title: "Conditions", desc: "NA" }
        }
      ]
    }
  },
  {
    id: "epa-2027",
    title: "35th European Congress of Psychiatry",
    organizer: "European Psychiatric Association",
    domain: "europsy.net",
    logo: "/logos/epa-2027-logo.png",
    link: "https://epa-congress.org/",
    location: "Floransa, İtalya",
    locationEn: "Florence, Italy",
    region: "Avrupa",
    regionEn: "Europe",
    tagsEn: ["Psychiatry", "Clinical psychology"],
    date: "2027-04-03",
    deadline: "2026-10-15",
    lastUpdated: "2026-06-14",
    tags: ["Psikiyatri", "Klinik psikoloji"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "EPA 2027 Kongresi, 'Ruh Sağlığında Yenilik: Kişiselleştirilmiş ve Entegre Bakıma Doğru' temasıyla toplanacaktır.",
          text: "Kongre, araştırma, klinik uygulama ve tedavi seçeneklerinde kişiye özel yaklaşımların geliştirilmesini amaçlamaktadır."
        },
        en: {
          lead: "The EPA 2027 Congress will convene under the theme 'Innovating Mental Health: Towards Personalised and Integrated Care'.",
          text: "The congress aims to advance personalized approaches in research, clinical practice, and treatment options."
        }
      },
      dates: [
        {
          date: "2027-01-27",
          tr: { title: "Erken Kayıt Sonu", desc: "İndirimli erken kayıt dönemi sona eriyor." },
          en: { title: "Early Bird Deadline", desc: "Discounted early bird registration period ends." },
          passed: false
        },
        {
          date: "2027-04-03",
          tr: { title: "Kongre Başlangıcı", desc: "Floransa'da etkinliklerin başlaması." },
          en: { title: "Congress Starts", desc: "Events begin in Florence." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Ücretler", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "Fees", early: "NA", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Seyahat Bursları", desc: "EPA, kongreye bildiri gönderen katılımcılara seyahat bursları sunmaktadır. Genellikle aday başına tek başvuru değerlendirilir." },
          en: { title: "Travel Grants", desc: "EPA offers travel grants to participants submitting abstracts. Typically, only one application per candidate is considered." }
        }
      ],
      conditions: [
        {
          tr: { title: "EPA Üyeliği", desc: "EPA üyeleri, kongre kayıtlarında ve kurslarda indirimli (ayrıcalıklı) ücretlerden faydalanabilirler." },
          en: { title: "EPA Membership", desc: "EPA members are eligible for preferential (discounted) registration fees and courses." }
        }
      ]
    }
  },

  //SİYASET BİLİMİ VE ULUSLARARASI İLİŞKİLER KONFERANSLARI

  {
    id: "eisa-pec-2026",
    title: "19th Pan-European Conference on International Relations",
    organizer: "European International Studies Association",
    domain: "eisa-net.org",
    logo: "/logos/European_International_Studies_Association.png",
    link: "https://pec2026.eisa-net.org/",
    location: "Lizbon, Portekiz",
    locationEn: "Lizbon, Portugal",
    region: "Avrupa",
    regionEn: "Europe",
    tagsEn: ["International relations", "Political science"],
    date: "2026-09-01",
    deadline: "2026-03-15",
    lastUpdated: "2026-06-14",
    tags: ["Uluslararası ilişkiler", "Siyaset bilimi"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Avrupa ve ötesinden akademisyenleri bir araya getiren temel bir uluslararası ilişkiler buluşmasıdır.",
          text: "Güvenlik çalışmalarından uluslararası ekonomi politiğe kadar pek çok alanda tematik çalışma grupları sunar. Erken dönem araştırmacılar için ağ kurma etkinlikleri ön plandadır."
        },
        en: {
          lead: "A major international relations gathering bringing together academics from Europe and beyond.",
          text: "It offers thematic working groups across various fields from security studies to international political economy. Networking events for early career researchers are prominent."
        }
      },
      dates: [
        {
          date: "2026-04-21",
          tr: { title: "Programa Dahil Olanlar İçin Kayıt", desc: "Sunum yapacak katılımcılar için son kayıt tarihi." },
          en: { title: "Registration for Programme Participants", desc: "Final registration deadline for presenting participants." },
          passed: false
        },
        {
          date: "2026-05-04",
          tr: { title: "Yedek Liste Kayıtları", desc: "Yedek listedeki katılımcılar için kayıt sonu." },
          en: { title: "Reserve List Registration", desc: "Registration deadline for participants on the reserve list." },
          passed: false
        },
        {
          date: "2026-09-01",
          tr: { title: "Konferans Başlangıcı", desc: "Lizbon'da oturumların başlaması." },
          en: { title: "Conference Starts", desc: "Sessions begin in Lisbon." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "EISA Üyeleri", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" },
          { cat: "Üye Olmayanlar", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "EISA Members", early: "NA", late: "NA" },
          { cat: "Non-Members", early: "NA", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Hareketlilik Fonu (Mobility Fund)", desc: "EISA, finansal desteğe ihtiyacı olan araştırmacılar ve erken kariyer akademisyenleri için Hareketlilik Fonu sunmaktadır." },
          en: { title: "Mobility Fund", desc: "EISA provides a Mobility Fund to support researchers and early-career academics in financial need." }
        }
      ],
      conditions: [
        {
          tr: { title: "EISA Üyeliği", desc: "Kayıt indirimleri ve fon desteklerinden yararlanmak için EISA üyesi olmak gereklidir." },
          en: { title: "EISA Membership", desc: "EISA membership is required to benefit from registration discounts and funding support." }
        }
      ]
    }
  },
  {
    id: "esg-2026",
    title: "Earth System Governance Conference 2026",
    organizer: "Earth System Governance Project",
    domain: "earthsystemgovernance.org",
    logo: "/logos/esg-2026-logo.svg",
    link: "https://www.earthsystemgovernance.org/",
    location: "Bath, Birleşik Krallık",
    locationEn: "Bath, United Kingdom",
    region: "Avrupa",
    regionEn: "Europe",
    tagsEn: ["Political science", "Environmental policies", "Governance"],
    date: "2026-09-07",
    deadline: "2026-07-01",
    lastUpdated: "2026-06-14",
    tags: ["Siyaset bilimi", "Çevre politikaları", "Yönetişim"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Küresel çevresel değişim bağlamında yönetişim zorluklarını ele alan prestijli bir atölye dizisidir.",
          text: "Demokrasi, adalet ve karmaşık sosyal-ekolojik sistemlerin yönetişimi konuları derinlemesine tartışılmaktadır."
        },
        en: {
          lead: "A prestigious series of workshops addressing governance challenges in the context of global environmental change.",
          text: "Issues of democracy, justice, and the governance of complex social-ecological systems are discussed in depth."
        }
      },
      dates: [
        {
          date: "2026-04-30",
          tr: { title: "Burs Başvurusu", desc: "Seyahat bursu başvuruları için son tarih." },
          en: { title: "Grant Application", desc: "Deadline for travel grant applications." },
          passed: false
        },
        {
          date: "2026-05-22",
          tr: { title: "Erken Kayıt Sonu", desc: "İndirimli kayıt dönemi kapanışı." },
          en: { title: "Early Bird Deadline", desc: "Discounted registration period ends." },
          passed: false
        },
        {
          date: "2026-08-07",
          tr: { title: "Standart Kayıt Sonu", desc: "Normal kayıt dönemi kapanışı." },
          en: { title: "Full Rate Deadline", desc: "Standard registration period ends." },
          passed: false
        },
        {
          date: "2026-09-07",
          tr: { title: "Konferans Başlangıcı", desc: "Erken Kariyer Günü ile başlıyor." },
          en: { title: "Conference Starts", desc: "Starts with Early Career Day." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Standart Bilet", early: "£325", late: "£375" },
          { cat: "İndirimli Bilet (Öğrenci/Düşük Gelir)", early: "£275", late: "£325" },
          { cat: "Online Katılım", early: "£125", late: "£125" }
        ],
        en: [
          { cat: "Standard Ticket", early: "£325", late: "£375" },
          { cat: "Concession Ticket (Student/Low Income)", early: "£275", late: "£325" },
          { cat: "Online Ticket", early: "£125", late: "£125" }
        ]
      },
      grants: [
        {
          tr: { title: "Seyahat Bursları", desc: "Düşük ve orta gelirli ülkelerden araştırmacılar ve lisansüstü öğrenciler için £1,275'a kadar (kayıt ücreti muafiyeti dahil) destek sağlanmaktadır." },
          en: { title: "Travel Grants", desc: "Support up to £1,275 (including fee waiver) is provided for researchers from low/middle-income countries and graduate students." }
        }
      ],
      conditions: [
        {
          tr: { title: "Burs Şartları", desc: "Burs alabilmek için konferansa en az bir bildirinin kabul edilmiş olması gerekmektedir." },
          en: { title: "Grant Conditions", desc: "Applicants must have at least one accepted contribution to be eligible for the grant." }
        },
        {
          tr: { title: "Katılım Şekli", desc: "Fiziksel katılımın yanı sıra, sadece çevrimiçi katılım (Online Ticket) seçeneği de mevcuttur." },
          en: { title: "Attendance", desc: "Alongside physical participation, an online-only ticket option is also available." }
        }
      ]
    }
  },
  {
    id: "apsa-2026",
    title: "122nd APSA Annual Meeting & Exhibition",
    organizer: "American Political Science Association",
    domain: "apsanet.org",
    logo: "/logos/American_Political_Science_Association.png",
    link: "https://apsanet.org/",
    location: "Boston, ABD",
    locationEn: "Boston, USA",
    region: "Kuzey Amerika",
    regionEn: "North America",
    tagsEn: ["Political science", "Public policy"],
    date: "2026-09-03",
    deadline: "2026-02-15",
    lastUpdated: "2026-06-14",
    tags: ["Siyaset bilimi", "Kamu politikası"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "APSA Yıllık Toplantısı, siyaset bilimi alanındaki en büyük ve en kapsamlı buluşmadır.",
          text: "Bu yılki kongre 'Demokrasi Tehdit Altında: Anlamak, Korumak ve Geliştirmek' temasıyla Boston'da gerçekleşecektir."
        },
        en: {
          lead: "The APSA Annual Meeting is the largest and most comprehensive gathering in the field of political science.",
          text: "This year's congress will take place in Boston with the theme 'Democracy Under Threat: Understanding, Protecting, and Developing'."
        }
      },
      dates: [
        {
          date: "2026-06-08",
          tr: { title: "Katılımcı Kayıt Sonu", desc: "Programa dahil olmak için son kayıt tarihi." },
          en: { title: "Participant Registration Deadline", desc: "Final registration deadline to remain on the program." },
          passed: false
        },
        {
          date: "2026-07-01",
          tr: { title: "Erken Kayıt Sonu", desc: "İndirimli erken kayıt dönemi sona eriyor." },
          en: { title: "Early Bird Deadline", desc: "Discounted early registration period ends." },
          passed: false
        },
        {
          date: "2026-09-03",
          tr: { title: "Kongre Başlangıcı", desc: "Boston'da oturumların başlaması." },
          en: { title: "Convention Starts", desc: "Sessions begin in Boston." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Öğrenci / İşsiz Üyeler", early: "$143", late: "$200" },
          { cat: "Düzenli Üyeler", early: "$278", late: "$368" },
          { cat: "Üye Olmayanlar", early: "$524", late: "$612" }
        ],
        en: [
          { cat: "Student / Unemployed Members", early: "$143", late: "$200" },
          { cat: "Regular Members", early: "$278", late: "$368" },
          { cat: "Non-Members", early: "$524", late: "$612" }
        ]
      },
      grants: [
        {
          tr: { title: "Seyahat Bursları", desc: "Kongrede sunum yapan ve 60 milden uzakta yaşayan üyeler için uçak bileti, otel ve yemek masraflarını kapsayan seyahat bursları sunulmaktadır (Kayıt ücretini kapsamaz)." },
          en: { title: "Travel Grants", desc: "Travel grants covering airfare, hotel, and meals are offered for presenting members residing more than 60 miles away (does not cover registration)." }
        }
      ],
      conditions: [
        {
          tr: { title: "Üyelik Şartı", desc: "İndirimli oranlardan faydalanmak için yıllık toplantı süresince APSA üyeliğinin aktif olması gerekir." },
          en: { title: "Membership Condition", desc: "APSA membership must be active through the annual meeting to benefit from discounted rates." }
        }
      ]
    }
  },
  {
    id: "pollen-2026",
    title: "POLLEN Political Ecology Network Conference",
    organizer: "Political Ecology Network",
    domain: "pollenpoliticalecology.network",
    logo: "/logos/pollen-2026-logo.png",
    link: "https://pollenpoliticalecology.network/pollen-2026/",
    location: "Barselona, İspanya",
    locationEn: "Barcelona, Spain",
    region: "Avrupa",
    regionEn: "Europe",
    tagsEn: ["Political science", "Political ecology"],
    date: "2026-06-29",
    deadline: "2025-12-05",
    lastUpdated: "2026-06-14",
    tags: ["Siyaset bilimi", "Politik ekoloji"],
    grants: false,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Politik ekoloji alanına özgü niş bir ağ oluşturma konferansıdır.",
          text: "Çevresel çatışmalar, devlet politikaları ve bölgesel ekolojik krizlerin politik ekonomisi üzerine dar odaklı tartışmalara olanak sağlar."
        },
        en: {
          lead: "A niche networking conference specific to the field of political ecology.",
          text: "It enables narrowly focused discussions on environmental conflicts, state policies, and the political economy of regional ecological crises."
        }
      },
      dates: [
        {
          date: "2026-03-25",
          tr: { title: "Fon Başvurusu Sonu", desc: "Finansal destek başvuruları kapanmıştır." },
          en: { title: "Funding Deadline", desc: "Financial support applications have closed." },
          passed: true
        },
        {
          date: "2026-05-18",
          tr: { title: "Kayıt Sonu", desc: "Genel kayıtlar için son tarih." },
          en: { title: "Registration Deadline", desc: "Final deadline for general registration." },
          passed: false
        },
        {
          date: "2026-06-29",
          tr: { title: "Konferans Başlangıcı", desc: "Barselona'da konferans başlıyor." },
          en: { title: "Conference Starts", desc: "Conference begins in Barcelona." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Dayanışma Oranı", early: "450 €", late: "450 €" },
          { cat: "Standart Oran", early: "440 €", late: "440 €" },
          { cat: "Öğrenci Oranı", early: "240 €", late: "240 €" },
          { cat: "Düşük Gelirli Ülkeler", early: "140 €", late: "140 €" }
        ],
        en: [
          { cat: "Solidarity Rate", early: "€450", late: "€450" },
          { cat: "Standard Rate", early: "€440", late: "€440" },
          { cat: "Student Rate", early: "€240", late: "€240" },
          { cat: "Concession Countries", early: "€140", late: "€140" }
        ]
      },
      grants: [
        {
          tr: { title: "Fon Destekleri", desc: "Başvuruları kapanmış olup; destekler erken kariyer, bağımsız araştırmacılar ve düşük gelirli ekonomilerden gelen katılımcılar için uluslararası seyahat ve konaklamayı kapsamaktaydı." },
          en: { title: "Funding Support", desc: "Applications are closed; support covered international travel and accommodation for early-career, independent scholars, and participants from lower-income economies." }
        }
      ],
      conditions: [
        {
          tr: { title: "Kayıt Zorunluluğu", desc: "Sunum yapan veya yapmayan tüm katılımcıların önceden kayıt olması gereklidir." },
          en: { title: "Registration Required", desc: "All participants, whether presenting or not, must register in advance." }
        }
      ]
    }
  },
  {
    id: "ipsa-2027",
    title: "29th IPSA World Congress of Political Science",
    organizer: "International Political Science Association",
    domain: "ipsa.org",
    logo: "/logos/ipsa-2027-logo.png",
    link: "https://www.ipsa.org/",
    location: "Roma, İtalya",
    locationEn: "Rome, Italy",
    region: "Avrupa",
    regionEn: "Europe",
    tagsEn: ["Political science", "International relations"],
    date: "2027-07-24",
    deadline: "2027-02-15",
    lastUpdated: "2026-06-14",
    tags: ["Siyaset bilimi", "Uluslararası ilişkiler"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "'Belirsiz Demokrasiler: Değişen Küresel Sistemde Yönetişimi Yeniden Düşünmek' ana temasıyla gerçekleşecektir.",
          text: "29. Dünya Siyaset Bilimi Kongresi, siyaset biliminin geniş alanını oluşturan kapsayıcı bir akademik platformdur."
        },
        en: {
          lead: "Taking place with the main theme 'Uncertain Democracies: Rethinking Governance in a Changing Global System'.",
          text: "The 29th World Congress of Political Science is an inclusive academic platform encompassing the broad field of political science."
        }
      },
      dates: [
        {
          date: "2027-02-03",
          tr: { title: "Burs Başvurusu Sonu", desc: "Seyahat bursları için son başvuru tarihi." },
          en: { title: "Grant Application Deadline", desc: "Deadline for travel grant applications." },
          passed: false
        },
        {
          date: "2027-03-18",
          tr: { title: "Erken Kayıt Sonu", desc: "İndirimli kayıt dönemi sona eriyor." },
          en: { title: "Early Bird Deadline", desc: "Discounted registration period ends." },
          passed: false
        },
        {
          date: "2027-05-05",
          tr: { title: "Panelistler İçin Son Kayıt", desc: "Sunum yapacakların programa dahil edilmesi için son tarih." },
          en: { title: "Panelist Registration Deadline", desc: "Final registration deadline for presenters to be included in the program." },
          passed: false
        },
        {
          date: "2027-07-24",
          tr: { title: "Kongre Başlangıcı", desc: "Roma'da yüz yüze oturumlar başlıyor." },
          en: { title: "Congress Starts", desc: "In-person sessions begin in Rome." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "A Grubu (Düzenli / Öğrenci)", early: "$370 / $130", late: "$420 / $160" },
          { cat: "B Grubu (Düzenli / Öğrenci)", early: "$280 / $100", late: "$315 / $120" },
          { cat: "C & D Grubu (Düzenli / Öğrenci)", early: "$175 / $65", late: "$200 / $75" }
        ],
        en: [
          { cat: "Group A (Regular / Student)", early: "$370 / $130", late: "$420 / $160" },
          { cat: "Group B (Regular / Student)", early: "$280 / $100", late: "$315 / $120" },
          { cat: "Group C & D (Regular / Student)", early: "$175 / $65", late: "$200 / $75" }
        ]
      },
      grants: [
        {
          tr: { title: "Seyahat Bursları", desc: "Gelişmekte olan ekonomilerden katılımcılar için 700-1000$ arası seyahat destekleri ve ayrıca lisansüstü öğrenciler için Stein Rokkan Bursu (Son başvuru 1 Mart 2027) mevcuttur." },
          en: { title: "Travel Grants", desc: "Travel grants of $700-$1000 for participants from developing economies, and the Stein Rokkan Fellowship for graduate students (Deadline March 1, 2027)." }
        }
      ],
      conditions: [
        {
          tr: { title: "Üyelik Şartı", desc: "Tüm kongre katılımcılarının kayıt olmak için 2027 yılı için bireysel IPSA üyesi olması zorunludur." },
          en: { title: "Membership Requirement", desc: "All congress participants must be individual IPSA members for 2027 to register." }
        },
        {
          tr: { title: "Fiziksel Katılım", desc: "Kongre tamamen yüz yüze gerçekleştirilecektir." },
          en: { title: "In-Person Only", desc: "The congress will be held entirely in-person." }
        }
      ]
    }
  },
  //ANTROPOLOJİ KONFERANSLARI
{
    id: "sfaa-2026",
    title: "86th SfAA Annual Meeting",
    organizer: "Society for Applied Anthropology",
    domain: "appliedanthro.org",
    logo: "/logos/sfaa-2026-logo.png",
    link: "https://appliedanthro.org/annual-meeting-announcements/",
    location: "Albuquerque, ABD",
    locationEn: "Albuquerque, USA",
    region: "Kuzey Amerika",
    regionEn: "North America",
    tagsEn: ["Anthropology", "Applied anthropology"],
    date: "2026-03-17",
    deadline: "2025-10-15",
    lastUpdated: "2026-06-14",
    tags: ["Antropoloji", "Uygulamalı antropoloji"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "SfAA Yıllık Toplantısı, 'Uygulamalı Antropolojinin Gündelik Pratiği' temasıyla Albuquerque'de gerçekleşecektir.",
          text: "Akademi, tıp, planlama ve sivil toplum gibi çeşitli alanlarda çalışan araştırmacı ve uygulayıcılar için pratik çözümler üretmeyi hedefler."
        },
        en: {
          lead: "The SfAA Annual Meeting will take place in Albuquerque with the theme 'The Everyday Practice of Applied Anthropology'.",
          text: "It aims to produce practical solutions for researchers and practitioners working in various fields such as academia, medicine, planning, and civil society."
        }
      },
      dates: [
        {
          date: "2025-10-15",
          tr: { title: "Bildiri Özeti Gönderimi", desc: "Özet gönderimi için son tarih." },
          en: { title: "Abstract Submission", desc: "Deadline for abstract submissions." },
          passed: true
        },
        {
          date: "2026-03-17",
          tr: { title: "Toplantı Başlangıcı", desc: "Albuquerque'de etkinlikler başlıyor." },
          en: { title: "Meeting Starts", desc: "Events begin in Albuquerque." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Ücretler", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "Fees", early: "NA", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Öğrenci Seyahat Ödülleri", desc: "SfAA, öğrencilerin yıllık toplantıya katılımını desteklemek amacıyla seyahat ödülleri sunmaktadır." },
          en: { title: "Student Travel Awards", desc: "SfAA offers travel awards to assist students in attending the annual meeting." }
        }
      ],
      conditions: [
        {
          tr: { title: "Kayıt Farkı", desc: "SfAA üyesi olmayan ancak üye tarifesinden kayıt yaptıran kişilerin fiyat farkını (veya üyelik ücretini) ödemesi zorunludur." },
          en: { title: "Registration Balance", desc: "Attendees who registered at a member rate but are not current members must pay the difference or join the society." }
        }
      ]
    }
  },
  {
    id: "sant-2026",
    title: "SANT Conference 2026",
    organizer: "Swedish Anthropological Association",
    domain: "gu.se",
    logo: "/logos/Swedish_Anthropological_Association.png",
    link: "https://www.gu.se/en/globalstudies/sant-conference-2026-interventions",
    location: "Göteborg, İsveç",
    locationEn: "Gothenburg, Sweden",
    region: "Avrupa",
    regionEn: "Europe",
    tagsEn: ["Anthropology", "Social anthropology"],
    date: "2026-04-22",
    deadline: "2026-01-10",
    lastUpdated: "2026-06-14",
    tags: ["Antropoloji", "Sosyal antropoloji"],
    grants: false,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "İsveç Antropoloji Derneği (SANT) tarafından düzenlenen konferans, 'Müdahaleler' temasına odaklanıyor.",
          text: "İklim krizi, adaletsizlik ve yerinden edilme gibi güncel sorunlar karşısında antropolojinin sadece gözlemci kalmak yerine nasıl sorumlu ve eleştirel müdahalelerde bulunabileceği tartışılacaktır."
        },
        en: {
          lead: "The conference organized by the Swedish Anthropological Association (SANT) focuses on the theme of 'Interventions'.",
          text: "It discusses how anthropology can make responsible and critical interventions rather than remaining just an observer in the face of current issues like the climate crisis, injustice, and displacement."
        }
      },
      dates: [
        {
          date: "2026-04-01",
          tr: { title: "Kayıt Kapanışı", desc: "Konferans kayıtları kapanmıştır." },
          en: { title: "Registration Closed", desc: "Conference registrations have closed." },
          passed: true
        },
        {
          date: "2026-04-22",
          tr: { title: "Konferans Başlangıcı", desc: "Göteborg'da konferans başlıyor." },
          en: { title: "Conference Starts", desc: "Conference begins in Gothenburg." },
          passed: true
        }
      ],
      fees: {
        tr: [
          { cat: "Ücretler", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "Fees", early: "NA", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Burslar", desc: "Konferansla ilişkili finansal destek veya seyahat bursu başvuruları kapanmıştır." },
          en: { title: "Grants", desc: "Financial support or travel grant applications associated with the conference are closed." }
        }
      ],
      conditions: [
        {
          tr: { title: "Kayıt", desc: "Kayıtlar kapanmıştır." },
          en: { title: "Registration", desc: "Registration is closed." }
        }
      ]
    }
  },
  {
    id: "easa-2026",
    title: "EASA 2026 Biennial Conference",
    organizer: "European Association of Social Anthropologists",
    domain: "easaonline.org",
    logo: "/logos/easa-2026-logo.png",
    link: "https://easaonline.org/conferences/easa2026/",
    location: "Poznan, Polonya",
    locationEn: "Poznan, Poland",
    region: "Avrupa",
    regionEn: "Europe",
    tagsEn: ["Anthropology", "Social anthropology"],
    date: "2026-07-21",
    deadline: "2026-01-20",
    lastUpdated: "2026-06-14",
    tags: ["Antropoloji", "Sosyal antropoloji"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Avrupa Sosyal Antropologlar Birliği'nin iki yılda bir düzenlediği kongre, 'Kutuplaşmış Bir Dünyada Antropoloji: Olasılıklar' temasıyla toplanacaktır.",
          text: "Konferans, parçalanan toplumsal yapılara karşı disiplinin sunabileceği analitik ve pratik ihtimalleri değerlendirmeyi amaçlıyor."
        },
        en: {
          lead: "The biennial congress of the European Association of Social Anthropologists will convene under the theme 'Anthropology in a Polarized World: Possibilities'.",
          text: "The conference aims to evaluate the analytical and practical possibilities the discipline can offer against fragmenting social structures."
        }
      },
      dates: [
        {
          date: "2026-06-22",
          tr: { title: "Erken Kayıt Sonu", desc: "İndirimli kayıt dönemi sona eriyor." },
          en: { title: "Early-Bird Deadline", desc: "Discounted registration period ends." },
          passed: false
        },
        {
          date: "2026-07-21",
          tr: { title: "Konferans Başlangıcı", desc: "Poznan'da oturumlar başlıyor." },
          en: { title: "Conference Starts", desc: "Sessions begin in Poznan." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Üyeler (Düşük/Orta/Yüksek Gelir)", early: "240 € / 295 € / 320 €", late: "340 € / 395 € / 420 €" },
          { cat: "Üye Olmayanlar (Düşük/Orta/Yüksek Gelir)", early: "308 € / 418 € / 474 €", late: "408 € / 518 € / 574 €" },
          { cat: "Online Üyeler (Düşük/Orta/Yüksek)", early: "120 € / 140 € / 170 €", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "Members (Low/Medium/High Income)", early: "€240 / €295 / €320", late: "€340 / €395 / €420" },
          { cat: "Non-members (Low/Medium/High Income)", early: "€308 / €418 / €474", late: "€408 / €518 / €574" },
          { cat: "Online Members (Low/Medium/High)", early: "€120 / €140 / €170", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Finansman Çağrısı", desc: "Düşük gelirli katılımcılar (aylık net geliri 1.200 € veya daha az) için konaklama, seyahat ve kayıt destek başvuruları kapanmıştır." },
          en: { title: "Funding Call", desc: "Funding applications for low-income participants (net income €1,200/month or less) for accommodation, travel, and registration are closed." }
        }
      ],
      conditions: [
        {
          tr: { title: "Hibrit Format", desc: "Konferans hibrit formatta gerçekleşmektedir. Yüz yüze katılımlarda %23 Polonya KDV'si uygulanır." },
          en: { title: "Hybrid Format", desc: "The conference takes place in a hybrid format. 23% Polish VAT applies to in-person participation fees." }
        },
        {
          tr: { title: "Sunum Sınırı", desc: "Delegeler genellikle kişi başı bir sunumla sınırlandırılmıştır." },
          en: { title: "Presentation Limit", desc: "Delegates are generally limited to one presentation per person." }
        }
      ]
    }
  },
  {
    id: "sha-2026",
    title: "SHA Fall Conference 2026",
    organizer: "Society for Humanistic Anthropology",
    domain: "americananthro.org",
    logo: "/logos/sha-2026-logo.png",
    link: "https://americananthro.org/event/society-for-humanistic-anthropology-sha-fall-conference-2026/",
    location: "New York, ABD",
    locationEn: "New York, USA",
    region: "Kuzey Amerika",
    regionEn: "North America",
    tagsEn: ["Anthropology", "Humanistic anthropology"],
    date: "2026-10-02",
    deadline: "2026-06-15",
    lastUpdated: "2026-06-14",
    tags: ["Antropoloji", "Hümanistik antropoloji"],
    grants: false,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Bu dar odaklı konferans, antropologları 'Üretken Bir Güç Olarak Arkadaşlık' teması etrafında buluşturuyor.",
          text: "Aidiyeti besleyen, toplulukları ayakta tutan ve sivil hayatı zenginleştiren bir bakım biçimi olarak arkadaşlığın antropolojik sınırları incelenecektir."
        },
        en: {
          lead: "This narrowly focused conference brings anthropologists together around the theme 'Friendship as a Generative Force'.",
          text: "The anthropological boundaries of friendship as a form of care that nurtures belonging, sustains communities, and enriches civic life will be examined."
        }
      },
      dates: [
        {
          date: "2026-10-02",
          tr: { title: "Konferans Başlangıcı", desc: "New York'ta etkinlikler başlıyor." },
          en: { title: "Conference Starts", desc: "Events begin in New York." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "AAA/SHA Üyeleri", early: "0 $ (Ücretsiz)", late: "0 $ (Ücretsiz)" },
          { cat: "Üye Olmayanlar", early: "35 $", late: "35 $" }
        ],
        en: [
          { cat: "AAA/SHA Members", early: "$0 (Free)", late: "$0 (Free)" },
          { cat: "Non-Members", early: "$35", late: "$35" }
        ]
      },
      grants: [
        {
          tr: { title: "Ödüller", desc: "SHA, öğrenci çalışmaları ve yaratıcı etnografik nesir/şiir için yıllık ödüller sunmaktadır. Ödüller (1.000 $, 500 $) genellikle sonbaharda verilir." },
          en: { title: "Awards", desc: "SHA offers annual awards for student scholarship and creative ethnographic prose/poetry. Prizes ($1,000, $500) are typically awarded in the autumn." }
        }
      ],
      conditions: [
        {
          tr: { title: "Sunum Sınırları", desc: "Katılımcılar genellikle bir panel teklifi veya yuvarlak masa tartışması ve bir ek çok modlu materyal ile sınırlıdır." },
          en: { title: "Presentation Limits", desc: "Participants are generally limited to one panel proposal or roundtable discussion, plus one additional multimodal material." }
        }
      ]
    }
  },
  {
    id: "aaa-2026",
    title: "125th AAA Annual Meeting",
    organizer: "American Anthropological Association",
    domain: "americananthro.org",
    logo: "/logos/aaa-2026-logo.png",
    link: "https://annualmeeting.americananthro.org/",
    location: "St. Louis, ABD",
    locationEn: "St. Louis, USA",
    region: "Kuzey Amerika",
    regionEn: "North America",
    tagsEn: ["Anthropology", "General anthropology"],
    date: "2026-11-18",
    deadline: "2026-03-25",
    lastUpdated: "2026-06-14",
    tags: ["Antropoloji", "Genel antropoloji"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Dünyanın en büyük antropoloji organizasyonu olan AAA'nın yıllık kongresi, 'Eşiğinde' ana temasıyla gerçekleşecektir.",
          text: "Kongrede, iklimsel devrilme noktaları, yayılan otoriterlik, ırksal biyopolitika ve kurumların geleceği gibi çoklu kriz anlarının antropolojik analizi yapılacaktır."
        },
        en: {
          lead: "The annual congress of the AAA, the world's largest anthropology organization, will take place with the main theme 'On the Verge'.",
          text: "Anthropological analysis of multiple crisis moments such as climatic tipping points, spreading authoritarianism, racial biopolitics, and the future of institutions will be conducted at the congress."
        }
      },
      dates: [
        {
          date: "2026-11-18",
          tr: { title: "Kongre Başlangıcı", desc: "St. Louis'de kongre oturumları başlıyor." },
          en: { title: "Congress Starts", desc: "Congress sessions begin in St. Louis." },
          passed: false
        },
        {
          date: "2026-12-21",
          tr: { title: "Çocuk Bakım Bursu Belge Teslimi", desc: "Burs için gerekli belgelerin son teslim tarihi." },
          en: { title: "Childcare Grant Documentation", desc: "Deadline to submit documentation for the childcare grant." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Ücretler", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "Fees", early: "NA", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Finansal Yardım ve Burslar", desc: "İhtiyaç sahibi üyeler için kayıt ücreti muafiyeti, yerli katılımcılar için tam muafiyet ve çocuk bakım masraflarını karşılamak üzere 250 $'a kadar burs sağlanmaktadır." },
          en: { title: "Financial Aid & Grants", desc: "Registration fee waivers for members in need, full waivers for indigenous attendees, and grants up to $250 to offset childcare costs are provided." }
        }
      ],
      conditions: [
        {
          tr: { title: "İndirimli Üyelik Fiyatları", desc: "İndirimli fiyatlardan yararlanmak için AAA üyeliğinin aktif tutulması gerekmektedir." },
          en: { title: "Discounted Member Pricing", desc: "An active AAA membership is recommended to secure discounted member pricing." }
        }
      ]
    }
  },

  //KÜLTÜREL ÇALIŞMALAR KONFERANSLARI
 
  {
    id: "acs-crossroads-2026",
    title: "Crossroads in Cultural Studies 2026",
    organizer: "Association for Cultural Studies",
    domain: "cultstud.org",
    logo: "/logos/Association_for_Cultural_Studies.png",
    link: "https://crossroads2026.com/en/",
    location: "Belo Horizonte, Brezilya",
    locationEn: "Belo Horizonte, Brazil",
    region: "Güney Amerika",
    regionEn: "South America",
    tagsEn: ["Cultural studies", "Decolonial studies"],
    date: "2026-07-27",
    deadline: "2026-01-19",
    lastUpdated: "2026-06-14",
    tags: ["Kültürel çalışmalar", "Dekolonyal çalışmalar"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Kültürel çalışmalar alanında dünyanın önde gelen uluslararası konferansıdır.",
          text: "'Kültürel Çalışmaları Dekolonize Etmek: Boş Zaman, Bedenler, Performanslar, Bölgeler ve Üniversiteler' temasıyla Brezilya'da düzenlenecektir."
        },
        en: {
          lead: "The world's leading international conference in the field of cultural studies.",
          text: "It will be held in Brazil with the theme 'Decolonizing Cultural Studies: Leisure, Bodies, Performances, Territories and Universities'."
        }
      },
      dates: [
        {
          date: "2026-04-20",
          tr: { title: "Erken Kayıt Sonu", desc: "İndirimli kayıt dönemi için ilk aşama kapanıyor." },
          en: { title: "Early Bird Deadline", desc: "The first phase of the discounted registration period closes." },
          passed: false
        },
        {
          date: "2026-05-01",
          tr: { title: "Fon Başvurusu", desc: "ACS Yardım Fonu başvuruları için son tarih." },
          en: { title: "Funding Application", desc: "Deadline for ACS Assistance Fund applications." },
          passed: false
        },
        {
          date: "2026-07-27",
          tr: { title: "Konferans Başlangıcı", desc: "Belo Horizonte'de konferans başlıyor." },
          en: { title: "Conference Starts", desc: "Conference begins in Belo Horizonte." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Tier 1 Ülkeler (Üye Olmayan/Üye)", early: "150 € / 60 €", late: "200 € / 80 €" },
          { cat: "Tier 2 Ülkeler (Üye Olmayan/Üye)", early: "100 € / 50 €", late: "150 € / 70 €" },
          { cat: "Tier 3 Ülkeler (Üye Olmayan/Üye)", early: "85 € / 40 €", late: "100 € / 60 €" },
          { cat: "Öğrenciler", early: "30 €", late: "30 €" }
        ],
        en: [
          { cat: "Tier 1 Countries (Non-Member/Member)", early: "€150 / €60", late: "€200 / €80" },
          { cat: "Tier 2 Countries (Non-Member/Member)", early: "€100 / €50", late: "€150 / €70" },
          { cat: "Tier 3 Countries (Non-Member/Member)", early: "€85 / €40", late: "€100 / €60" },
          { cat: "Students", early: "€30", late: "€30" }
        ]
      },
      grants: [
        {
          tr: { title: "ACS Yardım Fonu", desc: "Bildirisi kabul edilen katılımcılar, konferans masraflarına destek için ACS Yardım Fonu'na başvurabilirler." },
          en: { title: "ACS Assistance Fund", desc: "Participants with accepted proposals can apply to the ACS Assistance Fund for support." }
        }
      ],
      conditions: [
        {
          tr: { title: "İndirimli Ücretler", desc: "Kayıt ücretlerinde sunulan önemli indirimlerden faydalanmak için aktif ACS üyeliği gereklidir." },
          en: { title: "Discounted Fees", desc: "An active ACS membership is required to benefit from significant discounts on registration fees." }
        }
      ]
    }
  },
  {
    id: "csa-2027",
    title: "CSA Annual Conference 2027",
    organizer: "Cultural Studies Association",
    domain: "culturalstudiesassociation.org",
    logo: "/logos/csa-2027-logo.png",
    link: "https://www.culturalstudiesassociation.org/",
    location: "Online",
    locationEn: "Online",
    region: "Online",
    regionEn: "Online",
    tagsEn: ["Cultural studies", "Critical theory"],
    date: "2027-05-27",
    deadline: "2027-01-15",
    lastUpdated: "2026-06-14",
    tags: ["Kültürel çalışmalar", "Eleştirel teori"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Kültürel Çalışmalar Derneği (CSA) Yıllık Konferansı, medya, popüler kültür ve toplumsal hareketlerin eleştirel analizine odaklanır.",
          text: "2027 yılı konferansı tamamen çevrimiçi (online) olarak gerçekleştirilecektir."
        },
        en: {
          lead: "The Cultural Studies Association (CSA) Annual Conference focuses on the critical analysis of media, popular culture, and social movements.",
          text: "The 2027 conference will be held entirely online."
        }
      },
      dates: [
        {
          date: "2027-01-15",
          tr: { title: "Sunum Teklifleri Sonu", desc: "Tebliğ ve panel teklifleri için son tarih." },
          en: { title: "Proposal Deadline", desc: "Final deadline for paper and panel proposals." },
          passed: false
        },
        {
          date: "2027-05-27",
          tr: { title: "Konferans Başlangıcı", desc: "Çevrimiçi oturumların başlaması." },
          en: { title: "Conference Starts", desc: "Online sessions begin." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Ücretler", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "Fees", early: "NA", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Seyahat ve Katılım Bursları", desc: "Öğrenci üyeler için Yurtiçi ($300) ve Yurtdışı ($500) seyahat hibeleri sunulmaktadır (Son başvuru: 15 Nisan 2027)." },
          en: { title: "Travel and Participation Grants", desc: "Domestic ($300) and International ($500) travel grants are offered for student members (Deadline: April 15, 2027)." }
        }
      ],
      conditions: [
        {
          tr: { title: "Format", desc: "Bu yılki konferans tamamen çevrimiçi formatta gerçekleştirilecektir." },
          en: { title: "Format", desc: "This year's conference will be held in a fully online format." }
        },
        {
          tr: { title: "Kayıt ve Üyelik", desc: "CSA'da konferans kaydı ile yıllık üyelik genellikle tek bir işlem olarak gerçekleştirilir." },
          en: { title: "Registration and Membership", desc: "Conference registration and annual membership in CSA are typically combined into a single transaction." }
        }
      ]
    }
  },
  {
    id: "meccsa-2026",
    title: "MeCCSA Annual Conference 2026",
    organizer: "Media, Communication and Cultural Studies Association",
    domain: "meccsa.org.uk",
    logo: "/logos/Media_Communication_and_Cultural_Studies_Association.png",
    link: "https://meccsa2026.le.ac.uk/",
    location: "Leicester, Birleşik Krallık",
    locationEn: "Leicester, United Kingdom",
    region: "Avrupa",
    regionEn: "Europe",
    tagsEn: ["Cultural studies", "Media studies"],
    date: "2026-09-02",
    deadline: "2026-02-20",
    lastUpdated: "2026-06-14",
    tags: ["Kültürel çalışmalar", "Medya çalışmaları"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Medya, iletişim ve kültürel çalışmalar alanında Birleşik Krallık'ın en önemli akademik buluşmasıdır.",
          text: "'Ana Akımdan Kenarlara: Gelişen Pratikleri, Kamuları ve İknayı Yakalamak' temasıyla Leicester Üniversitesi'nde düzenlenecektir."
        },
        en: {
          lead: "The UK's most important academic gathering in the fields of media, communication, and cultural studies.",
          text: "It will be held at the University of Leicester with the theme 'From mainstream to margins: Capturing developing practices, publics and persuasion'."
        }
      },
      dates: [
        {
          date: "2026-03-26",
          tr: { title: "Öneri Gönderimi Sonu", desc: "Bildiri önerileri için son tarih kapanmıştır." },
          en: { title: "Proposal Submission Deadline", desc: "Deadline for paper proposals has closed." },
          passed: true
        },
        {
          date: "2026-07-15",
          tr: { title: "Erken Kayıt Sonu", desc: "İndirimli kayıt dönemi sona eriyor." },
          en: { title: "Early Bird Deadline", desc: "Discounted registration period ends." },
          passed: false
        },
        {
          date: "2026-09-02",
          tr: { title: "Konferans Başlangıcı", desc: "Leicester'da konferans başlıyor." },
          en: { title: "Conference Starts", desc: "Conference begins in Leicester." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Ücretler", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "Fees", early: "NA", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Doktora Bursları (PhD Bursary)", desc: "MeCCSA, yıllık konferansa katılan lisansüstü öğrencileri desteklemek için Doktora Burs programı sunmaktadır." },
          en: { title: "PhD Bursaries", desc: "MeCCSA offers a PhD Bursary scheme to support postgraduate students attending the annual conference." }
        }
      ],
      conditions: [
        {
          tr: { title: "Lisansüstü Ağı", desc: "Ana konferansın yanı sıra, 9 Eylül 2026'da Reading Üniversitesi'nde ayrı bir Lisansüstü Ağı Konferansı düzenlenecektir." },
          en: { title: "Postgraduate Network", desc: "In addition to the main conference, a separate Postgraduate Network Conference will be held at the University of Reading on September 9, 2026." }
        }
      ]
    }
  },
  {
    id: "msa-forward-2026",
    title: "MSA Forward Workshop 2026",
    organizer: "Memory Studies Association",
    domain: "memorystudiesassociation.org",
    logo: "/logos/Memory_Studies_Association.png",
    link: "https://www.memorystudiesassociation.org/call-for-papers-msa-forward-2026/",
    location: "Buenos Aires, Arjantin",
    locationEn: "Buenos Aires, Argentina",
    region: "Güney Amerika",
    regionEn: "South America",
    tagsEn: ["Cultural studies", "Memory studies"],
    date: "2026-07-28",
    deadline: "2026-03-06",
    lastUpdated: "2026-06-14",
    tags: ["Kültürel çalışmalar", "Hafıza çalışmaları"],
    grants: false,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Hafıza Çalışmaları Derneği'nin 10. Yıllık Konferansı kapsamında düzenlenen MSA Forward, alanında ileri düzey çalışmalar yapan araştırmacılar için tasarlanmış dar odaklı bir atölyedir.",
          text: "Hafıza politikaları, kültürel aktarım, kesişimsellik ve inkar süreçleri üzerine odaklanarak kültürel incelemelerin en dinamik sınırlarından birini oluşturur."
        },
        en: {
          lead: "Organized as part of the Memory Studies Association's 10th Annual Conference, MSA Forward is a focused workshop designed for advanced researchers in the field.",
          text: "It forms one of the most dynamic frontiers of cultural inquiry by focusing on memory politics, cultural transmission, intersectionality, and processes of denial."
        }
      },
      dates: [
        {
          date: "2026-07-28",
          tr: { title: "Atölye Başlangıcı", desc: "Buenos Aires'te oturumlar başlıyor." },
          en: { title: "Workshop Starts", desc: "Sessions begin in Buenos Aires." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Ücretler", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "Fees", early: "NA", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Burslar", desc: "Atölye için özel bir burs bilgisi bulunmamaktadır." },
          en: { title: "Grants", desc: "There is no specific grant information for the workshop." }
        }
      ],
      conditions: [
        {
          tr: { title: "Katılım", desc: "MSA Forward, seçilmiş araştırmacılara açık, atölye odaklı bir etkinliktir." },
          en: { title: "Participation", desc: "MSA Forward is a workshop-focused event open to selected researchers." }
        }
      ]
    }
  },
  {
    id: "pca-2027",
    title: "PCA National Conference 2027",
    organizer: "Popular Culture Association",
    domain: "pcaaca.org",
    logo: "/logos/pca-2027-logo.jpg",
    link: "https://pcaaca.org/",
    location: "Boston, ABD",
    locationEn: "Boston, USA",
    region: "Kuzey Amerika",
    regionEn: "North America",
    tagsEn: ["Cultural studies", "Popular culture"],
    date: "2027-03-24",
    deadline: "2026-12-15",
    lastUpdated: "2026-06-14",
    tags: ["Kültürel çalışmalar", "Popüler kültür"],
    grants: true,
    details: {
      type: "custom",
      summary: {
        tr: {
          lead: "Popüler Kültür Derneği (PCA) tarafından düzenlenen ve kültürel teorileri gündelik pratiklerle harmanlayan devasa bir platformdur.",
          text: "Edebiyattan televizyon ve dijital kültüre kadar uzanan yüze yakın farklı konu başlığında özel oturumlar gerçekleştirilir."
        },
        en: {
          lead: "A massive platform organized by the Popular Culture Association (PCA) that blends cultural theories with everyday practices.",
          text: "Special sessions are held on nearly a hundred different topics ranging from literature to television and digital culture."
        }
      },
      dates: [
        {
          date: "2026-08-01",
          tr: { title: "Bildiri Çağrısı Açılışı", desc: "2027 Yıllık Konferansı için başvurular açılıyor." },
          en: { title: "Call for Papers Opens", desc: "Submissions open for the 2027 Annual Conference." },
          passed: false
        },
        {
          date: "2027-03-24",
          tr: { title: "Konferans Başlangıcı", desc: "Boston'da konferans etkinlikleri başlıyor." },
          en: { title: "Conference Starts", desc: "Conference events begin in Boston." },
          passed: false
        }
      ],
      fees: {
        tr: [
          { cat: "Ücretler", early: "Tarih belirlenmedi", late: "Tarih belirlenmedi" }
        ],
        en: [
          { cat: "Fees", early: "NA", late: "NA" }
        ]
      },
      grants: [
        {
          tr: { title: "Seyahat Bursları", desc: "Aktif üyeler için seyahat bursları mevcuttur. Başvurularda kabul edilmiş bir özet ve mesleki hedefleri açıklayan bir beyan gereklidir." },
          en: { title: "Travel Grants", desc: "Travel grants are available for active members. Applications require an accepted abstract and a statement of professional goals." }
        }
      ],
      conditions: [
        {
          tr: { title: "Katılım Şartı", desc: "Sunum yapmak için aktif PCA üyeliği gereklidir ve katılımcılar konferans başına yalnızca bir sunum ile sınırlandırılmıştır." },
          en: { title: "Participation Condition", desc: "An active PCA membership is required to present, and participants are limited to one presentation per conference." }
        }
      ]
    }
  }
];
