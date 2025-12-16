<?php

/**
 * Script للتحقق من صحة النشر على Hostinger
 * 
 * استخدم هذا الملف للتحقق من أن كل شيء جاهز للنشر
 * 
 * الاستخدام: php check-deployment.php
 */

echo "=== فحص النشر على Hostinger ===\n\n";

$errors = [];
$warnings = [];
$success = [];

// 1. التحقق من وجود manifest.json
$manifestPaths = [
    __DIR__ . '/public/build/manifest.json',
    __DIR__ . '/public_html/build/manifest.json',
    (isset($_SERVER['DOCUMENT_ROOT']) ? $_SERVER['DOCUMENT_ROOT'] : '') . '/build/manifest.json',
];

$manifestFound = false;
$manifestPath = null;

foreach ($manifestPaths as $path) {
    if (file_exists($path)) {
        $manifestFound = true;
        $manifestPath = $path;
        $success[] = "✓ ملف manifest.json موجود في: $path";
        break;
    }
}

if (!$manifestFound) {
    $errors[] = "✗ ملف manifest.json غير موجود! يجب بناء الأصول أولاً: npm run build";
}

// 2. التحقق من وجود مجلد build/assets
$assetsPaths = [
    __DIR__ . '/public/build/assets',
    __DIR__ . '/public_html/build/assets',
];

$assetsFound = false;
foreach ($assetsPaths as $path) {
    if (is_dir($path)) {
        $assetsFound = true;
        $files = glob($path . '/*.{js,css}', GLOB_BRACE);
        $success[] = "✓ مجلد assets موجود ويحتوي على " . count($files) . " ملف";
        break;
    }
}

if (!$assetsFound) {
    $errors[] = "✗ مجلد build/assets غير موجود! يجب بناء الأصول أولاً: npm run build";
}

// 3. التحقق من وجود ملف .env
if (file_exists(__DIR__ . '/.env')) {
    $success[] = "✓ ملف .env موجود";
} else {
    $warnings[] = "⚠ ملف .env غير موجود (قد يكون مخفياً)";
}

// 4. التحقق من صلاحيات storage
$storagePath = __DIR__ . '/storage';
if (is_dir($storagePath)) {
    if (is_writable($storagePath)) {
        $success[] = "✓ مجلد storage قابل للكتابة";
    } else {
        $errors[] = "✗ مجلد storage غير قابل للكتابة! قم بتشغيل: chmod -R 755 storage";
    }
} else {
    $errors[] = "✗ مجلد storage غير موجود!";
}

// 5. التحقق من صلاحيات bootstrap/cache
$cachePath = __DIR__ . '/bootstrap/cache';
if (is_dir($cachePath)) {
    if (is_writable($cachePath)) {
        $success[] = "✓ مجلد bootstrap/cache قابل للكتابة";
    } else {
        $errors[] = "✗ مجلد bootstrap/cache غير قابل للكتابة! قم بتشغيل: chmod -R 755 bootstrap/cache";
    }
} else {
    $errors[] = "✗ مجلد bootstrap/cache غير موجود!";
}

// 6. التحقق من وجود vendor
if (is_dir(__DIR__ . '/vendor')) {
    $success[] = "✓ مجلد vendor موجود (Composer dependencies)";
} else {
    $errors[] = "✗ مجلد vendor غير موجود! قم بتشغيل: composer install";
}

// 7. التحقق من وجود index.php في public
$indexPaths = [
    __DIR__ . '/public/index.php',
    __DIR__ . '/public_html/index.php',
];

$indexFound = false;
foreach ($indexPaths as $path) {
    if (file_exists($path)) {
        $indexFound = true;
        $success[] = "✓ ملف index.php موجود في: $path";
        break;
    }
}

if (!$indexFound) {
    $errors[] = "✗ ملف index.php غير موجود في public/ أو public_html/";
}

// 8. التحقق من وجود .htaccess
$htaccessPaths = [
    __DIR__ . '/public/.htaccess',
    __DIR__ . '/public_html/.htaccess',
];

$htaccessFound = false;
foreach ($htaccessPaths as $path) {
    if (file_exists($path)) {
        $htaccessFound = true;
        $success[] = "✓ ملف .htaccess موجود في: $path";
        break;
    }
}

if (!$htaccessFound) {
    $warnings[] = "⚠ ملف .htaccess غير موجود (قد يسبب مشاكل في routing)";
}

// عرض النتائج
echo "النتائج:\n\n";

if (!empty($success)) {
    echo "✓ النجاح:\n";
    foreach ($success as $msg) {
        echo "  $msg\n";
    }
    echo "\n";
}

if (!empty($warnings)) {
    echo "⚠ تحذيرات:\n";
    foreach ($warnings as $msg) {
        echo "  $msg\n";
    }
    echo "\n";
}

if (!empty($errors)) {
    echo "✗ أخطاء:\n";
    foreach ($errors as $msg) {
        echo "  $msg\n";
    }
    echo "\n";
}

// الخلاصة
echo "=== الخلاصة ===\n";
if (empty($errors)) {
    echo "✓ كل شيء جاهز للنشر!\n";
    exit(0);
} else {
    echo "✗ يوجد أخطاء يجب إصلاحها قبل النشر.\n";
    exit(1);
}

