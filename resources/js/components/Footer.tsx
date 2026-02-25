import { Phone, Mail, MessageCircle } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

const WHATSAPP_URL = "https://wa.me/96893099914";

const quickLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "من نحن", path: "/#about" },
  { label: "خدماتنا", path: "/#services" },
  { label: "لماذا البعد العالي؟", path: "/#advantages" },
  { label: "تواصل معنا", path: "/#contact" },
];

export const Footer = () => {
  return (
    <footer className="bg-[#d5754e] text-white">
      <div className="section-container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden border border-white/30">
                <img src="/img/logo.png" alt="شعار شركة البعد العالي للتجارة" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-lg">شركة البعد العالي للتجارة</h3>
                <p className="text-sm text-white/80">تأجير الجيكات والسقالات</p>
              </div>
            </div>
            <p className="text-white/90 leading-relaxed max-w-md mb-6">
              إحدى الشركات العمانية المتخصصة في مجال تأجير معدات البناء، وبالأخص الجيكات والسقالات بكافة أنواعها وأحجامها. مقرنا الرئيسي في منطقة الموالح الجنوبية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-white/90 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <div>
                  <a href="tel:+96893099914" className="text-white/90 hover:text-white transition-colors" dir="ltr">
                    +968 9309 9914
                  </a>
                  <br />
                  <a href="tel:+96890891070" className="text-white/90 hover:text-white transition-colors" dir="ltr">
                    +968 9089 1070
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <a href="mailto:higherdimension30@gmail.com" className="text-white/90 hover:text-white transition-colors">
                  higherdimension30@gmail.com
                </a>
              </li>
            </ul>

            <Button asChild className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 ml-2" />
                تواصل عبر واتساب
              </a>
            </Button>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/80 text-sm">
            © {new Date().getFullYear()} شركة البعد العالي للتجارة - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};
