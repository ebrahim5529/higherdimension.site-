import { Package, Layers, Truck, Phone, Wrench } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RevealOnScroll } from "./RevealOnScroll";

const SERVICES = [
  {
    icon: Package,
    title: "تأجير الجيكات (الدعائم المعدنية)",
    description:
      "نوفر مجموعة شاملة من الجيكات بمقاسات مختلفة (تشمل 4 متر و 5 متر) لاستخدامها كدعامات أساسية في رفع الأسطح وصب الخرسانة للمباني والفلل. تتميز جيكاتنا بالقوة والمتانة مع خفة الوزن وسهولة الاستخدام، مما يضمن أعلى درجات الأمان والكفاءة في موقع البناء.",
  },
  {
    icon: Layers,
    title: "تأجير السقالات (السكفولدنج والكابلوك)",
    description:
      "نقدم أنظمة سقالات متعددة الاستخدامات (مثل السكفولدنج والكابلوك) التي توفر بنية متينة ودعماً آمناً للعمال والمواد خلال عمليات البناء والتشطيب. سواء كنت بحاجة إليها لأعمال البلاستر أو صبغ المباني، فإن سقالاتنا تتميز بقابلية التعديل والتكيف مع أشكال المباني المختلفة لضمان إنجاز العمل باحترافية.",
  },
  {
    icon: Truck,
    title: "خدمة التوصيل",
    description:
      "نحرص على توفير تجربة متكاملة لعملائنا من خلال توفير خدمة التوصيل المجاني للمعدات إلى مواقع العمل المختلفة.",
  },
  {
    icon: Phone,
    title: "سهولة الطلب",
    description:
      "يمكنك طلب احتياجاتك بسهولة عبر وسائل متعددة، سواء من خلال الاتصال الهاتفي المباشر أو عبر قنواتنا على وسائل التواصل الاجتماعي.",
  },
  {
    icon: Wrench,
    title: "خدمة ما بعد التأجير",
    description:
      "نضمن متابعة العملاء وتقديم الدعم اللازم طيلة فترة الإيجار، مع توفير فحص دوري للمعدات لضمان جاهزيتها وسلامتها.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-background">
      <div className="section-container">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-4">
              خدماتنا
            </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ما نقدمه لعملائنا
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            خدمات متكاملة ومرنة لتلبية احتياجاتكم في تأجير معدات البناء
          </p>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <RevealOnScroll key={index} delay={index < 3 ? "sm" : "md"}>
            <Card
              className="border-2 border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-lg text-foreground">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground/80 leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
