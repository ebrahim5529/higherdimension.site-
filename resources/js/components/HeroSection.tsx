import { Button } from "@/components/ui/button";
import { Play, MessageCircle } from "lucide-react";

export const HeroSection = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `var(--hero-gradient)`,
      }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right space-y-8 animate-fade-up">
            <div className="inline-block px-4 py-2 bg-primary/20 rounded-full text-primary-foreground text-sm mb-2">
              بوابة الوعي والصحة النفسية والتربوية
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground leading-relaxed">
              مرحباً بكم في بوابة الوعي
              <br className="mb-4" />
              <span className="text-accent">والصحة النفسية والتربوية</span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-primary-foreground/90 mt-4">
              وعيٌ يحرّر… ورسالةٌ تهدي إلى السلام
            </p>
            
            <div className="bg-primary-foreground/10 rounded-2xl p-6 backdrop-blur-sm border border-primary-foreground/20">
              <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-4">
                <strong className="text-primary-foreground">مع الدكتورة آسيا خليفة الجري</strong> –  استشاري نفسي وتربوي
              </p>
              <p className="text-base md:text-lg text-primary-foreground/90 leading-relaxed mb-4">
                أهلاً بكم في مساحة آمنة تجمع بين العلم والخبرة والإنسانية.
              </p>
              <p className="text-base md:text-lg text-primary-foreground/90 leading-relaxed">
                أقدّم لكم محتوى نفسي وتربوي متميزاً يشمل فيديوهات توعية، كتباً هادفة، ورسائل ملهمة، بالإضافة إلى استشارات نفسية متخصصة لدعم رحلتكم نحو التوازن، النمو، والتحول الشخصي.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button variant="hero" size="lg">
                <MessageCircle className="w-5 h-5 ml-2" />
                تواصل عبر واتساب
              </Button>
              <Button variant="heroOutline" size="lg">
                <Play className="w-5 h-5 ml-2" />
                شاهد الفيديوهات
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative">
              {/* صورة الدكتورة */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border-4 border-primary/20 p-2 overflow-hidden shadow-card">
                <img 
                  src="/a.jpg" 
                  alt="د. آسيا خليفة طلال الجري" 
                  className="w-full h-full rounded-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-card">
                <div className="text-sm text-muted-foreground">سنوات الخبرة</div>
                <div className="text-2xl font-bold text-primary">+15 سنة</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
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
};
