import type { ChannelCategory, LanguageCode } from '@/domain/models/Channel';

const fr = {
  appName: 'TunisieTV',
  nav: {
    home: 'Accueil',
    channels: 'Chaînes',
    search: 'Recherche',
    favorites: 'Favoris',
    settings: 'Paramètres',
  },
  live: 'EN DIRECT',
  liveShort: 'DIRECT',
  watch: 'Regarder',
  okWatch: 'OK Regarder',
  addFavorite: 'Ajouter aux favoris',
  removeFavorite: 'Retirer des favoris',
  allChannels: 'Toutes les chaînes',
  all: 'Toutes',
  channelCount: (n: number) => `${n} chaîne${n > 1 ? 's' : ''}`,
  category: {
    news: 'Actualités',
    entertainment: 'Divertissement',
    sports: 'Sport',
    religion: 'Religion',
    regional: 'Régionales',
    kids: 'Jeunesse',
  } satisfies Record<ChannelCategory, string>,
  languageName: { ar: 'Arabe', fr: 'Français', en: 'Anglais' } satisfies Record<LanguageCode, string>,
  continueWatching: 'Continuer à regarder',
  myFavorites: 'Mes favoris',
  recentlyWatched: 'Récemment regardés',
  timeAgo: (minutes: number) =>
    minutes < 1
      ? 'à l’instant'
      : minutes < 60
        ? `il y a ${minutes} min`
        : minutes < 60 * 24
          ? `il y a ${Math.floor(minutes / 60)} h`
          : `il y a ${Math.floor(minutes / (60 * 24))} j`,
  noFavoritesTitle: 'Aucun favori pour le moment',
  noFavoritesHint: 'Ajoutez une chaîne à vos favoris depuis sa fiche ou le lecteur.',
  noHistory: 'Les chaînes que vous regardez apparaîtront ici.',
  searchPlaceholder: 'Rechercher une chaîne…',
  searchHint: 'Nom de chaîne en français ou en arabe',
  noResults: (q: string) => `Aucune chaîne ne correspond à « ${q} »`,
  offline: 'Hors ligne',
  offlineHint: 'certaines chaînes sont indisponibles.',
  settings: {
    title: 'Préférences',
    language: 'Langue',
    languageHint: 'Passer de l’arabe au français (ou l’inverse) redémarre l’application',
    languageSystem: 'Appareil',
    clearHistory: 'Effacer l’historique de lecture',
    clearHistoryHint: 'Supprime les chaînes récentes',
    clearHistoryAction: 'Réinitialiser',
    cleared: 'Historique effacé',
    about: 'À propos de l’application',
    contentNotice: 'Les directs proviennent des sources officielles des chaînes (site ou chaîne YouTube).',
  },
  hints: {
    select: 'Sélectionner',
    navigate: 'Naviguer',
    back: 'Retour',
    backKey: 'RETOUR',
  },
  streamUnavailable: 'Flux non disponible',
  streamUnavailableHint: 'Aucune source autorisée n’est encore configurée pour cette chaîne.',
  comingSoon: 'Bientôt disponible',
  back: 'Retour',
  player: {
    loading: 'Chargement du flux…',
    retrying: (n: number, max: number) => `Reconnexion… (tentative ${n}/${max})`,
    errorTitle: 'Lecture impossible',
    errorHint: 'Le flux ne répond pas. Réessayez dans un instant.',
    offlineHint: 'Vérifiez votre connexion réseau',
    retry: 'Réessayer',
    play: 'Lecture',
    pause: 'Mettre en pause',
    previous: 'Chaîne précédente',
    next: 'Chaîne suivante',
    fullscreen: 'Plein écran',
    liveChannels: 'Chaînes en direct',
    quickZap: 'Zapping rapide',
    otherChannels: 'Autres chaînes',
    testStream: 'Flux de test',
    youtubeTitle: 'Diffusé sur YouTube',
    youtubeHint: 'Cette chaîne diffuse son direct sur sa chaîne YouTube officielle.',
    openYoutube: 'Regarder sur YouTube',
  },
};

export type Strings = typeof fr;

const ar: Strings = {
  appName: 'TunisieTV',
  nav: {
    home: 'الرئيسية',
    channels: 'القنوات',
    search: 'بحث',
    favorites: 'المفضلة',
    settings: 'الإعدادات',
  },
  live: 'مباشر',
  liveShort: 'مباشر',
  watch: 'شاهد',
  okWatch: 'OK شاهد',
  addFavorite: 'أضف إلى المفضلة',
  removeFavorite: 'إزالة من المفضلة',
  allChannels: 'كل القنوات',
  all: 'الكل',
  // Arabic plural: 1 قناة واحدة, 2 قناتان, 3–10 قنوات, 11+ قناة.
  channelCount: (n: number) =>
    n === 1 ? 'قناة واحدة' : n === 2 ? 'قناتان' : n >= 3 && n <= 10 ? `${n} قنوات` : `${n} قناة`,
  category: {
    news: 'أخبار',
    entertainment: 'ترفيه',
    sports: 'رياضة',
    religion: 'دين',
    regional: 'جهوية',
    kids: 'أطفال',
  },
  languageName: { ar: 'العربية', fr: 'الفرنسية', en: 'الإنجليزية' },
  continueWatching: 'تابع المشاهدة',
  myFavorites: 'مفضلتي',
  recentlyWatched: 'شوهدت مؤخرًا',
  timeAgo: (minutes: number) =>
    minutes < 1
      ? 'الآن'
      : minutes < 60
        ? `منذ ${minutes} د`
        : minutes < 60 * 24
          ? `منذ ${Math.floor(minutes / 60)} س`
          : `منذ ${Math.floor(minutes / (60 * 24))} ي`,
  noFavoritesTitle: 'لا توجد قنوات مفضلة بعد',
  noFavoritesHint: 'أضف قناة إلى المفضلة من صفحتها أو من المشغل.',
  noHistory: 'ستظهر هنا القنوات التي تشاهدها.',
  searchPlaceholder: 'ابحث عن قناة…',
  searchHint: 'اسم القناة بالعربية أو الفرنسية',
  noResults: (q: string) => `لا توجد قناة تطابق «${q}»`,
  offline: 'غير متصل',
  offlineHint: 'بعض القنوات غير متوفرة.',
  settings: {
    title: 'التفضيلات',
    language: 'اللغة',
    languageHint: 'التبديل بين العربية والفرنسية يعيد تشغيل التطبيق',
    languageSystem: 'الجهاز',
    clearHistory: 'مسح سجل المشاهدة',
    clearHistoryHint: 'يحذف القنوات الأخيرة',
    clearHistoryAction: 'مسح',
    cleared: 'تم مسح السجل',
    about: 'حول التطبيق',
    contentNotice: 'البث المباشر مصدره المواقع أو قنوات يوتيوب الرسمية للقنوات.',
  },
  hints: {
    select: 'اختيار',
    navigate: 'تنقل',
    back: 'رجوع',
    backKey: 'رجوع',
  },
  streamUnavailable: 'البث غير متوفر',
  streamUnavailableHint: 'لم يتم إعداد مصدر مرخّص لهذه القناة بعد.',
  comingSoon: 'قريبًا',
  back: 'رجوع',
  player: {
    loading: 'جارٍ تحميل البث…',
    retrying: (n: number, max: number) => `إعادة الاتصال… (المحاولة ${n}/${max})`,
    errorTitle: 'تعذّر التشغيل',
    errorHint: 'البث لا يستجيب. أعد المحاولة بعد قليل.',
    offlineHint: 'تحقق من اتصالك بالشبكة',
    retry: 'إعادة المحاولة',
    play: 'تشغيل',
    pause: 'إيقاف مؤقت',
    previous: 'القناة السابقة',
    next: 'القناة التالية',
    fullscreen: 'ملء الشاشة',
    liveChannels: 'القنوات المباشرة',
    quickZap: 'تنقل سريع',
    otherChannels: 'قنوات أخرى',
    testStream: 'بث تجريبي',
    youtubeTitle: 'يُبث على يوتيوب',
    youtubeHint: 'تبث هذه القناة مباشرها على قناتها الرسمية في يوتيوب.',
    openYoutube: 'المشاهدة على يوتيوب',
  },
};

export const strings = { fr, ar } as const;
export type Locale = keyof typeof strings;
