import { Award, BookOpen, GraduationCap, Heart, Users } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-4">
            <Heart className="w-4 h-4" />
            حول الدكتورة
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            د. آسيا خليفة طلال الجري
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            استشاري نفسي وتربوي وكاتبة وباحثة في الوعي الإنساني
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* الصورة والشعار */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-4 border-primary/20 p-2 overflow-hidden shadow-card">
                <img 
                  src="/2a.jpg" 
                  alt="د. آسيا خليفة طلال الجري" 
                  className="w-full h-full rounded-2xl object-cover" 
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card rounded-2xl p-4 shadow-card border-2 border-primary/20">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-accent" />
                  <div>
                    <div className="text-xs text-muted-foreground">ميدالية</div>
                    <div className="text-sm font-bold text-primary">جامعة الإسكندرية</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* المحتوى */}
          <div className="space-y-6">
            <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed">
              <p className="mb-4">
                د. آسيا خليفة طلال الجري هي <strong className="text-primary">استشاري نفسي وتربوي</strong> وكاتبة وباحثة في الوعي الإنساني، حاصلة على <strong className="text-primary">دكتوراه في الفلسفة -(إرشاد نفسي وتربوي)</strong> وماجستير ودبلومات متعددة في علم النفس والإرشاد النفسي التربوي من جامعات مرموقة في القاهرة والكويت والبحرين.
              </p>
              <p className="mb-4">
                تتمتع بخبرة أكاديمية ومهنية واسعة، حيث عملت <strong className="text-primary">أستاذة بكلية التربية – جامعة الكويت</strong>، ورئيسة جمعية علم النفس الكويتية سابقًا، وأسست <strong className="text-primary">مركز الحياة السعيدة للاستشارات النفسية</strong>، بالإضافة إلى عضويتها في جمعيات ومؤسسات أكاديمية وعلمية عربية وعالمية.
              </p>
              <p className="mb-4">
                لها مؤلفات علمية وأكاديمية بارزة في <strong className="text-primary">سيكولوجية الطفل، علم النفس الجنائي ،إرشاد الجناة ،الإرشاد التربوي، والإرشاد المعرفي السلوكي</strong>، إضافة إلى مؤلفات فكرية ونفسية وروائية للأطفال، تهدف جميعها إلى غرس القيم وتنمية الوعي والإبداع لدى الأطفال والبالغين على حد سواء.
              </p>
              <div className="bg-primary/5 border-r-4 border-primary rounded-lg p-6 mt-6">
                <p className="text-foreground italic leading-relaxed">
                  "تؤمن د. آسيا بأن <strong>الكلمة طريق للشفاء</strong> وأن كل إنسان يحمل نورًا ينتظر أن يُستيقظ عند وعيه برسالته الأرضية وفهمه لقوانين الله في الحياة، لتتحقق لديه <strong>التوازن النفسي والسلام الداخلي</strong>."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* الإنجازات والخدمات */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">دكتوراه في التربية</h3>
            <p className="text-sm text-muted-foreground">إرشاد نفسي تربوي من جامعات مرموقة</p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">رئيسة جمعية علم النفس</h3>
            <p className="text-sm text-muted-foreground">جمعية علم النفس الكويتية سابقًا</p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">مؤلفات علمية</h3>
            <p className="text-sm text-muted-foreground">في علم النفس والإرشاد والتربية</p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">مركز الحياة السعيدة</h3>
            <p className="text-sm text-muted-foreground">للاستشارات النفسية</p>
          </div>
        </div>
      </div>
    </section>
  );
};

