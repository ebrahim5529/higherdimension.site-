import { Phone, Mail, MessageCircle, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer id="contact" className="bg-secondary text-secondary-foreground">
      <div className="section-container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="شعار د. آسيا خليفة طلال الجري" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-lg">د. آسيا الجري</h3>
                <p className="text-sm text-secondary-foreground/70">استشاري نفسي وتربوي</p>
              </div>
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed max-w-md mb-6">
              أقدم محتوى نفسي متميز من فيديوهات وكتب ورسائل ملهمة، بالإضافة إلى استشارات نفسية متخصصة لمساعدتكم في رحلة النمو والتطور الشخصي.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                { label: "الرئيسية", path: "/" },
                { label: "من نحن", path: "/about" },
                { label: "الاستشارات", path: "/consultations" },
                { label: "الكتب", path: "/books" },
                { label: "مقتطفات", path: "/messages" },
                { label: "المقالات", path: "/articles" },
                { label: "فيديوهات", path: "/videos" },
                { label: "قصص", path: "/stories" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.path} className="text-secondary-foreground/80 hover:text-primary transition-colors">
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
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-secondary-foreground/80" dir="ltr">+965 XXXX XXXX</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <a href="mailto:info@drasiaaljiar.com" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  info@drasiaaljiar.com
                </a>
              </li>
            </ul>

            {/* WhatsApp Button */}
            <Button
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white"
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              تواصل عبر واتساب
            </Button>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-secondary-foreground/60 text-sm">
            © {new Date().getFullYear()} د. آسيا خليفة طلال الجري - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};
