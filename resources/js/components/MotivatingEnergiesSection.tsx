import { Button } from "@/components/ui/button";
import { Zap, Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { motivatingEnergies } from "@/data/motivatingEnergies";

const categories = ["الكل", "تحفيز", "صحة نفسية", "إيمان", "سلام داخلي", "تربية"];

export const MotivatingEnergiesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const filteredEnergies = motivatingEnergies.filter((energy) => {
    return selectedCategory === "الكل" || energy.category === selectedCategory;
  });

  return (
    <section id="motivating-energies" className="section-padding bg-gradient-to-b from-primary/5 to-accent/5">
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-4">
            <Zap className="w-4 h-4" />
            بطاقات تحفيزية
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            بطاقات تحفيزية
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            رسائل ملهمة وقصيرة لتجديد طاقتك الداخلية وتقوية روحك
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-primary/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Energies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredEnergies.map((energy, index) => (
            <div
              key={energy.id}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-bl-full" />
              {energy.cardNumber && (
                <div className="absolute top-4 left-4 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">{energy.cardNumber}</span>
                </div>
              )}
              <Sparkles className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-foreground text-lg leading-relaxed mb-4 whitespace-pre-line">
                {energy.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground">
                  {energy.category}
                </span>
                <button className="text-primary hover:text-accent transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEnergies.length === 0 && (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد بطاقات تحفيزية في هذا التصنيف</p>
          </div>
        )}
      </div>
    </section>
  );
};

