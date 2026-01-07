export type Language = 'uz' | 'ru' | 'en'

export interface Translations {
  dashboard: string
  users: string
  projects: string
  categories: string
  leads: string
  content: string
  comments: string
  messages: string
  partners: string
  integrations: string
  ai: string
  analytics: string
  settings: string
  search: string
  add: string
  edit: string
  delete: string
  save: string
  cancel: string
  close: string
  yes: string
  no: string
  all: string
  active: string
  blocked: string
  status: string
  date: string
  actions: string
  view: string
  send: string
  total: string
  name: string
  color: string
  icon: string
  phone: string
  email: string
  activate: string
  block: string
  viewAll: string
  noData: string
  daily: string
  weekly: string
  monthly: string
  yearly: string
  today: string
  thisWeek: string
  thisMonth: string
  thisYear: string
  dateRange: string
  custom: string
  minutesAgo: string
  hoursAgo: string
  daysAgo: string
  now: string
  newProject: string
  editProject: string
  projectName: string
  projectDesc: string
  technology: string
  category: string
  subcategory: string
  selectCategory: string
  selectSubcategory: string
  features: string
  projectIntegrations: string
  autoSend: string
  autoSendDesc: string
  connected: string
  noProjectsFound: string
  newUser: string
  editUser: string
  firstName: string
  lastName: string
  role: string
  registered: string
  deleteUser: string
  deleteUserConfirm: string
  blockUser: string
  blockUserConfirm: string
  activateUser: string
  activateUserConfirm: string
  newCategory: string
  editCategory: string
  newSubcategory: string
  editSubcategory: string
  deleteCategory: string
  deleteCategoryConfirm: string
  deleteSubcategory: string
  deleteSubcategoryConfirm: string
  projectCount: string
  newLead: string
  contacted: string
  sent: string
  cancelled: string
  totalLeads: string
  project: string
  client: string
  clients: string
  manual: string
  auto: string
  newContent: string
  editContent: string
  contentType: string
  news: string
  banner: string
  notification: string
  audience: string
  everyone: string
  freelancers: string
  selectImage: string
  uploadImage: string
  title: string
  description: string
  aiTranslate: string
  published: string
  draft: string
  banners: string
  notifications: string
  position: string
  views: string
  languages: string
  approved: string
  pending: string
  rejected: string
  approve: string
  reject: string
  reply: string
  comment: string
  rating: string
  addComment: string
  unread: string
  read: string
  inbox: string
  newMessage: string
  newPartner: string
  editPartner: string
  website: string
  address: string
  deletePartner: string
  totalProjects: string
  totalUsers: string
  totalLeadsCount: string
  totalViews: string
  revenue: string
  newRegistrations: string
  newRequests: string
  compare: string
  topProjects: string
  recentActivity: string
  conversions: string
  notificationsList: string
  markAllRead: string
  noNotifications: string
  viewAllNotifications: string
  profile: string
  logout: string
  uzbek: string
  russian: string
  english: string
  general: string
  security: string
  appearance: string
  darkMode: string
  language: string
  connectIntegrations: string
  enterProjectName: string
  enterDescription: string
  example: string
  support247: string
  from: string
  to: string
  apply: string
  previous: string
  trafficDynamics: string
  currentPeriod: string
  previousPeriod: string
  byCategories: string
  topProjectsStats: string
  conversion: string
  trend: string
  realTimeUpdates: string
  avgSession: string
  returning: string
  excellent: string
  optional: string
  partnerProjects: string
  password: string
  confirmPassword: string
  categoriesDesc: string
  iconAndColor: string
  leadsDesc: string
  leadsByIntegrations: string
  // Categories page
  addCategory: string
  subcategories: string
  noSubcategories: string
  order: string
  inactive: string
  deleteConfirmCategory: string
  deleteConfirmSubcategory: string
  pleaseEnterName: string
  translationSuccess: string
  translationError: string
  pleaseLoginFirst: string
  tryAgain: string
  uploading: string
  uploadIcon: string
  removeIcon: string
  supportedFormats: string
  translating: string
  // Content page
  addNew: string
  noNews: string
  noBanners: string
  noNotificationsContent: string
  titleUz: string
  titleRu: string
  titleEn: string
  contentUz: string
  contentRu: string
  contentEn: string
  descUz: string
  descRu: string
  descEn: string
  messageUz: string
  messageRu: string
  messageEn: string
  linkUrl: string
  projectIdLabel: string
  projectIdDesc: string
  videoGif: string
  videoFormats: string
  scheduledTime: string
  saving: string
  deleteConfirm: string
  noDescription: string
  // Users page
  manageUsers: string
  refresh: string
  totalUsersLabel: string
  activeUsersLabel: string
  regularUsersLabel: string
  sellersLabel: string
  allRoles: string
  userRole: string
  sellerRole: string
  usersFound: string
  userInfo: string
  phoneLabel: string
  idLabel: string
  registeredDate: string
  deleteUserTitle: string
  deleteUserWarning: string
  cannotUndo: string
  fullName: string
  usernameLabel: string
  phoneNumber: string
  enterFullName: string
  enterUsername: string
  enterPhone: string
  editUserTitle: string
  viewBtn: string
  editBtn: string
  blockUnblock: string
  noUsersFound: string
  cannotBlockSelf: string
  statusChangeError: string
  userLoadError: string
  userDeleteError: string
  userEditError: string
  // Partners page
  managePartners: string
  noPartners: string
  deletePartnerConfirm: string
  editPartnerTitle: string
  partnerName: string
  partnerLogo: string
  uploadLogo: string
  partnerWebsite: string
  partnerType: string
  partnerTypeHint: string
  partnerDescUz: string
  partnerOrder: string
  partnerStatus: string
  waitingStatus: string
  // Common
  image: string
  toAll: string
  toUsers: string
  toSellers: string
  toAdmins: string
  fileNotSelected: string
  // Projects page
  noProjectsFoundEmpty: string
  startByCreatingProject: string
  errorLoadingProjects: string
  noImage: string
  moreImages: string
  favorites: string
  projectImage: string
  changeImage: string
  deleteImage: string
  existingImage: string
  dropImageHere: string
  imageFormats: string
  projectVideos: string
  addVideo: string
  videoFormatsShort: string
  existing: string
  additionalImages: string
  addImage: string
  enterProjectNameLang: string
  separateWithComma: string
  projectDescLang: string
  featuresList: string
  featurePlaceholder: string
  select: string
  integrationsSection: string
  marketplaceSettings: string
  topBest: string
  newLabel: string
  savingProject: string
  sessionExpired: string
  pleaseReLogin: string
  deleteProjectConfirm: string
  noPermission: string
  adminRequired: string
  statusChangeError2: string
  uzLang: string
  ruLang: string
  enLang: string
  phoneNumber2: string
  call: string
  paymentSystem: string
  testMode: string
  smsProvider: string
  senderName: string
  senderEmail: string
  webhookOptional: string
  secretKeyOptional: string
  // Footer page
  footer: string
  footerSections: string
  socialLinks: string
  contacts: string
  footerDesc: string
  sectionName: string
  slug: string
  itemLink: string
  newTab: string
  platform: string
  contactType: string
  contactValue: string
  addSection: string
  addItem: string
  addSocialLink: string
  addContact: string
  editSection: string
  editItem: string
  editSocialLink: string
  editContact: string
  noSections: string
  noSocialLinks: string
  noContacts: string
  // FAQ page
  faq: string
  faqDesc: string
  addFaq: string
  editFaq: string
  noFaqs: string
  questionUz: string
  questionRu: string
  questionEn: string
  answerUz: string
  answerRu: string
  answerEn: string
}

export const translations: Record<Language, Translations> = {
  uz: {
    dashboard: 'Boshqaruv paneli',
    users: 'Foydalanuvchilar',
    projects: 'Loyihalar',
    categories: 'Kategoriyalar',
    leads: 'Lidlar',
    content: 'Kontent',
    comments: 'Izohlar',
    messages: 'Xabarlar',
    partners: 'Hamkorlar',
    integrations: 'Integratsiyalar',
    ai: 'AI Tahlil',
    analytics: 'Tahlillar',
    settings: 'Sozlamalar',
    search: 'Qidirish...',
    add: "Qo'shish",
    edit: 'Tahrirlash',
    delete: "O'chirish",
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    close: 'Yopish',
    yes: 'Ha',
    no: "Yo'q",
    all: 'Hammasi',
    active: 'Faol',
    blocked: 'Bloklangan',
    status: 'Holat',
    date: 'Sana',
    actions: 'Amallar',
    view: "Ko'rish",
    send: 'Yuborish',
    total: 'Jami',
    name: 'Nomi',
    color: 'Rang',
    icon: 'Belgi',
    phone: 'Telefon',
    email: 'Email',
    activate: 'Faollashtirish',
    block: 'Bloklash',
    viewAll: "Barchasini ko'rish",
    noData: "Ma'lumot topilmadi",
    daily: 'Kunlik',
    weekly: 'Haftalik',
    monthly: 'Oylik',
    yearly: 'Yillik',
    today: 'Bugun',
    thisWeek: 'Shu hafta',
    thisMonth: 'Shu oy',
    thisYear: 'Shu yil',
    dateRange: 'Sana oralig\'i',
    custom: 'Boshqa',
    minutesAgo: 'daqiqa oldin',
    hoursAgo: 'soat oldin',
    daysAgo: 'kun oldin',
    now: 'Hozir',
    newProject: 'Yangi loyiha',
    editProject: 'Loyihani tahrirlash',
    projectName: 'Loyiha nomi',
    projectDesc: 'Loyiha tavsifi',
    technology: 'Texnologiyalar',
    category: 'Kategoriya',
    subcategory: 'Subkategoriya',
    selectCategory: 'Kategoriyani tanlang',
    selectSubcategory: 'Subkategoriyani tanlang',
    features: 'Imkoniyatlar',
    projectIntegrations: 'Integratsiyalar',
    autoSend: 'Avtoyuborish',
    autoSendDesc: 'Lidlar avtomatik integratsiyalarga yuboriladi',
    connected: 'Ulangan',
    noProjectsFound: 'Bu kategoriyada loyihalar topilmadi',
    newUser: 'Yangi foydalanuvchi',
    editUser: 'Foydalanuvchini tahrirlash',
    firstName: 'Ism',
    lastName: 'Familiya',
    role: 'Rol',
    registered: "Ro'yxatdan o'tgan",
    deleteUser: "Foydalanuvchini o'chirish",
    deleteUserConfirm: "Foydalanuvchini o'chirishni xohlaysizmi?",
    blockUser: 'Foydalanuvchini bloklash',
    blockUserConfirm: 'Foydalanuvchini bloklashni xohlaysizmi?',
    activateUser: 'Foydalanuvchini faollashtirish',
    activateUserConfirm: 'Foydalanuvchini faollashtirishni xohlaysizmi?',
    newCategory: 'Yangi kategoriya',
    editCategory: 'Kategoriyani tahrirlash',
    newSubcategory: 'Yangi subkategoriya',
    editSubcategory: 'Subkategoriyani tahrirlash',
    deleteCategory: "Kategoriyani o'chirish",
    deleteCategoryConfirm: "Kategoriyani o'chirishni xohlaysizmi?",
    deleteSubcategory: "Subkategoriyani o'chirish",
    deleteSubcategoryConfirm: "Subkategoriyani o'chirishni xohlaysizmi?",
    projectCount: 'Loyihalar soni',
    newLead: 'Yangi',
    contacted: 'Aloqada',
    sent: 'Yuborilgan',
    cancelled: 'Bekor qilingan',
    totalLeads: 'Jami lidlar',
    project: 'Loyiha',
    client: 'Mijoz',
    clients: 'Mijozlar',
    manual: 'Qo\'lda',
    auto: 'Avto',
    newContent: "Yangi kontent qo'shish",
    editContent: 'Kontentni tahrirlash',
    contentType: 'Kontent turini tanlang',
    news: 'Yangilik',
    banner: 'Banner',
    notification: 'Xabarnoma',
    audience: 'Kimga yuborish',
    everyone: 'Hammaga',
    freelancers: 'Frilanserlar',
    selectImage: 'Rasm tanlang',
    uploadImage: 'Rasm yuklash uchun bosing',
    title: 'Sarlavha',
    description: 'Izoh',
    aiTranslate: 'AI Tarjima',
    published: 'Nashr qilingan',
    draft: 'Qoralama',
    banners: 'Bannerlar',
    notifications: 'Xabarnomalar',
    position: 'Pozitsiya',
    views: "Ko'rishlar",
    languages: 'Tillar',
    approved: 'Tasdiqlangan',
    pending: 'Kutilmoqda',
    rejected: 'Rad etilgan',
    approve: 'Tasdiqlash',
    reject: 'Rad etish',
    reply: 'Javob berish',
    comment: 'Izoh',
    rating: 'Baho',
    addComment: "Izoh qo'shish",
    unread: "O'qilmagan",
    read: "O'qilgan",
    inbox: 'Kiruvchi',
    newMessage: 'Yangi xabar',
    newPartner: 'Yangi hamkor',
    editPartner: 'Hamkorni tahrirlash',
    website: 'Veb-sayt',
    address: 'Manzil',
    deletePartner: "Hamkorni o'chirish",
    totalProjects: 'Jami loyihalar',
    totalUsers: 'Foydalanuvchilar',
    totalLeadsCount: 'Lidlar',
    totalViews: "Ko'rishlar",
    revenue: 'Daromad',
    newRegistrations: "Yangi ro'yxatdan o'tganlar",
    newRequests: 'Yangi sorovlar',
    compare: 'Taqqoslash',
    topProjects: 'Top loyihalar',
    recentActivity: 'Songgi faoliyat',
    conversions: 'Konversiya',
    notificationsList: 'Bildirishnomalar',
    markAllRead: "Barchasini o'qilgan deb belgilash",
    noNotifications: "Yangi bildirishnoma yoq",
    viewAllNotifications: "Barcha bildirishnomalarni ko'rish",
    profile: 'Profil',
    logout: 'Chiqish',
    uzbek: "O'zbek",
    russian: 'Русский',
    english: 'English',
    general: 'Umumiy',
    security: 'Xavfsizlik',
    appearance: "Ko'rinish",
    darkMode: 'Tungi rejim',
    language: 'Til',
    connectIntegrations: 'Avval integratsiyalarni ulang',
    enterProjectName: 'Loyiha nomini kiriting',
    enterDescription: 'Tavsifni kiriting',
    example: 'Masalan',
    support247: "24/7 qo'llab quvvatlash",
    from: 'Dan',
    to: 'Gacha',
    apply: "Qo'llash",
    previous: 'Oldingi',
    trafficDynamics: 'Trafik dinamikasi',
    currentPeriod: 'Joriy davr',
    previousPeriod: 'Oldingi davr',
    byCategories: "Kategoriyalar bo'yicha",
    topProjectsStats: 'Top loyihalar statistikasi',
    conversion: 'Konversiya',
    trend: 'Trend',
    realTimeUpdates: 'Real vaqt yangilanishlari',
    avgSession: 'Ortacha sessiya',
    returning: 'Qaytuvchi',
    excellent: 'Ajoyib',
    optional: 'ixtiyoriy',
    partnerProjects: 'Hamkorlik loyihalari',
    password: 'Parol',
    confirmPassword: 'Parolni takrorlang',
    categoriesDesc: "Loyihalar uchun kategoriyalar va subkategoriyalar",
    iconAndColor: 'Belgi va rang',
    leadsDesc: 'Mijozlar va integratsiyalardan buyurtmalar',
    leadsByIntegrations: "Integratsiyalar bo'yicha lidlar",
    // Categories page
    addCategory: "Kategoriya qo'shish",
    subcategories: 'Subkategoriyalar',
    noSubcategories: "Subkategoriyalar yo'q",
    order: 'Tartib',
    inactive: 'Nofaol',
    deleteConfirmCategory: "Bu kategoriyani o'chirmoqchimisiz? Barcha subkategoriyalar ham o'chiriladi!",
    deleteConfirmSubcategory: "Bu subkategoriyani o'chirmoqchimisiz?",
    pleaseEnterName: 'Iltimos, avval biror tilda nom kiriting',
    translationSuccess: 'Tarjima muvaffaqiyatli amalga oshirildi!',
    translationError: 'Tarjima qilishda xatolik',
    pleaseLoginFirst: 'Iltimos, avval tizimga kiring',
    tryAgain: "Qayta urinib ko'ring",
    uploading: 'Yuklanmoqda...',
    uploadIcon: 'Ikonka yuklash',
    removeIcon: "Ikonkani o'chirish",
    supportedFormats: "PNG, JPG, SVG formatlar qo'llab-quvvatlanadi",
    translating: 'Tarjima qilinmoqda...',
    // Content page
    addNew: "Yangi qo'shish",
    noNews: 'Yangiliklar topilmadi',
    noBanners: 'Bannerlar topilmadi',
    noNotificationsContent: 'Xabarnomalar topilmadi',
    titleUz: 'Sarlavha (UZ)',
    titleRu: 'Sarlavha (RU)',
    titleEn: 'Sarlavha (EN)',
    contentUz: 'Matn (UZ)',
    contentRu: 'Matn (RU)',
    contentEn: 'Matn (EN)',
    descUz: 'Tavsif (UZ)',
    descRu: 'Tavsif (RU)',
    descEn: 'Tavsif (EN)',
    messageUz: 'Xabar (UZ)',
    messageRu: 'Xabar (RU)',
    messageEn: 'Xabar (EN)',
    linkUrl: 'Havola URL',
    projectIdLabel: 'Loyiha ID (ixtiyoriy)',
    projectIdDesc: "Loyiha ID kiritilganda banner bosilganda o'sha loyihaga o'tiladi",
    videoGif: 'Video/GIF (ixtiyoriy)',
    videoFormats: 'MP4, WebM yoki GIF formatida (max 50MB)',
    scheduledTime: 'Rejali vaqt',
    saving: 'Saqlanmoqda...',
    deleteConfirm: "Rostdan ham o'chirmoqchimisiz?",
    noDescription: "Tavsif yo'q",
    // Users page
    manageUsers: "Ro'yxatdan o'tgan foydalanuvchilarni boshqaring",
    refresh: 'Yangilash',
    totalUsersLabel: 'Jami foydalanuvchilar',
    activeUsersLabel: 'Faol foydalanuvchilar',
    regularUsersLabel: 'Oddiy foydalanuvchilar',
    sellersLabel: 'Sotuvchilar',
    allRoles: 'Barchasi',
    userRole: 'Foydalanuvchi',
    sellerRole: 'Sotuvchi',
    usersFound: 'ta foydalanuvchi',
    userInfo: "Foydalanuvchi ma'lumotlari",
    phoneLabel: 'Telefon',
    idLabel: 'ID',
    registeredDate: "Ro'yxatdan o'tgan sana",
    deleteUserTitle: "Foydalanuvchini o'chirish",
    deleteUserWarning: "foydalanuvchisini o'chirmoqchimisiz?",
    cannotUndo: "Bu amalni ortga qaytarib bo'lmaydi.",
    fullName: "To'liq ism",
    usernameLabel: 'Foydalanuvchi nomi',
    phoneNumber: 'Telefon raqam',
    enterFullName: "To'liq ismni kiriting",
    enterUsername: 'Foydalanuvchi nomini kiriting',
    enterPhone: 'Telefon raqamini kiriting',
    editUserTitle: 'Foydalanuvchini tahrirlash',
    viewBtn: "Ko'rish",
    editBtn: 'Tahrirlash',
    blockUnblock: 'Bloklash/Faollashtirish',
    noUsersFound: 'Foydalanuvchilar topilmadi',
    cannotBlockSelf: "O'z akkauntingizni bloklay olmaysiz",
    statusChangeError: "Holatni o'zgartirishda xatolik yuz berdi",
    userLoadError: 'Foydalanuvchilarni yuklashda xatolik',
    userDeleteError: "Foydalanuvchini o'chirishda xatolik yuz berdi",
    userEditError: 'Foydalanuvchini tahrirlashda xatolik yuz berdi',
    // Partners page
    managePartners: 'Hamkorlar va mijozlarni boshqaring',
    noPartners: 'Hamkorlar topilmadi',
    deletePartnerConfirm: "Hamkorni o'chirmoqchimisiz?",
    editPartnerTitle: 'Hamkorni tahrirlash',
    partnerName: 'Nomi',
    partnerLogo: 'Logo',
    uploadLogo: 'Rasm yuklash',
    partnerWebsite: 'Veb-sayt',
    partnerType: 'Turi',
    partnerTypeHint: 'Texnologiya hamkori, Mijoz...',
    partnerDescUz: 'Tavsif (UZ)',
    partnerOrder: 'Tartib',
    partnerStatus: 'Holat',
    waitingStatus: 'Kutilmoqda',
    // Common
    image: 'Rasm',
    toAll: 'Hammaga',
    toUsers: 'Foydalanuvchilar',
    toSellers: 'Sotuvchilar',
    toAdmins: 'Adminlar',
    fileNotSelected: 'Fayl tanlanmagan',
    // Projects page
    noProjectsFoundEmpty: 'Loyihalar topilmadi',
    startByCreatingProject: "Birinchi loyihangizni yaratishdan boshlang",
    errorLoadingProjects: "Loyihalarni yuklashda xatolik",
    noImage: "Rasm yo'q",
    moreImages: 'ta rasm',
    favorites: 'Sevimlilar',
    projectImage: 'Loyiha rasmi',
    changeImage: "O'zgartirish",
    deleteImage: "O'chirish",
    existingImage: 'Mavjud rasm',
    dropImageHere: 'Rasmni bu yerga tashlang yoki bosing',
    imageFormats: 'PNG, JPG, WEBP (max 5MB)',
    projectVideos: 'Loyiha videolari (cheksiz)',
    addVideo: "Video qo'shish",
    videoFormatsShort: 'MP4, WebM',
    existing: 'Mavjud',
    additionalImages: "Qo'shimcha rasmlar (cheksiz)",
    addImage: "Rasm qo'shish",
    enterProjectNameLang: 'Loyiha nomini kiriting',
    separateWithComma: 'Vergul bilan ajrating',
    projectDescLang: 'Loyiha haqida qisqacha',
    featuresList: 'Imkoniyatlar',
    featurePlaceholder: "Masalan: 24/7 qo'llab quvvatlash",
    select: 'Tanlang',
    integrationsSection: 'Integratsiyalar',
    marketplaceSettings: 'Marketplace sozlamalari',
    topBest: 'Eng yaxshi',
    newLabel: 'Yangi',
    savingProject: 'Saqlanmoqda...',
    sessionExpired: 'Sessiya muddati tugagan. Iltimos, qayta login qiling.',
    pleaseReLogin: 'Iltimos, avval tizimga kiring',
    deleteProjectConfirm: "Loyihani o'chirishni tasdiqlaysizmi?",
    noPermission: "Ruxsat yo'q. Admin huquqlari talab qilinadi.",
    adminRequired: 'Admin huquqlari talab qilinadi',
    statusChangeError2: "Status o'zgartirishda xatolik",
    uzLang: "O'zbekcha",
    ruLang: 'Ruscha',
    enLang: 'Inglizcha',
    phoneNumber2: 'Telefon raqami',
    call: "Qo'ng'iroq",
    paymentSystem: "To'lov tizimi",
    testMode: 'Test rejimi',
    smsProvider: 'SMS provayder',
    senderName: "Jo'natuvchi nomi",
    senderEmail: "Jo'natuvchi Email",
    webhookOptional: 'Webhook URL (ixtiyoriy)',
    secretKeyOptional: 'Secret Key (ixtiyoriy)',
    // Footer page
    footer: 'Footer',
    footerSections: "Bo'limlar",
    socialLinks: 'Ijtimoiy tarmoqlar',
    contacts: "Bog'lanish",
    footerDesc: "Sayt pastki qismidagi ma'lumotlarni boshqaring",
    sectionName: "Bo'lim nomi",
    slug: 'Slug',
    itemLink: 'Havola',
    newTab: "Yangi oynada ochish",
    platform: 'Platforma',
    contactType: 'Kontakt turi',
    contactValue: 'Qiymat',
    addSection: "Bo'lim qo'shish",
    addItem: "Element qo'shish",
    addSocialLink: "Ijtimoiy tarmoq qo'shish",
    addContact: "Kontakt qo'shish",
    editSection: "Bo'limni tahrirlash",
    editItem: 'Elementni tahrirlash',
    editSocialLink: 'Ijtimoiy tarmoqni tahrirlash',
    editContact: 'Kontaktni tahrirlash',
    noSections: "Bo'limlar topilmadi",
    noSocialLinks: 'Ijtimoiy tarmoqlar topilmadi',
    noContacts: 'Kontaktlar topilmadi',
    // FAQ page
    faq: "Ko'p so'raladigan savollar",
    faqDesc: "Saytdagi FAQ savollarini boshqaring",
    addFaq: "Savol qo'shish",
    editFaq: "Savolni tahrirlash",
    noFaqs: "Hozircha savollar yo'q",
    questionUz: "Savol (UZ)",
    questionRu: "Savol (RU)",
    questionEn: "Savol (EN)",
    answerUz: "Javob (UZ)",
    answerRu: "Javob (RU)",
    answerEn: "Javob (EN)",
  },
  ru: {
    dashboard: 'Панель',
    users: 'Пользователи',
    projects: 'Проекты',
    categories: 'Категории',
    leads: 'Лиды',
    content: 'Контент',
    comments: 'Комментарии',
    messages: 'Сообщения',
    partners: 'Партнёры',
    integrations: 'Интеграции',
    ai: 'AI Анализ',
    analytics: 'Аналитика',
    settings: 'Настройки',
    search: 'Поиск...',
    add: 'Добавить',
    edit: 'Редактировать',
    delete: 'Удалить',
    save: 'Сохранить',
    cancel: 'Отмена',
    close: 'Закрыть',
    yes: 'Да',
    no: 'Нет',
    all: 'Все',
    active: 'Активный',
    blocked: 'Заблокирован',
    status: 'Статус',
    date: 'Дата',
    actions: 'Действия',
    view: 'Просмотр',
    send: 'Отправить',
    total: 'Всего',
    name: 'Название',
    color: 'Цвет',
    icon: 'Иконка',
    phone: 'Телефон',
    email: 'Email',
    activate: 'Активировать',
    block: 'Заблокировать',
    viewAll: 'Смотреть все',
    noData: 'Данные не найдены',
    daily: 'Ежедневно',
    weekly: 'Еженедельно',
    monthly: 'Ежемесячно',
    yearly: 'Ежегодно',
    today: 'Сегодня',
    thisWeek: 'Эта неделя',
    thisMonth: 'Этот месяц',
    thisYear: 'Этот год',
    dateRange: 'Диапазон дат',
    custom: 'Свой',
    minutesAgo: 'мин назад',
    hoursAgo: 'ч назад',
    daysAgo: 'дн назад',
    now: 'Сейчас',
    newProject: 'Новый проект',
    editProject: 'Редактировать проект',
    projectName: 'Название проекта',
    projectDesc: 'Описание проекта',
    technology: 'Технологии',
    category: 'Категория',
    subcategory: 'Подкатегория',
    selectCategory: 'Выберите категорию',
    selectSubcategory: 'Выберите подкатегорию',
    features: 'Возможности',
    projectIntegrations: 'Интеграции',
    autoSend: 'Автоотправка',
    autoSendDesc: 'Лиды автоматически отправляются в интеграции',
    connected: 'Подключено',
    noProjectsFound: 'Проекты в этой категории не найдены',
    newUser: 'Новый пользователь',
    editUser: 'Редактировать пользователя',
    firstName: 'Имя',
    lastName: 'Фамилия',
    role: 'Роль',
    registered: 'Зарегистрирован',
    deleteUser: 'Удалить пользователя',
    deleteUserConfirm: 'Вы уверены что хотите удалить пользователя?',
    blockUser: 'Заблокировать пользователя',
    blockUserConfirm: 'Вы уверены что хотите заблокировать пользователя?',
    activateUser: 'Активировать пользователя',
    activateUserConfirm: 'Вы уверены что хотите активировать пользователя?',
    newCategory: 'Новая категория',
    editCategory: 'Редактировать категорию',
    newSubcategory: 'Новая подкатегория',
    editSubcategory: 'Редактировать подкатегорию',
    deleteCategory: 'Удалить категорию',
    deleteCategoryConfirm: 'Вы уверены что хотите удалить категорию?',
    deleteSubcategory: 'Удалить подкатегорию',
    deleteSubcategoryConfirm: 'Вы уверены что хотите удалить подкатегорию?',
    projectCount: 'Количество проектов',
    newLead: 'Новый',
    contacted: 'Связались',
    sent: 'Отправлено',
    cancelled: 'Отменено',
    totalLeads: 'Всего лидов',
    project: 'Проект',
    client: 'Клиент',
    clients: 'Клиенты',
    manual: 'Вручную',
    auto: 'Авто',
    newContent: 'Добавить контент',
    editContent: 'Редактировать контент',
    contentType: 'Выберите тип контента',
    news: 'Новость',
    banner: 'Баннер',
    notification: 'Уведомление',
    audience: 'Кому отправить',
    everyone: 'Всем',
    freelancers: 'Фрилансеры',
    selectImage: 'Выберите изображение',
    uploadImage: 'Нажмите для загрузки',
    title: 'Заголовок',
    description: 'Описание',
    aiTranslate: 'AI Перевод',
    published: 'Опубликовано',
    draft: 'Черновик',
    banners: 'Баннеры',
    notifications: 'Уведомления',
    position: 'Позиция',
    views: 'Просмотры',
    languages: 'Языки',
    approved: 'Одобрено',
    pending: 'Ожидает',
    rejected: 'Отклонено',
    approve: 'Одобрить',
    reject: 'Отклонить',
    reply: 'Ответить',
    comment: 'Комментарий',
    rating: 'Оценка',
    addComment: 'Добавить комментарий',
    unread: 'Непрочитанные',
    read: 'Прочитанные',
    inbox: 'Входящие',
    newMessage: 'Новое сообщение',
    newPartner: 'Новый партнёр',
    editPartner: 'Редактировать партнёра',
    website: 'Веб-сайт',
    address: 'Адрес',
    deletePartner: 'Удалить партнёра',
    totalProjects: 'Всего проектов',
    totalUsers: 'Пользователей',
    totalLeadsCount: 'Лидов',
    totalViews: 'Просмотров',
    revenue: 'Доход',
    newRegistrations: 'Новые регистрации',
    newRequests: 'Новые заявки',
    compare: 'Сравнить',
    topProjects: 'Топ проекты',
    recentActivity: 'Последняя активность',
    conversions: 'Конверсия',
    notificationsList: 'Уведомления',
    markAllRead: 'Отметить все как прочитанные',
    noNotifications: 'Нет новых уведомлений',
    viewAllNotifications: 'Смотреть все уведомления',
    profile: 'Профиль',
    logout: 'Выход',
    uzbek: 'Ozbek',
    russian: 'Русский',
    english: 'English',
    general: 'Общие',
    security: 'Безопасность',
    appearance: 'Внешний вид',
    darkMode: 'Тёмный режим',
    language: 'Язык',
    connectIntegrations: 'Сначала подключите интеграции',
    enterProjectName: 'Введите название проекта',
    enterDescription: 'Введите описание',
    example: 'Например',
    support247: 'Поддержка 24/7',
    from: 'От',
    to: 'До',
    apply: 'Применить',
    previous: 'Предыдущий',
    trafficDynamics: 'Динамика трафика',
    currentPeriod: 'Текущий период',
    previousPeriod: 'Предыдущий период',
    byCategories: 'По категориям',
    topProjectsStats: 'Статистика топ проектов',
    conversion: 'Конверсия',
    trend: 'Тренд',
    realTimeUpdates: 'Обновления в реальном времени',
    avgSession: 'Средняя сессия',
    returning: 'Возвращающиеся',
    excellent: 'Отлично',
    optional: 'необязательно',
    partnerProjects: 'Партнёрские проекты',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    categoriesDesc: 'Категории и подкатегории для проектов',
    iconAndColor: 'Иконка и цвет',
    leadsDesc: 'Заказы от клиентов и интеграций',
    leadsByIntegrations: 'Лиды по интеграциям',
    // Categories page
    addCategory: 'Добавить категорию',
    subcategories: 'Подкатегории',
    noSubcategories: 'Нет подкатегорий',
    order: 'Порядок',
    inactive: 'Неактивен',
    deleteConfirmCategory: 'Вы уверены, что хотите удалить категорию? Все подкатегории также будут удалены!',
    deleteConfirmSubcategory: 'Вы уверены, что хотите удалить подкатегорию?',
    pleaseEnterName: 'Пожалуйста, сначала введите название на любом языке',
    translationSuccess: 'Перевод успешно выполнен!',
    translationError: 'Ошибка при переводе',
    pleaseLoginFirst: 'Пожалуйста, сначала войдите в систему',
    tryAgain: 'Попробовать снова',
    uploading: 'Загрузка...',
    uploadIcon: 'Загрузить иконку',
    removeIcon: 'Удалить иконку',
    supportedFormats: 'Поддерживаются форматы PNG, JPG, SVG',
    translating: 'Перевод...',
    // Content page
    addNew: 'Добавить',
    noNews: 'Новости не найдены',
    noBanners: 'Баннеры не найдены',
    noNotificationsContent: 'Уведомления не найдены',
    titleUz: 'Заголовок (UZ)',
    titleRu: 'Заголовок (RU)',
    titleEn: 'Заголовок (EN)',
    contentUz: 'Текст (UZ)',
    contentRu: 'Текст (RU)',
    contentEn: 'Текст (EN)',
    descUz: 'Описание (UZ)',
    descRu: 'Описание (RU)',
    descEn: 'Описание (EN)',
    messageUz: 'Сообщение (UZ)',
    messageRu: 'Сообщение (RU)',
    messageEn: 'Сообщение (EN)',
    linkUrl: 'URL ссылки',
    projectIdLabel: 'ID проекта (необязательно)',
    projectIdDesc: 'При указании ID проекта, при клике на баннер будет переход к проекту',
    videoGif: 'Видео/GIF (необязательно)',
    videoFormats: 'Формат MP4, WebM или GIF (макс 50MB)',
    scheduledTime: 'Запланированное время',
    saving: 'Сохранение...',
    deleteConfirm: 'Вы уверены, что хотите удалить?',
    noDescription: 'Нет описания',
    // Users page
    manageUsers: 'Управление зарегистрированными пользователями',
    refresh: 'Обновить',
    totalUsersLabel: 'Всего пользователей',
    activeUsersLabel: 'Активные пользователи',
    regularUsersLabel: 'Обычные пользователи',
    sellersLabel: 'Продавцы',
    allRoles: 'Все',
    userRole: 'Пользователь',
    sellerRole: 'Продавец',
    usersFound: 'пользователей',
    userInfo: 'Информация о пользователе',
    phoneLabel: 'Телефон',
    idLabel: 'ID',
    registeredDate: 'Дата регистрации',
    deleteUserTitle: 'Удалить пользователя',
    deleteUserWarning: 'удалить?',
    cannotUndo: 'Это действие нельзя отменить.',
    fullName: 'Полное имя',
    usernameLabel: 'Имя пользователя',
    phoneNumber: 'Номер телефона',
    enterFullName: 'Введите полное имя',
    enterUsername: 'Введите имя пользователя',
    enterPhone: 'Введите номер телефона',
    editUserTitle: 'Редактировать пользователя',
    viewBtn: 'Просмотр',
    editBtn: 'Редактировать',
    blockUnblock: 'Блокировать/Разблокировать',
    noUsersFound: 'Пользователи не найдены',
    cannotBlockSelf: 'Вы не можете заблокировать свой аккаунт',
    statusChangeError: 'Ошибка при изменении статуса',
    userLoadError: 'Ошибка при загрузке пользователей',
    userDeleteError: 'Ошибка при удалении пользователя',
    userEditError: 'Ошибка при редактировании пользователя',
    // Partners page
    managePartners: 'Управление партнёрами и клиентами',
    noPartners: 'Партнёры не найдены',
    deletePartnerConfirm: 'Удалить партнёра?',
    editPartnerTitle: 'Редактировать партнёра',
    partnerName: 'Название',
    partnerLogo: 'Логотип',
    uploadLogo: 'Загрузить изображение',
    partnerWebsite: 'Веб-сайт',
    partnerType: 'Тип',
    partnerTypeHint: 'Технологический партнёр, Клиент...',
    partnerDescUz: 'Описание (UZ)',
    partnerOrder: 'Порядок',
    partnerStatus: 'Статус',
    waitingStatus: 'Ожидает',
    // Common
    image: 'Изображение',
    toAll: 'Всем',
    toUsers: 'Пользователям',
    toSellers: 'Продавцам',
    toAdmins: 'Админам',
    fileNotSelected: 'Файл не выбран',
    // Projects page
    noProjectsFoundEmpty: 'Проекты не найдены',
    startByCreatingProject: 'Начните с создания первого проекта',
    errorLoadingProjects: 'Ошибка загрузки проектов',
    noImage: 'Нет изображения',
    moreImages: 'изображений',
    favorites: 'Избранное',
    projectImage: 'Изображение проекта',
    changeImage: 'Изменить',
    deleteImage: 'Удалить',
    existingImage: 'Существующее изображение',
    dropImageHere: 'Перетащите изображение сюда или нажмите',
    imageFormats: 'PNG, JPG, WEBP (макс 5MB)',
    projectVideos: 'Видео проекта (без ограничений)',
    addVideo: 'Добавить видео',
    videoFormatsShort: 'MP4, WebM',
    existing: 'Существующий',
    additionalImages: 'Дополнительные изображения (без ограничений)',
    addImage: 'Добавить изображение',
    enterProjectNameLang: 'Введите название проекта',
    separateWithComma: 'Разделяйте запятой',
    projectDescLang: 'Краткое описание проекта',
    featuresList: 'Возможности',
    featurePlaceholder: 'Например: поддержка 24/7',
    select: 'Выберите',
    integrationsSection: 'Интеграции',
    marketplaceSettings: 'Настройки маркетплейса',
    topBest: 'Лучший',
    newLabel: 'Новый',
    savingProject: 'Сохранение...',
    sessionExpired: 'Сессия истекла. Пожалуйста, войдите снова.',
    pleaseReLogin: 'Пожалуйста, сначала войдите в систему',
    deleteProjectConfirm: 'Подтвердите удаление проекта?',
    noPermission: 'Нет разрешения. Требуются права администратора.',
    adminRequired: 'Требуются права администратора',
    statusChangeError2: 'Ошибка изменения статуса',
    uzLang: 'Узбекский',
    ruLang: 'Русский',
    enLang: 'Английский',
    phoneNumber2: 'Номер телефона',
    call: 'Звонок',
    paymentSystem: 'Платёжная система',
    testMode: 'Тестовый режим',
    smsProvider: 'SMS провайдер',
    senderName: 'Имя отправителя',
    senderEmail: 'Email отправителя',
    webhookOptional: 'Webhook URL (необязательно)',
    secretKeyOptional: 'Secret Key (необязательно)',
    // Footer page
    footer: 'Футер',
    footerSections: 'Разделы',
    socialLinks: 'Социальные сети',
    contacts: 'Контакты',
    footerDesc: 'Управление информацией в нижней части сайта',
    sectionName: 'Название раздела',
    slug: 'Slug',
    itemLink: 'Ссылка',
    newTab: 'Открыть в новой вкладке',
    platform: 'Платформа',
    contactType: 'Тип контакта',
    contactValue: 'Значение',
    addSection: 'Добавить раздел',
    addItem: 'Добавить элемент',
    addSocialLink: 'Добавить соцсеть',
    addContact: 'Добавить контакт',
    editSection: 'Редактировать раздел',
    editItem: 'Редактировать элемент',
    editSocialLink: 'Редактировать соцсеть',
    editContact: 'Редактировать контакт',
    noSections: 'Разделы не найдены',
    noSocialLinks: 'Социальные сети не найдены',
    noContacts: 'Контакты не найдены',
    // FAQ page
    faq: 'Часто задаваемые вопросы',
    faqDesc: 'Управление FAQ вопросами на сайте',
    addFaq: 'Добавить вопрос',
    editFaq: 'Редактировать вопрос',
    noFaqs: 'Пока нет вопросов',
    questionUz: 'Вопрос (UZ)',
    questionRu: 'Вопрос (RU)',
    questionEn: 'Вопрос (EN)',
    answerUz: 'Ответ (UZ)',
    answerRu: 'Ответ (RU)',
    answerEn: 'Ответ (EN)',
  },
  en: {
    dashboard: 'Dashboard',
    users: 'Users',
    projects: 'Projects',
    categories: 'Categories',
    leads: 'Leads',
    content: 'Content',
    comments: 'Comments',
    messages: 'Messages',
    partners: 'Partners',
    integrations: 'Integrations',
    ai: 'AI Analytics',
    analytics: 'Analytics',
    settings: 'Settings',
    search: 'Search...',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    all: 'All',
    active: 'Active',
    blocked: 'Blocked',
    status: 'Status',
    date: 'Date',
    actions: 'Actions',
    view: 'View',
    send: 'Send',
    total: 'Total',
    name: 'Name',
    color: 'Color',
    icon: 'Icon',
    phone: 'Phone',
    email: 'Email',
    activate: 'Activate',
    block: 'Block',
    viewAll: 'View All',
    noData: 'No Data Found',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    dateRange: 'Date Range',
    custom: 'Custom',
    minutesAgo: 'min ago',
    hoursAgo: 'h ago',
    daysAgo: 'd ago',
    now: 'Now',
    newProject: 'New Project',
    editProject: 'Edit Project',
    projectName: 'Project Name',
    projectDesc: 'Project Description',
    technology: 'Technologies',
    category: 'Category',
    subcategory: 'Subcategory',
    selectCategory: 'Select Category',
    selectSubcategory: 'Select Subcategory',
    features: 'Features',
    projectIntegrations: 'Integrations',
    autoSend: 'Auto-send',
    autoSendDesc: 'Leads are automatically sent to integrations',
    connected: 'Connected',
    noProjectsFound: 'No projects found in this category',
    newUser: 'New User',
    editUser: 'Edit User',
    firstName: 'First Name',
    lastName: 'Last Name',
    role: 'Role',
    registered: 'Registered',
    deleteUser: 'Delete User',
    deleteUserConfirm: 'Are you sure you want to delete this user?',
    blockUser: 'Block User',
    blockUserConfirm: 'Are you sure you want to block this user?',
    activateUser: 'Activate User',
    activateUserConfirm: 'Are you sure you want to activate this user?',
    newCategory: 'New Category',
    editCategory: 'Edit Category',
    newSubcategory: 'New Subcategory',
    editSubcategory: 'Edit Subcategory',
    deleteCategory: 'Delete Category',
    deleteCategoryConfirm: 'Are you sure you want to delete this category?',
    deleteSubcategory: 'Delete Subcategory',
    deleteSubcategoryConfirm: 'Are you sure you want to delete this subcategory?',
    projectCount: 'Project Count',
    newLead: 'New',
    contacted: 'Contacted',
    sent: 'Sent',
    cancelled: 'Cancelled',
    totalLeads: 'Total Leads',
    project: 'Project',
    client: 'Client',
    clients: 'Clients',
    manual: 'Manual',
    auto: 'Auto',
    newContent: 'Add Content',
    editContent: 'Edit Content',
    contentType: 'Select Content Type',
    news: 'News',
    banner: 'Banner',
    notification: 'Notification',
    audience: 'Send To',
    everyone: 'Everyone',
    freelancers: 'Freelancers',
    selectImage: 'Select Image',
    uploadImage: 'Click to upload',
    title: 'Title',
    description: 'Description',
    aiTranslate: 'AI Translate',
    published: 'Published',
    draft: 'Draft',
    banners: 'Banners',
    notifications: 'Notifications',
    position: 'Position',
    views: 'Views',
    languages: 'Languages',
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
    approve: 'Approve',
    reject: 'Reject',
    reply: 'Reply',
    comment: 'Comment',
    rating: 'Rating',
    addComment: 'Add Comment',
    unread: 'Unread',
    read: 'Read',
    inbox: 'Inbox',
    newMessage: 'New Message',
    newPartner: 'New Partner',
    editPartner: 'Edit Partner',
    website: 'Website',
    address: 'Address',
    deletePartner: 'Delete Partner',
    totalProjects: 'Total Projects',
    totalUsers: 'Users',
    totalLeadsCount: 'Leads',
    totalViews: 'Views',
    revenue: 'Revenue',
    newRegistrations: 'New Registrations',
    newRequests: 'New Requests',
    compare: 'Compare',
    topProjects: 'Top Projects',
    recentActivity: 'Recent Activity',
    conversions: 'Conversions',
    notificationsList: 'Notifications',
    markAllRead: 'Mark all as read',
    noNotifications: 'No new notifications',
    viewAllNotifications: 'View all notifications',
    profile: 'Profile',
    logout: 'Logout',
    uzbek: "O'zbek",
    russian: 'Русский',
    english: 'English',
    general: 'General',
    security: 'Security',
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    language: 'Language',
    connectIntegrations: 'Connect integrations first',
    enterProjectName: 'Enter project name',
    enterDescription: 'Enter description',
    example: 'Example',
    support247: '24/7 Support',
    from: 'From',
    to: 'To',
    apply: 'Apply',
    previous: 'Previous',
    trafficDynamics: 'Traffic Dynamics',
    currentPeriod: 'Current Period',
    previousPeriod: 'Previous Period',
    byCategories: 'By Categories',
    topProjectsStats: 'Top Projects Statistics',
    conversion: 'Conversion',
    trend: 'Trend',
    realTimeUpdates: 'Real-time Updates',
    avgSession: 'Avg Session',
    returning: 'Returning',
    excellent: 'Excellent',
    optional: 'optional',
    partnerProjects: 'Partner Projects',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    categoriesDesc: 'Categories and subcategories for projects',
    iconAndColor: 'Icon and Color',
    leadsDesc: 'Orders from clients and integrations',
    leadsByIntegrations: 'Leads by Integrations',
    // Categories page
    addCategory: 'Add Category',
    subcategories: 'Subcategories',
    noSubcategories: 'No subcategories',
    order: 'Order',
    inactive: 'Inactive',
    deleteConfirmCategory: 'Are you sure you want to delete this category? All subcategories will also be deleted!',
    deleteConfirmSubcategory: 'Are you sure you want to delete this subcategory?',
    pleaseEnterName: 'Please enter a name in any language first',
    translationSuccess: 'Translation completed successfully!',
    translationError: 'Translation error',
    pleaseLoginFirst: 'Please login first',
    tryAgain: 'Try again',
    uploading: 'Uploading...',
    uploadIcon: 'Upload icon',
    removeIcon: 'Remove icon',
    supportedFormats: 'PNG, JPG, SVG formats supported',
    translating: 'Translating...',
    // Content page
    addNew: 'Add New',
    noNews: 'No news found',
    noBanners: 'No banners found',
    noNotificationsContent: 'No notifications found',
    titleUz: 'Title (UZ)',
    titleRu: 'Title (RU)',
    titleEn: 'Title (EN)',
    contentUz: 'Content (UZ)',
    contentRu: 'Content (RU)',
    contentEn: 'Content (EN)',
    descUz: 'Description (UZ)',
    descRu: 'Description (RU)',
    descEn: 'Description (EN)',
    messageUz: 'Message (UZ)',
    messageRu: 'Message (RU)',
    messageEn: 'Message (EN)',
    linkUrl: 'Link URL',
    projectIdLabel: 'Project ID (optional)',
    projectIdDesc: 'When project ID is set, clicking the banner will navigate to that project',
    videoGif: 'Video/GIF (optional)',
    videoFormats: 'MP4, WebM or GIF format (max 50MB)',
    scheduledTime: 'Scheduled Time',
    saving: 'Saving...',
    deleteConfirm: 'Are you sure you want to delete?',
    noDescription: 'No description',
    // Users page
    manageUsers: 'Manage registered users',
    refresh: 'Refresh',
    totalUsersLabel: 'Total users',
    activeUsersLabel: 'Active users',
    regularUsersLabel: 'Regular users',
    sellersLabel: 'Sellers',
    allRoles: 'All',
    userRole: 'User',
    sellerRole: 'Seller',
    usersFound: 'users',
    userInfo: 'User Information',
    phoneLabel: 'Phone',
    idLabel: 'ID',
    registeredDate: 'Registration Date',
    deleteUserTitle: 'Delete User',
    deleteUserWarning: 'delete?',
    cannotUndo: 'This action cannot be undone.',
    fullName: 'Full Name',
    usernameLabel: 'Username',
    phoneNumber: 'Phone Number',
    enterFullName: 'Enter full name',
    enterUsername: 'Enter username',
    enterPhone: 'Enter phone number',
    editUserTitle: 'Edit User',
    viewBtn: 'View',
    editBtn: 'Edit',
    blockUnblock: 'Block/Unblock',
    noUsersFound: 'No users found',
    cannotBlockSelf: 'You cannot block your own account',
    statusChangeError: 'Error changing status',
    userLoadError: 'Error loading users',
    userDeleteError: 'Error deleting user',
    userEditError: 'Error editing user',
    // Partners page
    managePartners: 'Manage partners and clients',
    noPartners: 'No partners found',
    deletePartnerConfirm: 'Delete partner?',
    editPartnerTitle: 'Edit Partner',
    partnerName: 'Name',
    partnerLogo: 'Logo',
    uploadLogo: 'Upload image',
    partnerWebsite: 'Website',
    partnerType: 'Type',
    partnerTypeHint: 'Technology partner, Client...',
    partnerDescUz: 'Description (UZ)',
    partnerOrder: 'Order',
    partnerStatus: 'Status',
    waitingStatus: 'Waiting',
    // Common
    image: 'Image',
    toAll: 'Everyone',
    toUsers: 'Users',
    toSellers: 'Sellers',
    toAdmins: 'Admins',
    fileNotSelected: 'File not selected',
    // Projects page
    noProjectsFoundEmpty: 'No projects found',
    startByCreatingProject: 'Start by creating your first project',
    errorLoadingProjects: 'Error loading projects',
    noImage: 'No image',
    moreImages: 'images',
    favorites: 'Favorites',
    projectImage: 'Project image',
    changeImage: 'Change',
    deleteImage: 'Delete',
    existingImage: 'Existing image',
    dropImageHere: 'Drop image here or click',
    imageFormats: 'PNG, JPG, WEBP (max 5MB)',
    projectVideos: 'Project videos (unlimited)',
    addVideo: 'Add video',
    videoFormatsShort: 'MP4, WebM',
    existing: 'Existing',
    additionalImages: 'Additional images (unlimited)',
    addImage: 'Add image',
    enterProjectNameLang: 'Enter project name',
    separateWithComma: 'Separate with comma',
    projectDescLang: 'Brief project description',
    featuresList: 'Features',
    featurePlaceholder: 'Example: 24/7 support',
    select: 'Select',
    integrationsSection: 'Integrations',
    marketplaceSettings: 'Marketplace settings',
    topBest: 'Best',
    newLabel: 'New',
    savingProject: 'Saving...',
    sessionExpired: 'Session expired. Please log in again.',
    pleaseReLogin: 'Please log in first',
    deleteProjectConfirm: 'Confirm project deletion?',
    noPermission: 'No permission. Admin rights required.',
    adminRequired: 'Admin rights required',
    statusChangeError2: 'Error changing status',
    uzLang: 'Uzbek',
    ruLang: 'Russian',
    enLang: 'English',
    phoneNumber2: 'Phone number',
    call: 'Call',
    paymentSystem: 'Payment system',
    testMode: 'Test mode',
    smsProvider: 'SMS provider',
    senderName: 'Sender name',
    senderEmail: 'Sender email',
    webhookOptional: 'Webhook URL (optional)',
    secretKeyOptional: 'Secret Key (optional)',
    // Footer page
    footer: 'Footer',
    footerSections: 'Sections',
    socialLinks: 'Social Links',
    contacts: 'Contacts',
    footerDesc: 'Manage footer information on the website',
    sectionName: 'Section Name',
    slug: 'Slug',
    itemLink: 'Link',
    newTab: 'Open in new tab',
    platform: 'Platform',
    contactType: 'Contact Type',
    contactValue: 'Value',
    addSection: 'Add Section',
    addItem: 'Add Item',
    addSocialLink: 'Add Social Link',
    addContact: 'Add Contact',
    editSection: 'Edit Section',
    editItem: 'Edit Item',
    editSocialLink: 'Edit Social Link',
    editContact: 'Edit Contact',
    noSections: 'No sections found',
    noSocialLinks: 'No social links found',
    noContacts: 'No contacts found',
    // FAQ page
    faq: 'Frequently Asked Questions',
    faqDesc: 'Manage FAQ questions on the website',
    addFaq: 'Add Question',
    editFaq: 'Edit Question',
    noFaqs: 'No questions yet',
    questionUz: 'Question (UZ)',
    questionRu: 'Question (RU)',
    questionEn: 'Question (EN)',
    answerUz: 'Answer (UZ)',
    answerRu: 'Answer (RU)',
    answerEn: 'Answer (EN)',
  },
}

export const languages = [
  { id: 'uz' as Language, flag: '🇺🇿', label: 'UZ', fullName: "O'zbek" },
  { id: 'ru' as Language, flag: '🇷🇺', label: 'RU', fullName: 'Русский' },
  { id: 'en' as Language, flag: '🇬🇧', label: 'EN', fullName: 'English' },
]
