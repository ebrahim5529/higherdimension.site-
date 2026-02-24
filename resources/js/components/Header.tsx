import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";

const WHATSAPP_URL = "https://wa.me/96893099914";

const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "من نحن", path: "/#about" },
  { label: "خدماتنا", path: "/#services" },
  { label: "لماذا البعد العالي؟", path: "/#advantages" },
  { label: "تواصل معنا", path: "/#contact" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { url, props } = usePage<{ auth?: { user?: unknown } }>();

  const isAuthenticated = Boolean(props.auth?.user);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center overflow-hidden border border-primary/20">
              <img src="/img/logo.png" alt="شعار شركة البعد العالي للتجارة" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-foreground">شركة البعد العالي للتجارة</h1>
              <p className="text-xs text-muted-foreground">تأجير الجيكات والسقالات</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "text-sm font-medium transition-colors",
                  url === link.path ? "text-primary" : "text-foreground/80 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                لوحة التحكم
              </Link>
            )}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="hero" size="default" asChild>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600">
                تواصل عبر واتساب
              </a>
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
                  url === link.path ? "text-primary font-semibold" : "text-foreground/80 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="py-2 text-foreground/80 hover:text-primary transition-colors"
              >
                لوحة التحكم
              </Link>
            )}
            <Button variant="hero" className="mt-4 w-full sm:w-auto" asChild>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600">
                تواصل عبر واتساب
              </a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
