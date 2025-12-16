#!/bin/bash

# Script لبناء الأصول للاستضافة المشتركة (Hostinger)
# 
# الاستخدام: bash build-for-production.sh
# أو: chmod +x build-for-production.sh && ./build-for-production.sh

echo "=== بناء الأصول للإنتاج ==="
echo ""

# التحقق من وجود Node.js و npm
if ! command -v node &> /dev/null; then
    echo "✗ Node.js غير مثبت! يرجى تثبيته أولاً."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "✗ npm غير مثبت! يرجى تثبيته أولاً."
    exit 1
fi

echo "✓ Node.js: $(node --version)"
echo "✓ npm: $(npm --version)"
echo ""

# تثبيت dependencies إذا لم تكن موجودة
if [ ! -d "node_modules" ]; then
    echo "تثبيت dependencies..."
    npm install
    echo ""
fi

# بناء الأصول
echo "بناء الأصول..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ تم بناء الأصول بنجاح!"
    echo ""
    echo "الملفات المبنية موجودة في: public/build/"
    echo ""
    echo "الخطوات التالية:"
    echo "1. ارفع مجلد public/build/ إلى public_html/build/ على الخادم"
    echo "2. تأكد من أن manifest.json موجود في public_html/build/manifest.json"
    echo "3. تحقق من أن جميع الملفات في build/assets/ موجودة"
    echo ""
    
    # التحقق من وجود manifest.json
    if [ -f "public/build/manifest.json" ]; then
        echo "✓ manifest.json موجود"
        echo "  المسار: public/build/manifest.json"
    else
        echo "✗ manifest.json غير موجود!"
        exit 1
    fi
    
    # عرض حجم الملفات
    if [ -d "public/build/assets" ]; then
        echo ""
        echo "معلومات الملفات المبنية:"
        du -sh public/build/assets/*
    fi
else
    echo ""
    echo "✗ فشل بناء الأصول!"
    exit 1
fi

