export const translations = {
  he: {
    // Landing Page
    title: 'המרת טקסט לדיבור בעברית',
    subtitle: 'הכלי היחיד בישראל שמשתמש בטכנולוגיה המתקדמת של Google AI',
    description: 'קולות טבעיים, איכות מקצועית, קל לשימוש',
    loginButton: 'התחבר עם Google',
    startFree: 'התחל בחינם',
    tryNow: 'נסה עכשיו בחינם',
    
    // Features
    fastSimple: 'מהיר ופשוט',
    fastSimpleDesc: 'הדבק טקסט, בחר קול, והורד את הקובץ תוך שניות',
    highQuality: 'איכות גבוהה',
    highQualityDesc: 'טכנולוגיית Google AI המתקדמת ביותר לדיבור טבעי',
    hebrewSupport: 'תמיכה בעברית',
    hebrewSupportDesc: 'הכלי היחיד בישראל עם קולות עבריים מקצועיים',
    
    // Demo Form
    placeholder: 'הדבק טקסט בעברית כאן...',
    selectVoice: 'בחר קול',
    selectSpeed: 'מהירות דיבור',
    createVoice: 'צור קול',
    loginToSave: 'התחבר כדי לשמור ולהוריד את הקבצים שלך',
    pleaseLogin: 'אנא התחבר קודם כדי ליצור קולות',
    toGenerateVoice: 'כדי ליצור קול, התחבר עם Google',
    
    // Dashboard
    createNew: 'צור קול חדש',
    generating: 'מייצר...',
    history: 'היסטוריה',
    statistics: 'סטטיסטיקה',
    voicesCreated: 'קולות שנוצרו',
    totalCharacters: 'סה"כ תווים',
    noVoicesYet: 'עדיין לא יצרת קולות',
    logout: 'התנתק',
    success: 'הקול נוצר בהצלחה!',
    play: 'השמע',
    download: 'הורד MP3',
    characters: 'תווים',
    
    // Footer
    rights: '© 2026 HebVoice. כל הזכויות שמורות.',
  },
  en: {
    // Landing Page
    title: 'Hebrew Text to Speech Converter',
    subtitle: 'The only tool in Israel using advanced Google AI technology',
    description: 'Natural voices, professional quality, easy to use',
    loginButton: 'Login with Google',
    startFree: 'Start Free',
    tryNow: 'Try Now for Free',
    
    // Features
    fastSimple: 'Fast & Simple',
    fastSimpleDesc: 'Paste text, select voice, and download the file in seconds',
    highQuality: 'High Quality',
    highQualityDesc: 'The most advanced Google AI technology for natural speech',
    hebrewSupport: 'Hebrew Support',
    hebrewSupportDesc: 'The only tool in Israel with professional Hebrew voices',
    
    // Demo Form
    placeholder: 'Paste Hebrew text here...',
    selectVoice: 'Select Voice',
    selectSpeed: 'Speech Speed',
    createVoice: 'Create Voice',
    loginToSave: 'Login to save and download your files',
    pleaseLogin: 'Please login first to create voices',
    toGenerateVoice: 'To generate voice, login with Google',
    
    // Dashboard
    createNew: 'Create New Voice',
    generating: 'Generating...',
    history: 'History',
    statistics: 'Statistics',
    voicesCreated: 'Voices Created',
    totalCharacters: 'Total Characters',
    noVoicesYet: "You haven't created any voices yet",
    logout: 'Logout',
    success: 'Voice created successfully!',
    play: 'Play',
    download: 'Download MP3',
    characters: 'characters',
    
    // Footer
    rights: '© 2026 HebVoice. All rights reserved.',
  }
}

export type Language = 'he' | 'en'
export type TranslationKey = keyof typeof translations.he



