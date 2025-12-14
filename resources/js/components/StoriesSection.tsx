import { Button } from "@/components/ui/button";
import { BookOpen, Download, ShoppingCart, Search } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { books } from "@/data/books";

export const StoriesSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // تصفية الكتب لعرض قصص الأطفال فقط
  const stories = books.filter((book) => book.category === "قصص أطفال");

  const filteredStories = stories.filter((story) => {
    const matchesSearch = story.title.includes(searchQuery) || story.description.includes(searchQuery);
    return matchesSearch;
  });

  return (
    <section id="stories" className="section-padding bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-4">
            <BookOpen className="w-4 h-4" />
            قصص الأطفال
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            القصص التعليمية
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            مجموعة من القصص الهادفة والمسلية للأطفال من سلسلة الحياة السعيدة ويوميات وليد
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن قصة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2"
            >
              {/* Story Cover */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                {story.coverImage ? (
                  <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-16 h-16 text-primary/50" />
                )}
              </div>
              <div className="p-6 flex flex-col">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-3 w-fit">
                  {story.category}
                </span>
                <h3 className="text-xl font-bold text-foreground mb-2">{story.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                  {story.description}
                </p>
                
                <Link
                  href={`/book/${story.id}`}
                  className="mb-4"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-primary hover:text-primary/80"
                  >
                    <BookOpen className="w-4 h-4 ml-2" />
                    اقرأ المزيد
                  </Button>
                </Link>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-primary">{story.price}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="hero" size="sm">
                      <ShoppingCart className="w-4 h-4 ml-1" />
                      شراء
                    </Button>
                  </div>
                </div>
                {story.publisher && (
                  <p className="text-xs text-muted-foreground mt-2">{story.publisher}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد قصص تطابق البحث</p>
          </div>
        )}
      </div>
    </section>
  );
};

