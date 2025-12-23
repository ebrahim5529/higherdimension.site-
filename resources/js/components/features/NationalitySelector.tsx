/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { availableNationalities } from '@/data/suppliersData';

interface NationalitySelectorProps {
  value?: string;
  onChange: (nationality: string) => void;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}

export function NationalitySelector({ 
  value, 
  onChange, 
  disabled = false,
  label = 'الجنسية',
  required = false 
}: NationalitySelectorProps) {
  const [nationalities, setNationalities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNationality, setNewNationality] = useState('');

  // تحميل الجنسيات المتاحة
  useEffect(() => {
    // تحميل الجنسيات من الملف
    setNationalities([...availableNationalities]);
  }, []);

  // فلترة الجنسيات بناءً على البحث
  const filteredNationalities = nationalities.filter((nationality) => {
    const searchTerm = searchQuery.toLowerCase();
    return nationality.toLowerCase().includes(searchTerm);
  });

  // التحقق من وجود الجنسية المدخلة
  const hasExactMatch = nationalities.some(
    (n) => n.toLowerCase() === searchQuery.toLowerCase()
  );

  // الجنسية المختارة
  const selectedNationality = value || '';

  const handleSelect = (nationality: string) => {
    onChange(nationality);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onChange('');
    setSearchQuery('');
  };

  const handleAddNew = () => {
    if (newNationality.trim() && !nationalities.includes(newNationality.trim())) {
      const updatedNationalities = [...nationalities, newNationality.trim()];
      setNationalities(updatedNationalities);
      onChange(newNationality.trim());
      setNewNationality('');
      setShowAddModal(false);
      setShowDropdown(false);
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowDropdown(true);
    
    // إذا كان النص غير موجود في القائمة، أظهر زر إضافة جديد
    if (query && !hasExactMatch && query.length > 0) {
      // سيتم عرض زر الإضافة في القائمة المنسدلة
    }
  };

  return (
    <div className="relative">
      {/* التسمية */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* حقل الإدخال */}
      <div className="relative">
        <input
          type="text"
          value={selectedNationality || searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setShowDropdown(true)}
          placeholder="ابحث عن الجنسية أو أدخل جنسية جديدة..."
          disabled={disabled}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        {selectedNationality && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {/* القائمة المنسدلة */}
      {showDropdown && !disabled && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
            {filteredNationalities.length > 0 ? (
              <>
                {filteredNationalities.map((nationality) => (
                  <button
                    key={nationality}
                    type="button"
                    onClick={() => handleSelect(nationality)}
                    className={`w-full text-right px-4 py-3 hover:bg-[#58d2c8]/10 transition-colors border-b border-gray-100 last:border-b-0 ${
                      value === nationality ? 'bg-[#58d2c8]/20' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {nationality}
                    </div>
                  </button>
                ))}
                
                {/* زر إضافة جنسية جديدة إذا كان البحث غير موجود */}
                {searchQuery && !hasExactMatch && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewNationality(searchQuery);
                      setShowAddModal(true);
                    }}
                    className="w-full text-right px-4 py-3 hover:bg-blue-50 transition-colors border-t border-gray-200 bg-blue-50/50"
                  >
                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                      <Plus className="h-4 w-4" />
                      إضافة "{searchQuery}" كجنسية جديدة
                    </div>
                  </button>
                )}
              </>
            ) : (
              <div className="px-4 py-3">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setNewNationality(searchQuery);
                      setShowAddModal(true);
                    }}
                    className="w-full text-right px-4 py-3 hover:bg-blue-50 transition-colors rounded-lg bg-blue-50/50"
                  >
                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                      <Plus className="h-4 w-4" />
                      إضافة "{searchQuery}" كجنسية جديدة
                    </div>
                  </button>
                ) : (
                  <div className="text-center text-gray-500">
                    لا توجد نتائج
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal إضافة جنسية جديدة */}
      {showAddModal && (
        <>
          <div 
            className="fixed inset-0 z-30 bg-black/50"
            onClick={() => {
              setShowAddModal(false);
              setNewNationality('');
            }}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              إضافة جنسية جديدة
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الجنسية <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newNationality}
                  onChange={(e) => setNewNationality(e.target.value)}
                  placeholder="أدخل اسم الجنسية"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNew();
                    } else if (e.key === 'Escape') {
                      setShowAddModal(false);
                      setNewNationality('');
                    }
                  }}
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewNationality('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleAddNew}
                  disabled={!newNationality.trim()}
                  className="px-4 py-2 bg-[#58d2c8] text-white rounded-lg hover:bg-[#4AB8B3] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

