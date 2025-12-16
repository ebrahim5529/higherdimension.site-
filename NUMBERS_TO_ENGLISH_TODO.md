# TODO: تغيير عرض جميع الأرقام في النظام إلى اللغة الإنجليزية

## المطلوب
عرض جميع الأرقام في النظام باللغة الإنجليزية (en-US) بدلاً من العربية، حتى لو كان النظام الافتراضي بالعربية.

## الملفات التي تحتاج تحديث

### 1. صفحات العملاء (Customers)
- [ ] `resources/js/Pages/Customers/Index.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Customers/Show.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Customers/Contracts.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Customers/Claims.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/components/features/CustomersTable.tsx` - تحديث `formatCurrency` و `formatDate`

### 2. صفحات العقود (Contracts)
- [ ] `resources/js/Pages/Contracts/Index.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Contracts/Create.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Contracts/Edit.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Contracts/Show.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/components/features/ContractsTable.tsx` - تحديث `formatCurrency` و `formatDate`

### 3. صفحات المدفوعات (Payments)
- [ ] `resources/js/Pages/Payments/Index.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Payments/Create.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Payments/Show.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Payments/LatePayments.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Payments/Reports.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/components/features/PaymentsTable.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/components/features/PaymentsListTable.tsx` - تحديث `formatCurrency` و `formatDate`

### 4. صفحات الموردين (Suppliers)
- [ ] `resources/js/Pages/Suppliers/Index.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Suppliers/Show.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/components/features/SuppliersTable.tsx` - تحديث `formatCurrency` و `formatDate`

### 5. صفحات المخزون (Inventory)
- [ ] `resources/js/Pages/Inventory/Index.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/components/features/InventoryTable.tsx` - تحديث `formatCurrency` و `formatDate`

### 6. صفحات الموظفين (Employees)
- [ ] `resources/js/Pages/Employees/Index.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Employees/Salaries/Index.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Employees/Salaries/Create.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Employees/Salaries/Edit.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Employees/Salaries/Show.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Employees/Incentives/Index.tsx` - تحديث `formatCurrency` و `formatDate`

### 7. صفحات التقارير (Reports)
- [ ] `resources/js/Pages/Dashboard/MainDashboard.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Dashboard/DashboardInteractive.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Reports/OperationsReports.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Reports/CustomerReports.tsx` - تحديث `formatCurrency` و `formatDate`
- [ ] `resources/js/Pages/Reports/FinancialReports.tsx` - تحديث `formatCurrency` و `formatDate`

### 8. المكونات المشتركة (Shared Components)
- [ ] `resources/js/components/features/CustomerStats.tsx` - تحديث `formatCurrency`
- [ ] `resources/js/components/features/PaymentStats.tsx` - تحديث `formatCurrency`
- [ ] أي مكونات أخرى تستخدم `formatCurrency` أو `formatDate`

## التغييرات المطلوبة

### دالة formatCurrency
تغيير من:
```typescript
new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'OMR' })
```
إلى:
```typescript
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'OMR' })
```

### دالة formatDate
تغيير من:
```typescript
new Date(date).toLocaleDateString('ar-SA', { ... })
```
إلى:
```typescript
new Date(date).toLocaleDateString('en-US', { ... })
```

### دالة formatNumber (إن وجدت)
تغيير من:
```typescript
new Intl.NumberFormat('ar-SA', { ... })
```
إلى:
```typescript
new Intl.NumberFormat('en-US', { ... })
```

## ملاحظات
- يجب الحفاظ على جميع الوظائف الأخرى كما هي
- فقط تغيير locale من 'ar-SA' إلى 'en-US'
- التأكد من أن جميع الأرقام تظهر بالإنجليزية في كل الصفحات

