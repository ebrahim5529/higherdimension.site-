import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Send, Heart, Sparkles } from "lucide-react";

const messages = [
  {
    id: 1,
    content: "السعادة ليست وجهة نصل إليها، بل طريقة نعيش بها كل يوم.",
    category: "تحفيز",
  },
  {
    id: 2,
    content: "لا تقارن نفسك بالآخرين، فأنت في رحلتك الخاصة.",
    category: "تطوير الذات",
  },
  {
    id: 3,
    content: "الهدوء الداخلي يبدأ عندما تتوقف عن السماح للآخرين بالتحكم في مشاعرك.",
    category: "سلام داخلي",
  },
  {
    id: 4,
    content: "كل يوم جديد هو فرصة لتكون نسخة أفضل من نفسك.",
    category: "تحفيز",
  },
  {
    id: 5,
    content: "الاهتمام بصحتك النفسية ليس رفاهية، بل ضرورة.",
    category: "صحة نفسية",
  },
  {
    id: 6,
    content: "التسامح يحررك أنت قبل أن يحرر الآخرين.",
    category: "سلام داخلي",
  },
];

export const MessagesSection = () => {
  return (
    <section id="messages" className="section-padding bg-gradient-to-b from-primary/5 to-accent/5">
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            رسائل يومية
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            الرسائل النفسية
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            رسائل قصيرة وملهمة يومياً لدعمك في رحلة النمو الشخصي
          </p>
        </div>

        {/* Messages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-bl-full" />
              <MessageSquare className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-foreground text-lg leading-relaxed mb-4">
                "{message.content}"
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground">
                  {message.category}
                </span>
                <button className="text-primary hover:text-accent transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe Card */}
        <div className="bg-gradient-to-l from-primary to-accent rounded-3xl p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <Mail className="w-12 h-12 text-primary-foreground mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              احصل على الرسائل يومياً
            </h3>
            <p className="text-primary-foreground/80 mb-8">
              اشترك للحصول على رسالة ملهمة يومياً عبر البريد الإلكتروني أو واتساب
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="البريد الإلكتروني أو رقم الواتساب"
                className="flex-1 px-4 py-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
              />
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Send className="w-4 h-4 ml-2" />
                اشترك
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
