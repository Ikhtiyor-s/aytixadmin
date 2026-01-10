# Xavfsizlik Qo'llanmasi - AyTiX Admin Panel

## Umumiy ma'lumot

Ushbu hujjat AyTiX Admin Panel tizimida amalga oshirilgan xavfsizlik choralarini va eng yaxshi amaliyotlarni tavsiflaydi.

## O'rnatilgan Xavfsizlik Choralari

### 1. Parol Xavfsizligi

#### Kuchli Parol Talablari
Tizimda quyidagi parol talablari joriy etilgan:

- **Minimal uzunlik**: 8 ta belgi
- **Katta harflar**: Kamida 1 ta (A-Z)
- **Kichik harflar**: Kamida 1 ta (a-z)
- **Raqamlar**: Kamida 1 ta (0-9)
- **Maxsus belgilar**: Kamida 1 ta (!@#$%^&*...)

#### Parol Kuchini Tekshirish
- Real-time parol kuchi ko'rsatkichi
- Zaif parollar haqida ogohlantirish
- Umumiy parollarni bloklash (123456, password, qwerty va h.k.)
- Ketma-ket belgilarni aniqlash
- Takrorlanuvchi belgilarni aniqlash

**Fayl:** [utils/passwordValidation.ts](utils/passwordValidation.ts:1-167)

### 2. Kirish Ma'lumotlarini Himoyalash

#### Ochiq Ma'lumotlarni Olib Tashlash
- ✅ Barcha login sahifalaridan test credentials olib tashlandi
- ✅ Kodda ochiq parol va login ma'lumotlari yo'q
- ✅ Environment variables orqali konfiguratsiya
- ✅ localStorage'da parol saqlash to'liq o'chirildi

**MUHIM:** Hech qachon quyidagilarni qilmang:
- ❌ localStorage yoki sessionStorage'da parol saqlash
- ❌ URL parametrlarida parol yuborish
- ❌ Console log'da parol chiqarish
- ❌ Kodda hardcoded credentials yozish

#### Input Sanitizatsiya
XSS (Cross-Site Scripting) hujumlarini oldini olish uchun:
- Foydalanuvchi kiritgan ma'lumotlarni tozalash
- HTML teglarini olib tashlash
- Maksimal uzunlikni cheklash (255 belgi)

**Funksiya:** `sanitizeInput()` - [utils/passwordValidation.ts](utils/passwordValidation.ts:150-155)

### 3. HTTP Security Headers

Next.js konfiguratsiyasida quyidagi security headerlar qo'shildi:

#### Strict Transport Security (HSTS)
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```
- HTTPS orqali aloqani majburiy qiladi
- 2 yil davomida amal qiladi

#### X-Frame-Options
```
X-Frame-Options: SAMEORIGIN
```
- Clickjacking hujumlarini oldini oladi
- Faqat bir xil domendan iframe'ga joylashtirishga ruxsat beradi

#### X-Content-Type-Options
```
X-Content-Type-Options: nosniff
```
- MIME type sniffing'ni o'chiradi
- Content-Type manipulyatsiyasini oldini oladi

#### X-XSS-Protection
```
X-XSS-Protection: 1; mode=block
```
- Brauzer XSS himoyasini yoqadi
- Hujum aniqlanganida sahifani bloklaydi

#### Content Security Policy (CSP)
```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: http://localhost:8000;
connect-src 'self' http://localhost:8000;
```
- XSS va code injection hujumlarini kamaytiradi
- Faqat ishonchli manbalardan resurslarni yuklashga ruxsat beradi

**Fayl:** [next.config.js](next.config.js:15-55)

### 4. Autentifikatsiya va Avtorizatsiya

#### Cookie Xavfsizligi
- Access token va refresh token cookie'larda saqlanadi
- HTTPOnly flag ishlatilishi kerak (production)
- Secure flag ishlatilishi kerak (production)
- SameSite=Strict yoki Lax

#### Session Boshqaruvi
- Token'lar maxfiy serverda yaratiladi
- Client-side'da faqat tokenlar saqlanadi
- Logout funksiyasi cookie'larni to'liq tozalaydi

**Fayl:** [services/auth.ts](services/auth.ts:1-60)

## Production uchun Qo'shimcha Tavsiyalar

### 1. Environment Variables
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
SESSION_SECRET=very-strong-random-secret-min-32-characters
COOKIE_SECURE=true
COOKIE_HTTPONLY=true
COOKIE_SAMESITE=strict
```

### 2. HTTPS Majburiy Ishlatish
- Barcha production environmentlarda HTTPS ishlatilishi shart
- SSL/TLS sertifikatlarini yangilab turing
- Mixed content'dan saqlaning

### 3. Rate Limiting
API endpointlarga rate limiting qo'shing:
```javascript
// Tavsiya etilgan sozlamalar
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000 // 15 daqiqa
```

### 4. CORS Konfiguratsiyasi
Faqat ishonchli domenlardan so'rovlarga ruxsat bering:
```javascript
// Backend (FastAPI/Express)
const allowedOrigins = [
  'https://admin.yourdomain.com',
  'https://yourdomain.com'
]
```

### 5. Dependency Security
```bash
# Xavfsizlik zaifliklarini tekshirish
npm audit

# Avtomatik tuzatish
npm audit fix

# Dependencies'ni yangilash
npm update
```

### 6. Logging va Monitoring
- Failed login attempts'ni log qiling
- Suspicious activity'ni kuzating
- Error tracking (Sentry, LogRocket)
- Performance monitoring

### 7. Backup va Recovery
- Ma'lumotlar bazasining muntazam backup'i
- Recovery planini tayyorlang
- Backup'larni test qiling

## Xavfsizlik Testlari

### Manual Testing
- [ ] Parol validation ishlashini tekshiring
- [ ] Security headers to'g'ri sozlanganligini tekshiring
- [ ] XSS hujumlariga qarshi himoya testlari
- [ ] CSRF protection testlari
- [ ] Authentication flow testlari

### Automated Testing
```bash
# OWASP ZAP yoki Burp Suite bilan
# Penetration testing o'tkazing
```

## Xavfsizlik Incident'lari

Agar xavfsizlik muammosi topilsa:
1. Darhol production'ni himoya qiling
2. Muammoni tafsilotli log qiling
3. Barcha foydalanuvchilarga xabar bering (agar kerak bo'lsa)
4. Muammoni tuzating va test qiling
5. Post-mortem tahlil qiling

## Bog'lanish

Xavfsizlik muammolarini topganingizda:
- GitHub Issues orqali xabar bering
- Yoki to'g'ridan-to'g'ri security@yourdomain.com ga email yuboring

## Yangilanishlar

- **2025-01-10 (v2)**: Qo'shimcha xavfsizlik choralari
  - ✅ Barcha login sahifalaridan test credentials olib tashlandi
  - ✅ localStorage'da parol saqlash o'chirildi (CRITICAL FIX)
  - ✅ Input handling xavfsizlashtirildi

- **2025-01-10**: Boshlang'ich xavfsizlik choralari joriy etildi
  - Parol validation
  - Security headers
  - Input sanitization
  - Hardcoded credentials olib tashlandi

## Resurslar

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
