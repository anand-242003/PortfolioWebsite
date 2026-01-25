import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [emailValid, setEmailValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  const validateEmail = (value: string) => {
    setEmailValid(emailRegExp.test(value));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    validateEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailValid) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

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
      setEmailValid(true);
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
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-mono text-sm uppercase tracking-widest mb-4 block">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Contact Me
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-lg p-8 shadow-2xl border border-border/50"
          >
            {/* Error Message */}
            <div className="h-8 mb-4">
              {!emailValid && formData.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm text-center bg-destructive/10 py-2 px-4 rounded"
                >
                  Oh, please enter a valid email address.
                </motion.p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <fieldset className="border-b border-border pb-6 mb-6">
                <legend className="text-xl font-display font-bold text-foreground mb-6">
                  Send me a message
                </legend>

                {/* Name Field */}
                <div className="mb-5">
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 text-base bg-background border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Your name"
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="mb-5">
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    className={`w-full px-4 py-3 text-base bg-background border rounded text-foreground placeholder:text-muted-foreground focus:outline-none transition-all ${
                      !emailValid && formData.email
                        ? 'border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive'
                        : 'border-border focus:border-primary focus:ring-1 focus:ring-primary'
                    }`}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Message Field */}
                <div className="mb-5 relative">
                  <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    maxLength={500}
                    className="w-full px-4 py-3 text-base bg-background border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                    placeholder="Tell me about your project..."
                    required
                  />
                  <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                    {formData.message.length} / 500
                  </span>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !emailValid}
                    className="px-8 py-3 text-base bg-primary text-primary-foreground rounded font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[0.98] active:scale-95"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </fieldset>
            </form>
          </motion.div>

          {/* Debug Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-black/80 rounded-lg p-8 shadow-2xl border border-primary/20"
          >
            <h3 className="text-lg font-display font-bold text-primary mb-4">Form Data Preview</h3>
            <pre className="text-primary/80 text-sm font-mono leading-relaxed overflow-auto">
              <code>{JSON.stringify({
                name: formData.name,
                email: formData.email,
                emailValid: emailValid,
                message: formData.message,
                messageLength: formData.message.length,
                isSubmitting: isSubmitting
              }, null, 2)}</code>
            </pre>
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex justify-center gap-6"
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
                className={`w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:border-primary transition-all ${link.color}`}
                aria-label={link.label}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
