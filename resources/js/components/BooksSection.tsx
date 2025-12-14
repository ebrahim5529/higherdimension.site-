import { Button } from "@/components/ui/button";
import { Book, Download, ShoppingCart, Search, BookOpen } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { books } from "@/data/books";

const categories = ["الكل", "علم نفس", "تطوير الذات", "توجيه نفسي", "إرشاد نفسي", "قصص أطفال"];

export const BooksSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = books.filter((book) => {
    const matchesCategory = selectedCategory === "الكل" || book.category === selectedCategory;
    const matchesSearch = book.title.includes(searchQuery) || book.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="books" className="section-padding bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-4">
            <Book className="w-4 h-4" />
            مكتبة الكتب
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            الكتب النفسية
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            مجموعة من الكتب المتخصصة في الصحة النفسية وتطوير الذات
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن كتاب..."
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

        {/* Books Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2"
            >
              {/* Book Cover */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <Book className="w-16 h-16 text-primary/50" />
                )}
              </div>
              <div className="p-6 flex flex-col">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-3 w-fit">
                  {book.category}
                </span>
                <h3 className="text-xl font-bold text-foreground mb-2">{book.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                  {book.description}
                </p>
                
                <Link
                  href={`/book/${book.id}`}
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
                  <span className="text-lg font-bold text-primary">{book.price}</span>
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
                {book.publisher && (
                  <p className="text-xs text-muted-foreground mt-2">{book.publisher}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
