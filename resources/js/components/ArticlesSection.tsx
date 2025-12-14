import { Button } from "@/components/ui/button";
import { FileText, Search, BookOpen } from "lucide-react";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { articles } from "@/data/articles";

const categories = ["الكل", "تطوير الذات", "صحة نفسية", "تربية", "إرشاد نفسي"];

export const ArticlesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "الكل" || article.category === selectedCategory;
    const matchesSearch = article.title.includes(searchQuery) || 
                         article.excerpt?.includes(searchQuery) ||
                         article.content.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="articles" className="section-padding bg-background">
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-4">
            <FileText className="w-4 h-4" />
            المقالات النفسية
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            مقالات ومواضيع نفسية
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            مجموعة من المقالات المتخصصة في الصحة النفسية والتربية والإرشاد النفسي
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن مقال..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
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
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-3 w-fit">
                  {article.category}
                </span>
                <h3 className="text-xl font-bold text-foreground mb-3">{article.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                  {article.excerpt || article.content.substring(0, 150) + "..."}
                </p>
                
                <Link href={`/article/${article.id}`} className="mt-auto">
                  <Button
                    variant="hero"
                    size="sm"
                    className="w-full"
                  >
                    <BookOpen className="w-4 h-4 ml-2" />
                    اقرأ المزيد
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد مقالات تطابق البحث</p>
          </div>
        )}
      </div>
    </section>
  );
};

