import { skills } from '@/store/useStore';
import { memo, useEffect, useRef } from 'react';

const skillIcons: Record<string, string> = {
  javascript: '/js.png',
  react: '/react.png',
  nextjs: '/nextjs.png',
  typescript: '/typescript.png',
  tailwind: '/icons8-tailwind-css-48.png',
  html5: '/html-5.png',
  css3: '/css-3.png',
  nodejs: '/icons8-nodejs-48.png',
  express: '/icons8-express-js-48.png',
  python: '/icons8-python-48.png',
  redux: '/icons8-redux-48.png',
  zod: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiByeD0iMTAiIGZpbGw9IiMzRTdDRkYiLz4KPHBhdGggZD0iTTUwIDYwSDEzMEwxMzAgODBMNzAgMTQwSDE1MEwxNTAgMTYwSDcwTDcwIDE0MEwxMzAgODBINTBMNTAgNjBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=',
  prisma: '/icons8-prisma-orm-48.png',
  mysql: '/icons8-mysql-24.png',
  mongodb: '/icons8-mongodb-24.png',
  docker: '/icons8-docker-48.png',
  git: '/icons8-git-48.png',
  github: '/icons8-github-50.png',
  postman: '/icons8-postman-inc-24.png',
  vscode: '/icons8-visual-studio-48.png',
  aws: '/icons8-aws-48.png',
  vercel: '/icons8-vercel-50.png',
  render: '/render.png',
  eslint: '/icons8-eslint-48.png',
  markdown: '/icons8-markdown-50.png',
};

const categories: Record<string, string[]> = {
  'Frontend Core': ['html5', 'css3', 'javascript', 'typescript'],
  'Frameworks & UI': ['react', 'nextjs', 'tailwind', 'redux'],
  'Backend & DB': ['nodejs', 'express', 'python', 'zod', 'mongodb', 'mysql', 'prisma'],
  'DevOps & Tools': ['docker', 'aws', 'vercel', 'render', 'git', 'github', 'eslint', 'postman', 'vscode', 'markdown'],
};

// Skill category with scroll animation
const SkillCategory = memo(({ categoryName, categorySkills, index }: { 
  categoryName: string; 
  categorySkills: typeof skills; 
  index: number 
}) => {
  const categoryRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = categoryRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('in-view');
        } else if (entry.boundingClientRect.top > 0) {
          element.classList.remove('in-view');
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);
  
  return (
    <div 
      ref={categoryRef} 
      className="relative pl-8 md:pl-12 scroll-animate slide-up"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="absolute top-6 left-0 w-8 md:w-12 h-px bg-white/10 border-t-2 border-dashed border-white/10" />
      <div className="absolute -left-[9px] top-4 w-5 h-5 rounded-full border-4 border-background bg-primary" />

      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
        {categoryName}
        <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
          {categorySkills.length} items
        </span>
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categorySkills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-colors"
          >
            <div
              className={`w-8 h-8 shrink-0 flex items-center justify-center ${
                ['express', 'github', 'nextjs', 'vercel', 'eslint'].includes(skill.id) ? 'bg-white rounded p-1' : ''
              }`}
            >
              <img 
                src={skillIcons[skill.id]} 
                alt={skill.name} 
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
                width="32"
                height="32"
              />
            </div>
            
            <span className="text-sm font-medium text-muted-foreground">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

const SkillsSection = memo(() => {
  const headerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('in-view');
        } else if (entry.boundingClientRect.top > 0) {
          element.classList.remove('in-view');
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);
  
  return (
    <section id="skills" className="py-20" aria-label="Technical Skills">
      <div className="section-container max-w-5xl mx-auto">
        <header ref={headerRef} className="mb-12 scroll-animate slide-up">
          <h2 className="text-3xl font-mono font-bold text-foreground">
            <span className="text-primary mr-2" aria-hidden="true">~/</span>
            <span>Technical Skills & Expertise</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Comprehensive tech stack spanning frontend, backend, databases, and DevOps. 
            Proficient in modern JavaScript ecosystem with hands-on experience in AI/ML integration.
          </p>
        </header>

        <div className="relative border-l-2 border-dashed border-white/10 ml-4 md:ml-10 space-y-12" role="list">
          {Object.entries(categories).map(([categoryName, categoryIds], index) => {
            const categorySkills = skills.filter(skill => categoryIds.includes(skill.id));
            
            if (categorySkills.length === 0) return null;

            return (
              <SkillCategory 
                key={categoryName} 
                categoryName={categoryName} 
                categorySkills={categorySkills} 
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default SkillsSection;
