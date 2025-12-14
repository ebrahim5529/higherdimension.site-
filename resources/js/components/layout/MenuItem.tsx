/** @jsxImportSource react */
import { memo, useCallback } from 'react';
import { Link, router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface MenuItemProps {
  id: string;
  label: string;
  icon: any;
  href?: string;
  children?: MenuItemProps[];
  isExpanded?: boolean;
  onToggle?: (id: string) => void;
  isActive?: boolean;
  isCollapsed?: boolean;
  level?: number;
  onSectionChange?: (section: string) => void;
  onClose?: () => void;
}

export const MenuItem = memo(function MenuItem({
  id,
  label,
  icon: Icon,
  href,
  children,
  isExpanded = false,
  onToggle,
  isActive = false,
  isCollapsed = false,
  level = 0,
  onSectionChange,
  onClose,
}: MenuItemProps) {
  const handleNavigation = useCallback(() => {
    if (href) {
      // للروابط المباشرة
      if (onClose && window.innerWidth < 768) {
        onClose();
      }
    } else {
      // للعناصر العادية - التنقل تلقائياً بناءً على الـ id
      const routeMap: Record<string, string> = {
        'dashboard-interactive': '/dashboard/dashboard-interactive',
        'financial-reports': '/dashboard/financial-reports',
        'operations-reports': '/dashboard/operations-reports',
        'customer-reports': '/dashboard/customer-reports',
        'customer-management': '/customers',
        'main-dashboard': '/dashboard/main-dashboard',
      };
      
      const route = routeMap[id] || `/dashboard/${id}`;
      if (route) {
        router.visit(route);
      }
      
      if (onSectionChange) {
        onSectionChange(id);
      }
      if (onClose && window.innerWidth < 768) {
        onClose();
      }
    }
  }, [id, href, onSectionChange, onClose]);

  const handleToggle = useCallback(() => {
    if (onToggle && children) {
      onToggle(id);
    }
  }, [id, onToggle, children]);

  const hasChildren = children && children.length > 0;
  const isMainLevel = level === 0;
  const isSubLevel = level === 1;

  const content = (
    <button
      onClick={hasChildren ? handleToggle : handleNavigation}
      className={cn(
        'w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-right group',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        isMainLevel && 'text-gray-700 dark:text-gray-300',
        isSubLevel && 'text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
        isActive && 'bg-primary text-white hover:bg-primary/90',
        isCollapsed && 'justify-center px-2'
      )}
      title={isCollapsed ? label : undefined}
    >
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <Icon
          className={cn(
            'flex-shrink-0 transition-colors duration-200',
            isMainLevel ? 'h-5 w-5' : 'h-4 w-4',
            isActive ? 'text-white' : 'text-current',
            isCollapsed && 'mx-auto'
          )}
        />

        {!isCollapsed && (
          <div className="flex-1 text-right">
            <div
              className={cn(
                'font-medium transition-colors duration-200',
                isMainLevel ? 'text-base' : 'text-sm',
                isActive ? 'text-white' : 'text-current'
              )}
            >
              {label}
            </div>
          </div>
        )}
      </div>

      {!isCollapsed && hasChildren && (
        <div className="mr-2 transition-transform duration-200">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      )}
    </button>
  );

  return (
    <div className="space-y-1">
      {href ? (
        <Link href={href} className="block">
          {content}
        </Link>
      ) : (
        content
      )}

      {!isCollapsed && hasChildren && isExpanded && (
        <div
          className={cn(
            'space-y-1 transition-all duration-200',
            isMainLevel ? 'mr-4' : 'mr-8'
          )}
        >
          {children.map((child) => (
            <MenuItem
              key={child.id}
              {...child}
              isActive={isActive}
              isCollapsed={isCollapsed}
              level={level + 1}
              onToggle={onToggle}
              onSectionChange={onSectionChange}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default MenuItem;

