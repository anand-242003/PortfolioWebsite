import { motion } from 'framer-motion';
import { projects } from '@/store/useStore';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const BentoGrid = () => {
  return (
    <section id="projects" className="section-container py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <span className="text-primary font-mono text-sm uppercase tracking-widest mb-4 block">
          Featured Work
        </span>
        <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
          Projects
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Building digital experiences that push the boundaries of web technology.
        </p>
      </motion.div>

      <div className="timeline max-w-5xl mx-auto">
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="timeline-item"
          >
            <div className="timeline__content">
              <h1 className="text-3xl font-display font-bold text-primary mb-4">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-mono bg-primary/10 border border-primary/20 rounded-full text-primary"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 5 && (
                  <span className="px-3 py-1 text-xs font-mono bg-primary/10 border border-primary/20 rounded-full text-primary">
                    +{project.technologies.length - 5}
                  </span>
                )}
              </div>

              <hr className="border-border opacity-30 mb-4" />
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                {project.longDescription}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="text-center">
                    <div className="text-lg font-display font-bold text-primary">
                      {metric.value}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <FaExternalLinkAlt className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
                  >
                    <FaGithub className="w-4 h-4" />
                    View Code
                  </a>
                )}
              </div>
            </div>

            <div className="timeline__image">
              <img 
                src={`/${project.image === 'drk-mttr' ? 'DRLMTTR.png' : project.image === 'job-portal' ? 'JOB_portal.png' : 'Emware.ai.png'}`}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default BentoGrid;
