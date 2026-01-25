import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

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
  cameraTarget: [number, number, number];
  neuralNetworkActive: boolean;
  
  setSelectedSkill: (skill: Skill | null) => void;
  setActiveProject: (project: Project | null) => void;
  updateCursorPosition: (x: number, y: number) => void;
  setIsLoading: (loading: boolean) => void;
  setScrollProgress: (progress: number) => void;
  setCameraTarget: (target: [number, number, number]) => void;
  setNeuralNetworkActive: (active: boolean) => void;
}

export const useStore = create<PortfolioStore>((set, get) => ({
  selectedSkill: null,
  activeProject: null,
  cursorPosition: { x: 0, y: 0 },
  isLoading: true,
  scrollProgress: 0,
  cameraTarget: [0, 0, 5],
  neuralNetworkActive: true,
  
  setSelectedSkill: (skill) => set({ selectedSkill: skill }),
  setActiveProject: (project) => set({ activeProject: project }),
  updateCursorPosition: (x, y) => set({ cursorPosition: { x, y } }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setNeuralNetworkActive: (active) => set({ neuralNetworkActive: active }),
}));

export { shallow };

export const useCameraState = () =>
  useStore(
    (state) => ({
      target: state.cameraTarget,
      scrollProgress: state.scrollProgress,
    }),
    shallow
  );

export const useUIState = () =>
  useStore(
    (state) => ({
      isLoading: state.isLoading,
      neuralNetworkActive: state.neuralNetworkActive,
    }),
    shallow
  );

export const useInteractionState = () =>
  useStore(
    (state) => ({
      selectedSkill: state.selectedSkill,
      activeProject: state.activeProject,
      cursorPosition: state.cursorPosition,
    }),
    shallow
  );

export const getFilteredProjects = (technology?: string): Project[] => {
  if (!technology) return projects;
  return projects.filter((project) =>
    project.technologies.some((tech) =>
      tech.toLowerCase().includes(technology.toLowerCase())
    )
  );
};

export const useProjectsBySkill = () => {
  const selectedSkill = useStore((state) => state.selectedSkill);
  
  if (!selectedSkill) return projects;
  
  return projects.filter((project) =>
    project.technologies.some((tech) =>
      tech.toLowerCase().includes(selectedSkill.name.toLowerCase())
    )
  );
};

export const getSkillById = (skillId: string): Skill | undefined => {
  return skills.find((skill) => skill.id === skillId);
};

export const getConnectedSkills = (skillId: string): Skill[] => {
  const skill = getSkillById(skillId);
  if (!skill) return [];
  
  return skill.connections
    .map((connectionId) => getSkillById(connectionId))
    .filter((s): s is Skill => s !== undefined);
};

export const skills: Skill[] = [
  { id: 'javascript', name: 'JavaScript', category: 'frontend', proficiency: 95, connections: ['react', 'nodejs', 'typescript'] },
  { id: 'react', name: 'React', category: 'frontend', proficiency: 95, connections: ['nextjs', 'typescript', 'tailwind', 'redux'] },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', proficiency: 90, connections: ['react', 'typescript', 'nodejs'] },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', proficiency: 88, connections: ['react', 'nextjs', 'nodejs'] },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', proficiency: 95, connections: ['react', 'nextjs'] },
  { id: 'html5', name: 'HTML5', category: 'frontend', proficiency: 98, connections: ['css3', 'javascript'] },
  { id: 'css3', name: 'CSS3', category: 'frontend', proficiency: 95, connections: ['html5', 'tailwind'] },
  { id: 'nodejs', name: 'Node.js', category: 'backend', proficiency: 90, connections: ['express', 'prisma', 'typescript', 'mongodb'] },
  { id: 'express', name: 'Express', category: 'backend', proficiency: 88, connections: ['nodejs', 'prisma', 'mongodb'] },
  { id: 'python', name: 'Python', category: 'backend', proficiency: 85, connections: ['nodejs', 'aws'] },
  { id: 'redux', name: 'Redux', category: 'backend', proficiency: 85, connections: ['react', 'typescript'] },
  { id: 'zod', name: 'Zod', category: 'backend', proficiency: 82, connections: ['typescript', 'nodejs'] },
  { id: 'prisma', name: 'Prisma', category: 'database', proficiency: 85, connections: ['nodejs', 'mysql', 'typescript', 'mongodb'] },
  { id: 'mysql', name: 'MySQL', category: 'database', proficiency: 82, connections: ['prisma', 'nodejs'] },
  { id: 'mongodb', name: 'MongoDB', category: 'database', proficiency: 88, connections: ['nodejs', 'express', 'prisma'] },
  { id: 'docker', name: 'Docker', category: 'tools', proficiency: 75, connections: ['nodejs', 'mysql', 'aws'] },
  { id: 'git', name: 'Git', category: 'tools', proficiency: 92, connections: ['github', 'vscode'] },
  { id: 'github', name: 'GitHub', category: 'tools', proficiency: 90, connections: ['git', 'vscode'] },
  { id: 'postman', name: 'Postman', category: 'tools', proficiency: 88, connections: ['nodejs', 'express'] },
  { id: 'vscode', name: 'VS Code', category: 'tools', proficiency: 95, connections: ['git', 'github'] },
  { id: 'aws', name: 'AWS', category: 'tools', proficiency: 78, connections: ['docker', 'nodejs', 'python'] },
  { id: 'vercel', name: 'Vercel', category: 'tools', proficiency: 85, connections: ['nextjs', 'react'] },
  { id: 'render', name: 'Render', category: 'tools', proficiency: 80, connections: ['nodejs', 'docker'] },
  { id: 'eslint', name: 'ESLint', category: 'tools', proficiency: 88, connections: ['typescript', 'vscode'] },
  { id: 'markdown', name: 'Markdown', category: 'tools', proficiency: 90, connections: ['github', 'vscode'] },
];

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
    github: 'https://github.com/anand-242003/jobportal',
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
    github: 'https://github.com/anand-242003/EMWare.Ai',
  },
];
