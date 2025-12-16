@echo off
REM Script لبناء الأصول للاستضافة المشتركة (Hostinger) - Windows
REM 
REM الاستخدام: build-for-production.bat

echo === بناء الأصول للإنتاج ===
echo.

REM التحقق من وجود Node.js و npm
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Node.js غير مثبت! يرجى تثبيته أولاً.
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ npm غير مثبت! يرجى تثبيته أولاً.
    exit /b 1
)

echo ✓ Node.js:
node --version
echo ✓ npm:
npm --version
echo.

REM تثبيت dependencies إذا لم تكن موجودة
if not exist "node_modules" (
    echo تثبيت dependencies...
    call npm install
    echo.
)

REM بناء الأصول
echo بناء الأصول...
call npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✓ تم بناء الأصول بنجاح!
    echo.
    echo الملفات المبنية موجودة في: public\build\
    echo.
    echo الخطوات التالية:
    echo 1. ارفع مجلد public\build\ إلى public_html\build\ على الخادم
    echo 2. تأكد من أن manifest.json موجود في public_html\build\manifest.json
    echo 3. تحقق من أن جميع الملفات في build\assets\ موجودة
    echo.
    
    REM التحقق من وجود manifest.json
    if exist "public\build\manifest.json" (
        echo ✓ manifest.json موجود
        echo   المسار: public\build\manifest.json
    ) else (
        echo ✗ manifest.json غير موجود!
        exit /b 1
    )
) else (
    echo.
    echo ✗ فشل بناء الأصول!
    exit /b 1
)

pause

