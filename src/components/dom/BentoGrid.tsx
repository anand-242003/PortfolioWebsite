import { motion } from 'framer-motion';
import { projects, Project } from '@/store/useStore';
import jobPortalImage from '@/assets/job-portal-hero.jpg';
import emwareAiImage from '@/assets/emware-ai-hero.jpg';

const projectImages: Record<string, string> = {
  'job-portal': jobPortalImage,
  'emware-ai': emwareAiImage,
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const image = projectImages[project.image] || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bento-card group cursor-pointer"
    >
      {/* Project Image */}
      <div className="relative h-56 mb-6 rounded-xl overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 animate-glow-pulse flex items-center justify-center">
              <span className="text-4xl font-display font-bold text-primary">
                {project.title.charAt(0)}
              </span>
            </div>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
        
        {/* Hover overlay */}
        <motion.div 
          className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <span className="text-primary-foreground font-display font-bold text-lg">View Project</span>
        </motion.div>
      </div>

      {/* Project Info */}
      <h3 className="text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
        {project.title}
      </h3>
      
      <p className="text-muted-foreground mb-4 leading-relaxed">
        {project.description}
      </p>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.technologies.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 text-xs font-mono bg-muted rounded-full text-muted-foreground"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 4 && (
          <span className="px-3 py-1 text-xs font-mono bg-muted rounded-full text-muted-foreground">
            +{project.technologies.length - 4}
          </span>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        {project.metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <div className="text-xl font-display font-bold text-primary">
              {metric.value}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const BentoGrid = () => {
  return (
    <section id="projects" className="section-container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <span className="text-primary font-mono text-sm uppercase tracking-widest mb-4 block">
          Featured Work
        </span>
        <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
          Projects
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Building digital experiences that push the boundaries of web technology.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default BentoGrid;
