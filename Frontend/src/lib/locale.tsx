'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const LocaleContext = createContext();

interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
  mounted: boolean;
}

export const TRANSLATIONS = {
  en: {
    'app.title': 'Areca',
    'nav.home': 'Home',
    'nav.capture': 'Capture',
    'nav.dashboard': 'Dashboard',
    'home.subtitle': 'Plant Assistant',
    'capture.title': 'Capture Photos',
    'capture.description': 'Take photos of your crops and queue them for analysis',
    'capture.tips': 'Capture Tips',
    'capture.tip1': 'Hold phone steady with good lighting',
    'capture.tip2': 'Include the entire crop in frame',
    'capture.tip3': 'Avoid shadows and glare',
    'capture.speakTips': 'Speak Tips',
    'capture.cameraError': 'Camera access denied. Please enable camera permissions.',
    'capture.queued': 'Photo queued successfully!',
    'capture.queueError': 'Failed to queue photo',
    'capture.syncError': 'Sync failed. Please try again.',
    'capture.synced': 'Synced',
    'capture.noItems': 'No items to sync',
    'capture.queuedCount': 'Queued Items',
    'capture.retake': 'Retake',
    'capture.queueIt': 'Queue Photo',
    'capture.syncNow': 'Sync Now',
    'dashboard.title': 'Dashboard',
    'dashboard.description': 'View and manage your queued captures',
    'dashboard.empty': 'No captures yet. Start capturing to see them here.',
    'dashboard.startCapturing': 'Start Capturing →',
    'dashboard.queued': 'Queued',
    'dashboard.synced': 'Synced',
    'login.title': 'Sign In',
    'login.description': 'Enter your authentication token',
    'login.tokenLabel': 'Token',
    'login.tokenPlaceholder': 'Paste your token here',
    'login.emptyToken': 'Token cannot be empty',
    'login.submit': 'Sign In',
    'login.success': 'Sign in successful! Redirecting...',
    'login.failed': 'Sign in failed',
    'login.error': 'An error occurred. Please try again.',
    'login.disclaimer': 'This is a stub authentication. Real auth will be implemented on the backend.',
    'common.loading': 'Loading...',
    'common.remove': 'Remove',
  },
  hi: {
    'app.title': 'अरेका',
    'nav.home': 'होम',
    'nav.capture': 'कैप्चर करें',
    'nav.dashboard': 'डैशबोर्ड',
    'home.subtitle': 'पौधा सहायक',
    'capture.title': 'फोटो कैप्चर करें',
    'capture.description': 'अपनी फसलों की फोटो लें और विश्लेषण के लिए कतार में डालें',
    'capture.tips': 'कैप्चर करने के सुझाव',
    'capture.tip1': 'फोन को स्थिर रखें और अच्छी रोशनी में रखें',
    'capture.tip2': 'पूरी फसल को फ्रेम में शामिल करें',
    'capture.tip3': 'छाया और चमक से बचें',
    'capture.speakTips': 'सुझाव सुनें',
    'capture.cameraError': 'कैमरा एक्सेस अस्वीकृत। कैमरा की अनुमति दें।',
    'capture.queued': 'फोटो कतार में जोड़ी गई!',
    'capture.queueError': 'फोटो कतार में जोड़ने में विफल',
    'capture.syncError': 'सिंक विफल। कृपया पुनः प्रयास करें।',
    'capture.synced': 'सिंक किया गया',
    'capture.noItems': 'सिंक करने के लिए कोई आइटम नहीं',
    'capture.queuedCount': 'कतारबद्ध आइटम',
    'capture.retake': 'पुनः लें',
    'capture.queueIt': 'फोटो कतार में डालें',
    'capture.syncNow': 'अभी सिंक करें',
    'dashboard.title': 'डैशबोर्ड',
    'dashboard.description': 'अपने कैप्चर को देखें और प्रबंधित करें',
    'dashboard.empty': 'अभी तक कोई कैप्चर नहीं। कैप्चर करना शुरू करें।',
    'dashboard.startCapturing': 'कैप्चर करना शुरू करें →',
    'dashboard.queued': 'कतार में',
    'dashboard.synced': 'सिंक किया गया',
    'login.title': 'साइन इन करें',
    'login.description': 'अपना प्रमाणीकरण टोकन दर्ज करें',
    'login.tokenLabel': 'टोकन',
    'login.tokenPlaceholder': 'अपना टोकन यहाँ पेस्ट करें',
    'login.emptyToken': 'टोकन खाली नहीं हो सकता',
    'login.submit': 'साइन इन करें',
    'login.success': 'साइन इन सफल! पुनर्निर्देशित हो रहा है...',
    'login.failed': 'साइन इन विफल',
    'login.error': 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
    'login.disclaimer': 'यह एक स्टब प्रमाणीकरण है। असली प्रमाणीकरण बैकएंड पर लागू किया जाएगा।',
    'common.loading': 'लोड हो रहा है...',
    'common.remove': 'हटाएं',
  },
  kn: {
    'app.title': 'ಅರೆಕಾ',
    'nav.home': 'ಮುಖ್ಯಪೃಷ್ಠ',
    'nav.capture': 'ಸೆರೆಹಿಡಿ',
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'home.subtitle': 'ಸಸ್ಯ ಸಹಾಯಕ',
    'capture.title': 'ಫೋಟೋ ಸೆರೆಹಿಡಿ',
    'capture.description': 'ನಿಮ್ಮ ಬೆಳೆಯ ಫೋಟೋ ತೆಗೆ ಮತ್ತು ವಿಶ್ಲೇಷಣೆಯ ಮೊದಲು ಸೇರಿಸಿ',
    'capture.tips': 'ಸೆರೆಹಿಡಿ ಸಲಹೆ',
    'capture.tip1': 'ಫೋನ್ ಅನ್ನು ಸ್ಥಿರವಾಗಿ ಇಟ್ಟುಕೊಂಡು ಚೆಂದ ಬೆಳಕಿನಲ್ಲಿ ಇಡಿ',
    'capture.tip2': 'ಸಂಪೂರ್ಣ ಬೆಳೆಯನ್ನು ಫ್ರೇಮ್‌ಗೆ ಸೇರಿಸಿ',
    'capture.tip3': 'ನೆರಳು ಮತ್ತು ಪ್ರತಿಬಿಂಬದಿಂದ ತಪ್ಪಿಸಿ',
    'capture.speakTips': 'ಸಲಹೆ ಆಲಿಸಿ',
    'capture.cameraError': 'ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ। ಕ್ಯಾಮೆರಾ ಅನುಮತಿ ಸಕ್ರಿಯ ಮಾಡಿ।',
    'capture.queued': 'ಫೋಟೋ ಮೊದಲು ಸೇರಿಸಲಾಯಿತು!',
    'capture.queueError': 'ಫೋಟೋ ಮೊದಲು ಸೇರಿಸಲು ವಿಫಲ',
    'capture.syncError': 'ಸಿಂಕ್ ವಿಫಲ। ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ।',
    'capture.synced': 'ಸಿಂಕ್ ಆಯಿತು',
    'capture.noItems': 'ಸಿಂಕ್ ಮಾಡಲು ಯಾವುದೇ ವಿಷಯ ಇಲ್ಲ',
    'capture.queuedCount': 'ಮೊದಲು ಸೇರಿಸಿದ ವಿಷಯ',
    'capture.retake': 'ಮತ್ತೆ ತೆಗೆ',
    'capture.queueIt': 'ಫೋಟೋ ಮೊದಲು ಸೇರಿಸಿ',
    'capture.syncNow': 'ಈಗ ಸಿಂಕ್ ಮಾಡಿ',
    'dashboard.title': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'dashboard.description': 'ನಿಮ್ಮ ಸೆರೆಹಿಡಿ ನೋಡಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ',
    'dashboard.empty': 'ಇನ್ನೂ ಯಾವುದೇ ಸೆರೆಹಿಡಿ ಇಲ್ಲ। ಸೆರೆಹಿಡಿ ಮಾಡಲು ಪ್ರಾರಂಭ ಮಾಡಿ।',
    'dashboard.startCapturing': 'ಸೆರೆಹಿಡಿ ಪ್ರಾರಂಭ ಮಾಡಿ →',
    'dashboard.queued': 'ಮೊದಲು',
    'dashboard.synced': 'ಸಿಂಕ್ ಆಯಿತು',
    'login.title': 'ಸೈನ್ ಇನ್ ಮಾಡಿ',
    'login.description': 'ನಿಮ್ಮ ಪ್ರಮಾಣೀಕರಣ ಟೋಕನ್ ನಮೂದಿಸಿ',
    'login.tokenLabel': 'ಟೋಕನ್',
    'login.tokenPlaceholder': 'ನಿಮ್ಮ ಟೋಕನ್ ಇಲ್ಲಿ ಅಂಟಿಸಿ',
    'login.emptyToken': 'ಟೋಕನ್ ಖಾಲಿ ಆಗಲಾರದು',
    'login.submit': 'ಸೈನ್ ಇನ್ ಮಾಡಿ',
    'login.success': 'ಸೈನ್ ಇನ್ ಯಶಸ್ವಿ! ಮರುನಿರ್ದೇಶಿತ ಆಗುತ್ತಿದೆ...',
    'login.failed': 'ಸೈನ್ ಇನ್ ವಿಫಲ',
    'login.error': 'ಒಂದು ದೋಷ ಸಂಭವಿಸಿದೆ। ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ।',
    'login.disclaimer': 'ಇದು ಸ್ಟಬ್ ಪ್ರಮಾಣೀಕರಣ. ನೈಜ ಪ್ರಮಾಣೀಕರಣ ಬ್ಯಾಕ್‌ಎಂಡ್‌ನಲ್ಲಿ ಕಾರ್ಯಗತರಿಸಲಾಗುತ್ತದೆ।',
    'common.loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    'common.remove': 'ತೆಗೆ ಹಾಕಿ',
  },
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('areca-locale') || 'en';
    setLocale(saved);
    setMounted(true);
  }, []);

  const handleSetLocale = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('areca-locale', newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale, mounted }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    return {
      locale: 'en',
      setLocale: () => {},
      t: (key: string) => TRANSLATIONS.en[key as keyof typeof TRANSLATIONS.en] || key,
    };
  }

  const { locale, setLocale } = context;

  return {
    locale,
    setLocale,
    t: (key: string) => {
      const trans = TRANSLATIONS[locale as keyof typeof TRANSLATIONS];
      return trans?.[key as keyof typeof trans] || TRANSLATIONS.en[key as keyof typeof TRANSLATIONS.en] || key;
    },
  };
}
