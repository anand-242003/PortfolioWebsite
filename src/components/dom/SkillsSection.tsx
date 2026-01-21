import { motion } from 'framer-motion';
import { skills } from '@/store/useStore';

const SkillsSection = () => {
  const categories = [
    { id: 'frontend', label: 'Frontend', color: 'bg-primary' },
    { id: 'backend', label: 'Backend', color: 'bg-accent' },
    { id: 'ai', label: 'AI / ML', color: 'bg-red-500' },
    { id: 'database', label: 'Database', color: 'bg-teal-500' },
    { id: 'tools', label: 'Tools', color: 'bg-purple-500' },
  ];

  return (
    <section id="skills" className="section-container relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <span className="text-primary font-mono text-sm uppercase tracking-widest mb-4 block">
          Technical Expertise
        </span>
        <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
          Skills & Tools
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mb-16">
          A comprehensive toolkit for building modern, scalable web applications 
          and AI-powered experiences.
        </p>

        {/* Category Legend */}
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${cat.color}`} />
              <span className="text-sm text-muted-foreground">{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill, index) => {
            const category = categories.find((c) => c.id === skill.category);
            
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="bento-card flex flex-col items-center text-center p-6"
              >
                {/* Skill Icon/Letter */}
                <div className={`w-12 h-12 rounded-xl ${category?.color || 'bg-primary'} bg-opacity-20 flex items-center justify-center mb-4`}>
                  <span className="text-xl font-display font-bold text-foreground">
                    {skill.name.charAt(0)}
                  </span>
                </div>

                {/* Skill Name */}
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {skill.name}
                </h3>

                {/* Proficiency Bar */}
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
                    className={`h-full ${category?.color || 'bg-primary'} rounded-full`}
                  />
                </div>

                {/* Proficiency Percentage */}
                <span className="text-xs text-muted-foreground mt-2 font-mono">
                  {skill.proficiency}%
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default SkillsSection;
