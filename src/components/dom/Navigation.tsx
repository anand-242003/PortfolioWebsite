import { useState, useEffect, memo } from 'react';

const Navigation = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
    { label: 'Resume', href: '/Resume-Anand Mishra (7).pdf', external: true },
  ];

  const scrollToSection = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, '_blank');
      return;
    }
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'py-4 bg-background/80 backdrop-blur-xl border-b border-border/50' 
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="font-display font-bold text-2xl text-foreground hover:text-primary transition-colors"
          >
            AM<span className="text-primary">.</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href, link.external)}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium link-underline"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('#contact')}
              className="px-6 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Let's Talk
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span 
                className={`w-full h-0.5 bg-current origin-left transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-[2px]' : ''}`}
              />
              <span 
                className={`w-full h-0.5 bg-current transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}
              />
              <span 
                className={`w-full h-0.5 bg-current origin-left transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-[2px]' : ''}`}
              />
            </div>
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-background flex flex-col items-center justify-center gap-8 animate-fade-in"
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href, link.external)}
              className="text-3xl font-display font-bold text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
});

export default Navigation;
