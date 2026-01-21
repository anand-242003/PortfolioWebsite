import { create } from 'zustand';

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'ai' | 'database' | 'tools';
  proficiency: number;
  connections: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  image: string;
  link?: string;
  github?: string;
}

interface PortfolioStore {
  selectedSkill: Skill | null;
  activeProject: Project | null;
  cursorPosition: { x: number; y: number };
  isLoading: boolean;
  scrollProgress: number;
  
  setSelectedSkill: (skill: Skill | null) => void;
  setActiveProject: (project: Project | null) => void;
  updateCursorPosition: (x: number, y: number) => void;
  setIsLoading: (loading: boolean) => void;
  setScrollProgress: (progress: number) => void;
}

export const useStore = create<PortfolioStore>((set) => ({
  selectedSkill: null,
  activeProject: null,
  cursorPosition: { x: 0, y: 0 },
  isLoading: true,
  scrollProgress: 0,
  
  setSelectedSkill: (skill) => set({ selectedSkill: skill }),
  setActiveProject: (project) => set({ activeProject: project }),
  updateCursorPosition: (x, y) => set({ cursorPosition: { x, y } }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}));

// Skills Data
export const skills: Skill[] = [
  { id: 'javascript', name: 'JavaScript', category: 'frontend', proficiency: 95, connections: ['react', 'nodejs', 'typescript'] },
  { id: 'react', name: 'React', category: 'frontend', proficiency: 95, connections: ['nextjs', 'typescript', 'tailwind', 'redux'] },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', proficiency: 90, connections: ['react', 'typescript', 'nodejs'] },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', proficiency: 88, connections: ['react', 'nextjs', 'nodejs'] },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', proficiency: 95, connections: ['react', 'nextjs'] },
  { id: 'html5', name: 'HTML5', category: 'frontend', proficiency: 98, connections: ['css3', 'javascript'] },
  { id: 'css3', name: 'CSS3', category: 'frontend', proficiency: 95, connections: ['html5', 'tailwind'] },
  { id: 'nodejs', name: 'Node.js', category: 'backend', proficiency: 90, connections: ['express', 'prisma', 'typescript'] },
  { id: 'express', name: 'Express', category: 'backend', proficiency: 88, connections: ['nodejs', 'prisma'] },
  { id: 'redux', name: 'Redux', category: 'backend', proficiency: 85, connections: ['react', 'typescript'] },
  { id: 'prisma', name: 'Prisma', category: 'database', proficiency: 85, connections: ['nodejs', 'mysql', 'typescript'] },
  { id: 'mysql', name: 'MySQL', category: 'database', proficiency: 82, connections: ['prisma', 'nodejs'] },
  { id: 'docker', name: 'Docker', category: 'tools', proficiency: 75, connections: ['nodejs', 'mysql'] },
  { id: 'git', name: 'Git', category: 'tools', proficiency: 92, connections: ['docker', 'vscode'] },
  { id: 'postman', name: 'Postman', category: 'tools', proficiency: 88, connections: ['nodejs', 'express'] },
  { id: 'vscode', name: 'VS Code', category: 'tools', proficiency: 95, connections: ['git'] },
];

// Projects Data
export const projects: Project[] = [
  {
    id: 'drk-mttr',
    title: 'DRK/MTTR Platform',
    description: 'Full-stack MERN platform with advanced authentication and state management',
    longDescription: 'A comprehensive platform built with MERN stack featuring JWT authentication, Redux Toolkit for state management, and modern UI with Tailwind CSS.',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'Prisma', 'JWT', 'Redux Toolkit', 'Tailwind CSS'],
    metrics: [
      { label: 'Tech Stack', value: 'MERN' },
      { label: 'Auth', value: 'JWT' },
      { label: 'State Mgmt', value: 'Redux' },
    ],
    image: 'drk-mttr',
    github: 'https://github.com/anand-242003/nanoreach-platform',
  },
  {
    id: 'job-portal',
    title: 'Job Portal',
    description: 'Real-time job matching platform with WebSocket communication',
    longDescription: 'A comprehensive job portal featuring real-time messaging between employers and candidates, advanced job matching algorithms, and seamless user experience built with Next.js and Socket.io.',
    technologies: ['Next.js', 'Node.js', 'Prisma', 'Socket.io', 'MongoDB', 'Tailwind CSS'],
    metrics: [
      { label: 'Real-time', value: 'Socket.io' },
      { label: 'Database', value: 'MongoDB' },
      { label: 'Framework', value: 'Next.js' },
    ],
    image: 'job-portal',
    link: 'https://jobportal-frontend-navy-xi.vercel.app/',
  },
  {
    id: 'emware-ai',
    title: 'EMWare.AI',
    description: 'AI-powered travel itinerary generator using Google Gemini',
    longDescription: 'An intelligent travel planning platform that leverages Google Gemini AI and Google Places API to generate personalized travel itineraries with smooth animations powered by GSAP.',
    technologies: ['React.js', 'Google Gemini AI', 'Google Places API', 'GSAP', 'Tailwind CSS'],
    metrics: [
      { label: 'AI Engine', value: 'Gemini' },
      { label: 'Animation', value: 'GSAP' },
      { label: 'API', value: 'Places' },
    ],
    image: 'emware-ai',
    link: 'https://em-ware-ai-ia16.vercel.app/',
  },
  {
    id: 'portfolio-html',
    title: 'Personal Portfolio',
    description: 'Clean and responsive portfolio website built with HTML & CSS',
    longDescription: 'A minimalist portfolio website showcasing projects and skills, built from scratch using pure HTML and CSS with responsive design principles.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    metrics: [
      { label: 'Pure Code', value: 'HTML/CSS' },
      { label: 'Design', value: 'Responsive' },
      { label: 'Performance', value: '100' },
    ],
    image: 'portfolio-html',
    github: 'https://github.com/anand-242003/Portfolio',
  },
];
