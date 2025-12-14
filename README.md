# موقع د. آسيا خليفة طلال الجري - Laravel Starter Kit

موقع إلكتروني للدكتورة آسيا خليفة طلال الجري - استشاري نفسي وتربوي، مبني باستخدام Laravel Starter Kit مع React و Inertia.js.

## 📍 المسار

**المسار الكامل للمشروع:**
```
E:\whatsapp_project\LToReactAsia\laravel-app
```

**المسار النسبي من المجلد الرئيسي:**
```
LToReactAsia/laravel-app
```

## 📋 نظرة عامة

هذا المشروع مبني باستخدام:
- **Laravel 12** - Backend Framework
- **React 19** - Frontend Library
- **Inertia.js** - للربط بين Laravel و React
- **Laravel Fortify** - للمصادقة
- **TypeScript** - للكتابة الآمنة
- **Tailwind CSS** - لإطار عمل CSS
- **shadcn/ui** - مكونات UI مبنية على Radix UI

## 🚀 الميزات

- ✅ نظام مصادقة كامل (تسجيل الدخول، التسجيل، إعادة تعيين كلمة المرور)
- ✅ Two-Factor Authentication (2FA)
- ✅ واجهة مستخدم عربية كاملة (RTL)
- ✅ تصميم حديث ومتجاوب مع جميع الأجهزة
- ✅ مكونات UI متقدمة من shadcn-ui (Radix UI)

## 📁 بنية المشروع

```
laravel-app/
├── app/                    # Laravel Application
│   ├── Http/
│   │   ├── Controllers/    # Controllers
│   │   └── Middleware/     # Middleware (HandleInertiaRequests)
│   ├── Models/             # Eloquent Models
│   └── Providers/          # Service Providers
├── config/                 # Configuration files
├── database/               # Migrations, Seeders, Factories
├── public/                 # Public assets
├── resources/
│   ├── css/               # CSS files
│   ├── js/                # React/TypeScript files
│   │   ├── Pages/         # Inertia Pages
│   │   ├── components/    # React Components
│   │   └── lib/           # Utilities
│   └── views/             # Blade templates
├── routes/                 # Route definitions
└── storage/                # Storage files
```

## 🛠️ المتطلبات

- PHP 8.2+
- Composer
- Node.js 18+
- npm

## 📦 التثبيت

### 1. تثبيت Dependencies

```bash
# تثبيت PHP dependencies
composer install

# تثبيت Node dependencies
npm install
```

### 2. إعداد Environment

```bash
# نسخ ملف .env.example إلى .env
cp .env.example .env

# توليد Application Key
php artisan key:generate
```

### 3. إعداد قاعدة البيانات

قم بتحديث ملف `.env` بإعدادات قاعدة البيانات:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

ثم قم بتشغيل migrations:

```bash
php artisan migrate
```

### 4. بناء Assets

```bash
# للتطوير
npm run dev

# للإنتاج
npm run build
```

## 🚀 التشغيل

### Development Server

```bash
# تشغيل Laravel development server
php artisan serve

# في terminal آخر، تشغيل Vite dev server
npm run dev
```

ثم افتح المتصفح على: `http://localhost:8000` (افتراضي) أو `http://localhost:8080` (إذا استخدمت `--port=8080`)

**ملاحظة:** المسار الكامل للمشروع: `E:\whatsapp_project\LToReactAsia\laravel-app`

## 📄 الصفحات المتاحة

- `/` - الصفحة الرئيسية
- `/login` - تسجيل الدخول
- `/register` - التسجيل
- `/dashboard` - لوحة التحكم (محمي)

## 🔐 المصادقة

المشروع يستخدم Laravel Fortify للمصادقة مع الميزات التالية:
- تسجيل الدخول
- التسجيل
- إعادة تعيين كلمة المرور
- Two-Factor Authentication (2FA)
- تحديث معلومات الملف الشخصي

## 📦 النشر للاستضافة المشتركة

### خطوات النشر:

1. **بناء المشروع محلياً:**
   ```bash
   npm run build
   composer install --optimize-autoloader --no-dev
   ```

2. **رفع الملفات:**
   - ارفع جميع الملفات إلى الاستضافة (باستثناء `node_modules` و `vendor`)
   - تأكد من أن `public/` هو document root

3. **إعداد قاعدة البيانات:**
   - أنشئ قاعدة بيانات على الاستضافة
   - حدّث ملف `.env` بإعدادات قاعدة البيانات

4. **تشغيل Migrations:**
   - قم بتشغيل migrations على الاستضافة

## 📝 ملاحظات

- جميع عمليات البناء تتم محلياً قبل الرفع
- تأكد من أن PHP version على الاستضافة هو 8.2 أو أحدث
- تأكد من تفعيل extension `openssl` و `pdo` في PHP

## 📄 الترخيص

هذا المشروع خاص بالدكتورة آسيا خليفة طلال الجري.
