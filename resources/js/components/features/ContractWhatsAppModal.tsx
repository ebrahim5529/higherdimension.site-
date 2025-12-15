/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, MessageSquare, Phone, FileText, Eye, Download, Copy, Send } from 'lucide-react';
import { showToast } from '@/hooks/use-toast';

interface Contract {
  id: number;
  contract_number: string;
  customer_name: string;
  total_amount: number;
  contract_date: string;
  contract_type?: string;
}

interface ContractWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract | null;
  customerPhone?: string;
}

export const ContractWhatsAppModal: React.FC<ContractWhatsAppModalProps> = ({
  open,
  onOpenChange,
  contract,
  customerPhone = '',
}) => {
  const [phone, setPhone] = useState(customerPhone);
  const [customMessage, setCustomMessage] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');

  useEffect(() => {
    if (contract && open) {
      setPhone(customerPhone);
      generateDefaultMessage();
    }
  }, [contract, open, customerPhone]);

  useEffect(() => {
    if (customMessage.trim()) {
      setWhatsappMessage(customMessage);
    } else {
      generateDefaultMessage();
    }
  }, [customMessage, contract]);

  const generateDefaultMessage = () => {
    if (!contract) return;

    const contractType = contract.contract_type || 'تأجير معدات بناء';
    // استخدام الرابط الحالي ديناميكيًا بناءً على البيئة
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const signUrl = `${baseUrl}/contract/sign/${contract.contract_number}`;

    const message = `السلام عليكم ورحمة الله وبركاته



أهلاً وسهلاً بكم في شركة البعد العالي للتجارة



تم إعداد عقد إيجار معدات بناء برقم: *${contract.contract_number}*



تفاصيل العقد:

• العميل: ${contract.customer_name}

• القيمة الإجمالية: ${contract.total_amount} ر.ع

• تاريخ العقد: ${contract.contract_date}

• نوع العقد: ${contractType}



يرجى مراجعة العقد والتوقيع عليه من خلال الرابط التالي:

${signUrl}



بعد التوقيع سيتم إرسال نسخة موقعة إليكم



شكراً لثقتكم بنا
شركة البعد العالي للتجارة`;

    setWhatsappMessage(message);
  };

  const formatPhoneNumber = (phoneNumber: string): string => {
    // إزالة جميع المسافات والرموز
    let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // إذا بدأ بـ +968، احذفه
    if (cleaned.startsWith('+968')) {
      cleaned = cleaned.substring(4);
    }
    // إذا بدأ بـ 968 فقط، احذفه
    else if (cleaned.startsWith('968')) {
      cleaned = cleaned.substring(3);
    }
    
    // إضافة 968 في البداية
    return `968${cleaned}`;
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(whatsappMessage);
    showToast.success('تم النسخ', 'تم نسخ الرسالة إلى الحافظة');
  };

  const handleOpenWhatsApp = () => {
    if (!phone.trim()) {
      showToast.error('خطأ', 'يرجى إدخال رقم الهاتف');
      return;
    }

    const formattedPhone = formatPhoneNumber(phone);
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleSendViaSystem = () => {
    if (!phone.trim()) {
      showToast.error('خطأ', 'يرجى إدخال رقم الهاتف');
      return;
    }

    // TODO: إرسال عبر النظام (API call)
    showToast.info('قيد التطوير', 'سيتم إضافة هذه الميزة قريباً');
  };

  const handlePreviewContract = () => {
    if (!contract) return;
    window.open(`/contracts/${contract.id}/invoice`, '_blank');
  };

  const handleGeneratePDF = () => {
    if (!contract) return;
    // TODO: توليد PDF
    showToast.info('قيد التطوير', 'سيتم إضافة هذه الميزة قريباً');
  };

  const isPhoneValid = phone.trim().length >= 7;

  if (!contract) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">إرسال العقد عبر الواتساب</h2>
              <p className="text-sm text-gray-600">إرسال العقد للعميل للتوقيع</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* معلومات العقد */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">معلومات العقد</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">رقم العقد:</span>
                <span className="font-medium text-gray-900 mr-2"> {contract.contract_number}</span>
              </div>
              <div>
                <span className="text-gray-600">اسم العميل:</span>
                <span className="font-medium text-gray-900 mr-2"> {contract.customer_name}</span>
              </div>
              <div>
                <span className="text-gray-600">القيمة الإجمالية:</span>
                <span className="font-medium text-gray-900 mr-2"> {contract.total_amount} ر.ع</span>
              </div>
              <div>
                <span className="text-gray-600">تاريخ العقد:</span>
                <span className="font-medium text-gray-900 mr-2"> {contract.contract_date}</span>
              </div>
            </div>
          </div>

          {/* رقم الهاتف */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Phone className="h-4 w-4" />
              رقم الهاتف
            </label>
            <Input
              placeholder="96812345678 أو 12345678"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">يمكن إدخال الرقم بدون رمز البلد أو مع +968</p>
          </div>

          {/* الرسالة المخصصة */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MessageSquare className="h-4 w-4" />
              الرسالة المخصصة (اختياري)
            </label>
            <textarea
              placeholder="اكتب رسالة مخصصة أو اتركها فارغة لاستخدام الرسالة الافتراضية"
              rows={6}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent resize-none"
            />
          </div>

          {/* معاينة وتوليد العقد */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-3">معاينة وتوليد العقد:</h4>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="default"
                onClick={handlePreviewContract}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                معاينة نموذج العقد
              </Button>
              <Button
                variant="default"
                onClick={handleGeneratePDF}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                توليد PDF
              </Button>
            </div>
          </div>

          {/* معاينة الرسالة */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">معاينة الرسالة:</h4>
            <div className="bg-white rounded border p-3 text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
              {whatsappMessage}
            </div>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              onClick={handleCopyMessage}
              className="bg-gray-600 hover:bg-gray-700"
            >
              <Copy className="h-4 w-4 mr-2" />
              نسخ الرسالة
            </Button>
            <Button
              variant="default"
              onClick={handleOpenWhatsApp}
              disabled={!isPhoneValid}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              فتح الواتساب
            </Button>
            <Button
              variant="default"
              onClick={handleSendViaSystem}
              disabled={!isPhoneValid}
              className="bg-[#58d2c8] hover:bg-[#4AB8B3] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 mr-2" />
              إرسال عبر النظام
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

