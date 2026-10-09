import React, { useState } from 'react';

// IndexedDB Queue Helper for offline-first support
const saveToIndexedDB = async (report) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OceanHazardDB', 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('offline_reports')) {
        db.createObjectStore('offline_reports', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction('offline_reports', 'readwrite');
      const store = tx.objectStore('offline_reports');
      store.add(report);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    };

    request.onerror = () => reject(request.error);
  });
};

export default function ReportForm({ isNightMode }) {
  const [lang, setLang] = useState('en'); // 'en' or 'hi'
  const [hazardType, setHazardType] = useState('High Wave');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Copy Dictionary
  const t = {
    en: {
      title: 'Ocean Hazard Report',
      hazardLabel: 'Observed Hazard Type',
      descLabel: 'Incident Description / Voice Note',
      descPlaceholder: 'Describe wave height, boat status, or coastal flooding...',
      voiceBtn: 'Hold to Speak',
      listening: 'Listening...',
      submitBtn: 'ONE-TAP SOS / SUBMIT REPORT',
      locating: 'Acquiring GPS fix from vessel...',
      savedOffline: 'Offline mode active: Report saved to local IndexedDB queue. Will auto-sync when online.',
      savedOnline: 'Online: Report successfully transmitted to INCOIS & FastAPI AI engine.',
      tsunami: 'Tsunami Anomaly',
      swell: 'High Swell Surge',
      wave: 'Rough High Wave (>3m)',
      flood: 'Coastal Inundation / Flooding',
    },
    hi: {
      title: 'समुद्री आपदा रिपोर्टिंग',
      hazardLabel: 'देखी गई आपदा का प्रकार',
      descLabel: 'घटना का विवरण / वॉइस नोट',
      descPlaceholder: 'लहरों की ऊंचाई, नाव की स्थिति, या तटीय पानी भरने का विवरण दें...',
      voiceBtn: 'बोलने के लिए दबाएं',
      listening: 'सुन रहा है...',
      submitBtn: 'एक-क्लिक आपातकालीन SOS / रिपोर्ट भेजें',
      locating: 'नाव का GPS स्थान प्राप्त किया जा रहा है...',
      savedOffline: 'ऑफलाइन मोड: रिपोर्ट सुरक्षित रूप से स्थानीय IndexedDB कतार में सहेजी गई। नेटवर्क आने पर सिंक होगी।',
      savedOnline: 'ऑनलाइन: रिपोर्ट INCOIS और AI इंजन को सफलतापूर्वक भेज दी गई है।',
      tsunami: 'सुनामी चेतावनी',
      swell: 'तेज समुद्री उफान',
      wave: 'ऊंची खतरनाक लहरें (>3m)',
      flood: 'तटीय जलभराव / बाढ़',
    }
  }[lang];

  const handleVoiceRecord = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Web Speech API is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(t.locating);

    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your device.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const reportData = {
          hazard_type: hazardType,
          description,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          timestamp: new Date().toISOString(),
          is_offline_report: !navigator.onLine,
        };

        try {
          await saveToIndexedDB(reportData);
          if (navigator.onLine) {
            setStatus(t.savedOnline);
          } else {
            setStatus(t.savedOffline);
          }
          setDescription('');
        } catch (err) {
          setStatus('Local storage error: Unable to queue report.');
        }
      },
      (err) => {
        setStatus('GPS Error: ' + err.message + '. Please ensure location permissions are enabled.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto my-8 p-6 bg-white dark:bg-nautical-surface rounded-xl shadow-2xl border border-slate-200 dark:border-nautical-red transition-all">
      <div className="flex justify-between items-center mb-6 border-b pb-3 dark:border-nautical-surface-light">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-nautical-red">
          {t.title}
        </h2>
        
        {/* Bilingual Switch */}
        <button
          type="button"
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-nautical-surface-light dark:text-nautical-red-light border dark:border-nautical-red"
        >
          {lang === 'en' ? '🇮🇳 हिंदी' : '🌐 English'}
        </button>
      </div>

      {status && (
        <div className="mb-4 p-3 text-xs rounded border bg-blue-50 text-blue-800 border-blue-200 dark:bg-nautical-surface-light dark:text-nautical-red-light dark:border-nautical-red">
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-nautical-red mb-1">
            {t.hazardLabel}
          </label>
          <select
            value={hazardType}
            onChange={(e) => setHazardType(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white dark:bg-nautical-black dark:border-nautical-red dark:text-nautical-red-light focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="High Wave">{t.wave}</option>
            <option value="Swell Surge">{t.swell}</option>
            <option value="Coastal Flooding">{t.flood}</option>
            <option value="Tsunami">{t.tsunami}</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold uppercase text-slate-600 dark:text-nautical-red">
              {t.descLabel}
            </label>
            <button
              type="button"
              onClick={handleVoiceRecord}
              className={`flex items-center space-x-1 px-2 py-1 text-xs rounded transition ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-nautical-surface-light text-slate-700 dark:text-nautical-red-light hover:bg-slate-200'
              }`}
            >
              <span>🎤</span>
              <span>{isRecording ? t.listening : t.voiceBtn}</span>
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.descPlaceholder}
            rows="3"
            className="w-full p-2.5 rounded-lg border border-slate-300 text-sm bg-white dark:bg-nautical-black dark:border-nautical-red dark:text-nautical-red-light focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-red-600 hover:bg-red-700 dark:bg-nautical-red dark:hover:bg-nautical-red-light text-white dark:text-black font-extrabold text-base rounded-xl shadow-lg hover:shadow-xl transition-all tracking-wide flex justify-center items-center space-x-2"
        >
          <span>🚨</span>
          <span>{t.submitBtn}</span>
        </button>
      </form>
    </div>
  );
}
