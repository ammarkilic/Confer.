import React, { useState, useEffect } from 'react';
import { conferences } from './data';
import { t } from './translations';

const parseMarkdownLinks = (text) => {
  if (!text) return "";
  const parts = [];
  let lastIndex = 0;
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#ff9ab3] hover:text-[#e07b94] font-semibold underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
      >
        {match[1]}
        <span className="text-[10px]">↗</span>
      </a>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
};

export default function ConferFlatDesign() {
  const [lang, setLang] = useState('tr');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState("deadlineAsc");

  const [selectedData, setSelectedData] = useState(null);

  // State definitions for elevated features
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('confer_favorites') || '[]');
    } catch {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("cfp");
  const [openingCardId, setOpeningCardId] = useState(null);

  // New Calendar States
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [calendarShowBy, setCalendarShowBy] = useState('deadline'); // 'deadline' or 'eventDate'
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 0, 1)); // start at January 2026

  const [mobileFiltersExpanded, setMobileFiltersExpanded] = useState(false);

  // Lock body scrolling when details modal is open
  useEffect(() => {
    if (selectedData) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedData]);

  // LocalStorage synchronizations
  useEffect(() => {
    localStorage.setItem('confer_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Reset active tab in details drawer when selected conference changes
  useEffect(() => {
    if (selectedData && selectedData.conf.details) {
      if (selectedData.conf.details.type === "custom") {
        setActiveTab("summary");
      } else {
        setActiveTab("cfp");
      }
    } else {
      setActiveTab("cfp");
    }
  }, [selectedData]);

  // Tarihleri 1 Ocak 2026 veya January 1, 2026 formatına çeviren yardımcı fonksiyon
  const formatDate = (dateStr, currentLang) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(currentLang === 'tr' ? 'tr-TR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRemainingDays = (deadlineDate) => {
    if (!deadlineDate) return -1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineDate);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const currentTags = conferences.flatMap(c => lang === 'tr' ? c.tags : c.tagsEn);
  const allTags = [...new Set(currentTags)].sort();

  const currentRegions = conferences.map(c => lang === 'tr' ? c.region : c.regionEn);
  const allLocations = [...new Set(currentRegions)].sort();

  const filtered = conferences.filter(c => {
    const titleMatch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const orgMatch = c.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSearch = titleMatch || orgMatch;

    const confTags = lang === 'tr' ? c.tags : c.tagsEn;
    const matchTag = selectedTags.length === 0 || confTags.some(t => selectedTags.includes(t));

    const confRegion = lang === 'tr' ? c.region : c.regionEn;
    const matchLocation = selectedRegions.length === 0 || selectedRegions.includes(confRegion);

    const matchType = selectedTypes.length === 0 || selectedTypes.includes(c.type);

    const matchFavorites = !showFavoritesOnly || favorites.includes(c.id);
    const matchOpenOnly = !showOpenOnly || getRemainingDays(c.deadline) >= 0;

    return matchSearch && matchTag && matchLocation && matchType && matchFavorites && matchOpenOnly;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "deadlineAsc") return new Date(a.deadline) - new Date(b.deadline);
    if (sortBy === "deadlineDesc") return new Date(b.deadline) - new Date(a.deadline);
    if (sortBy === "dateAsc") return new Date(a.date) - new Date(b.date);
    if (sortBy === "titleAsc") return a.title.localeCompare(b.title, lang === 'tr' ? 'tr' : 'en');
    if (sortBy === "grantsFirst") {
      if (a.grants === b.grants) return new Date(a.deadline) - new Date(b.deadline);
      return a.grants ? -1 : 1;
    }
    return 0;
  });

  const getDeadlineStatus = (deadlineDate) => {
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: t[lang].closed,
        style: "bg-red-50 text-red-700 border border-red-200/80 font-semibold"
      };
    }
    if (diffDays <= 15) {
      return {
        text: `${t[lang].lastDays} ${diffDays} ${t[lang].days}`,
        style: "bg-red-50 text-red-800 border border-red-200 font-semibold"
      };
    }
    return {
      text: t[lang].open,
      style: "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
    };
  };

  const getGoogleCalendarUrl = (conf) => {
    const startDate = conf.date.replace(/-/g, '');
    const endObj = new Date(conf.date);
    endObj.setDate(endObj.getDate() + 1);
    const endDate = endObj.toISOString().split('T')[0].replace(/-/g, '');
    const title = encodeURIComponent(conf.title);
    const loc = lang === 'tr' ? conf.location : conf.locationEn;
    const details = encodeURIComponent(`${conf.organizer}\n\n${conf.link}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${encodeURIComponent(loc)}`;
  };

  const elegantStyle = {
    cardBg: "bg-[#EFE9E3]",
    border: "border-[#d6cdbf]/60",
    text: "text-[#5c554a]",
    tagBg: "bg-[#EFE9E3]/35 text-[#5c554a]"
  };

  const retroStyles = Array(6).fill(elegantStyle);

  // Calendar Calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayIndex = (y, m) => {
    const day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayIndex(year, month);

  const prevMonthDate = new Date(year, month - 1, 1);
  const daysInPrevMonth = getDaysInMonth(prevMonthDate.getFullYear(), prevMonthDate.getMonth());

  const calendarCells = [];

  // Fill previous month padding days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
      isPadding: true
    });
  }

  // Fill current month days
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    calendarCells.push({
      day: i,
      month: month,
      year: year,
      isPadding: false
    });
  }

  // Fill next month padding days
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      day: i,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year,
      isPadding: true
    });
  }

  const getFormattedDateString = (y, m, d) => {
    const pad = (num) => String(num).padStart(2, '0');
    return `${y}-${pad(m + 1)}-${pad(d)}`;
  };

  const getConferencesForCell = (cell) => {
    const dateStr = getFormattedDateString(cell.year, cell.month, cell.day);
    return sorted.filter(c => {
      const targetDate = calendarShowBy === 'deadline' ? c.deadline : c.date;
      return targetDate === dateStr;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="min-h-screen font-sans p-4 sm:p-8 relative transition-colors duration-300 text-[#2a2421]">

      {/* SVG Mask Definition for Perforated Stamps */}
      <svg width="0" height="0" className="absolute pointer-events-none opacity-0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <mask id="stamp-mask-aps" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="60">
            {/* White base rect */}
            <rect x="0" y="0" width="48" height="60" fill="white" />

            {/* Top border perforations (x spacing 8px, y = 0) */}
            <circle cx="0" cy="0" r="3" fill="black" />
            <circle cx="8" cy="0" r="3" fill="black" />
            <circle cx="16" cy="0" r="3" fill="black" />
            <circle cx="24" cy="0" r="3" fill="black" />
            <circle cx="32" cy="0" r="3" fill="black" />
            <circle cx="40" cy="0" r="3" fill="black" />
            <circle cx="48" cy="0" r="3" fill="black" />

            {/* Bottom border perforations (x spacing 8px, y = 60) */}
            <circle cx="0" cy="60" r="3" fill="black" />
            <circle cx="8" cy="60" r="3" fill="black" />
            <circle cx="16" cy="60" r="3" fill="black" />
            <circle cx="24" cy="60" r="3" fill="black" />
            <circle cx="32" cy="60" r="3" fill="black" />
            <circle cx="40" cy="60" r="3" fill="black" />
            <circle cx="48" cy="60" r="3" fill="black" />

            {/* Left border perforations (y spacing 10px, x = 0) */}
            <circle cx="0" cy="10" r="3" fill="black" />
            <circle cx="0" cy="20" r="3" fill="black" />
            <circle cx="0" cy="30" r="3" fill="black" />
            <circle cx="0" cy="40" r="3" fill="black" />
            <circle cx="0" cy="50" r="3" fill="black" />

            {/* Right border perforations (y spacing 10px, x = 48) */}
            <circle cx="48" cy="10" r="3" fill="black" />
            <circle cx="48" cy="20" r="3" fill="black" />
            <circle cx="48" cy="30" r="3" fill="black" />
            <circle cx="48" cy="40" r="3" fill="black" />
            <circle cx="48" cy="50" r="3" fill="black" />
          </mask>

          <mask id="stamp-mask-aps-drawer" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="80">
            {/* White base rect */}
            <rect x="0" y="0" width="64" height="80" fill="white" />

            {/* Top border perforations (x spacing 8px, y = 0) */}
            <circle cx="0" cy="0" r="3" fill="black" />
            <circle cx="8" cy="0" r="3" fill="black" />
            <circle cx="16" cy="0" r="3" fill="black" />
            <circle cx="24" cy="0" r="3" fill="black" />
            <circle cx="32" cy="0" r="3" fill="black" />
            <circle cx="40" cy="0" r="3" fill="black" />
            <circle cx="48" cy="0" r="3" fill="black" />
            <circle cx="56" cy="0" r="3" fill="black" />
            <circle cx="64" cy="0" r="3" fill="black" />

            {/* Bottom border perforations (x spacing 8px, y = 80) */}
            <circle cx="0" cy="80" r="3" fill="black" />
            <circle cx="8" cy="80" r="3" fill="black" />
            <circle cx="16" cy="80" r="3" fill="black" />
            <circle cx="24" cy="80" r="3" fill="black" />
            <circle cx="32" cy="80" r="3" fill="black" />
            <circle cx="40" cy="80" r="3" fill="black" />
            <circle cx="48" cy="80" r="3" fill="black" />
            <circle cx="56" cy="80" r="3" fill="black" />
            <circle cx="64" cy="80" r="3" fill="black" />

            {/* Left border perforations (y spacing 10px, x = 0) */}
            <circle cx="0" cy="10" r="3" fill="black" />
            <circle cx="0" cy="20" r="3" fill="black" />
            <circle cx="0" cy="30" r="3" fill="black" />
            <circle cx="0" cy="40" r="3" fill="black" />
            <circle cx="0" cy="50" r="3" fill="black" />
            <circle cx="0" cy="60" r="3" fill="black" />
            <circle cx="0" cy="70" r="3" fill="black" />

            {/* Right border perforations (y spacing 10px, x = 64) */}
            <circle cx="64" cy="10" r="3" fill="black" />
            <circle cx="64" cy="20" r="3" fill="black" />
            <circle cx="64" cy="30" r="3" fill="black" />
            <circle cx="64" cy="40" r="3" fill="black" />
            <circle cx="64" cy="50" r="3" fill="black" />
            <circle cx="64" cy="60" r="3" fill="black" />
            <circle cx="64" cy="70" r="3" fill="black" />
          </mask>
        </defs>
      </svg>

      {/* ÜST BAŞLIK BÖLÜMÜ */}
      <header className="max-w-7xl mx-auto mb-3 flex flex-wrap justify-between items-end gap-4 border-b border-black/5 pb-3">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold font-fira-bold tracking-tight text-[#2a2421] flex items-center gap-0.5 mb-1 select-none">
            Confer<span className="text-[#ff9ab3] font-serif font-black">.</span>
          </h1>
          <p className="text-stone-500 font-fira-regular text-xs md:text-[13px] tracking-tight whitespace-nowrap mt-1">{t[lang].subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Selector */}
          <div className="flex bg-white rounded-full p-0.5 shadow-sm border border-black/5">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-full text-xs font-fira-semibold transition-all duration-300 ${viewMode === 'list'
                ? 'bg-[#2a2421] text-white shadow-sm'
                : 'bg-transparent text-[#5a5451] hover:bg-black/5'
                }`}
            >
              {t[lang].listView}
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-full text-xs font-fira-semibold transition-all duration-300 ${viewMode === 'calendar'
                ? 'bg-[#2a2421] text-white shadow-sm'
                : 'bg-transparent text-[#5a5451] hover:bg-black/5'
                }`}
            >
              {t[lang].calendarView}
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-full text-xs font-fira-semibold transition-all duration-300 ${viewMode === 'map'
                ? 'bg-[#2a2421] text-white shadow-sm'
                : 'bg-transparent text-[#5a5451] hover:bg-black/5'
                }`}
            >
              {t[lang].mapView}
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex bg-white rounded-full p-0.5 shadow-sm border border-black/5">
            <button
              onClick={() => { setLang('tr'); setSelectedTags([]); setSelectedRegions([]); setSelectedTypes([]); }}
              className={`px-3 py-1 rounded-full text-xs font-fira-semibold transition-all duration-300 ${lang === 'tr'
                ? 'bg-[#2a2421] text-white shadow-sm'
                : 'bg-transparent text-[#5a5451] hover:bg-black/5'
                }`}
            >
              TR
            </button>
            <button
              onClick={() => { setLang('en'); setSelectedTags([]); setSelectedRegions([]); setSelectedTypes([]); }}
              className={`px-3 py-1 rounded-full text-xs font-fira-semibold transition-all duration-300 ${lang === 'en'
                ? 'bg-[#2a2421] text-white shadow-sm'
                : 'bg-transparent text-[#5a5451] hover:bg-black/5'
                }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* ANA GRID DÜZENİ */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pt-2 lg:pt-8">

        {/* SOL STICKY FİLTRE PANELİ */}
        <aside className="lg:col-span-1 lg:sticky lg:top-8 w-full z-20">
          <div className="rounded-2xl p-6 flex flex-col gap-4 shadow-md border border-black/5 bg-gradient-to-br from-white via-[#fcfbfa] to-[#f6f5f2]">
            <div className="flex justify-between items-start gap-2 mb-0">
              <div>
                <h2 className="text-xl tracking-tight text-[#2a2421] font-fira-semibold">
                  {lang === 'tr' ? 'Filtrele' : 'Filter'}
                </h2>
              </div>
              {(selectedTags.length > 0 || selectedRegions.length > 0 || selectedTypes.length > 0 || searchTerm !== "" || showFavoritesOnly || showOpenOnly) && (
                <button
                  onClick={() => {
                    setSelectedTags([]);
                    setSelectedRegions([]);
                    setSelectedTypes([]);
                    setSearchTerm("");
                    setShowFavoritesOnly(false);
                    setShowOpenOnly(false);
                  }}
                  className="text-[10px] font-semibold font-fira-regular transition-colors px-2 py-1 rounded-full shadow-xs whitespace-nowrap shrink-0 border bg-white text-[#ff9ab3] hover:text-[#e07b94] border-[#ff9ab3]/20 hover:border-[#ff9ab3]/40"
                >
                  {lang === 'tr' ? 'Temizle' : 'Clear'}
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Search input */}
              <div>
                <input
                  type="text"
                  placeholder={t[lang].searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 transition-all font-fira-regular font-normal shadow-inner bg-white border-black/5 text-[#2a2421] focus:ring-[#2a2421] placeholder:text-[11px]"
                />
              </div>

              {/* Mobile Advanced Filters Toggle Button */}
              <button
                onClick={() => setMobileFiltersExpanded(!mobileFiltersExpanded)}
                className="flex lg:hidden w-full items-center justify-between gap-2 border border-[#2a2421]/10 bg-[#2a2421] hover:bg-[#3d3430] text-[#fcfbfa] text-xs font-fira-semibold px-4 py-3 rounded-2xl select-none transition-all duration-300 shadow-sm"
              >
                <span>{lang === 'tr' ? (mobileFiltersExpanded ? 'Gelişmiş Filtreleri Gizle' : 'Gelişmiş Filtreleri Göster') : (mobileFiltersExpanded ? 'Hide Advanced Filters' : 'Show Advanced Filters')}</span>
                <span className={`text-[10px] transition-transform duration-300 ${mobileFiltersExpanded ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {/* Advanced Filters Content (Collapsible on Mobile, Always Visible on Desktop) */}
              <div className={`${mobileFiltersExpanded ? 'flex' : 'hidden lg:flex'} flex-col gap-4`}>
                {/* Favorites & Open Applications Checkboxes */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2.5 text-sm cursor-pointer p-2.5 rounded-xl border border-black/5 bg-white text-[#2a2421] select-none shadow-sm">
                    <input
                      type="checkbox"
                      checked={showFavoritesOnly}
                      onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                      className="w-4 h-4 rounded focus:ring-offset-0 cursor-pointer accent-[#2a2421]"
                    />
                    <span className="font-fira-regular font-semibold text-xs leading-none">{t[lang].favoritesOnly}</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-sm cursor-pointer p-2.5 rounded-xl border border-black/5 bg-white text-[#2a2421] select-none shadow-sm">
                    <input
                      type="checkbox"
                      checked={showOpenOnly}
                      onChange={(e) => setShowOpenOnly(e.target.checked)}
                      className="w-4 h-4 rounded focus:ring-offset-0 cursor-pointer accent-[#2a2421]"
                    />
                    <span className="font-fira-regular font-semibold text-xs leading-none">{t[lang].openOnly}</span>
                  </label>
                </div>

                {/* Discipline filter */}
                <div>
                  <details className="group border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 border-black/5 bg-white">
                    <summary className="flex justify-between items-center px-4 py-3 text-xs font-medium cursor-pointer list-none select-none text-[#2a2421] hover:bg-black/[0.02] font-fira-regular">
                      <span>{t[lang].discipline} {selectedTags.length > 0 && `(${selectedTags.length})`}</span>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </span>
                    </summary>
                    <div className="p-3 border-t max-h-48 overflow-y-auto space-y-2 custom-scrollbar shadow-inner border-black/5 bg-[#faf9f6]">
                      {allTags.map(tag => (
                        <label key={tag} className="flex items-center gap-2.5 text-sm cursor-pointer p-1.5 rounded-xl transition-colors select-none text-[#2a2421] hover:bg-black/[0.02]">
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTags([...selectedTags, tag]);
                              } else {
                                setSelectedTags(selectedTags.filter(t => t !== tag));
                              }
                            }}
                            className="w-4 h-4 rounded border-black/10 focus:ring-offset-0 cursor-pointer accent-[#2a2421]"
                          />
                          <span className="font-fira-regular font-semibold text-xs leading-none">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </details>
                </div>

                {/* Region filter */}
                <div>
                  <details className="group border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 border-black/5 bg-white">
                    <summary className="flex justify-between items-center px-4 py-3 text-xs font-medium cursor-pointer list-none select-none text-[#2a2421] hover:bg-black/[0.02] font-fira-regular">
                      <span>{t[lang].region} {selectedRegions.length > 0 && `(${selectedRegions.length})`}</span>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </span>
                    </summary>
                    <div className="p-3 border-t space-y-2 shadow-inner border-black/5 bg-[#faf9f6]">
                      {allLocations.map(loc => (
                        <label key={loc} className="flex items-center gap-2.5 text-sm cursor-pointer p-1.5 rounded-xl transition-colors select-none text-[#2a2421] hover:bg-black/[0.02]">
                          <input
                            type="checkbox"
                            checked={selectedRegions.includes(loc)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRegions([...selectedRegions, loc]);
                              } else {
                                setSelectedRegions(selectedRegions.filter(l => l !== loc));
                              }
                            }}
                            className="w-4 h-4 rounded border-black/10 focus:ring-offset-0 cursor-pointer accent-[#2a2421]"
                          />
                          <span className="font-fira-regular font-semibold text-xs leading-none">{loc}</span>
                        </label>
                      ))}
                    </div>
                  </details>
                </div>

                {/* Type filter */}
                <div>
                  <details className="group border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 border-black/5 bg-white">
                    <summary className="flex justify-between items-center px-4 py-3 text-xs font-medium cursor-pointer list-none select-none text-[#2a2421] hover:bg-black/[0.02] font-fira-regular">
                      <span>{t[lang].eventType} {selectedTypes.length > 0 && `(${selectedTypes.length})`}</span>
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </span>
                    </summary>
                    <div className="p-3 border-t space-y-2 shadow-inner border-black/5 bg-[#faf9f6]">
                      {['konferans', 'atölye', 'yaz okulu'].map(typeKey => {
                        const typeLabel = typeKey === 'konferans' ? t[lang].conference
                          : typeKey === 'atölye' ? t[lang].workshop
                            : t[lang].summerSchool;
                        return (
                          <label key={typeKey} className="flex items-center gap-2.5 text-sm cursor-pointer p-1.5 rounded-xl transition-colors select-none text-[#2a2421] hover:bg-black/[0.02]">
                            <input
                              type="checkbox"
                              checked={selectedTypes.includes(typeKey)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTypes([...selectedTypes, typeKey]);
                                } else {
                                  setSelectedTypes(selectedTypes.filter(t => t !== typeKey));
                                }
                              }}
                              className="w-4 h-4 rounded border-black/10 focus:ring-offset-0 cursor-pointer accent-[#2a2421]"
                            />
                            <span className="font-fira-regular font-semibold text-xs leading-none">{typeLabel}</span>
                          </label>
                        );
                      })}
                    </div>
                  </details>
                </div>

                {/* Sorting */}
                <div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="select-custom w-full border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 font-fira-regular font-normal shadow-sm cursor-pointer bg-white border-black/5 text-[#2a2421] ring-[#2a2421]"
                  >
                    <option value="deadlineAsc">{t[lang].sortDeadlineAsc}</option>
                    <option value="deadlineDesc">{t[lang].sortDeadlineDesc}</option>
                    <option value="dateAsc">{t[lang].sortDateAsc}</option>
                    <option value="titleAsc">{t[lang].sortTitleAsc}</option>
                    <option value="grantsFirst">{t[lang].sortGrantsFirst}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* SAĞ PANEL: LİSTE VEYA TAKVİM GÖRÜNÜMÜ */}
        <section className="lg:col-span-3 w-full">
          {viewMode === 'calendar' ? (
            /* TAKVİM GÖRÜNÜMÜ */
            <div className="w-full font-fira-regular">
              {/* Takvim Kontrol Menüsü */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white border border-black/5 p-2 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="w-8 h-8 flex items-center justify-center bg-[#faf9f6] hover:bg-black/5 text-[#2a2421] border border-black/5 rounded-full shadow-xs transition-colors text-sm font-bold"
                    title={t[lang].prevMonth}
                  >
                    ‹
                  </button>

                  <div className="flex items-center gap-1">
                    <select
                      value={month}
                      onChange={(e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1))}
                      className="select-custom bg-transparent border-none text-sm font-fira-semibold text-[#2a2421] cursor-pointer focus:ring-0 py-0.5 pl-1.5 pr-5"
                    >
                      {t[lang].months.map((mName, idx) => (
                        <option key={idx} value={idx}>{mName}</option>
                      ))}
                    </select>

                    <select
                      value={year}
                      onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1))}
                      className="select-custom bg-transparent border-none text-sm font-fira-semibold text-[#2a2421] cursor-pointer focus:ring-0 py-0.5 pl-1.5 pr-5"
                    >
                      <option value={2025}>2025</option>
                      <option value={2026}>2026</option>
                      <option value={2027}>2027</option>
                    </select>
                  </div>

                  <button
                    onClick={handleNextMonth}
                    className="w-8 h-8 flex items-center justify-center bg-[#faf9f6] hover:bg-black/5 text-[#2a2421] border border-black/5 rounded-full shadow-xs transition-colors text-sm font-bold"
                    title={t[lang].nextMonth}
                  >
                    ›
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-fira-semibold text-neutral-500">{t[lang].calendarShowBy}:</span>
                  <div className="flex bg-[#faf9f6] rounded-full p-0.5 border border-black/5 shadow-inner">
                    <button
                      onClick={() => setCalendarShowBy('deadline')}
                      className={`px-3 py-1 rounded-full text-xs font-fira-semibold transition-all duration-300 ${calendarShowBy === 'deadline'
                        ? 'bg-[#2a2421] text-white shadow-sm'
                        : 'bg-transparent text-neutral-600 hover:bg-black/5'
                        }`}
                    >
                      {t[lang].showByDeadline}
                    </button>
                    <button
                      onClick={() => setCalendarShowBy('eventDate')}
                      className={`px-3 py-1 rounded-full text-xs font-fira-semibold transition-all duration-300 ${calendarShowBy === 'eventDate'
                        ? 'bg-[#2a2421] text-white shadow-sm'
                        : 'bg-transparent text-neutral-600 hover:bg-black/5'
                        }`}
                    >
                      {t[lang].showByEventDate}
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable grid wrapper for mobile */}
              <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar">
                <div className="min-w-[640px] md:min-w-0">
                  {/* Hafta Günleri Başlığı */}
                  <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[9px] font-fira-semibold uppercase tracking-widest text-stone-500">
                    {t[lang].weekdays.map(d => (
                      <div key={d} className="py-2 bg-white/50 border border-black/[0.02] rounded-xl">{d}</div>
                    ))}
                  </div>

                  {/* Gün Hücreleri */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarCells.map((cell, idx) => {
                      const cellConfs = getConferencesForCell(cell);
                      const isToday = new Date().toDateString() === new Date(cell.year, cell.month, cell.day).toDateString();

                      return (
                        <div
                          key={idx}
                          className={`border rounded-2xl p-2 min-h-[90px] flex flex-col justify-between transition-all duration-300 relative ${cell.isPadding
                            ? 'opacity-40 bg-gray-50/50'
                            : 'bg-white hover:bg-neutral-50 hover:shadow-xs'
                            } ${isToday ? 'ring-2 ring-[#2a2421]' : 'border-black/5'
                            }`}
                        >
                          <span className={`text-xs font-fira-semibold ${cell.isPadding ? 'text-neutral-400' : 'text-neutral-700'}`}>
                            {cell.day}
                          </span>
                          <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[60px] custom-scrollbar">
                            {cellConfs.map(conf => {
                              const confIndex = conferences.findIndex(c => c.id === conf.id);
                              const style = retroStyles[confIndex >= 0 ? confIndex % retroStyles.length : 0];
                              return (
                                <div
                                  key={conf.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedData({ conf, style });
                                  }}
                                  className={`text-[8px] font-fira-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border truncate w-full hover:scale-105 transition-transform text-center cursor-pointer select-none ${style.tagBg} ${style.border} ${style.text}`}
                                  title={`${conf.title} - ${conf.organizer}`}
                                >
                                  {conf.id.split('-')[0].toUpperCase()}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : viewMode === 'map' ? (
            <GlobeView
              sorted={sorted}
              lang={lang}
              setSelectedData={setSelectedData}
              setOpeningCardId={setOpeningCardId}
              formatDate={formatDate}
              retroStyles={retroStyles}
            />
          ) : (
            /* LİSTE GÖRÜNÜMÜ */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12 w-full pt-4">
              {sorted.map((conf, index) => {
                const displayLocation = lang === 'tr' ? conf.location : conf.locationEn;
                const displayTags = lang === 'tr' ? conf.tags : conf.tagsEn;
                const style = retroStyles[index % retroStyles.length];
                const status = getDeadlineStatus(conf.deadline);
                const daysLeft = getRemainingDays(conf.deadline);
                const isTrialCard = ['eisa-pec-2026', 'esg-2026', 'msa-forward-2026'].includes(conf.id);
                const tapeRotation = (index % 2 === 0) ? 'rotate-[2.5deg]' : '-rotate-[2.5deg]';

                return (
                  <div
                    key={conf.id}
                    onClick={() => {
                      if (openingCardId) return;
                      setOpeningCardId(conf.id);
                      setTimeout(() => {
                        setSelectedData({ conf, style });
                      }, 400);
                    }}
                    className={`relative w-full ${style.cardBg} border ${style.border} shadow-sm cursor-pointer group select-none transition-all duration-300 hover:shadow-md hover:-translate-y-1.5 overflow-visible h-[190px] rounded-xl`}
                  >
                    {/* Zarf İç Kılıf (Açık Renk) */}
                    <div className="absolute inset-x-4 bottom-4 bg-white/40 rounded-xl z-0 top-[96px]" />
                    {/* Mektup Kağıdı (İçinden Çıkan Kart) */}
                    <div className={`absolute inset-x-4 bg-[#f8f7f5] rounded-xl pt-[33px] pb-4 px-5 shadow-sm border border-stone-200/80 transition-all z-10 flex flex-col justify-between ${openingCardId === conf.id
                      ? 'translate-y-[-30px] duration-300 ease-out'
                      : 'translate-y-[-16px] group-hover:translate-y-[-24px] group-active:translate-y-[-24px] duration-300 ease-out'
                      }`} style={{ height: '178px' }}>

                      {/* Polaroid Fotoğraf Çerçevesi (Tüm Kartlar için) */}
                      <div
                        className={`absolute right-7 top-[36px] w-[96px] h-[118px] bg-white p-1.5 pb-6 shadow-md border border-stone-200/80 rounded-sm z-30 transition-all duration-300 ease-out pointer-events-none select-none flex flex-col justify-between ${openingCardId === conf.id
                          ? 'translate-y-[-8px] rotate-[8deg]'
                          : 'translate-y-0 rotate-[6deg] group-hover:translate-y-[-4px] group-hover:rotate-[9deg] group-active:translate-y-[-4px] group-active:rotate-[9deg]'
                          }`}
                        style={{
                          filter: 'drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.15))'
                        }}
                      >
                        {/* İç Görsel Alanı (Tam Kare Polaroid Oranı) */}
                        <div className={`w-full aspect-square flex items-center justify-center overflow-hidden border border-stone-200/60 ${conf.id === 'pollen-2026' ? 'bg-[#5172b5]' :
                          conf.id === 'aaa-2026' ? 'bg-[#b20837]' :
                            conf.id === 'apsa-2026' ? 'bg-[#f5f4f0]' :
                              conf.id === 'sant-2026' ? 'bg-[#004b89]' :
                                'bg-stone-50'
                          }`}>
                          <img
                            src={conf.logo || `https://logo.clearbit.com/${conf.domain}`}
                            alt="Polaroid Inner"
                            className={`w-full h-full object-contain ${conf.id === 'apsa-2026' ? 'p-1.5' :
                              ['pollen-2026', 'aaa-2026', 'sant-2026'].includes(conf.id) ? 'p-0' : 'p-1'
                              }`}
                            onError={(e) => {
                              if (e.target.src.includes('clearbit.com')) {
                                e.target.style.display = 'none';
                              } else {
                                e.target.src = `https://logo.clearbit.com/${conf.domain}`;
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Başvuru Kapandı Dairesel Damgası (Tüm Kartlar için, Polaroid veya Pul Üzerinde En Önde, Mektup Kağıdında Sabit) */}
                      {daysLeft < 0 && (
                        <div
                          className="absolute rounded-full border border-dashed border-[#c92a2a]/80 bg-transparent p-[3px] flex items-center justify-center pointer-events-none select-none transition-all duration-300 z-40"
                          style={{
                            width: '48px',
                            height: '48px',
                            top: '20px',
                            right: '140px',
                            transform: 'rotate(-15deg)',
                            filter: 'drop-shadow(0px 1.5px 2px rgba(0, 0, 0, 0.1))'
                          }}
                        >
                          {/* İç Daire (Gerçekçi Posta Damgası Hissiyatı) */}
                          <div className="w-full h-full rounded-full border border-solid border-[#c92a2a]/60 flex flex-col items-center justify-center p-[2px]">
                            <span className="text-[#c92a2a]/90 uppercase tracking-wide text-center leading-none font-typewriter text-[7.5px]">
                              {lang === 'tr' ? (
                                <>Başvuru<br />Kapandı</>
                              ) : (
                                <>Apps<br />Closed</>
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Mektup İçeriği */}
                      <div className="flex flex-col h-full pr-[110px]">
                        {/* ETIKETLER */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {displayTags.map(tag => (
                            <span
                              key={tag}
                              className={`text-[11px] font-normal px-2.5 py-0.5 rounded-md font-fira-light ${style.tagBg} ${style.text}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* BAŞLIK */}
                        <h2 className="text-base leading-snug tracking-tight text-[#2a2421] font-fira-semibold pr-2 line-clamp-2">
                          {conf.title}
                        </h2>
                        {/* ORGANİZATÖR */}
                        <p className="text-[10px] font-fira-light opacity-70 text-[#2a2421] truncate mt-0">
                          {conf.organizer}
                        </p>
                      </div>
                    </div>

                    {/* Zarf Ön Kapağı / Ön Bölme */}
                    <div className={`absolute bottom-0 left-0 right-0 h-[42%] ${style.cardBg} border-t ${style.border} rounded-b-xl z-20 flex items-center justify-between pl-6 pr-6 shadow-[0_-4px_12px_rgba(42,36,33,0.08)] transition-transform duration-300 ease-out translate-y-0`}>

                      {/* Zarf Mührü / Son Başvuru Durum Mührü (Envelope Seal / Vintage Washi Tape) */}
                      {daysLeft >= 0 && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none select-none filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.12)]">
                          <span className={`text-[9.5px] font-fira-bold uppercase tracking-wider px-3 py-1 border-y border-black/5 inline-block tape-curled ${tapeRotation} ${daysLeft <= 15
                            ? "bg-[#FD9B4A]/60 text-[#2a2421]"
                            : "bg-[#9FCB98]/50 text-[#2a2421]"
                            }`}>
                            {daysLeft === 0 ? t[lang].todayLastDay : status.text}
                          </span>
                        </div>
                      )}

                      {/* Sol Kısım: Lokasyon ve Tarih */}
                      <div className="flex flex-col text-left py-1">
                        <p className="text-xs font-fira-semibold text-[#2a2421] mb-0.5 truncate max-w-[120px] sm:max-w-[150px] flex items-center gap-1">
                          <svg className="w-3 h-3 text-[#2a2421]/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {displayLocation}
                        </p>
                        <p className="text-[10px] font-fira-light text-[#2a2421]/60">
                          {formatDate(conf.date, lang)}
                        </p>
                      </div>

                      {/* Sağ Kısım: Son Başvuru Tarihi & Favori Butonu */}
                      <div className="flex items-center justify-end gap-3 relative z-40">
                        <div className="border border-dashed border-[#2a2421]/30 bg-transparent text-[#2a2421] text-[10px] font-fira-semibold px-3 py-1 rounded-xl whitespace-nowrap flex items-center gap-1.5 select-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3.5 h-3.5 opacity-80"
                          >
                            <path d="M5 2h14" />
                            <path d="M5 22h14" />
                            <path d="M19 2v4c0 2-2 3-5 5v2c3 2 5 3 5 5v4" />
                            <path d="M5 2v4c0 2 2 3 5 5v2c-3 2-5 3-5 5v4" />
                          </svg>
                          {formatDate(conf.deadline, lang)}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(conf.id);
                          }}
                          className={`text-lg transition-all duration-300 hover:scale-125 z-40 ${favorites.includes(conf.id) ? 'text-[#5c5043] font-bold drop-shadow-sm' : 'text-stone-400 opacity-60 hover:opacity-100'
                            }`}
                          aria-label="Toggle Favorite"
                        >
                          {favorites.includes(conf.id) ? '★' : '☆'}
                        </button>
                      </div>
                    </div>


                  </div>
                );
              })}

              {sorted.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-24 rounded-[3rem] border shadow-md transition-all duration-300 bg-white border-black/5 font-sans">
                  <p className="text-5xl mb-4">🔍</p>
                  <p className="font-semibold text-lg text-[#5a5451]">{t[lang].notFound}</p>
                  {showFavoritesOnly && (
                    <p className="text-xs mt-2 opacity-75 text-[#5a5451]">
                      {t[lang].noFavoritesYet}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto mt-16 pt-8 pb-4 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 font-fira-regular text-xs select-none">
        <p className="text-center sm:text-left leading-relaxed">
          © 2026 Confer. <span className="font-fira-light">{t[lang].subtitle}</span> • {t[lang].footerDesigned}
        </p>
        <div className="flex items-center gap-4 shrink-0 font-fira-semibold">
          <a
            href="https://github.com/ammarkilic/Confer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#2a2421] transition-colors"
          >
            {t[lang].footerContribute}
          </a>
          <span className="text-stone-300">•</span>
          <a
            href="mailto:contact@confer.tracker"
            className="hover:text-[#2a2421] transition-colors"
          >
            {t[lang].footerFeedback}
          </a>
        </div>
      </footer>

      {/* CENTRED POPUP DETAILS MODAL */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 transition-opacity duration-300 ${selectedData ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop overlay */}
        <div className="absolute inset-0 bg-[#2a2421]/60 backdrop-blur-xs transition-opacity duration-300" onClick={() => {
          setSelectedData(null);
          setOpeningCardId(null);
        }} />

        {/* Modal panel */}
        <div className={`relative w-full max-w-2xl max-h-[90vh] shadow-2xl rounded-3xl md:rounded-[2.5rem] bg-white text-[#2a2421] flex flex-col overflow-hidden transition-all duration-300 ${selectedData ? 'modal-content-animate' : 'scale-95 opacity-0'
          }`}>
          {selectedData && (
            <>
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedData(null);
                  setOpeningCardId(null);
                }}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-20 shadow-xs border bg-[#faf9f6] hover:bg-[#2a2421] hover:text-white text-black border-black/5 font-sans text-xs"
                aria-label="Close details"
              >
                ✕
              </button>

              {/* Drawer Header */}
              <div className={`relative px-6 md:px-16 pt-14 md:pt-8 pb-6 bg-gradient-to-br border-b border-t-[12px] transition-colors duration-300 from-white via-[#fcfbfa] to-[#f5f4f0] border-black/5 ${selectedData.style.border}`}>
                {/* Polaroid Fotoğraf Çerçevesi */}
                <div
                  className="absolute right-6 md:right-16 w-[104px] h-[128px] bg-white p-2 pb-6 shadow-md border border-stone-200/80 rounded-sm z-30 select-none flex flex-col justify-between top-16 md:top-1/2 -translate-y-0 md:-translate-y-1/2 rotate-[6deg]"
                  style={{
                    filter: 'drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.15))'
                  }}
                >
                  {/* Görsel Alanı (Kare) */}
                  <div className={`w-full aspect-square flex items-center justify-center overflow-hidden border border-stone-200/60 ${selectedData.conf.id === 'pollen-2026' ? 'bg-[#5172b5]' :
                    selectedData.conf.id === 'aaa-2026' ? 'bg-[#b20837]' :
                      selectedData.conf.id === 'apsa-2026' ? 'bg-[#f5f4f0]' :
                        selectedData.conf.id === 'sant-2026' ? 'bg-[#004b89]' :
                          'bg-stone-50'
                    }`}>
                  <img
                    src={selectedData.conf.logo || `https://logo.clearbit.com/${selectedData.conf.domain}`}
                    alt="Polaroid Inner Logo"
                    className={`w-full h-full object-contain ${selectedData.conf.id === 'apsa-2026' ? 'p-1.5' :
                      ['pollen-2026', 'aaa-2026', 'sant-2026'].includes(selectedData.conf.id) ? 'p-0' : 'p-1'
                      }`}
                    onError={(e) => {
                      if (e.target.src.includes('clearbit.com')) {
                        e.target.style.display = 'none';
                      } else {
                        e.target.src = `https://logo.clearbit.com/${selectedData.conf.domain}`;
                      }
                    }}
                  />
                  </div>

                  {/* Başvuru Kapandı Dairesel Damgası (Anasayfadaki kart tasarımıyla birebir aynı) */}
                  {getRemainingDays(selectedData.conf.deadline) < 0 && (
                    <div
                      className="absolute rounded-full border border-dashed border-[#c92a2a]/80 bg-transparent p-[3px] flex items-center justify-center pointer-events-none select-none z-45"
                      style={{
                        width: '48px',
                        height: '48px',
                        top: '12px',
                        left: '-76px',
                        transform: 'rotate(-15deg)',
                        filter: 'drop-shadow(0px 1.5px 2px rgba(0, 0, 0, 0.1))'
                      }}
                    >
                      {/* İç Daire (Gerçekçi Posta Damgası Hissiyatı) */}
                      <div className="w-full h-full rounded-full border border-solid border-[#c92a2a]/60 flex flex-col items-center justify-center p-[2px]">
                        <span className="text-[#c92a2a]/90 uppercase tracking-wide text-center leading-none font-typewriter text-[7.5px]">
                          {lang === 'tr' ? (
                            <>Başvuru<br />Kapandı</>
                          ) : (
                            <>Apps<br />Closed</>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-5 mb-4 pr-[132px] md:pr-[188px]">
                  <div className="pt-1">
                    {selectedData.conf.type !== 'konferans' && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md font-fira-regular bg-[#2a2421] text-white uppercase tracking-wider">
                          {lang === 'tr'
                            ? (selectedData.conf.type === 'atölye' ? 'Atölye' : 'Yaz Okulu')
                            : (selectedData.conf.type === 'atölye' ? 'Workshop' : 'Summer School')}
                        </span>
                      </div>
                    )}
                    <h2 className="text-xl md:text-2xl leading-tight mb-1 tracking-tight transition-colors duration-300 text-[#2a2421] font-fira-bold">
                      {selectedData.conf.title}
                    </h2>
                    <p className="text-sm font-fira-light opacity-70 mt-0.5 transition-colors duration-300 text-[#2a2421] leading-snug">
                      {selectedData.conf.organizer}
                    </p>
                  </div>
                </div>

                {/* Tarihlerin Cümle Yapısı (Using font-fira-regular to match user request) */}
                <div className="flex flex-col gap-2 mt-4 font-fira-regular text-xs text-[#2a2421] border-t border-stone-200/40 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <p className="opacity-90">
                      {lang === 'tr' ? 'Son başvuru tarihi:' : 'Application deadline:'}{' '}
                      <span className="text-stone-900 font-semibold">{formatDate(selectedData.conf.deadline, lang)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <p className="opacity-90">
                      {lang === 'tr' ? 'Konferans tarihi:' : 'Conference starts on:'}{' '}
                      <span className="text-stone-900 font-semibold">{formatDate(selectedData.conf.date, lang)}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer Body (CFP Text or Tabbed Layout) */}
              <div className="px-6 md:px-16 py-6 md:py-8 overflow-y-auto text-base font-normal leading-relaxed flex-grow custom-scrollbar bg-white">
                {selectedData.conf.details ? (
                  <div className="flex flex-col h-full">
                    {/* Tab Navigation */}
                    <div className="flex flex-wrap gap-1.5 border-b border-stone-200 pb-3 mb-6 font-fira-light text-sm">
                      {selectedData.conf.details.type === "custom" ? (
                        // Custom Tab Navigation
                        Object.keys(selectedData.conf.details).filter(k => k !== 'type').map(tabKey => {
                          const labels = {
                            tr: { summary: "Özet", dates: "Tarihler", fees: "Ücretler", grants: "Burslar", conditions: "Koşullar" },
                            en: { summary: "Summary", dates: "Dates", fees: "Fees", grants: "Grants", conditions: "Requirements" }
                          };
                          const label = labels[lang][tabKey] || tabKey;
                          const isActive = activeTab === tabKey;
                          return (
                            <button
                              key={tabKey}
                              onClick={() => setActiveTab(tabKey)}
                              className={`px-2.5 py-1 rounded-md text-xs border transition-all duration-200 ${isActive
                                ? 'bg-[#2a2421] text-white border-[#2a2421] shadow-xs'
                                : 'bg-transparent text-stone-500 border-transparent hover:text-[#2a2421] hover:bg-stone-50'
                                }`}
                            >
                              {label}
                            </button>
                          );
                        })
                      ) : (
                        // Standard Tab Navigation
                        Object.keys(selectedData.conf.details[lang]).map(tabKey => {
                          const labels = {
                            tr: { cfp: "Özet", dates: "Tarihler", fees: "Ücretler", grants: "Burslar", conditions: "Koşullar" },
                            en: { cfp: "Summary", dates: "Dates", fees: "Fees", grants: "Grants", conditions: "Requirements" }
                          };
                          const label = labels[lang][tabKey] || tabKey;
                          const isActive = activeTab === tabKey;
                          return (
                            <button
                              key={tabKey}
                              onClick={() => setActiveTab(tabKey)}
                              className={`px-2.5 py-1 rounded-md text-xs border transition-all duration-200 ${isActive
                                ? 'bg-[#2a2421] text-white border-[#2a2421] shadow-xs'
                                : 'bg-transparent text-stone-500 border-transparent hover:text-[#2a2421] hover:bg-stone-50'
                                }`}
                            >
                              {label}
                            </button>
                          );
                        })
                      )}
                    </div>
                    {/* Tab Content */}
                    <div className="flex-grow">
                      {selectedData.conf.details.type === "custom" ? (
                        // Render Custom Tab Content
                        (() => {
                          if (activeTab === "summary") {
                            const sumData = selectedData.conf.details.summary[lang];
                            return (
                              <div className="space-y-4 pb-8">
                                <p className="font-fira-light text-stone-800 leading-relaxed text-base">
                                  {sumData.lead}
                                </p>
                                <p className="font-fira-light text-stone-850 leading-relaxed text-base">
                                  {sumData.text}
                                </p>
                                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-sm font-fira-regular text-stone-600">
                                  <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span>
                                    {lang === 'tr' ? selectedData.conf.location : selectedData.conf.locationEn}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          if (activeTab === "dates") {
                            const datesData = selectedData.conf.details.dates;
                            return (
                              <div className="relative py-4 pb-12 font-fira-regular">
                                {/* MOBILE TIMELINE */}
                                <div className="block md:hidden relative pl-6">
                                  <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-stone-200" />
                                  <div className="space-y-6 relative">
                                    {datesData.map((d, index) => {
                                      const itemInfo = d[lang];
                                      const dateFormatted = formatDate(d.date, lang);
                                      return (
                                        <div key={index} className="relative pl-6 min-h-[40px]">
                                          {/* Dot */}
                                          <div className={`absolute left-[-21px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white transition-colors duration-300 z-10 ${d.passed
                                            ? 'border-stone-300 bg-stone-100'
                                            : 'border-stone-800 bg-[#2a2421] ring-4 ring-stone-100'
                                            }`} />
                                          <div>
                                            <p className="text-[10px] font-semibold text-stone-500">
                                              {dateFormatted}
                                            </p>
                                            <h4 className={`text-xs font-bold mt-0.5 ${d.passed ? 'text-stone-500 font-medium' : 'text-[#2a2421]'}`}>
                                              {itemInfo.title}
                                            </h4>
                                            <p className={`text-[11px] mt-0.5 ${d.passed ? 'text-stone-400' : 'text-stone-600'}`}>
                                              {itemInfo.desc}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* DESKTOP TIMELINE */}
                                <div className="hidden md:block relative">
                                  {/* Central vertical line */}
                                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-stone-200 transform -translate-x-1/2" />
                                  <div className="space-y-5 relative">
                                    {datesData.map((d, index) => {
                                      const itemInfo = d[lang];
                                      const dateFormatted = formatDate(d.date, lang);
                                      const isEven = index % 2 === 0;

                                      return (
                                        <div key={index} className="relative flex items-center justify-between w-full min-h-[50px]">
                                          {/* Left Side */}
                                          <div className={`w-[44%] text-right pr-4 ${isEven ? '' : 'opacity-0 pointer-events-none select-none'}`}>
                                            <p className="text-xs font-semibold text-stone-500">
                                              {dateFormatted}
                                            </p>
                                            <h4 className={`text-sm font-bold mt-0.5 ${d.passed ? 'text-stone-500 font-medium' : 'text-[#2a2421] font-fira-regular'}`}>
                                              {itemInfo.title}
                                            </h4>
                                            <p className={`text-xs mt-0.5 ${d.passed ? 'text-stone-400' : 'text-stone-600'}`}>
                                              {itemInfo.desc}
                                            </p>
                                          </div>

                                          {/* Central Dot */}
                                          <div className={`absolute left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 bg-white transition-colors duration-300 z-10 ${d.passed
                                            ? 'border-stone-300 bg-stone-100'
                                            : 'border-stone-800 bg-[#2a2421] ring-4 ring-stone-100'
                                            }`} />

                                          {/* Right Side */}
                                          <div className={`w-[44%] text-left pl-4 ${!isEven ? '' : 'opacity-0 pointer-events-none select-none'}`}>
                                            <p className="text-xs font-semibold text-stone-500">
                                              {dateFormatted}
                                            </p>
                                            <h4 className={`text-sm font-bold mt-0.5 ${d.passed ? 'text-stone-500 font-medium' : 'text-[#2a2421] font-fira-regular'}`}>
                                              {itemInfo.title}
                                            </h4>
                                            <p className={`text-xs mt-0.5 ${d.passed ? 'text-stone-400' : 'text-stone-600'}`}>
                                              {itemInfo.desc}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          if (activeTab === "fees") {
                            const feesData = selectedData.conf.details.fees[lang];
                            return (
                              <div className="overflow-x-auto pt-2 pb-4">
                                <table className="w-full text-left border-collapse text-xs font-fira-regular">
                                  <thead>
                                    <tr className="border-b-2 border-stone-200 text-xs font-normal text-stone-500">
                                      <th className="py-2.5 pr-4 font-normal">{lang === 'tr' ? 'Kategori' : 'Category'}</th>
                                      <th className="py-2.5 px-4 font-normal text-right">{lang === 'tr' ? 'Erken Kayıt' : 'Early-Bird'}</th>
                                      <th className="py-2.5 pl-4 font-normal text-right">{lang === 'tr' ? 'Geç Kayıt' : 'Late / Regular'}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-stone-100 font-fira-light">
                                    {feesData.map((f, index) => (
                                      <tr key={index} className="hover:bg-stone-50/50 transition-colors">
                                        <td className="py-3 pr-4 text-stone-850">{f.cat}</td>
                                        <td className="py-3 px-4 text-right text-stone-900">{f.early}</td>
                                        <td className="py-3 pl-4 text-right text-stone-900">{f.late}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          }
                          if (activeTab === "grants") {
                            const grantsData = selectedData.conf.details.grants;
                            return (
                              <div className="space-y-4 pt-2 pb-2">
                                {grantsData.map((g, index) => {
                                  const itemInfo = g[lang];
                                  return (
                                    <div key={index} className="rounded-2xl p-4 border border-stone-100 bg-[#fdfbf9]/40 shadow-xs hover:border-stone-200/80 transition-colors">
                                      <h4 className="font-fira-regular font-bold text-sm text-stone-900 mb-1.5 flex items-center gap-1.5">
                                        <span className="text-[#ff9ab3]">✦</span> {itemInfo.title}
                                      </h4>
                                      <p className="font-fira-light text-xs leading-relaxed text-stone-600">
                                        {itemInfo.desc}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          }
                          if (activeTab === "conditions") {
                            const condsData = selectedData.conf.details.conditions;
                            return (
                              <div className="grid grid-cols-1 gap-6 pt-2 pb-4">
                                {condsData.map((c, index) => {
                                  const itemInfo = c[lang];
                                  return (
                                    <div key={index} className="flex gap-3 items-start">
                                      <span className="font-fira-regular text-xl text-stone-350 select-none w-6 shrink-0 text-center">
                                        {String(index + 1).padStart(2, '0')}
                                      </span>
                                      <div className="pt-0.5 flex-grow">
                                        <h4 className="font-fira-regular font-bold text-xs text-stone-900 mb-0.5">
                                          {itemInfo.title}
                                        </h4>
                                        <p className="font-fira-light text-[11px] leading-relaxed text-stone-600">
                                          {itemInfo.desc}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          }
                          return null;
                        })()
                      ) : (
                        // Standard Tab Content
                        <div className="flex flex-col gap-4">
                          <p className="font-serif font-normal text-base leading-relaxed text-stone-800 whitespace-pre-line">
                            {parseMarkdownLinks(selectedData.conf.details[lang][activeTab])}
                          </p>
                          {activeTab === 'cfp' && (
                            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-sm font-fira-regular text-stone-600">
                              <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>
                                {lang === 'tr' ? selectedData.conf.location : selectedData.conf.locationEn}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Dinamik Dipnot Yapısı */}
                      {(activeTab === 'fees' || activeTab === 'grants') && selectedData.conf.details[activeTab]?.footnote && (
                        <div className="mt-4 pt-4 border-t border-[#2a2421]/10 text-[10px] text-stone-500 font-sans leading-relaxed whitespace-pre-line">
                          {parseMarkdownLinks(selectedData.conf.details[activeTab].footnote[lang])}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-[9px] font-extrabold uppercase tracking-widest text-stone-500 mb-3 block font-fira-regular">
                        {t[lang].cfp}
                      </h3>
                      <p className="font-fira-light text-base leading-relaxed text-stone-800 whitespace-pre-line">
                        {lang === 'tr' ? selectedData.conf.cfpText : selectedData.conf.cfpTextEn || selectedData.conf.cfpText}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-sm font-fira-regular text-stone-600">
                      <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>
                        {lang === 'tr' ? selectedData.conf.location : selectedData.conf.locationEn}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="px-6 md:px-16 py-6 border-t flex items-center justify-center gap-3 shrink-0 transition-colors duration-300 bg-[#faf9f6] border-black/5">
                <a
                  href={getGoogleCalendarUrl(selectedData.conf)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border font-fira-regular py-1.5 px-4 rounded-xl transition-all duration-300 text-xs shadow-xs whitespace-nowrap bg-white border-black/10 hover:bg-[#2a2421] hover:text-white hover:border-[#2a2421] text-[#2a2421] flex-grow text-center max-w-[150px]"
                >
                  {t[lang].addToCalendar}
                </a>
                <a
                  href={selectedData.conf.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-fira-regular py-1.5 px-4 rounded-xl transition-all duration-300 text-xs shadow-sm whitespace-nowrap bg-[#2a2421] hover:bg-black text-white flex-grow text-center max-w-[150px]"
                >
                  {t[lang].goToSite}
                </a>
              </div>

            </>
          )}
        </div>
      </div>

    </div>
  );
}

// -----------------------------------------------------------------
// 3D KÜRESEL DÜNYA HARİTASI (ORTHOGRAPHIC GLOBE VIEW) BİLEŞENİ
// -----------------------------------------------------------------

const locationCoords = {
  "esa-2026": [21.01, 52.23],          // Varşova, Polonya
  "isa-soc-2027": [126.85, 35.16],       // Gwangju, Güney Kore
  "apa-2026": [-77.04, 38.90],         // Washington, DC, ABD
  "aps-2026": [2.17, 41.38],           // Barselona, İspanya
  "icap-2026": [11.25, 43.77],         // Floransa, İtalya
  "ecpp-2026": [-6.26, 53.35],         // Dublin, İrlanda
  "epa-2027": [11.25, 43.77],          // Floransa, İtalya
  "eisa-pec-2026": [-9.14, 38.72],      // Lizbon, Portekiz
  "esg-2026": [-2.36, 51.38],          // Bath, Birleşik Krallık
  "apsa-2026": [-71.06, 42.36],        // Boston, ABD
  "pollen-2026": [2.17, 41.38],        // Barselona, İspanya
  "ipsa-2027": [12.49, 41.90],         // Roma, İtalya
  "sfaa-2026": [-106.65, 35.08],       // Albuquerque, ABD
  "sant-2026": [11.97, 57.70],         // Göteborg, İsveç
  "easa-2026": [16.92, 52.41],         // Poznan, Polonya
  "sha-2026": [-74.00, 40.71],         // New York, ABD
  "aaa-2026": [-90.20, 38.63],         // St. Louis, ABD
  "acs-crossroads-2026": [-43.94, -19.92], // Belo Horizonte, Brezilya
  "csa-2027": null,                     // Online
  "meccsa-2026": [-1.13, 52.63],       // Leicester, Birleşik Krallık
  "msa-forward-2026": [-58.38, -34.60],  // Buenos Aires, Arjantin
  "pca-2027": [-71.06, 42.36]          // Boston, ABD
};

function GlobeView({ sorted, lang, setSelectedData, setOpeningCardId, formatDate, retroStyles }) {
  const canvasRef = React.useRef(null);
  const [landPolygons, setLandPolygons] = React.useState([]);
  const [rotation, setRotation] = React.useState([10, 25]); // [boylam, enlem] başlangıç açısı
  const [hoveredEvent, setHoveredEvent] = React.useState(null);
  const [tooltip, setTooltip] = React.useState(null);

  const rotationRef = React.useRef(rotation);
  rotationRef.current = rotation;

  const isDraggingRef = React.useRef(false);
  const dragStartRef = React.useRef({ x: 0, y: 0, rot: [0, 0] });
  const lastInteractionRef = React.useRef(Date.now());
  const hoveredEventRef = React.useRef(null);
  const hoveredSideRef = React.useRef(null);
  const visibleMarkersRef = React.useRef([]);

  // Optimize edilmiş kıta sınırları koordinatlarını yükle
  React.useEffect(() => {
    fetch('/land-coordinates.json')
      .then(res => res.json())
      .then(data => {
        setLandPolygons(data);
      })
      .catch(err => {
        console.error("Harita koordinat verisi yüklenemedi:", err);
      });
  }, []);

  const resetInteractionTime = () => {
    lastInteractionRef.current = Date.now();
  };

  // 3 saniye etkileşim olmadığında kendi etrafında yavaşça dönen otomatik dönüş (auto-spin)
  React.useEffect(() => {
    let animationId;
    const tick = () => {
      const now = Date.now();
      if (!isDraggingRef.current && (now - lastInteractionRef.current > 3000)) {
        setRotation(prev => [prev[0] + 0.08, prev[1]]);
      }
      animationId = requestAnimationFrame(tick);
    };
    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Ortografik 3D Küresel Projeksiyon Matematik Formülü
  const project = (lon, lat, r, centerLon, centerLat, cx, cy) => {
    const lonRad = (lon * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;
    const centerLonRad = (centerLon * Math.PI) / 180;
    const centerLatRad = (centerLat * Math.PI) / 180;

    const cosC = Math.sin(centerLatRad) * Math.sin(latRad) +
      Math.cos(centerLatRad) * Math.cos(latRad) * Math.cos(lonRad - centerLonRad);

    if (cosC < 0) return null; // Kürenin arkasında kalan görünmez yüzey

    const x = r * Math.cos(latRad) * Math.sin(lonRad - centerLonRad);
    const y = r * (Math.cos(centerLatRad) * Math.sin(latRad) -
      Math.sin(centerLatRad) * Math.cos(latRad) * Math.cos(lonRad - centerLonRad));

    return { x: cx + x, y: cy - y, cosC };
  };

  // Çizim Döngüsü
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Yüksek çözünürlüklü ekranlar (Retina vb.) için piksel oranı
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.47;

    let frameId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const [centerLon, centerLat] = rotationRef.current;

      // 1. 3D Derinlik Hissiyatı Veren Küresel Taban Degradeli Arka Plan
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      const grad = ctx.createRadialGradient(cx - radius / 4, cy - radius / 4, radius / 10, cx, cy, radius);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.7, '#fbfaf8');
      grad.addColorStop(1, '#e3ded3');
      ctx.fillStyle = grad;
      ctx.fill();

      // Küre arkası derinlik gölgesi
      ctx.shadowColor = 'rgba(42, 36, 33, 0.08)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 8;
      ctx.strokeStyle = 'rgba(42, 36, 33, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.shadowColor = 'transparent'; // gölgeyi sıfırla

      // Küre sınırları içine kırpalım (graticule ve kıtalar dışarı taşmasın)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.clip();

      // 2. Enlem / Boylam Izgaraları (Graticules)
      ctx.strokeStyle = 'rgba(42, 36, 33, 0.06)';
      ctx.lineWidth = 0.8;

      // Paralleller (Enlem Çizgileri)
      for (let lat = -60; lat <= 60; lat += 20) {
        ctx.beginPath();
        let drawing = false;
        for (let lon = -180; lon <= 180; lon += 5) {
          const proj = project(lon, lat, radius, centerLon, centerLat, cx, cy);
          if (proj) {
            if (!drawing) {
              ctx.moveTo(proj.x, proj.y);
              drawing = true;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      }

      // Meridyenler (Boylam Çizgileri)
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let drawing = false;
        for (let lat = -80; lat <= 80; lat += 5) {
          const proj = project(lon, lat, radius, centerLon, centerLat, cx, cy);
          if (proj) {
            if (!drawing) {
              ctx.moveTo(proj.x, proj.y);
              drawing = true;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      }

      // 3. Kıta Sınırlarının Eskiz/Mürekkep Stiliyle Çizimi
      ctx.strokeStyle = 'rgba(42, 36, 33, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.fillStyle = 'rgba(42, 36, 33, 0.06)'; // Küre renginden bir tık koyu warm ton
      landPolygons.forEach(polygon => {
        // Döndürme işlemi: Başlangıç noktasını görünmez (arka yüzeydeki) bir noktaya kaydırıyoruz.
        // Bu sayede görünür tüm parçalar (segmentler) kesinlikle ufuk çizgisinde başlayıp ufuk çizgisinde biter.
        let rotatedPolygon = polygon;
        const firstInvisibleIdx = polygon.findIndex(pt => {
          const proj = project(pt[0], pt[1], radius, centerLon, centerLat, cx, cy);
          return !proj;
        });

        if (firstInvisibleIdx > 0) {
          const pts = polygon.slice(0, -1);
          const rotatedPts = pts.slice(firstInvisibleIdx).concat(pts.slice(0, firstInvisibleIdx));
          rotatedPts.push(rotatedPts[0]);
          rotatedPolygon = rotatedPts;
        }

        const segments = [];
        let currentSeg = [];

        rotatedPolygon.forEach(pt => {
          const proj = project(pt[0], pt[1], radius, centerLon, centerLat, cx, cy);
          if (proj) {
            currentSeg.push({
              x: proj.x,
              y: proj.y,
              lon: pt[0],
              lat: pt[1]
            });
          } else {
            if (currentSeg.length > 0) {
              segments.push(currentSeg);
              currentSeg = [];
            }
          }
        });
        if (currentSeg.length > 0) {
          segments.push(currentSeg);
        }

        segments.forEach(seg => {
          if (seg.length < 2) return;

          // 1. Doldurma (Fill) için tam kapalı yol oluşturuluyor
          ctx.beginPath();
          ctx.moveTo(seg[0].x, seg[0].y);
          for (let i = 1; i < seg.length; i++) {
            ctx.lineTo(seg[i].x, seg[i].y);
          }

          const p0 = seg[0];
          const pk = seg[seg.length - 1];
          const dist = Math.sqrt((pk.x - p0.x) ** 2 + (pk.y - p0.y) ** 2);

          const dist0 = Math.sqrt((p0.x - cx) ** 2 + (p0.y - cy) ** 2);
          const distk = Math.sqrt((pk.x - cx) ** 2 + (pk.y - cy) ** 2);
          const onEdge = Math.abs(dist0 - radius) < 6 && Math.abs(distk - radius) < 6;

          if (dist > 5 && onEdge) {
            const angleStart = Math.atan2(pk.y - cy, pk.x - cx);
            const angleEnd = Math.atan2(p0.y - cy, p0.x - cx);

            let diff = angleEnd - angleStart;
            while (diff < -Math.PI) diff += 2 * Math.PI;
            while (diff > Math.PI) diff -= 2 * Math.PI;

            const counterClockwise = diff < 0;
            ctx.arc(cx, cy, radius, angleStart, angleEnd, counterClockwise);
          }

          ctx.closePath();
          ctx.fill();

          // 2. Çerçeve (Stroke) için harita dateline sınırlarını atlayan yol oluşturuluyor
          ctx.beginPath();
          let inStrokeSegment = false;

          for (let i = 0; i < seg.length - 1; i++) {
            const ptA = seg[i];
            const ptB = seg[i + 1];

            // Eğer iki nokta da yapay dateline boylamı (-180 / 180) üzerindeyse çizmiyoruz
            const isDateline = Math.abs(ptA.lon) > 179.9 && Math.abs(ptB.lon) > 179.9;

            if (!isDateline) {
              if (!inStrokeSegment) {
                ctx.moveTo(ptA.x, ptA.y);
                inStrokeSegment = true;
              }
              ctx.lineTo(ptB.x, ptB.y);
            } else {
              inStrokeSegment = false;
            }
          }

          // Eğer ufuk çizgisi yayı çizildiyse, bu yayı da çerçeveye dahil et (dateline olmadığı için)
          if (dist > 5 && onEdge) {
            const angleStart = Math.atan2(pk.y - cy, pk.x - cx);
            const angleEnd = Math.atan2(p0.y - cy, p0.x - cx);

            let diff = angleEnd - angleStart;
            while (diff < -Math.PI) diff += 2 * Math.PI;
            while (diff > Math.PI) diff -= 2 * Math.PI;

            const counterClockwise = diff < 0;
            ctx.arc(cx, cy, radius, angleStart, angleEnd, counterClockwise);
          }

          ctx.stroke();
        });
      });

      // Kırpmayı sonlandır
      ctx.restore();

      // 4. Konferans İşaretçilerinin Çizimi
      const markers = [];
      const nowTime = Date.now();

      sorted.forEach((conf, idx) => {
        const coords = locationCoords[conf.id];
        if (!coords) return;

        const proj = project(coords[0], coords[1], radius, centerLon, centerLat, cx, cy);
        if (proj) {
          markers.push({ conf, x: proj.x, y: proj.y, cosC: proj.cosC, index: idx });
        }
      });

      visibleMarkersRef.current = markers;

      markers.forEach(m => {
        const isHovered = hoveredEventRef.current && hoveredEventRef.current.id === m.conf.id;

        // Yanıp sönen pulsing efekt dairesi
        const pulseRadius = 5 + (nowTime % 1200) / 100;
        const pulseOpacity = 1 - (nowTime % 1200) / 1200;
        ctx.beginPath();
        ctx.arc(m.x, m.y, pulseRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(224, 123, 148, ${pulseOpacity * 0.75})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Merkezdeki işaretçi dairesi
        ctx.beginPath();
        ctx.arc(m.x, m.y, isHovered ? 6 : 4.5, 0, 2 * Math.PI);
        ctx.fillStyle = isHovered ? '#e07b94' : '#ff9ab3';
        ctx.fill();
        ctx.strokeStyle = '#2a2421';
        ctx.lineWidth = 1;
        ctx.stroke();

        if (isHovered) {
          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(42, 36, 33, 0.45)';
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);

          const isMobile = window.innerWidth < 768;
          let targetX = m.x;
          let targetY = m.y;

          if (isMobile) {
            targetX = width / 2;
            targetY = height - 10;
          } else {
            const side = hoveredSideRef.current || (m.x < cx ? 'left' : 'right');
            if (side === 'left') {
              targetX = 15;
              targetY = height / 2;
            } else {
              targetX = width - 15;
              targetY = height / 2;
            }
          }

          ctx.moveTo(m.x, m.y);
          ctx.lineTo(targetX, targetY);
          ctx.stroke();

          // Sabitleme noktası dairesi
          ctx.beginPath();
          ctx.arc(targetX, targetY, 3, 0, 2 * Math.PI);
          ctx.fillStyle = '#ff9ab3';
          ctx.fill();
          ctx.strokeStyle = '#2a2421';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();
        }
      });

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [landPolygons, sorted]);

  // Sürükle ve Döndür Etkileşimi
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      rot: [...rotation]
    };
    resetInteractionTime();
  };

  const handlePointerMove = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (isDraggingRef.current) {
      const dx = clientX - dragStartRef.current.x;
      const dy = clientY - dragStartRef.current.y;

      const sensitivity = 0.25;
      const newLon = dragStartRef.current.rot[0] - dx * sensitivity;
      const newLat = Math.max(-80, Math.min(80, dragStartRef.current.rot[1] + dy * sensitivity));

      setRotation([newLon, newLat]);
      resetInteractionTime();
    }

    const canvas = canvasRef.current;
    if (!canvas || isDraggingRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    let found = null;
    let minDistance = 10;

    visibleMarkersRef.current.forEach(m => {
      const dist = Math.sqrt((m.x - x) ** 2 + (m.y - y) ** 2);
      if (dist < minDistance) {
        found = m;
      }
    });

    if (found) {
      canvas.style.cursor = 'pointer';
      hoveredEventRef.current = found.conf;
      setHoveredEvent(found.conf);

      setTooltip(prev => {
        const side = (prev && prev.event.id === found.conf.id)
          ? prev.side
          : (found.x < rect.width / 2 ? 'left' : 'right');

        hoveredSideRef.current = side;

        return {
          event: found.conf,
          x: found.x,
          y: found.y - 12,
          cx: rect.width / 2,
          side: side,
          style: retroStyles[found.index % retroStyles.length]
        };
      });
    } else {
      canvas.style.cursor = 'default';
      hoveredEventRef.current = null;
      setHoveredEvent(null);
      setTooltip(null);
      hoveredSideRef.current = null;
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    resetInteractionTime();
  };

  const handleMarkerClick = () => {
    if (hoveredEvent) {
      const confIndex = sorted.findIndex(c => c.id === hoveredEvent.id);
      const style = retroStyles[confIndex >= 0 ? confIndex % retroStyles.length : 0];
      setOpeningCardId(hoveredEvent.id);
      setTimeout(() => {
        setSelectedData({ conf: hoveredEvent, style });
      }, 400);
      setTooltip(null);
      setHoveredEvent(null);
      hoveredEventRef.current = null;
      hoveredSideRef.current = null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 relative bg-white/40 border border-black/5 rounded-3xl shadow-sm mt-4 select-none min-h-[480px] md:min-h-[580px] overflow-hidden">

      {/* Harita Başlığı Bilgisi */}
      <div className="absolute top-4 left-6 pointer-events-none select-none text-left z-10">
        <h3 className="text-sm font-fira-bold tracking-wider text-[#2a2421] mb-0.5">
          {lang === 'tr' ? 'Etkileşimli küre' : 'Interactive globe'}
        </h3>
        <p className="text-[10px] font-fira-light text-stone-500 max-w-[200px] leading-snug">
          {lang === 'tr'
            ? 'Dünyayı döndürmek için sürükleyin, konferans detayları için noktalara tıklayın.'
            : 'Drag to rotate the globe, click on dots to view conference details.'}
        </p>
      </div>

      {/* Küre Canvas Alanı */}
      <canvas
        ref={canvasRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onClick={handleMarkerClick}
        className="w-full max-w-[500px] aspect-square cursor-grab active:cursor-grabbing pointer-events-auto"
        style={{ touchAction: 'none' }}
      />


      {/* Bilgi Kartı Tooltip (Glassmorphism) */}
      {tooltip && (
        <div
          className={`absolute z-40 pt-4 px-4 pb-3 w-60 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-lg pointer-events-none transition-all duration-150 flex flex-col gap-1.5 text-left
            ${window.innerWidth < 768
              ? 'left-1/2 bottom-4 -translate-x-1/2'
              : tooltip.side === 'left'
                ? 'left-6 top-1/2 -translate-y-1/2'
                : 'right-6 top-1/2 -translate-y-1/2'
            }`}
          style={{
            filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.12))'
          }}
        >

          {/* İçerik */}
          <div className="flex flex-col gap-1.5 select-none pointer-events-none text-left">
            <div className="flex flex-wrap gap-1">
              {(lang === 'tr' ? tooltip.event.tags : tooltip.event.tagsEn).map(tag => (
                <span
                  key={tag}
                  className={`text-[9px] px-1.5 py-0.5 rounded font-fira-regular ${tooltip.style.tagBg} ${tooltip.style.text}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <h4 className="text-xs font-fira-bold leading-snug text-[#2a2421] line-clamp-2">
              {tooltip.event.title}
            </h4>
            <p className="text-[9px] font-fira-light text-stone-500 truncate">
              {tooltip.event.organizer}
            </p>
            <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-stone-100 text-[9px] text-[#2a2421]">
              <span className="truncate max-w-[110px] flex items-center gap-1">
                <svg className="w-2.5 h-2.5 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {lang === 'tr' ? tooltip.event.location : tooltip.event.locationEn}
              </span>
              <span className="font-semibold text-stone-600 flex items-center gap-1">
                <svg className="w-2.5 h-2.5 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(tooltip.event.deadline, lang)}
              </span>
            </div>
            <div className="text-[8px] font-fira-semibold text-center text-[#ff9ab3] mt-1.5 animate-pulse">
              {lang === 'tr' ? 'Detayları görmek için tıklayın' : 'Click to view details'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}