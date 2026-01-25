import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      label: 'GitHub', 
      href: 'https://github.com/anand-242003', 
      icon: FaGithub,
      color: 'hover:text-[#333] dark:hover:text-white'
    },
    { 
      label: 'LinkedIn', 
      href: 'https://www.linkedin.com/in/anand-mishra-a3a306225/', 
      icon: FaLinkedin,
      color: 'hover:text-[#0077b5]'
    },
    { 
      label: 'LeetCode', 
      href: 'https://leetcode.com/u/Sir_anand/', 
      icon: SiLeetcode,
      color: 'hover:text-[#FFA116]'
    },
    { 
      label: 'Email', 
      href: 'mailto:anandmishra3001@gmail.com', 
      icon: FaEnvelope,
      color: 'hover:text-[#EA4335]'
    },
  ];

  return (
    <footer role="contentinfo" className="relative py-12 px-6 border-t border-border" aria-label="Site footer">
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

          <div className="flex items-center gap-6">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-muted-foreground transition-colors ${link.color}`}
                  aria-label={link.label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Available for work
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-mono">
              © {currentYear} Anand Mishra
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
