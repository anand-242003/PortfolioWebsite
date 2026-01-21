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
  { id: 'react', name: 'React', category: 'frontend', proficiency: 95, connections: ['nextjs', 'typescript', 'tailwind'] },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', proficiency: 90, connections: ['react', 'typescript', 'node'] },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', proficiency: 92, connections: ['react', 'nextjs', 'node'] },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', proficiency: 95, connections: ['react', 'nextjs'] },
  { id: 'node', name: 'Node.js', category: 'backend', proficiency: 88, connections: ['express', 'socketio', 'typescript'] },
  { id: 'express', name: 'Express', category: 'backend', proficiency: 85, connections: ['node', 'socketio', 'prisma'] },
  { id: 'socketio', name: 'Socket.io', category: 'backend', proficiency: 82, connections: ['node', 'express'] },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', proficiency: 85, connections: ['prisma', 'node'] },
  { id: 'prisma', name: 'Prisma', category: 'database', proficiency: 80, connections: ['postgresql', 'node', 'typescript'] },
  { id: 'python', name: 'Python', category: 'ai', proficiency: 78, connections: ['tensorflow', 'gemini'] },
  { id: 'tensorflow', name: 'TensorFlow', category: 'ai', proficiency: 70, connections: ['python', 'gemini'] },
  { id: 'gemini', name: 'Google Gemini', category: 'ai', proficiency: 75, connections: ['python', 'nextjs'] },
  { id: 'docker', name: 'Docker', category: 'tools', proficiency: 75, connections: ['node', 'postgresql'] },
  { id: 'git', name: 'Git', category: 'tools', proficiency: 90, connections: ['docker'] },
];

// Projects Data
export const projects: Project[] = [
  {
    id: 'job-portal',
    title: 'Job Portal',
    description: 'Real-time full-stack job matching platform with WebSocket communication',
    longDescription: 'A comprehensive job portal featuring real-time messaging between employers and candidates, advanced job matching algorithms, and a seamless user experience.',
    technologies: ['React', 'Node.js', 'Express', 'Socket.io', 'PostgreSQL', 'Prisma'],
    metrics: [
      { label: 'Lighthouse Score', value: '99' },
      { label: 'LCP', value: '0.8s' },
      { label: 'Active Users', value: '5K+' },
    ],
    image: 'job-portal',
  },
  {
    id: 'emware-ai',
    title: 'EMWare.Ai',
    description: 'AI-powered travel itinerary generator using Google Gemini',
    longDescription: 'An intelligent travel planning platform that leverages Google Gemini to generate personalized, detailed travel itineraries based on user preferences and natural language input.',
    technologies: ['Next.js', 'React', 'Google Gemini API', 'Tailwind CSS', 'TypeScript'],
    metrics: [
      { label: 'AI Accuracy', value: '94%' },
      { label: 'Avg Response', value: '1.2s' },
      { label: 'Itineraries', value: '10K+' },
    ],
    image: 'emware-ai',
  },
];
