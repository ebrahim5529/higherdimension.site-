# موقع د. آسيا خليفة طلال الجري - Laravel React Application

موقع إلكتروني للدكتورة آسيا خليفة طلال الجري - استشاري نفسي وتربوي، مبني باستخدام Laravel مع React و Inertia.js.

## 📍 المسار

**المسار الكامل للمشروع:**
```
D:\Ashal.on\React_To_LaravelReact\laravel-app
```

**المسار النسبي من المجلد الرئيسي:**
```
React_To_LaravelReact/laravel-app
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
- ✅ إدارة العملاء (Customers Management)
- ✅ إدارة الموردين (Suppliers Management)
- ✅ إدارة المخزون (Inventory Management)
- ✅ لوحة تحكم تفاعلية مع إحصائيات
- ✅ تقارير مالية وتشغيلية

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

**ملاحظة:** المسار الكامل للمشروع: `D:\Ashal.on\React_To_LaravelReact\laravel-app`

## 📄 الصفحات المتاحة

### صفحات عامة
- `/` - الصفحة الرئيسية
- `/login` - تسجيل الدخول
- `/register` - التسجيل

### لوحات التحكم (محمية)
- `/dashboard` - لوحة التحكم الرئيسية
- `/main-dashboard` - لوحة التحكم التفاعلية
- `/dashboard-interactive` - لوحة تحكم تفاعلية

### إدارة العملاء
- `/customers` - قائمة العملاء
- `/customers/create` - إضافة عميل جديد
- `/customers/{id}` - عرض تفاصيل العميل
- `/customers/{id}/edit` - تعديل العميل

### إدارة الموردين
- `/suppliers` - قائمة الموردين
- `/suppliers/create` - إضافة مورد جديد
- `/suppliers/{id}` - عرض تفاصيل المورد
- `/suppliers/{id}/edit` - تعديل المورد

### إدارة المخزون
- `/inventory` - قائمة المخزون
- `/inventory/create` - إضافة عنصر جديد
- `/inventory/{id}` - عرض تفاصيل العنصر
- `/inventory/{id}/edit` - تعديل العنصر

### التقارير
- `/reports/customers` - تقارير العملاء
- `/reports/financial` - التقارير المالية
- `/reports/operations` - التقارير التشغيلية

## 🔐 المصادقة

المشروع يستخدم Laravel Fortify للمصادقة مع الميزات التالية:
- تسجيل الدخول
- التسجيل
- إعادة تعيين كلمة المرور
- Two-Factor Authentication (2FA)
- تحديث معلومات الملف الشخصي

## 📦 النشر للاستضافة المشتركة

### 🌿 فرع النشر (Deployment Branch)

تم إنشاء فرع `deployment` في Git يحتوي على جميع الملفات المطلوبة للرفع:

```bash
# الانتقال إلى فرع النشر
git checkout deployment

# رفع الفرع إلى GitHub
git push origin deployment
```

### 📋 الملفات المطلوبة للرفع

#### 1. ملفات `public/` → `public_html/`

**المجلد:** `deployment-files/` (جاهز للرفع)

يجب رفع جميع محتويات `deployment-files/` إلى `public_html/`:

```
public_html/
├── .htaccess          ✅ (إعدادات Apache)
├── index.php          ✅ (نقطة الدخول الرئيسية)
├── robots.txt         ✅
├── favicon.ico        ✅
└── build/
    ├── manifest.json  ✅ (مهم جداً)
    ├── index.php      ✅ (منع عرض المحتويات)
    └── assets/
        ├── index.php  ✅ (منع عرض المحتويات)
        ├── app-C4SmtXzs.js    ✅ (414 KB - ملف JS الرئيسي)
        ├── app-zNvbvzzP.css   ✅ (108 KB - ملف CSS الرئيسي)
        └── [جميع الملفات الأخرى...] ✅ (~100 ملف)
```

**الإحصائيات:**
- إجمالي الملفات: 111 ملف
- الحجم الإجمالي: ~1.77 MB

#### 2. باقي المشروع → `laravel-app/` (خارج public_html)

**المجلدات المطلوبة:**
```
laravel-app/
├── app/               ✅ (كود التطبيق)
├── bootstrap/         ✅ (ملفات التهيئة)
├── config/            ✅ (ملفات الإعدادات)
├── database/          ✅ (Migrations, Seeders, Factories)
├── resources/         ✅ (Blade templates, JS/TS files)
├── routes/            ✅ (ملفات التوجيه)
├── storage/           ✅ (ملفات التخزين - المجلد فقط، بدون logs)
└── vendor/            ✅ (أو تثبيته بـ composer install)
```

**الملفات المطلوبة:**
```
laravel-app/
├── .env               ✅ (يتم إنشاؤه على الخادم من .env.example)
├── .env.example       ✅ (مثال للإعدادات)
├── artisan            ✅ (أداة Laravel)
├── composer.json      ✅ (تبعيات PHP)
└── composer.lock      ✅ (إصدارات محددة)
```

### 🚀 خطوات النشر الكاملة

#### 1. بناء المشروع محلياً:
```bash
# بناء الأصول
npm run build

# نسخ ملفات النشر
.\copy-deployment-files.ps1
```

#### 2. رفع ملفات `public/`:
- ارفع جميع محتويات `deployment-files/` إلى `public_html/`
- استخدم FTP/SFTP أو Git

#### 3. رفع باقي المشروع:
- ارفع المجلدات والملفات المذكورة أعلاه إلى `laravel-app/`
- يجب أن يكون خارج `public_html/` لأسباب أمنية

#### 4. تعديل `public_html/index.php`:

**قبل التعديل:**
```php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
```

**بعد التعديل (إذا كان المشروع في `laravel-app/` خارج `public_html/`):**
```php
require __DIR__.'/../laravel-app/vendor/autoload.php';
$app = require_once __DIR__.'/../laravel-app/bootstrap/app.php';
```

**ملاحظة:** إذا كان المشروع في نفس المستوى مع `public_html/`، استخدم المسارات أعلاه. إذا كان في مكان آخر، عدّل المسارات حسب موقع المشروع.

#### 5. إعداد `.env` على الخادم:
```bash
# نسخ .env.example إلى .env
cd laravel-app
cp .env.example .env

# تعديل الإعدادات
nano .env
```

**إعدادات مهمة في `.env`:**
```env
APP_NAME="Higher Dimension"
APP_ENV=production
APP_KEY=base64:...  # قم بتوليده بـ php artisan key:generate
APP_DEBUG=false
APP_URL=https://higherdimension.site

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error



BROADCAST_DRIVER=log
CACHE_STORE=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=database
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

**⚠️ مهم جداً:**
- قم بتوليد `APP_KEY` باستخدام: `php artisan key:generate`
- لا ترفع ملف `.env` إلى Git أو أي مكان عام
- تأكد من صحة إعدادات قاعدة البيانات

#### 6. تثبيت التبعيات على الخادم:
```bash
cd laravel-app
composer install --no-dev --optimize-autoloader
```

#### 7. تعديل الأذونات:
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R www-data:www-data storage
chown -R www-data:www-data bootstrap/cache
```

#### 8. إنشاء Symbolic Link:
```bash
cd public_html
php ../laravel-app/artisan storage:link
```

#### 9. تشغيل Migrations:
```bash
cd laravel-app
php artisan migrate --force
```

#### 10. مسح الكاش:
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### ❌ الملفات التي لا يجب رفعها

- `node_modules/` ❌
- `.git/` ❌
- `.vscode/`, `.idea/`, `.cursor/` ❌
- `tests/` ❌
- `storage/logs/*.log` ❌
- `storage/framework/cache/*` ❌
- `storage/framework/sessions/*` ❌
- `storage/framework/views/*` ❌
- `deployment-files/` ❌ (مجلد النسخ المحلي فقط)

### 📁 الهيكل الموصى به على الخادم

```
/home/username/
├── laravel-app/              ← المشروع الكامل (خارج public_html)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── resources/
│   ├── routes/
│   ├── storage/             ← يجب أن يكون قابل للكتابة
│   ├── vendor/
│   ├── .env
│   ├── artisan
│   ├── composer.json
│   └── composer.lock
│
└── public_html/              ← Document Root
    ├── .htaccess
    ├── index.php            ← يجب تعديل المسارات فيه
    ├── robots.txt
    ├── favicon.ico
    └── build/
        ├── manifest.json
        ├── index.php
        └── assets/
            └── [جميع الملفات...]
```

### ✅ قائمة التحقق من النشر (Checklist)

#### قبل الرفع:
- [ ] تم بناء المشروع: `npm run build`
- [ ] تم نسخ ملفات النشر: `.\copy-deployment-files.ps1`
- [ ] تم التحقق من وجود `deployment-files/build/manifest.json`
- [ ] تم التحقق من وجود `deployment-files/build/assets/app-C4SmtXzs.js`
- [ ] تم التحقق من وجود `deployment-files/build/assets/app-zNvbvzzP.css`

#### رفع ملفات public/:
- [ ] تم رفع `.htaccess` إلى `public_html/`
- [ ] تم رفع `index.php` إلى `public_html/`
- [ ] تم رفع `robots.txt` إلى `public_html/` (إن وجد)
- [ ] تم رفع `favicon.ico` إلى `public_html/` (إن وجد)
- [ ] تم رفع مجلد `build/` بالكامل إلى `public_html/build/`
- [ ] تم التحقق من وجود `public_html/build/manifest.json`
- [ ] تم التحقق من وجود جميع الملفات في `public_html/build/assets/` (~103 ملف)

#### رفع باقي المشروع:
- [ ] تم رفع مجلد `app/` إلى `laravel-app/app/`
- [ ] تم رفع مجلد `bootstrap/` إلى `laravel-app/bootstrap/`
- [ ] تم رفع مجلد `config/` إلى `laravel-app/config/`
- [ ] تم رفع مجلد `database/` إلى `laravel-app/database/`
- [ ] تم رفع مجلد `resources/` إلى `laravel-app/resources/`
- [ ] تم رفع مجلد `routes/` إلى `laravel-app/routes/`
- [ ] تم رفع مجلد `storage/` (المجلد فقط) إلى `laravel-app/storage/`
- [ ] تم رفع ملف `artisan` إلى `laravel-app/artisan`
- [ ] تم رفع `composer.json` و `composer.lock` إلى `laravel-app/`

#### على الخادم:
- [ ] تم تعديل `public_html/index.php` بالمسارات الصحيحة
- [ ] تم إنشاء ملف `.env` في `laravel-app/`
- [ ] تم تعبئة إعدادات `.env` (قاعدة البيانات، APP_URL، etc.)
- [ ] تم توليد `APP_KEY`: `php artisan key:generate`
- [ ] تم تثبيت التبعيات: `composer install --no-dev --optimize-autoloader`
- [ ] تم تعديل الأذونات: `chmod -R 755 storage bootstrap/cache`
- [ ] تم إنشاء symbolic link: `php artisan storage:link`
- [ ] تم تشغيل migrations: `php artisan migrate --force`
- [ ] تم مسح الكاش: `php artisan config:clear && php artisan cache:clear`

#### التحقق النهائي:
- [ ] الموقع يعمل: `https://higherdimension.site/`
- [ ] لا توجد أخطاء 404 في ملفات CSS/JS
- [ ] تسجيل الدخول يعمل
- [ ] قاعدة البيانات متصلة
- [ ] الصفحات الرئيسية تعمل

### 🔧 متطلبات الخادم

#### PHP:
- PHP 8.2 أو أحدث
- Extensions المطلوبة:
  - `openssl`
  - `pdo`
  - `pdo_mysql`
  - `mbstring`
  - `tokenizer`
  - `xml`
  - `ctype`
  - `json`
  - `fileinfo`
  - `curl`

#### Apache:
- `mod_rewrite` مفعّل
- `.htaccess` مدعوم

#### MySQL:
- MySQL 5.7+ أو MariaDB 10.3+
- قاعدة بيانات جاهزة
- مستخدم مع صلاحيات كاملة

#### Composer:
- Composer 2.0+ مثبت على الخادم (للتثبيت)

### 🐛 حل المشاكل الشائعة

#### 1. خطأ 404 في ملفات CSS/JS:
```bash
# تحقق من وجود الملفات:
ls -la public_html/build/assets/app-*.js
ls -la public_html/build/assets/app-*.css

# تحقق من الأذونات:
chmod 644 public_html/build/assets/*
```

#### 2. خطأ "Vite manifest not found":
- تأكد من رفع `public_html/build/manifest.json`
- تحقق من المسار في `config/vite.php`

#### 3. خطأ "No application encryption key":
```bash
cd laravel-app
php artisan key:generate
```

#### 4. خطأ في الاتصال بقاعدة البيانات:
- تحقق من إعدادات `.env`
- تأكد من أن MySQL يعمل
- تحقق من اسم المستخدم وكلمة المرور

#### 5. خطأ "Permission denied" في storage:
```bash
chmod -R 755 laravel-app/storage
chmod -R 755 laravel-app/bootstrap/cache
chown -R www-data:www-data laravel-app/storage
chown -R www-data:www-data laravel-app/bootstrap/cache
```

#### 6. خطأ "Class not found":
```bash
cd laravel-app
composer dump-autoload
php artisan config:clear
php artisan cache:clear
```

### 📚 ملفات التوثيق المتوفرة

- `DEPLOYMENT-FILES-LIST.md` - قائمة ملفات public/ (266 سطر)
- `FULL-DEPLOYMENT-GUIDE.md` - دليل النشر الكامل
- `DEPLOYMENT-INSTRUCTIONS.md` - تعليمات النشر (186 سطر)
- `deployment-files/README.txt` - تعليمات ملفات النشر
- `deployment-files/OTHER-FILES-TO-UPLOAD.txt` - قائمة باقي الملفات (129 سطر)
- `deployment-files/DEPLOYMENT-SUMMARY.txt` - ملخص النشر
- `GIT-DEPLOYMENT-STATUS.md` - حالة فرع النشر

## 🗄️ قاعدة البيانات

### النماذج (Models)
- `Customer` - العملاء
- `Supplier` - الموردين
- `Scaffold` - المخزون
- `Contract` - العقود
- `Payment` - المدفوعات
- `Installment` - الأقساط
- `Purchase` - المشتريات
- `Activity` - الأنشطة
- `Employee` - الموظفين

## 📝 ملاحظات

- جميع عمليات البناء تتم محلياً قبل الرفع
- تأكد من أن PHP version على الاستضافة هو 8.2 أو أحدث
- تأكد من تفعيل extension `openssl` و `pdo` في PHP
- استخدم `npm` (وليس `pnpm`) لإدارة الحزم
- المشروع يستخدم Radix Icons للأيقونات
- اللون الأساسي للعلامة التجارية: `rgb(30, 64, 175)` (أزرق داكن)

## 🔗 المستودع

**GitHub Repository:**
- https://github.com/ebrahim5529/higherdimension.site

## 📄 الترخيص

هذا المشروع خاص بالدكتورة آسيا خليفة طلال الجري.
