import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/96893099914";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden hero-gradient">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-black/10 blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right space-y-8">
            <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-white text-sm mb-2 animate-fade-up-1">
              تأجير معدات البناء - الجيكات والسقالات
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-relaxed animate-fade-up-2">
              شركة البعد العالي للتجارة
              <br className="mb-4" />
              <span className="text-white/90">للتأجير الاحترافي في سلطنة عمان</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-white/90 mt-4 animate-fade-up-3">
              جيكات وسقالات بكافة الأحجام · خدمة توصيل · أسعار منافسة
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-fade-up-4">
              <Button asChild>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="w-5 h-5 ml-2" />
                  تواصل عبر واتساب
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-foreground">
                <a href="#services">استعرض خدماتنا</a>
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative animate-float">
              <div className="w-80 h-80 rounded-2xl bg-white/10 flex items-center justify-center border-4 border-white/20 p-4 overflow-hidden shadow-xl backdrop-blur-sm animate-fade-up-4">
                <img
                  src="/img/logo.png"
                  alt="شعار شركة البعد العالي للتجارة"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}
