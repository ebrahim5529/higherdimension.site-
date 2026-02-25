import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "./RevealOnScroll";

const WHATSAPP_URL = "https://wa.me/96893099914";
const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=23.535345,58.191704&hl=ar&z=15&output=embed";

export function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-background">
      <div className="section-container">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-4">
              <MapPin className="w-4 h-4" />
              تواصل معنا
            </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            نحن هنا لمساعدتك
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            تواصل معنا للحصول على أفضل عروض التأجير
          </p>
          </div>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
          <RevealOnScroll className="space-y-8" delay="sm">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6">
                معلومات الاتصال
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">الهاتف الأول</p>
                    <a
                      href="tel:+96893099914"
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                      dir="ltr"
                    >
                      +968 9309 9914
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">الهاتف الثاني</p>
                    <a
                      href="tel:+96890891070"
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                      dir="ltr"
                    >
                      +968 9089 1070
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <a
                      href="mailto:higherdimension30@gmail.com"
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      higherdimension30@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">الموقع</p>
                    <p className="text-foreground">الموالح الجنوبية، محافظة مسقط</p>
                  </div>
                </li>
              </ul>
            </div>

            <Button asChild size="lg" className="w-full sm:w-auto bg-green-500 hover:bg-green-600">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                تواصل عبر واتساب
              </a>
            </Button>
          </RevealOnScroll>

          <RevealOnScroll delay="md" className="rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg h-[350px] min-h-[300px]">
            <iframe
              src={MAP_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع شركة البعد العالي للتجارة - الموالح الجنوبية"
              className="w-full h-full min-h-[300px]"
            />
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
