import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";

const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "من نحن", path: "/about" },
  { label: "الاستشارات", path: "/consultations" },
  { label: "الكتب", path: "/books" },
  { label: "مقتطفات", path: "/messages" },
  { label: "بطاقات تحفيزية", path: "/motivating-energies" },
  { label: "المقالات", path: "/articles" },
  { label: "فيديوهات", path: "/videos" },
  { label: "قصص", path: "/stories" },
  { label: "تواصل معنا", path: "/#contact" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { url } = usePage();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="شعار د. آسيا   الجري" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-foreground">د. آسيا   الجري</h1>
              <p className="text-xs text-muted-foreground">  استشاري نفسي وتربوي</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "text-sm font-medium transition-colors",
                  url === link.path
                    ? "text-primary"
                    : "text-foreground/80 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="hero" size="default">
              تواصل عبر واتساب
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-96 pb-6" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "transition-colors py-2",
                  url === link.path
                    ? "text-primary font-semibold"
                    : "text-foreground/80 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="hero" className="mt-4">
              تواصل عبر واتساب
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
