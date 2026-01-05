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
  },
}

export const languages = [
  { id: 'uz' as Language, flag: '🇺🇿', label: 'UZ', fullName: "O'zbek" },
  { id: 'ru' as Language, flag: '🇷🇺', label: 'RU', fullName: 'Русский' },
  { id: 'en' as Language, flag: '🇬🇧', label: 'EN', fullName: 'English' },
]
