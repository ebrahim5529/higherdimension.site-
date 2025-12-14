import { Button } from "@/components/ui/button";
import { Play, Clock, Eye, Filter } from "lucide-react";
import { useState } from "react";

const videos = [
  {
    id: 1,
    title: "كيف تتغلب على القلق؟",
    category: "نصائح نفسية",
    duration: "12:30",
    views: "15K",
    thumbnail: null,
  },
  {
    id: 2,
    title: "5 طرق لتحسين مزاجك",
    category: "نصائح نفسية",
    duration: "8:45",
    views: "22K",
    thumbnail: null,
  },
  {
    id: 3,
    title: "فهم الاكتئاب وعلاجه",
    category: "فيديوهات تعليمية",
    duration: "25:00",
    views: "45K",
    thumbnail: null,
  },
  {
    id: 4,
    title: "التعامل مع الضغط النفسي",
    category: "نصائح نفسية",
    duration: "15:20",
    views: "18K",
    thumbnail: null,
  },
  {
    id: 5,
    title: "سيكولوجية العلاقات",
    category: "فيديوهات تعليمية",
    duration: "35:00",
    views: "32K",
    thumbnail: null,
  },
  {
    id: 6,
    title: "بناء الثقة بالنفس",
    category: "نصائح نفسية",
    duration: "10:15",
    views: "28K",
    thumbnail: null,
  },
];

const categories = ["الكل", "نصائح نفسية", "فيديوهات تعليمية"];

export const VideosSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const filteredVideos = videos.filter(
    (video) => selectedCategory === "الكل" || video.category === selectedCategory
  );

  return (
    <section id="videos" className="section-padding">
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm mb-4">
            <Play className="w-4 h-4" />
            مكتبة الفيديوهات
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            الفيديوهات التعليمية
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            مجموعة متنوعة من الفيديوهات القصيرة والطويلة في مجال الصحة النفسية
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-8 justify-center">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-foreground hover:bg-accent/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Video Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
                <button className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-primary-foreground mr-[-4px]" fill="currentColor" />
                </button>
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-foreground/80 rounded text-xs text-background">
                  {video.duration}
                </div>
              </div>
              <div className="p-5">
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full mb-3">
                  {video.category}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                  {video.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {video.views} مشاهدة
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {video.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg">
            عرض جميع الفيديوهات
          </Button>
        </div>
      </div>
    </section>
  );
};
