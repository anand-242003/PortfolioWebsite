import { memo } from 'react';

const HeroText = memo(() => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <article className="text-center px-6 max-w-6xl pointer-events-auto animate-fade-in" itemScope itemType="https://schema.org/Person">
        {/* Role/Title with semantic markup */}
        <div className="mb-8">
          <p className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground uppercase tracking-[0.3em]" itemProp="jobTitle">
            <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
            Full Stack Developer & AI Engineer
          </p>
        </div>

        {/* Primary H1 - only one per page for SEO */}
        <div className="mb-8">
          <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-bold text-foreground leading-none tracking-tight" itemProp="name">
            Anand Mishra
          </h1>
        </div>

        {/* SEO-rich description */}
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed" itemProp="description">
          Crafting <span className="text-primary">living digital experiences</span> through code, creativity, and cutting-edge AI technology. Specializing in <strong>React</strong>, <strong>Next.js</strong>, <strong>Node.js</strong>, and <strong>AI-powered applications</strong>.
        </p>
        
        {/* Hidden SEO content for crawlers */}
        <meta itemProp="url" content="https://anandmishra.dev" />
        <meta itemProp="email" content="anandmishra3001@gmail.com" />

        {/* Call-to-action buttons with proper accessibility */}
        <nav className="flex flex-col sm:flex-row gap-4 justify-center items-center" aria-label="Quick navigation">
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            aria-label="View my projects and portfolio work"
          >
            View Projects
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
            aria-label="Contact Anand Mishra for collaboration"
          >
            Get In Touch
          </button>
        </nav>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2" aria-hidden="true">
          <div className="flex flex-col items-center gap-2 text-muted-foreground animate-bounce-slow">
            <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
        </div>
      </article>
    </div>
  );
});

export default HeroText;
