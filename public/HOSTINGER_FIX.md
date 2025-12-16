# حل مشكلة Vite Manifest على Hostinger

## المشكلة
Laravel يبحث عن ملف `manifest.json` في المسار:
```
/home/u183760739/domains/higherdimension.site/public_html/public/build/manifest.json
```

## الحل

### الحل 1: التأكد من Document Root
على Hostinger، يجب أن يكون **Document Root** هو `public_html` وليس `public_html/public`.

1. اذهب إلى **File Manager** في cPanel
2. اذهب إلى **Settings** في File Manager
3. تأكد من أن **Document Root** يشير إلى `public_html` وليس `public_html/public`

### الحل 2: التأكد من وجود الملفات
تأكد من أن ملف `manifest.json` موجود في:
```
public_html/public/build/manifest.json
```

### الحل 3: إذا كان Document Root هو `public_html/public`
إذا كان Document Root مضبوط على `public_html/public`، يجب نقل محتويات مجلد `public` إلى `public_html` مباشرة.

## التحقق من الحل
بعد تطبيق الحل، تأكد من:
1. ✅ ملف `manifest.json` موجود في `public/build/manifest.json`
2. ✅ Document Root مضبوط بشكل صحيح
3. ✅ صلاحيات الملفات صحيحة (755 للمجلدات، 644 للملفات)

## ملاحظة
تم إضافة كود في `AppServiceProvider` للتعامل مع هذه المشكلة تلقائياً.

