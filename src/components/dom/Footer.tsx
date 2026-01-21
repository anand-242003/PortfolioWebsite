import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.a
            href="#"
            className="font-display font-bold text-2xl text-foreground hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            AM<span className="text-primary">.</span>
          </motion.a>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm font-mono">
            © {currentYear} Anand Mishra. Built with passion & code.
          </p>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Available for work
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
