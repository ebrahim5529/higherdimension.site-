import {
  Users,
  Wrench,
  TrendingUp,
  Heart,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { RevealOnScroll } from "./RevealOnScroll";

const ADVANTAGES = [
  {
    icon: Users,
    title: "إدارة وتنظيم عماني",
    description:
      "مشروع يُدار بكفاءة وطموح شباب عماني، يمتلك معرفة عميقة بالسوق المحلي ويحرص على تقديم أعلى مستويات الخدمة.",
  },
  {
    icon: Wrench,
    title: "الجودة والمعدات الحديثة",
    description:
      "نعتمد في مشروعنا على توفير معدات حديثة وقوية، مع ضمان عمر افتراضي جيد لها من خلال الصيانة الدورية.",
  },
  {
    icon: TrendingUp,
    title: "القدرة على المنافسة",
    description:
      "نقدم أسعاراً منافسة وجودة عالية في الخدمة، مع تسهيل إجراءات التأجير وسرعة توفير المعدات المطلوبة.",
  },
  {
    icon: Heart,
    title: "التركيز على العملاء",
    description:
      "نمتلك قاعدة بيانات واسعة من العملاء المحتملين، ونحرص على بناء علاقات قوية ومستدامة معهم من خلال خدمة ما بعد البيع والمتابعة المستمرة.",
  },
  {
    icon: MapPin,
    title: "موقع استراتيجي",
    description:
      "يقع مقرنا في الموالح الجنوبية، مما يسهل الوصول إلينا وتغطية طلبات العملاء في محافظة مسقط والمناطق المحيطة.",
  },
];

export function AdvantagesSection() {
  return (
    <section id="advantages" className="section-padding bg-muted/30">
      <div className="section-container">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-4">
              <CheckCircle2 className="w-4 h-4" />
              لماذا البعد العالي؟
            </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            المزايا التنافسية
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ما يميزنا عن غيرنا في سوق تأجير المعدات
          </p>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ADVANTAGES.map((item, index) => (
            <RevealOnScroll key={index} delay={index % 2 === 0 ? "sm" : "md"}>
            <div
              className="flex gap-6 p-6 rounded-2xl bg-card border-2 border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
