import { skills } from '@/store/useStore';

const skillIcons: Record<string, string> = {
  javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  react: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  nextjs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  tailwind: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  html5: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  css3: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  nodejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  express: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original-wordmark.svg',
  python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  redux: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
  zod: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiByeD0iMTAiIGZpbGw9IiMzRTdDRkYiLz4KPHBhdGggZD0iTTUwIDYwSDEzMEwxMzAgODBMNzAgMTQwSDE1MEwxNTAgMTYwSDcwTDcwIDE0MEwxMzAgODBINTBMNTAgNjBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=',
  prisma: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg',
  mysql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  mongodb: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  git: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  github: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  postman: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
  vscode: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  aws: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  vercel: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg',
  render: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/render/render-original.svg',
  eslint: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg',
  markdown: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg',
};

const categories: Record<string, string[]> = {
  'Frontend Core': ['html5', 'css3', 'javascript', 'typescript'],
  'Frameworks & UI': ['react', 'nextjs', 'tailwind', 'redux'],
  'Backend & DB': ['nodejs', 'express', 'python', 'zod', 'mongodb', 'mysql', 'prisma'],
  'DevOps & Tools': ['docker', 'aws', 'vercel', 'render', 'git', 'github', 'eslint', 'postman', 'vscode', 'markdown'],
};

const SkillsSection = () => {
  return (
    <section id="skills" className="py-20">
      <div className="section-container max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-mono font-bold text-foreground">
            <span className="text-primary mr-2">~/</span>skills-tree
          </h2>
        </div>

        <div className="relative border-l-2 border-dashed border-white/10 ml-4 md:ml-10 space-y-12">
          {Object.entries(categories).map(([categoryName, categoryIds]) => {
            const categorySkills = skills.filter(skill => categoryIds.includes(skill.id));
            
            if (categorySkills.length === 0) return null;

            return (
              <div key={categoryName} className="relative pl-8 md:pl-12">
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
                        className={`w-8 h-8 shrink-0 ${
                          ['express', 'github', 'nextjs', 'vercel', 'render', 'eslint'].includes(skill.id) ? 'bg-white rounded p-1' : ''
                        }`}
                      >
                        <img 
                          src={skillIcons[skill.id]} 
                          alt={skill.name} 
                          className="w-full h-full object-contain"
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
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
