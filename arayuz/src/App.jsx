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

    const matchFavorites = !showFavoritesOnly || favorites.includes(c.id);
    const matchOpenOnly = !showOpenOnly || getRemainingDays(c.deadline) >= 0;
    
    return matchSearch && matchTag && matchLocation && matchFavorites && matchOpenOnly;
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

  const retroStyles = [
    { 
      cardBg: "bg-gradient-to-br from-white via-[#fcfbfa] to-[#f3effa]", 
      border: "border-[#d0bdf4]/40", 
      text: "text-[#4b357a]", 
      tagBg: "bg-[#d0bdf4]/25 text-[#4b357a]"
    },
    { 
      cardBg: "bg-gradient-to-br from-white via-[#fcfbfa] to-[#fff0f3]", 
      border: "border-[#ff9ab3]/40", 
      text: "text-[#7c253e]", 
      tagBg: "bg-[#ff9ab3]/25 text-[#7c253e]"
    },
    { 
      cardBg: "bg-gradient-to-br from-white via-[#fcfbfa] to-[#f4f7ef]", 
      border: "border-[#d5e6b5]/50", 
      text: "text-[#3e4f20]", 
      tagBg: "bg-[#d5e6b5]/35 text-[#3e4f20]"
    },
    { 
      cardBg: "bg-gradient-to-br from-white via-[#fcfbfa] to-[#fffbeb]", 
      border: "border-[#ffe270]/40", 
      text: "text-[#665500]", 
      tagBg: "bg-[#ffe270]/30 text-[#665500]"
    },
    { 
      cardBg: "bg-gradient-to-br from-white via-[#fcfbfa] to-[#fff5ed]", 
      border: "border-[#ffb680]/35", 
      text: "text-[#7a3b00]", 
      tagBg: "bg-[#ffb680]/25 text-[#7a3b00]"
    },
    { 
      cardBg: "bg-gradient-to-br from-white via-[#fcfbfa] to-[#f0f7ff]", 
      border: "border-[#bad5e8]/45", 
      text: "text-[#203c53]", 
      tagBg: "bg-[#bad5e8]/30 text-[#203c53]"
    }
  ];

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
              className={`px-3 py-1 rounded-full text-xs font-fira-semibold transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-[#2a2421] text-white shadow-sm' 
                  : 'bg-transparent text-[#5a5451] hover:bg-black/5'
              }`}
            >
              {t[lang].listView}
            </button>
            <button 
              onClick={() => setViewMode('calendar')} 
              className={`px-3 py-1 rounded-full text-xs font-fira-semibold transition-all duration-300 ${
                viewMode === 'calendar' 
                  ? 'bg-[#2a2421] text-white shadow-sm' 
                  : 'bg-transparent text-[#5a5451] hover:bg-black/5'
              }`}
            >
              {t[lang].calendarView}
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex bg-white rounded-full p-0.5 shadow-sm border border-black/5">
            <button 
              onClick={() => { setLang('tr'); setSelectedTags([]); setSelectedRegions([]); }} 
              className={`px-3 py-1 rounded-full text-xs font-fira-semibold transition-all duration-300 ${
                lang === 'tr' 
                  ? 'bg-[#2a2421] text-white shadow-sm' 
                  : 'bg-transparent text-[#5a5451] hover:bg-black/5'
              }`}
            >
              TR
            </button>
            <button 
              onClick={() => { setLang('en'); setSelectedTags([]); setSelectedRegions([]); }} 
              className={`px-3 py-1 rounded-full text-xs font-fira-semibold transition-all duration-300 ${
                lang === 'en' 
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
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pt-2">
        
        {/* SOL STICKY FİLTRE PANELİ */}
        <aside className="lg:col-span-1 lg:sticky lg:top-8 w-full z-20">
          <div className="rounded-2xl p-6 flex flex-col gap-4 shadow-md border border-black/5 bg-gradient-to-br from-white via-[#fcfbfa] to-[#f6f5f2]">
            <div className="flex justify-between items-start gap-2 mb-0">
              <div>
                <h2 className="text-xl tracking-tight text-[#2a2421] font-fira-semibold">
                  {lang === 'tr' ? 'Filtrele' : 'Filter'}
                </h2>
              </div>
              {(selectedTags.length > 0 || selectedRegions.length > 0 || searchTerm !== "" || showFavoritesOnly || showOpenOnly) && (
                <button 
                  onClick={() => {
                    setSelectedTags([]);
                    setSelectedRegions([]);
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
                  className="w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all font-fira-regular font-normal shadow-inner bg-white border-black/5 text-[#2a2421] focus:ring-[#2a2421]" 
                />
              </div>

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
                  <summary className="flex justify-between items-center px-4 py-3 text-sm font-medium cursor-pointer list-none select-none text-[#2a2421] hover:bg-black/[0.02] font-fira-regular">
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
                  <summary className="flex justify-between items-center px-4 py-3 text-sm font-medium cursor-pointer list-none select-none text-[#2a2421] hover:bg-black/[0.02] font-fira-regular">
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

              {/* Sorting */}
              <div>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="select-custom w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 font-fira-regular font-normal shadow-sm cursor-pointer bg-white border-black/5 text-[#2a2421] ring-[#2a2421]"
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
                      className={`px-3 py-1 rounded-full text-xs font-fira-semibold transition-all duration-300 ${
                        calendarShowBy === 'deadline' 
                          ? 'bg-[#2a2421] text-white shadow-sm' 
                          : 'bg-transparent text-neutral-600 hover:bg-black/5'
                      }`}
                    >
                      {t[lang].showByDeadline}
                    </button>
                    <button 
                      onClick={() => setCalendarShowBy('eventDate')}
                      className={`px-3 py-1 rounded-full text-xs font-fira-semibold transition-all duration-300 ${
                        calendarShowBy === 'eventDate' 
                          ? 'bg-[#2a2421] text-white shadow-sm' 
                          : 'bg-transparent text-neutral-600 hover:bg-black/5'
                      }`}
                    >
                      {t[lang].showByEventDate}
                    </button>
                  </div>
                </div>
              </div>

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
                      className={`border rounded-2xl p-2 min-h-[90px] flex flex-col justify-between transition-all duration-300 relative ${
                        cell.isPadding 
                          ? 'opacity-40 bg-gray-50/50' 
                          : 'bg-white hover:bg-neutral-50 hover:shadow-xs'
                      } ${
                        isToday ? 'ring-2 ring-[#2a2421]' : 'border-black/5'
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

                return (
                  <div 
                    key={conf.id} 
                    onClick={() => {
                      if (openingCardId) return;
                      setOpeningCardId(conf.id);
                      setTimeout(() => {
                        setSelectedData({ conf, style });
                        setOpeningCardId(null);
                      }, 300);
                    }} 
                    className={`relative w-full ${style.cardBg} border ${style.border} shadow-sm cursor-pointer group select-none transition-all duration-300 hover:shadow-md hover:-translate-y-1.5 overflow-visible h-[190px] rounded-xl`}
                  >
                    {/* Zarf İç Kılıf (Açık Renk) */}
                    <div className="absolute inset-x-4 bottom-4 bg-white/40 rounded-xl z-0 top-[96px]" />
                     {/* Mektup Kağıdı (İçinden Çıkan Kart) */}
                    <div className={`absolute inset-x-4 ${conf.id === 'aps-2026' ? 'bg-[#faf6ee]' : 'bg-white'} rounded-t-xl pt-[33px] pb-4 px-5 shadow-sm border border-stone-200/80 transition-all duration-300 ease-out z-10 flex flex-col justify-between ${
                      openingCardId === conf.id 
                        ? '-translate-y-6 opacity-0 scale-98 duration-300' 
                        : 'translate-y-[-16px] group-hover:translate-y-[-24px]'
                    }`} style={{ height: '178px' }}>
                      
                      {/* Mektup Pulu Logo (Etrafı Kesikli Çerçeveli / APS için özel gerçekçi pul) */}
                      {conf.id === 'aps-2026' ? (
                        <div 
                          className="absolute top-[29px] right-5 w-12 h-[60px] select-none z-20 overflow-visible"
                          style={{ filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.15))' }}
                        >
                          {/* Stamp Body with Perforation Mask */}
                          <div 
                            className="w-full h-full bg-white p-[3px] select-none"
                            style={{
                              mask: 'url(#stamp-mask-aps)',
                              WebkitMask: 'url(#stamp-mask-aps)',
                            }}
                          >
                            {/* Inner Stamp Print border and logo */}
                            <div className="w-full h-full border border-stone-200/70 rounded-xs flex items-center justify-center p-[2px]">
                              <img 
                                src={conf.logo || `https://logo.clearbit.com/${conf.domain}`} 
                                alt="Postage Stamp" 
                                className="w-full h-full object-contain" 
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

                          {/* Başvuru Kapandı Dairesel Damgası (Stamp) */}
                          {daysLeft < 0 && (
                            <div className="absolute -top-[10px] -left-6 w-[37px] h-[37px] rounded-full border-2 border-dashed border-[#c92a2a]/80 bg-transparent flex flex-col items-center justify-center -rotate-[12deg] z-25 pointer-events-none select-none">
                              <span className="text-[6.5px] font-typewriter text-[#c92a2a] uppercase tracking-wide text-center leading-none">
                                {lang === 'tr' ? (
                                  <>Başvuru<br/>Kapandı</>
                                ) : (
                                  <>Applications<br/>Closed</>
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="absolute top-[29px] right-5 w-12 h-[60px] bg-white p-[3px] shadow-md border-2 border-dashed border-stone-400/80 select-none flex items-center justify-center shrink-0">
                          <img 
                            src={conf.logo || `https://logo.clearbit.com/${conf.domain}`} 
                            alt="Postage Stamp" 
                            className="w-full h-full object-contain" 
                            onError={(e) => {
                              if (e.target.src.includes('clearbit.com')) {
                                e.target.style.display = 'none';
                              } else {
                                e.target.src = `https://logo.clearbit.com/${conf.domain}`;
                              }
                            }}
                          />
                          <div className="absolute inset-0 border border-black/5 pointer-events-none" />

                          {/* Başvuru Kapandı Dairesel Damgası (Stamp) */}
                          {daysLeft < 0 && (
                            <div className="absolute -top-[10px] -left-6 w-[37px] h-[37px] rounded-full border-2 border-dashed border-[#c92a2a]/80 bg-transparent flex flex-col items-center justify-center -rotate-[12deg] z-20 pointer-events-none select-none">
                              <span className="text-[6.5px] font-typewriter text-[#c92a2a] uppercase tracking-wide text-center leading-none">
                                {lang === 'tr' ? (
                                  <>Başvuru<br/>Kapandı</>
                                ) : (
                                  <>Applications<br/>Closed</>
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Mektup İçeriği */}
                      <div className="pr-14 flex flex-col h-full">
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
                    <div className={`absolute bottom-0 left-0 right-0 h-[42%] ${style.cardBg} border-t ${style.border} rounded-b-xl z-20 flex items-center justify-between pl-6 pr-6 shadow-[0_-3px_8px_rgba(0,0,0,0.02)]`}>
                      
                      {/* Zarf Mührü / Son Başvuru Durum Mührü (Envelope Seal) */}
                      {daysLeft >= 0 && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                          <span className={`text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm ${
                            daysLeft <= 15 
                              ? "bg-red-50 text-red-800 border-red-200 animate-pulse font-extrabold" 
                              : "bg-emerald-50 text-emerald-800 border-emerald-200 font-extrabold"
                          }`}>
                            {daysLeft === 0 ? t[lang].todayLastDay : status.text}
                          </span>
                        </div>
                      )}

                      {/* Sol Kısım: Lokasyon ve Tarih */}
                      <div className="flex flex-col text-left py-1">
                        <p className="text-xs font-fira-semibold text-[#2a2421] mb-0.5 truncate max-w-[120px] sm:max-w-[150px]">
                          📍 {displayLocation}
                        </p>
                        <p className="text-[10px] font-fira-light text-[#2a2421]/60">
                          {formatDate(conf.date, lang)}
                        </p>
                      </div>

                      {/* Sağ Kısım: Son Başvuru Tarihi & Favori Butonu */}
                      <div className="flex items-center justify-end gap-3 relative z-40">
                        <div className="border border-red-100 bg-red-50/70 text-[#c92a2a] text-[10px] font-fira-semibold px-3 py-1 rounded-xl whitespace-nowrap">
                          {formatDate(conf.deadline, lang)}
                        </div>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            toggleFavorite(conf.id); 
                          }}
                          className={`text-lg transition-all duration-300 hover:scale-125 z-40 ${
                            favorites.includes(conf.id) ? 'text-yellow-400 font-bold drop-shadow-sm' : 'text-stone-400 opacity-60 hover:opacity-100'
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
        <div className="absolute inset-0 bg-[#2a2421]/60 backdrop-blur-xs transition-opacity duration-300" onClick={() => setSelectedData(null)} />
        
        {/* Modal panel */}
        <div className={`relative w-full max-w-2xl max-h-[90vh] shadow-2xl rounded-[2.5rem] bg-white text-[#2a2421] flex flex-col overflow-hidden transition-all duration-300 ${
          selectedData ? 'modal-content-animate' : 'scale-95 opacity-0'
        }`}>
          {selectedData && (
            <>
              {/* Close Button */}
              <button 
                onClick={() => setSelectedData(null)} 
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-20 shadow-xs border bg-[#faf9f6] hover:bg-[#2a2421] hover:text-white text-black border-black/5 font-sans text-xs"
                aria-label="Close details"
              >
                ✕
              </button>

              {/* Drawer Header */}
              <div className={`relative px-16 pt-8 pb-6 bg-gradient-to-br border-b border-t-[12px] transition-colors duration-300 from-white via-[#fcfbfa] to-[#f5f4f0] border-black/5 ${selectedData.style.border}`}>
                {/* Mektup Pulu Konseptli Logo (Kesikli Çerçeve ve Posta Damgası) */}
                {selectedData.conf.id === 'aps-2026' ? (
                  <div 
                    className="absolute right-16 w-16 h-20 select-none z-10 overflow-visible"
                    style={{ 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      filter: 'drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.15))' 
                    }}
                  >
                    {/* Stamp Body with Perforation Mask */}
                    <div 
                      className="w-full h-full bg-white p-[4px] select-none"
                      style={{
                        mask: 'url(#stamp-mask-aps-drawer)',
                        WebkitMask: 'url(#stamp-mask-aps-drawer)',
                      }}
                    >
                      {/* Inner Stamp Print border and logo */}
                      <div className="w-full h-full border border-stone-200/80 rounded-xs flex items-center justify-center p-[3px]">
                        <img 
                          src={selectedData.conf.logo || `https://logo.clearbit.com/${selectedData.conf.domain}`} 
                          alt="Postage Stamp Logo" 
                          className="w-full h-full object-contain" 
                          onError={(e) => {
                            if (e.target.src.includes('clearbit.com')) {
                              e.target.style.display = 'none';
                            } else {
                              e.target.src = `https://logo.clearbit.com/${selectedData.conf.domain}`;
                            }
                          }} 
                        />
                      </div>
                    </div>
                    {/* Damga Efekti */}
                    <div className="absolute -bottom-2 -left-2 w-10 h-10 rounded-full border border-black/15 border-dashed pointer-events-none opacity-45 transform -rotate-12 z-20" />

                    {/* Başvuru Kapandı Dairesel Damgası (Stamp) */}
                    {getRemainingDays(selectedData.conf.deadline) < 0 && (
                      <div className="absolute -top-[14px] -left-10 w-[48px] h-[48px] rounded-full border-2 border-dashed border-[#c92a2a]/80 bg-transparent flex flex-col items-center justify-center -rotate-[12deg] z-25 pointer-events-none select-none">
                        <span className="text-[8px] font-typewriter text-[#c92a2a] uppercase tracking-wide text-center leading-none">
                          {lang === 'tr' ? (
                            <>
                              Başvuru
                              <br />
                              Kapandı
                            </>
                          ) : (
                            <>
                              Applications
                              <br />
                              Closed
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="absolute right-16 w-16 h-20 bg-white p-[5px] shadow-md border-2 border-dashed border-stone-400/80 select-none flex items-center justify-center shrink-0 z-10"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                  >
                    <img 
                      src={selectedData.conf.logo || `https://logo.clearbit.com/${selectedData.conf.domain}`} 
                      alt="Postage Stamp Logo" 
                      className="w-full h-full object-contain" 
                      onError={(e) => {
                        if (e.target.src.includes('clearbit.com')) {
                          e.target.style.display = 'none';
                        } else {
                          e.target.src = `https://logo.clearbit.com/${selectedData.conf.domain}`;
                        }
                      }} 
                    />
                    {/* Damga Efekti */}
                    <div className="absolute -bottom-2 -left-2 w-10 h-10 rounded-full border border-black/15 border-dashed pointer-events-none opacity-45 transform -rotate-12" />
                    <div className="absolute inset-0 border border-black/5" />

                    {/* Başvuru Kapandı Dairesel Damgası (Stamp) */}
                    {getRemainingDays(selectedData.conf.deadline) < 0 && (
                      <div className="absolute -top-[14px] -left-10 w-[48px] h-[48px] rounded-full border-2 border-dashed border-[#c92a2a]/80 bg-transparent flex flex-col items-center justify-center -rotate-[12deg] z-20 pointer-events-none select-none">
                        <span className="text-[8px] font-typewriter text-[#c92a2a] uppercase tracking-wide text-center leading-none">
                          {lang === 'tr' ? (
                            <>
                              Başvuru
                              <br />
                              Kapandı
                            </>
                          ) : (
                            <>
                              Applications
                              <br />
                              Closed
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-start gap-5 mb-4 pr-40">
                  <div className="pt-1">
                    <h2 className="text-2xl leading-tight mb-1 tracking-tight transition-colors duration-300 text-[#2a2421] font-fira-bold">
                      {selectedData.conf.title}
                    </h2>
                    <p className="text-sm md:text-base font-fira-light opacity-70 mt-0.5 transition-colors duration-300 text-[#2a2421] leading-snug">
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
              <div className="px-16 py-8 overflow-y-auto text-base font-normal leading-relaxed flex-grow custom-scrollbar bg-white">
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
                              className={`px-2.5 py-1 rounded-md text-xs border transition-all duration-200 ${
                                isActive 
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
                              className={`px-2.5 py-1 rounded-md text-xs border transition-all duration-200 ${
                                isActive 
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
                                  <span>📍</span>
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
                              <div className="relative py-4 pb-12 ml-0 font-fira-regular">
                                {/* Central vertical line */}
                                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-stone-200 transform -translate-x-1/2" />
                                
                                <div className="space-y-5 relative">
                                  {datesData.map((d, index) => {
                                    const itemInfo = d[lang];
                                    const dateFormatted = formatDate(d.date, lang);
                                    const isEven = index % 2 === 0;
                                    
                                    return (
                                      <div key={index} className="relative flex items-center justify-between w-full min-h-[50px]">
                                        {/* Left Side (Even items show text, Odd items are hidden) */}
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
                                        <div className={`absolute left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 bg-white transition-colors duration-300 z-10 ${
                                          d.passed 
                                            ? 'border-stone-300 bg-stone-100' 
                                            : 'border-stone-800 bg-[#2a2421] ring-4 ring-stone-100'
                                        }`} />

                                        {/* Right Side (Odd items show text, Even items are hidden) */}
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
                              <span>📍</span>
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
                      <span>📍</span>
                      <span>
                        {lang === 'tr' ? selectedData.conf.location : selectedData.conf.locationEn}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="px-16 py-6 border-t flex items-center justify-center gap-3 shrink-0 transition-colors duration-300 bg-[#faf9f6] border-black/5">
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