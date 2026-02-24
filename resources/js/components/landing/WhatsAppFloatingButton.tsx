import { MessageCircle } from "lucide-react";
import { useState } from "react";

const WHATSAPP_URL = "https://wa.me/96893099914?text=مرحباً، أود الاستفسار عن خدمات تأجير المعدات";

export function WhatsAppFloatingButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="تواصل معنا عبر واتساب"
    >
      {/* Tooltip - يظهر على جهة اليمين من الزر */}
      <div
        className={`
          absolute top-1/2 -translate-y-1/2
          px-4 py-2.5 bg-white dark:bg-gray-900 
          rounded-xl shadow-xl border border-gray-200 dark:border-gray-700
          whitespace-nowrap text-sm font-medium text-foreground
          transition-all duration-300 ease-out
          ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}
        `}
        style={{ left: "calc(100% + 12px)" }}
      >
        <span>تواصل معنا الآن</span>
        <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-0 h-0 border-t-8 border-b-8 border-l-0 border-r-8 border-transparent border-r-white dark:border-r-gray-900" />
      </div>

      {/* زر الشات - شكل chatbot */}
      <div className="relative">
        {/* حلقة النبض الخفيفة */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" style={{ animationDuration: "2s" }} />

        {/* الزر الرئيسي */}
        <div
          className="
            relative flex items-center justify-center w-16 h-16
            bg-[#25D366] hover:bg-[#20bd5a] 
            rounded-full shadow-lg hover:shadow-xl hover:scale-110
            transition-all duration-300 ease-out
            group-hover:rotate-12
          "
        >
          <MessageCircle className="w-8 h-8 text-white" strokeWidth={2} />
        </div>
      </div>
    </a>
  );
}
