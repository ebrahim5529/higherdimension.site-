import { Building2 } from "lucide-react";
import { RevealOnScroll } from "./RevealOnScroll";

const IMAGE_FILES = [
  "WhatsApp Image 2026-02-23 at 4.46.10 PM.jpeg",
  "WhatsApp Image 2026-02-23 at 4.46.11 PM.jpeg",
  "WhatsApp Image 2026-02-23 at 4.46.12 PM.jpeg",
  "WhatsApp Image 2026-02-23 at 4.46.13 PM.jpeg",
  "WhatsApp Image 2026-02-23 at 4.46.14 PM.jpeg",
  "WhatsApp Image 2026-02-23 at 4.46.15 PM.jpeg",
];

export function AboutSection() {
  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="section-container">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-4">
              <Building2 className="w-4 h-4" />
              من نحن
            </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            شركة البعد العالي للتجارة
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            إحدى الشركات العمانية المتخصصة في مجال تأجير معدات البناء
          </p>
          </div>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <RevealOnScroll className="space-y-6" delay="sm">
            <p className="text-foreground/90 leading-relaxed">
              شركة البعد العالي للتجارة هي إحدى الشركات العمانية المتخصصة في مجال تأجير معدات البناء، وبالأخص <strong className="text-primary">الجيكات والسقالات</strong> بكافة أنواعها وأحجامها.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              انطلاقاً من رؤية طموحة، تسعى الشركة إلى أن تصبح إحدى أكبر وأفضل شركات تأجير المعدات في سلطنة عمان، من خلال تقديم خدماتها بطرق احترافية حديثة.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              تدار الشركة بكفاءة عالية بواسطة كوادر عمانية شابة تمتلك خبرة ومعرفة جيدة بالسوق المحلي واحتياجاته، مع التركيز على الجودة العالية وسهولة وسلاسة الإجراءات لتلبية متطلبات الشركات الكبرى والأفراد على حد سواء.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              مقرها الرئيسي في <strong className="text-primary">منطقة الموالح الجنوبية</strong>، مما يضمن سهولة الوصول إليها وخدمة العملاء في مختلف المناطق.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay="md" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {IMAGE_FILES.map((filename, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={`/img/${encodeURIComponent(filename)}`}
                  alt={`معدات البناء - شركة البعد العالي ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
