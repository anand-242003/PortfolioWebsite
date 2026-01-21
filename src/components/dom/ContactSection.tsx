import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import MagneticButton from '@/components/ui/MagneticButton';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // EmailJS configuration from environment variables
      // Create a .env file based on .env.example and add your EmailJS credentials
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

      // Check if credentials are configured
      if (serviceId === 'YOUR_SERVICE_ID' || !serviceId) {
        toast.error('Email service not configured. Please contact me at anandmishra3001@gmail.com');
        setIsSubmitting(false);
        return;
      }

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: 'anandmishra3001@gmail.com',
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      toast.success('Message sent successfully! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Email send error:', error);
      toast.error('Failed to send message. Please try again or email me directly at anandmishra3001@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <section id="contact" className="section-container relative">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm uppercase tracking-widest mb-4 block">
            Get In Touch
          </span>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            Let's Build Something<br />
            <span className="text-primary text-glow">Amazing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Looking for a collaborator? Or just want to say hello? 
            I'd love to hear from you.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bento-card p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div className="mb-8">
            <label 
              htmlFor="message" 
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              placeholder="Tell me about your project..."
              required
            />
          </div>

          <div className="flex justify-center">
            <MagneticButton variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </MagneticButton>
          </div>
        </motion.form>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex justify-center gap-6"
        >
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:border-primary transition-all ${link.color}`}
                aria-label={link.label}
              >
                <Icon className="w-6 h-6" />
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
