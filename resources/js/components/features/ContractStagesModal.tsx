/** @jsxImportSource react */
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GitBranch, X, CheckCircle } from 'lucide-react';

interface Contract {
  id: number;
  contractNumber: string;
  customerName: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface ContractStagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract | null;
}

interface Stage {
  id: string;
  name: string;
  completed: boolean;
  active: boolean;
}

export function ContractStagesModal({
  open,
  onOpenChange,
  contract,
}: ContractStagesModalProps) {
  if (!contract) return null;

  // تحديد المراحل بناءً على حالة العقد
  const getStages = (): Stage[] => {
    const stages: Stage[] = [
      { id: 'signing', name: 'توقيع العقد', completed: true, active: false },
      { id: 'delivery', name: 'التسليم', completed: contract.status === 'منتهي', active: false },
      { id: 'inactive', name: 'غير نشط', completed: false, active: contract.status === 'منتهي' },
      { id: 'completion', name: 'انتهاء العقد', completed: contract.status === 'منتهي', active: false },
    ];
    return stages;
  };

  const stages = getStages();

  const getStatusText = () => {
    switch (contract.status) {
      case 'نشط':
        return 'نشط';
      case 'منتهي':
        return 'منتهي';
      case 'ملغي':
        return 'ملغي';
      default:
        return contract.status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-white rounded-lg shadow-2xl w-full">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GitBranch className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">مراحل العقد</h2>
              <p className="text-sm text-gray-600 mt-1">{contract.contractNumber}</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-8">
          {/* معلومات العقد */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">العميل:</span>
                <span className="font-medium text-gray-900 mr-2">{contract.customerName}</span>
              </div>
              <div>
                <span className="text-gray-600">الحالة:</span>
                <span className="font-medium mr-2 text-gray-600">{getStatusText()}</span>
              </div>
            </div>
          </div>

          {/* خط زمني المراحل */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1 min-w-full justify-center">
              {stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          stage.completed
                            ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-500 shadow-lg shadow-green-200'
                            : stage.active
                            ? 'bg-gray-100 border-gray-300'
                            : 'bg-gray-100 border-gray-300'
                        }`}
                      >
                        {stage.completed ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      <span
                        className={`text-xs mt-2 text-center font-medium transition-colors duration-200 max-w-[80px] leading-tight ${
                          stage.completed ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {stage.name}
                      </span>
                    </div>
                    {index < stages.length - 1 && (
                      <div
                        className={`h-1 w-12 mx-2 rounded-full transition-all duration-500 ${
                          stage.completed ? 'bg-green-400' : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ملاحظات */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">ملاحظات:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• تم توقيع العقد بتاريخ: {contract.startDate}</li>
              <li>• تاريخ الانتهاء المتوقع: {contract.endDate}</li>
              <li>• الحالة الحالية: {getStatusText()}</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

