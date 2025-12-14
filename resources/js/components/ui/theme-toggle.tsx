/** @jsxImportSource react */
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './button';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
  };

  const toggleTheme = () => {
    let newTheme: 'light' | 'dark' | 'system';
    if (theme === 'light') {
      newTheme = 'dark';
    } else if (theme === 'dark') {
      newTheme = 'system';
    } else {
      newTheme = 'light';
    }
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="p-1.5 sm:p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center"
      >
        <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
      </Button>
    );
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />;
      case 'dark':
        return <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />;
      default:
        return <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
    }
  };

  const getTooltip = () => {
    switch (theme) {
      case 'light':
        return 'الوضع الفاتح';
      case 'dark':
        return 'الوضع الداكن';
      default:
        return 'وضع النظام';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="p-1.5 sm:p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center"
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      {getIcon()}
    </Button>
  );
}

