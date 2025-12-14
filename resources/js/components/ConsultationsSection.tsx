import { Button } from "@/components/ui/button";
import { Calendar, User, Phone, Mail, Clock, MessageCircle, CreditCard } from "lucide-react";
import { useState } from "react";

const consultationTypes = [
  { value: "individual", label: "استشارة فردية", price: "0 د.ك" },
  { value: "couple", label: "استشارة زوجية", price: "0 د.ك" },
  { value: "family", label: "استشارة عائلية", price: "0 د.ك" },
];

export const ConsultationsSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "individual",
    date: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <section id="consultations" className="section-padding">
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-4">
            <Calendar className="w-4 h-4" />
            احجز استشارتك
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            الاستشارات النفسية
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            احجز استشارتك الآن واحصل على الدعم النفسي المتخصص
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Consultation Types */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground mb-6">أنواع الاستشارات</h3>
            
            {consultationTypes.map((type) => (
              <div
                key={type.value}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.type === type.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setFormData({ ...formData, type: type.value })}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-foreground">{type.label}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      جلسة مدتها 45 دقيقة
                    </p>
                  </div>
                  <div className="text-xl font-bold text-primary">{type.price}</div>
                </div>
              </div>
            ))}

            {/* WhatsApp Direct */}
            <div className="bg-gradient-to-l from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">استشارة مباشرة عبر واتساب</h4>
                  <p className="text-white/80 text-sm">للتواصل السريع والمباشر</p>
                </div>
                <Button className="bg-white text-green-600 hover:bg-white/90">
                  تواصل الآن
                </Button>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-card rounded-3xl p-8 shadow-card">
            <h3 className="text-xl font-bold text-foreground mb-6">نموذج الحجز</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <User className="w-4 h-4 inline ml-2" />
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="أدخل اسمك"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Mail className="w-4 h-4 inline ml-2" />
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="البريد الإلكتروني"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Phone className="w-4 h-4 inline ml-2" />
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="رقم الهاتف"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Clock className="w-4 h-4 inline ml-2" />
                  الموعد المفضل
                </label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MessageCircle className="w-4 h-4 inline ml-2" />
                  ملاحظات إضافية
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="أي معلومات إضافية تود مشاركتها..."
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full">
                <CreditCard className="w-5 h-5 ml-2" />
                احجز الآن وادفع
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
