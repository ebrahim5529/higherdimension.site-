/** @jsxImportSource react */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MenuItem } from './MenuItem';
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  CreditCard,
  BarChart3,
  Menu,
  X,
  LogOut,
  UserCheck,
  ClipboardList,
  Truck,
  DollarSign,
  UserCog,
  Activity,
  ShoppingCart,
  Receipt,
  Clock,
  TrendingUp,
  Shield,
  History,
  Key,
  Calendar,
  Calculator,
  AlertCircle,
  Settings,
  BarChart,
  PenTool,
  MapPin,
  Building2,
  Eye,
  Mail,
  BookOpen,
  Landmark,
  Scale,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface MenuItemType {
  id: string;
  label: string;
  icon: any;
  href?: string;
  children?: MenuItemType[];
}

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onClose?: () => void;
}

interface PageProps {
  [key: string]: any;
  auth?: {
    user?: {
      id: number;
      name: string;
      email: string;
      roles: string[];
      permissions: string[];
    };
  };
}

export function Sidebar({
  activeSection,
  onSectionChange,
  onClose,
}: SidebarProps) {
  const { auth } = usePage<PageProps>().props;
  const userPermissions = auth?.user?.permissions || [];
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // خريطة الصلاحيات المطلوبة لكل عنصر قائمة
  const menuPermissionsMap: Record<string, string | string[]> = {
    'main-dashboard': 'access-main-dashboard',
    'dashboard': 'access-dashboard-reports',
    'dashboard-interactive': 'access-dashboard-interactive',
    'financial-reports': 'access-financial-reports',
    'operations-reports': 'access-operations-reports',
    'customer-reports': 'access-customer-reports',
    'customers': 'access-customers',
    'customer-management': 'manage-customers',
    'customer-contracts': 'view-customer-contracts',
    'customer-claims': 'manage-customer-claims',
    'suppliers': 'access-suppliers',
    'supplier-management': 'manage-suppliers',
    'supplier-invoices': 'view-supplier-invoices',
    'supplier-purchases': 'manage-supplier-purchases',
    'inventory': 'access-inventory',
    'inventory-status': 'manage-inventory',
    'purchase-equipment': 'purchase-equipment',
    'purchases-list': 'manage-purchases',
    'contracts': 'access-contracts',
    'contract-management': 'manage-contracts',
    'active-contracts': 'view-active-contracts',
    'expired-contracts': 'view-expired-contracts',
    'cancelled-contracts': 'view-cancelled-contracts',
    'operations': 'access-operations',
    'delivery-orders': 'manage-delivery-orders',
    'shipping-tracking': 'track-shipping',
    'delivery-receipt': 'manage-delivery-receipt',
    'return-inspection': 'manage-return-inspection',
    'financial': 'access-financial',
    'payment-management': 'manage-payment-transactions',
    'purchase-management': 'manage-purchases',
    'invoices': 'manage-invoices',
    'employees': 'access-employees',
    'employee-management': 'manage-employees',
    'salaries': 'manage-salaries',
    'incentives': 'manage-incentives',
    'attendance': 'manage-attendance',
    'departments': 'manage-departments',
    'leaves': 'manage-leaves',
    'permissions-management': 'access-permissions',
    'user-roles': 'manage-user-roles',
    'permission-groups': 'manage-permission-groups',
    'roles': 'manage-roles',
    'payments': 'access-payments',
    'all-payments': 'view-all-payments',
    'late-payments': 'view-late-payments',
    'payment-reports': 'view-payment-reports',
    'settings': 'access-settings',
    'electronic-signature': 'manage-electronic-signature',
    'settings-governorates': 'access-settings',
    'settings-wilayats': 'access-settings',
    'settings-regions': 'access-settings',
    'smtp-settings': 'access-settings',
    'accounting': 'access-accounting',
    'chart-of-accounts': 'manage-chart-of-accounts',
    'journal-entries': 'manage-journal-entries',
    'all-journal-entries': 'manage-journal-entries',
    'create-journal-entry': 'manage-journal-entries',
    'accounting-reports': 'view-accounting-reports',
    'trial-balance': 'view-accounting-reports',
    'balance-sheet': 'view-accounting-reports',
    'income-statement': 'view-accounting-reports',
    'general-ledger': 'view-accounting-reports',
    'account-statement': 'view-accounting-reports',
    'journal-report': 'view-accounting-reports',
  };

  // دالة للتحقق من الصلاحيات
  const hasPermission = useCallback((menuId: string): boolean => {
    const requiredPermission = menuPermissionsMap[menuId];
    if (!requiredPermission) {
      return true; // إذا لم يكن هناك صلاحية محددة، اسمح بالوصول
    }

    if (Array.isArray(requiredPermission)) {
      return requiredPermission.some(perm => userPermissions.includes(perm));
    }

    return userPermissions.includes(requiredPermission);
  }, [userPermissions]);

  const toggleMenu = useCallback((menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerWidth >= 768 && onClose) {
          return;
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [onClose]);

  const menuItems: MenuItemType[] = useMemo(
    () => [
      {
        id: 'main-dashboard',
        label: 'الرئيسية',
        icon: LayoutDashboard,
        href: '/dashboard',
      },
      {
        id: 'dashboard',
        label: 'لوحة التحكم والتقارير',
        icon: BarChart3,
        children: [
          {
            id: 'dashboard-interactive',
            label: 'لوحة التحكم التفاعلية',
            icon: Activity,
            href: '/dashboard/dashboard-interactive',
          },
          {
            id: 'financial-reports',
            label: 'التقارير المالية',
            icon: TrendingUp,
            href: '/dashboard/financial-reports',
          },
          {
            id: 'operations-reports',
            label: 'تقارير التشغيل والمخزون',
            icon: Package,
            href: '/dashboard/operations-reports',
          },
          {
            id: 'customer-reports',
            label: 'تقارير العملاء',
            icon: Users,
            href: '/dashboard/customer-reports',
          },
        ],
      },

      {
        id: 'customers',
        label: 'إدارة العملاء',
        icon: Users,
        children: [
          {
            id: 'customer-management',
            label: 'إدارة بيانات العملاء',
            icon: UserCheck,
            href: '/customers',
          },
          {
            id: 'customer-contracts',
            label: 'سجل العقود الخاصة بالعملاء',
            icon: FileText,
            href: '/dashboard/customer-contracts',
          },
          {
            id: 'customer-claims',
            label: 'إدارة المطالبات',
            icon: ClipboardList,
            href: '/dashboard/customer-claims',
          },
        ],
      },
      {
        id: 'suppliers',
        label: 'إدارة الموردين',
        icon: Truck,
        children: [
          {
            id: 'supplier-management',
            label: 'إدارة بيانات الموردين',
            icon: UserCheck,
            href: '/suppliers',
          },
          {
            id: 'supplier-invoices',
            label: 'فواتير الموردين',
            icon: Receipt,
            href: '/dashboard/supplier-invoices',
          },
          {
            id: 'supplier-purchases',
            label: 'مشتريات الموردين',
            icon: ShoppingCart,
            href: '/dashboard/supplier-purchases',
          },
        ],
      },
      {
        id: 'inventory',
        label: 'إدارة المخزون',
        icon: Package,
        children: [
          {
            id: 'inventory-status',
            label: 'حالة المخزون',
            icon: Package,
            href: '/inventory',
          },
          {
            id: 'purchase-equipment',
            label: 'شراء معدات جديدة',
            icon: ShoppingCart,
            href: '/dashboard/purchase-equipment',
          },
          {
            id: 'purchases-list',
            label: 'إدارة المشتريات',
            icon: Receipt,
            href: '/dashboard/purchases-list',
          },
        ],
      },
      {
        id: 'contracts',
        label: 'إدارة العقود والاتفاقيات',
        icon: FileText,
        children: [
          {
            id: 'contract-management',
            label: 'إدارة العقود والاتفاقيات',
            icon: FileText,
            href: '/contracts',
          },
          {
            id: 'active-contracts',
            label: 'عقود نشطة',
            icon: Activity,
            href: '/contracts/active',
          },
          {
            id: 'expired-contracts',
            label: 'عقود منتهية',
            icon: Clock,
            href: '/contracts/expired',
          },
          {
            id: 'cancelled-contracts',
            label: 'عقود ملغاة',
            icon: X,
            href: '/contracts/cancelled',
          },
        ],
      },
      {
        id: 'operations',
        label: 'إدارة التشغيل والنقليات',
        icon: Truck,
        children: [
          { id: 'delivery-orders', label: 'إدارة طلبات التوصيل', icon: Truck },
          {
            id: 'delivery-orders-details',
            label: 'تفاصيل أوامر التوصيل',
            icon: Eye,
          },
          { id: 'shipping-tracking', label: 'تتبع الشحن', icon: Activity },
          { id: 'delivery-receipt', label: 'إيصال التسليم', icon: Receipt },
          {
            id: 'return-inspection',
            label: 'فحص الاسترجاع',
            icon: ClipboardList,
          },
        ],
      },
      {
        id: 'financial',
        label: 'إدارة المالية',
        icon: DollarSign,
        children: [
          {
            id: 'payment-management',
            label: 'إدارة المعاملات المالية',
            icon: CreditCard,
            href: '/payments',
          },
          {
            id: 'purchase-management',
            label: 'إدارة عمليات الشراء',
            icon: ShoppingCart,
            href: '/purchases',
          },
          {
            id: 'invoices',
            label: 'الفواتير',
            icon: Receipt,
            href: '/dashboard/invoices',
          },
          {
            id: 'financial-reports',
            label: 'التقارير المالية',
            icon: TrendingUp,
            href: '/dashboard/financial-reports',
          },
        ],
      },
      {
        id: 'employees',
        label: 'إدارة الموظفين',
        icon: UserCog,
        children: [
          {
            id: 'employee-management',
            label: 'إدارة بيانات الموظفين',
            icon: UserCheck,
            href: '/employees',
          },
          { id: 'salaries', label: 'الرواتب', icon: DollarSign, href: '/employees/salaries' },
          { id: 'incentives', label: 'الحوافز', icon: TrendingUp, href: '/employees/incentives' },
          { id: 'attendance', label: 'الحضور والانصراف', icon: Clock, href: '/employees/attendance' },
          { id: 'departments', label: 'الأقسام', icon: Building2, href: '/employees/departments' },
          { id: 'leaves', label: 'الإجازات', icon: Calendar, href: '/employees/leaves' },
        ],
      },
      {
        id: 'permissions-management',
        label: 'إدارة الصلاحيات',
        icon: Key,
        children: [
          { id: 'user-roles', label: 'أدوار المستخدمين', icon: UserCog, href: '/dashboard/user-roles' },
          {
            id: 'permission-groups',
            label: 'مجموعات الصلاحيات',
            icon: Shield,
            href: '/dashboard/permission-groups',
          },
          {
            id: 'roles',
            label: 'الأدوار',
            icon: Shield,
            href: '/dashboard/roles',
          },
        ],
      },
      {
        id: 'payments',
        label: 'المدفوعات',
        icon: CreditCard,
        children: [
          {
            id: 'all-payments',
            label: 'جميع المدفوعات',
            icon: DollarSign,
            href: '/payments',
          },
          {
            id: 'late-payments',
            label: 'المدفوعات المتأخرة',
            icon: AlertCircle,
            href: '/payments/late',
          },
          {
            id: 'payment-reports',
            label: 'تقارير المدفوعات',
            icon: BarChart,
            href: '/payments/reports',
          },
        ],
      },
      {
        id: 'accounting',
        label: 'المحاسبة',
        icon: Landmark,
        children: [
          {
            id: 'chart-of-accounts',
            label: 'شجرة الحسابات',
            icon: BookOpen,
            href: '/accounting/chart-of-accounts',
          },
          {
            id: 'all-journal-entries',
            label: 'القيود المحاسبية',
            icon: FileText,
            href: '/accounting/journal-entries',
          },
          {
            id: 'create-journal-entry',
            label: 'إنشاء قيد جديد',
            icon: Plus,
            href: '/accounting/journal-entries/create',
          },
          {
            id: 'trial-balance',
            label: 'ميزان المراجعة',
            icon: Scale,
            href: '/accounting/reports/trial-balance',
          },
          {
            id: 'balance-sheet',
            label: 'الميزانية العمومية',
            icon: BarChart,
            href: '/accounting/reports/balance-sheet',
          },
          {
            id: 'income-statement',
            label: 'قائمة الدخل',
            icon: TrendingUp,
            href: '/accounting/reports/income-statement',
          },
          {
            id: 'general-ledger',
            label: 'دفتر الأستاذ العام',
            icon: BookOpen,
            href: '/accounting/reports/general-ledger',
          },
          {
            id: 'account-statement',
            label: 'كشف حساب',
            icon: FileText,
            href: '/accounting/reports/account-statement',
          },
          {
            id: 'journal-report',
            label: 'تقرير اليومية',
            icon: ClipboardList,
            href: '/accounting/reports/journal-report',
          },
          {
            id: 'accounting-settings',
            label: 'إعدادات الربط المحاسبي',
            icon: Settings,
            href: '/accounting/settings',
          },
        ],
      },
      {
        id: 'settings',
        label: 'الإعدادات',
        icon: Settings,
        children: [
          {
            id: 'settings-governorates',
            label: 'المحافظات',
            icon: MapPin,
            href: '/dashboard/locations/governorates',
          },
          {
            id: 'settings-wilayats',
            label: 'الولايات',
            icon: MapPin,
            href: '/dashboard/locations/wilayats',
          },

          {
            id: 'electronic-signature',
            label: 'التوقيع الإلكتروني',
            icon: PenTool,
            href: '/dashboard/electronic-signature',
          },
          {
            id: 'smtp-settings',
            label: 'إعدادات SMTP',
            icon: Mail,
            href: '/dashboard/smtp-settings',
          },
        ],
      },
    ],
    []
  );

  // دالة لتصفية عناصر القائمة
  const filterMenuItems = useCallback((items: MenuItemType[]): MenuItemType[] => {
    return items
      .map(item => {
        // تصفية الأطفال أولاً إذا كان العنصر لديه أطفال
        if (item.children && item.children.length > 0) {
          const filteredChildren = filterMenuItems(item.children);
          // إذا لم يكن لديه أطفال مرئيين، لا تعرض العنصر
          if (filteredChildren.length === 0) {
            return null;
          }
          // تحقق من صلاحية العنصر الرئيسي
          if (!hasPermission(item.id)) {
            return null;
          }
          return {
            ...item,
            children: filteredChildren,
          };
        }
        // للعناصر بدون أطفال، تحقق من الصلاحية مباشرة
        if (!hasPermission(item.id)) {
          return null;
        }
        return item;
      })
      .filter((item): item is MenuItemType => item !== null);
  }, [hasPermission]);

  const filteredMenuItems = useMemo(() => filterMenuItems(menuItems), [menuItems, filterMenuItems]);

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className={cn(
          'bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 transition-all duration-500 ease-in-out flex flex-col h-full',
          isCollapsed ? 'w-14 sm:w-16' : 'w-72 sm:w-80 md:w-64 lg:w-72 xl:w-80',
          'lg:relative lg:translate-x-0 lg:shadow-none',
          'fixed inset-y-0 right-0 z-50 shadow-2xl'
        )}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">أ</span>
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                    البعد العالي
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    إدارة السقالات
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1.5 sm:p-2 md:hidden h-7 w-7 sm:h-8 sm:w-8"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleCollapse}
                className="p-1.5 sm:p-2 hidden md:block h-7 w-7 sm:h-8 sm:w-8"
              >
                {isCollapsed ? (
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <MenuItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              href={item.href}
              isExpanded={expandedMenus.includes(item.id)}
              onToggle={toggleMenu}
              isActive={activeSection === item.id}
              isCollapsed={isCollapsed}
              level={0}
              onSectionChange={onSectionChange}
              onClose={onClose}
            >
              {item.children}
            </MenuItem>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 sm:space-y-3">
          <div className="flex justify-center">
            <div className="scale-90 sm:scale-100">
              <ThemeToggle />
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => {
              if (onClose && window.innerWidth < 768) {
                onClose();
              }
              setShowLogoutDialog(true);
            }}
            className="w-full justify-start space-x-2 sm:space-x-3 rtl:space-x-reverse text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 h-9 sm:h-10 transition-all duration-200 hover:border-red-300 dark:hover:border-red-700"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            {!isCollapsed && <span className="text-sm sm:text-base">تسجيل الخروج</span>}
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={() => {
          router.post('/logout', {}, {
            onSuccess: () => {
              setShowLogoutDialog(false);
            },
          });
        }}
        title="تأكيد تسجيل الخروج"
        description="هل أنت متأكد من رغبتك في تسجيل الخروج؟ سيتم إغلاق جلسة العمل الحالية."
        confirmText="تسجيل الخروج"
        cancelText="إلغاء"
        variant="warning"
      />
    </>
  );
}

