/** @jsxImportSource react */
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { showToast } from '@/hooks/use-toast';
import {
  Settings,
  Save,
  Link2,
  Banknote,
  Users,
  Truck,
  UserCog,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface AccountOption {
  id: number;
  code: string;
  name: string;
  type: string;
  is_parent: boolean;
  display: string;
}

interface SettingItem {
  key: string;
  label: string;
  group: string;
  value: string | null;
}

interface Props {
  settings: Record<string, SettingItem>;
  accounts: AccountOption[];
}

const groupLabels: Record<string, { label: string; icon: any; description: string }> = {
  payment: {
    label: 'حسابات الدفع',
    icon: Banknote,
    description: 'تحديد حسابات النقدية والبنك المستخدمة عند تسجيل المدفوعات',
  },
  customers: {
    label: 'حسابات العملاء والعقود',
    icon: Users,
    description: 'تحديد حسابات العملاء والإيرادات المرتبطة بالعقود',
  },
  suppliers: {
    label: 'حسابات الموردين والمشتريات',
    icon: Truck,
    description: 'تحديد حسابات الموردين ومصروفات المشتريات',
  },
  employees: {
    label: 'حسابات الموظفين والرواتب',
    icon: UserCog,
    description: 'تحديد حسابات الرواتب ومستحقات الموظفين',
  },
  general: {
    label: 'إعدادات عامة',
    icon: Settings,
    description: 'إعدادات عامة للنظام المحاسبي',
  },
};

export default function AccountingSettings({ settings, accounts }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const data: Record<string, string> = {};
    Object.values(settings).forEach((s) => {
      data[s.key] = s.value || '';
    });
    return data;
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key] === '1' ? '0' : '1',
    }));
  };

  const handleSave = () => {
    setSaving(true);
    router.post(
      '/accounting/settings',
      { settings: formData },
      {
        preserveScroll: true,
        onSuccess: () => {
          showToast.success('تم حفظ الإعدادات بنجاح');
          setSaving(false);
        },
        onError: () => {
          showToast.error('حدث خطأ أثناء الحفظ');
          setSaving(false);
        },
      }
    );
  };

  const leafAccounts = accounts.filter((a) => !a.is_parent);

  const groupedSettings = Object.values(settings).reduce(
    (acc, setting) => {
      if (!acc[setting.group]) acc[setting.group] = [];
      acc[setting.group].push(setting);
      return acc;
    },
    {} as Record<string, SettingItem[]>
  );

  const groupOrder = ['payment', 'customers', 'suppliers', 'employees', 'general'];

  return (
    <DashboardLayout>
      <Head title="إعدادات الربط المحاسبي" />

      <div className="p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Link2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                إعدادات الربط المحاسبي
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تحديد الحسابات الافتراضية لربط العمليات المالية بالقيود المحاسبية تلقائياً
              </p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </Button>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>ملاحظة:</strong> عند تحديد الحسابات أدناه، سيقوم النظام تلقائياً بإنشاء قيود
            محاسبية عند تسجيل المدفوعات، إنشاء العقود، دفع الرواتب، وتسجيل المشتريات. يجب اختيار
            حسابات فرعية (غير رئيسية) فقط.
          </p>
        </div>

        {/* Settings Groups */}
        {groupOrder.map((groupKey) => {
          const groupSettings = groupedSettings[groupKey];
          if (!groupSettings) return null;
          const groupInfo = groupLabels[groupKey];
          const Icon = groupInfo.icon;

          return (
            <Card key={groupKey}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{groupInfo.label}</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {groupInfo.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupSettings.map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <Label className="text-sm font-medium">{setting.label}</Label>
                      {setting.key === 'auto_post_entries' ? (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggle(setting.key)}
                            className="flex items-center gap-2 text-sm"
                          >
                            {formData[setting.key] === '1' ? (
                              <>
                                <ToggleRight className="h-8 w-8 text-green-500" />
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  مفعّل — يتم ترحيل القيود تلقائياً
                                </span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="h-8 w-8 text-gray-400" />
                                <span className="text-gray-500 font-medium">
                                  معطّل — القيود تبقى مسودة
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <select
                          value={formData[setting.key] || ''}
                          onChange={(e) => handleChange(setting.key, e.target.value)}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">-- اختر الحساب --</option>
                          {leafAccounts.map((account) => (
                            <option key={account.id} value={String(account.id)}>
                              {account.code} - {account.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Bottom Save */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ جميع الإعدادات'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
