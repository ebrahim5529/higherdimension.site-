/** @jsxImportSource react */
import React from 'react';
import { Users, UserCheck, DollarSign, TrendingUp } from 'lucide-react';

interface EmployeeStatsType {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  onLeaveEmployees: number;
  newHiresThisMonth: number;
  averageSalary: number;
  totalSalaryCost: number;
}

interface EmployeeStatsProps {
  stats: EmployeeStatsType;
}

export function EmployeeStats({ stats }: EmployeeStatsProps) {
  if (!stats) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* إجمالي الموظفين */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                إجمالي الموظفين
              </h3>
              <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                {stats.totalEmployees || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.activeEmployees || 0} نشط، {stats.inactiveEmployees || 0} غير نشط
              </p>
            </div>
            <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
              <Users className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* الموظفين النشطين */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                الموظفين النشطين
              </h3>
              <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                {stats.activeEmployees || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalEmployees > 0
                  ? ((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1)
                  : 0}% من إجمالي الموظفين
              </p>
            </div>
            <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
              <UserCheck className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* متوسط الراتب */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                متوسط الراتب
              </h3>
              <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                {stats.averageSalary?.toLocaleString() || 0} ر.ع
              </div>
              <p className="text-xs text-gray-500 mt-1">شهرياً</p>
            </div>
            <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
              <DollarSign className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* إجمالي تكلفة الرواتب */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                إجمالي تكلفة الرواتب
              </h3>
              <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                {stats.totalSalaryCost?.toLocaleString() || 0} ر.ع
              </div>
              <p className="text-xs text-gray-500 mt-1">شهرياً</p>
            </div>
            <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
              <TrendingUp className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

