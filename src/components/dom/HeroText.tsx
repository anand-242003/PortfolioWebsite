import { motion } from 'framer-motion';

const HeroText = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center px-6 max-w-6xl pointer-events-auto">
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground uppercase tracking-[0.3em]">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Full Stack Developer & AI Engineer
          </span>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-bold text-foreground leading-none tracking-tight">
            Anand Mishra
          </h1>
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Crafting <span className="text-primary">living digital experiences</span> through code, creativity, and cutting-edge AI technology.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            View Projects
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
          >
            Get In Touch
          </button>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroText;
