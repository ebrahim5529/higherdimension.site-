/** @jsxImportSource react */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface PageProps {
  auth?: {
    user?: any;
  };
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { auth } = usePage<PageProps>().props;
  const [activeSection, setActiveSection] = useState('main-dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const pathToSectionMap = useMemo(
    () => ({
      '/dashboard': 'main-dashboard',
      '/dashboard/dashboard-interactive': 'dashboard-interactive',
      '/dashboard/operations-reports': 'operations-reports',
      '/dashboard/customer-reports': 'customer-reports',
      '/dashboard/customer-management': 'customer-management',
      '/dashboard/customer-contracts': 'customer-contracts',
      '/dashboard/customer-claims': 'customer-claims',
      '/contracts': 'contract-management',
      '/contracts/create': 'contract-management',
      '/contracts/edit': 'contract-management',
      '/contracts/active': 'active-contracts',
      '/contracts/expired': 'expired-contracts',
      '/contracts/cancelled': 'cancelled-contracts',
      '/dashboard/contract-management': 'contract-management',
      '/dashboard/supplier-management': 'supplier-management',
      '/dashboard/supplier-invoices': 'supplier-invoices',
      '/dashboard/supplier-purchases': 'supplier-purchases',
      '/dashboard/inventory-status': 'inventory-status',
      '/dashboard/purchase-equipment': 'purchase-equipment',
      '/dashboard/purchases-list': 'purchases-list',
      '/dashboard/active-contracts': 'active-contracts',
      '/dashboard/expired-contracts': 'expired-contracts',
      '/dashboard/cancelled-contracts': 'cancelled-contracts',
      '/dashboard/electronic-signature': 'electronic-signature',
      '/dashboard/delivery-orders': 'delivery-orders',
      '/dashboard/shipping-tracking': 'shipping-tracking',
      '/dashboard/delivery-receipt': 'delivery-receipt',
      '/dashboard/return-inspection': 'return-inspection',
      '/dashboard/payment-management': 'payment-management',
      '/dashboard/purchase-management': 'purchase-management',
      '/dashboard/invoices': 'invoices',
      '/dashboard/financial-reports': 'financial-reports',
      '/dashboard/employee-management': 'employee-management',
      '/employees': 'employee-management',
      '/employees/salaries': 'salaries',
      '/employees/incentives': 'incentives',
      '/employees/attendance': 'attendance',
      '/employees/attendance/reports': 'attendance',
      '/employees/departments': 'departments',
      '/employees/leaves': 'leaves',
      '/dashboard/user-roles': 'user-roles',
      '/dashboard/permission-groups': 'permission-groups',
      '/dashboard/roles': 'roles',
      '/payments': 'all-payments',
      '/payments/create': 'all-payments',
      '/payments/late': 'late-payments',
      '/payments/reports': 'payment-reports',
      '/dashboard/profile': 'profile',
    }),
    []
  );

  const getActiveSection = useCallback(
    (url: string) => {
      if (url.startsWith('/contracts')) {
        if (url.includes('/active')) {
          return 'active-contracts';
        }
        if (url.includes('/expired')) {
          return 'expired-contracts';
        }
        if (url.includes('/cancelled')) {
          return 'cancelled-contracts';
        }
        return 'contract-management';
      }
      if (url.startsWith('/dashboard/contract-details/')) {
        return 'contract-management';
      }
      if (url.startsWith('/employees/attendance')) {
        return 'attendance';
      }
      if (url.startsWith('/employees/salaries')) {
        return 'salaries';
      }
      if (url.startsWith('/employees/incentives')) {
        return 'incentives';
      }
      if (url.startsWith('/employees/departments')) {
        return 'departments';
      }
      if (url.startsWith('/employees/leaves')) {
        return 'leaves';
      }
      if (url.startsWith('/payments')) {
        if (url.includes('/late')) {
          return 'late-payments';
        }
        if (url.includes('/reports')) {
          return 'payment-reports';
        }
        return 'all-payments';
      }
      if (url.startsWith('/employees')) {
        return 'employee-management';
      }
      return (pathToSectionMap as Record<string, string>)[url] || 'main-dashboard';
    },
    [pathToSectionMap]
  );

  useEffect(() => {
    const url = window.location.pathname;
    const newSection = getActiveSection(url);
    if (newSection !== activeSection) {
      setActiveSection(newSection);
    }
  }, [getActiveSection, activeSection]);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (!auth?.user) {
      router.visit('/login');
    }
  }, [auth]);

  if (!auth?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row">
        {isSidebarOpen && (
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onClose={handleCloseSidebar}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0 lg:min-h-screen">
          <Header
            onToggleSidebar={handleToggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />

          <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-x-auto">
            <div className="max-w-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

