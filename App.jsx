import React, { useState, useEffect } from 'react';
import {
  BookOpen, Timer, Calendar, Brain, Play, Pause,
  RotateCcw, Plus, Trash2, CheckCircle, Circle,
  MessageSquare, Moon, Sun, Heart, Search
} from 'lucide-react';

const PharmacyStudyApp = () => {
  const [activeTab, setActiveTab] = useState('study');
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('pharmacy_subjects');
    return saved ? JSON.parse(saved) : [];
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('pharmacy_dark_mode');
    return saved === 'true';
  });
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('pharmacy_lang');
    return saved || 'ar';
  });

  /* ===== Dictionary States ===== */
  const [dictionaryTerm, setDictionaryTerm] = useState('');
  const [dictionaryResult, setDictionaryResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    localStorage.setItem('pharmacy_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('pharmacy_dark_mode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('pharmacy_lang', language);
    document.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const translations = {
    ar: {
      title: 'مساعد الصيدلة الذكي',
      study: 'المواد الدراسية',
      dictionary: 'القاموس الطبي',
      addSubject: 'أضيفي مادة جديدة...',
      noSubjects: 'لا توجد مواد مضافة بعد',
      dictionaryTitle: '📖 القاموس الصيدلاني (RxNorm)',
      dictionaryPlaceholder: 'ابحثي عن اسم الدواء (بالإنجليزي)...',
      searching: 'جاري البحث في قاعدة البيانات...',
      notFound: 'عذراً، لم يتم العثory على هذا المصطلح',
      name: 'الاسم العلمي',
      synonym: 'المرادفات',
      delete: 'حذف',
      clear: 'مسح الكل'
    },
    en: {
      title: 'Smart Pharmacy Assistant',
      study: 'Study Subjects',
      dictionary: 'Medical Dictionary',
      addSubject: 'Add a new subject...',
      noSubjects: 'No subjects added yet',
      dictionaryTitle: '📖 Pharmacy Dictionary (RxNorm)',
      dictionaryPlaceholder: 'Search for drug name...',
      searching: 'Searching database...',
      notFound: 'Sorry, term not found',
      name: 'Scientific Name',
      synonym: 'Synonyms',
      delete: 'Delete',
      clear: 'Clear All'
    }
  };

  const t = translations[language];

  /* ===== Pharmacy Dictionary API (RxNorm) ===== */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (dictionaryTerm.trim()) {
        searchPharmacyDictionary(dictionaryTerm);
      } else {
        setDictionaryResult(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [dictionaryTerm]);

  const searchPharmacyDictionary = async (term) => {
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${term}`
      );
      const data = await res.json();

      const concept =
        data?.drugGroup?.conceptGroup?.find(g => g.conceptProperties)?.conceptProperties?.[0];

      if (concept) {
        setDictionaryResult({
          name: concept.name,
          synonym: concept.synonym,
          rxcui: concept.rxcui,
        });
      } else {
        setDictionaryResult({ error: true });
      }
    } catch {
      setDictionaryResult({ error: true });
    }
    setIsSearching(false);
  };

  const addSubject = (subject) => {
    if (subject.trim()) {
      setSubjects([...subjects, { id: Date.now(), name: subject, completed: false }]);
    }
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const toggleComplete = (id) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const bgClass = darkMode
    ? 'min-h-screen bg-gray-950 transition-colors duration-300'
    : 'min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 transition-colors duration-300';

  const cardClass = darkMode 
    ? 'bg-gray-900 border border-gray-800 shadow-2xl shadow-purple-900/20' 
    : 'bg-white shadow-2xl shadow-purple-200/50 border border-purple-100';
    
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  
  const inputClass = darkMode
    ? 'bg-gray-800 text-white border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
    : 'bg-white text-gray-800 border-purple-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500';

  return (
    <div className={`${bgClass} p-4 md:p-8 font-sans`}>
      <div className="max-w-3xl mx-auto">
        <div className={`${cardClass} rounded-[2rem] overflow-hidden`}>

          {/* ===== Header ===== */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white relative">
            <div className={`absolute top-6 ${language === 'ar' ? 'left-6' : 'right-6'} flex gap-3`}>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-all active:scale-95"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="px-4 py-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl text-sm font-bold transition-all active:scale-95"
              >
                {language === 'ar' ? 'English' : 'العربية'}
              </button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl mb-2">
                <Brain size={40} className="text-white" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-center drop-shadow-md">
                {t.title}
              </h1>
              <p className="text-purple-100 text-sm font-medium opacity-90">
                {language === 'ar' ? 'رفيقتك الذكية في رحلة الصيدلة' : 'Your smart companion in pharmacy journey'}
              </p>
            </div>
          </div>

          {/* ===== Tabs ===== */}
          <div className="flex p-2 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border-b dark:border-gray-800">
            {[
              { id: 'study', icon: BookOpen, label: t.study },
              { id: 'dictionary', icon: Search, label: t.dictionary },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm transform scale-[1.02]'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon size={22} className={activeTab === tab.id ? 'animate-bounce' : ''} />
                <span className="text-sm font-bold">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ===== Content ===== */}
          <div className="p-8">

            {/* ===== Subjects ===== */}
            {activeTab === 'study' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t.addSubject}
                    className={`w-full p-4 pr-12 rounded-2xl border-2 transition-all outline-none text-lg ${inputClass}`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSubject(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className={`absolute top-1/2 -translate-y-1/2 ${language === 'ar' ? 'left-4' : 'right-4'}`}>
                    <Plus className="text-purple-400" size={24} />
                  </div>
                </div>

                <div className="grid gap-3">
                  {subjects.map(s => (
                    <div
                      key={s.id}
                      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all hover:shadow-md ${
                        darkMode 
                          ? 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50' 
                          : 'bg-purple-50/50 border-purple-100 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => toggleComplete(s.id)}
                          className={`transition-colors ${s.completed ? 'text-green-500' : 'text-purple-300 hover:text-purple-500'}`}
                        >
                          {s.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                        </button>
                        <span className={`text-lg font-medium ${textClass} ${s.completed ? 'line-through opacity-50' : ''}`}>
                          {s.name}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteSubject(s.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}

                  {subjects.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center opacity-40">
                      <BookOpen size={64} className="mb-4 text-purple-300" />
                      <p className={`text-xl font-medium ${secondaryTextClass}`}>
                        {t.noSubjects}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== Dictionary ===== */}
            {activeTab === 'dictionary' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative">
                  <input
                    type="text"
                    value={dictionaryTerm}
                    onChange={(e) => setDictionaryTerm(e.target.value)}
                    placeholder={t.dictionaryPlaceholder}
                    className={`w-full p-4 rounded-2xl border-2 transition-all outline-none text-lg ${inputClass}`}
                  />
                  {isSearching && (
                    <div className={`absolute top-1/2 -translate-y-1/2 ${language === 'ar' ? 'left-4' : 'right-4'}`}>
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {dictionaryResult && !dictionaryResult.error && (
                  <div className={`p-6 rounded-3xl border-2 transition-all scale-in-center ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 shadow-inner'
                  }`}>
                    <div className="space-y-4">
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${secondaryTextClass}`}>{t.name}</span>
                        <p className={`text-2xl font-black text-purple-600 dark:text-purple-400`}>{dictionaryResult.name}</p>
                      </div>
                      {dictionaryResult.synonym && (
                        <div>
                          <span className={`text-xs font-bold uppercase tracking-wider ${secondaryTextClass}`}>{t.synonym}</span>
                          <p className={`text-lg ${textClass}`}>{dictionaryResult.synonym}</p>
                        </div>
                      )}
                      <div className="pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                        <span className="text-xs font-mono text-gray-400">RxCUI: {dictionaryResult.rxcui}</span>
                        <Heart size={20} className="text-pink-400 cursor-pointer hover:fill-pink-400 transition-all" />
                      </div>
                    </div>
                  </div>
                )}

                {dictionaryResult?.error && (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                      <Search size={32} />
                    </div>
                    <p className="text-red-500 font-bold text-lg">{t.notFound}</p>
                    <p className={`text-sm mt-1 ${secondaryTextClass}`}>
                      {language === 'ar' ? 'تأكدي من كتابة الاسم العلمي الصحيح بالإنجليزية' : 'Make sure to type the correct scientific name in English'}
                    </p>
                  </div>
                )}

                {!dictionaryResult && !isSearching && (
                  <div className={`p-8 rounded-3xl border border-dashed text-center opacity-60 ${
                    darkMode ? 'border-gray-700' : 'border-purple-200'
                  }`}>
                    <MessageSquare size={48} className="mx-auto mb-4 text-purple-300" />
                    <p className={secondaryTextClass}>
                      {language === 'ar' 
                        ? 'ابحثي عن الأدوية للحصول على أسمائها العلمية ومرادفاتها مباشرة من قاعدة بيانات RxNorm' 
                        : 'Search for drugs to get scientific names and synonyms directly from RxNorm database'}
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
        
        <p className="mt-8 text-center text-gray-400 text-sm font-medium">
          Made with 💜 for Pharmacy Students
        </p>
      </div>
    </div>
  );
};

export default PharmacyStudyApp;
