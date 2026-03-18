import type { ResumeData } from '@/types/resume'

export const DEFAULT_RESUME: ResumeData = {
  personal: {
    name: 'Jane Smith',
    title: 'Senior Product Designer',
    email: 'jane@example.com',
    phone: '+63 912 345 6789',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/janesmith',
    github: 'github.com/janesmith',
    summary:
      'Product designer with 6 years of experience shipping B2B SaaS products. Passionate about design systems and accessibility.',
    photo: '',
  },
  work: [
    {
      id: 'exp-1',
      company: 'Acme Corp',
      role: 'Senior Product Designer',
      startDate: 'Jan 2022',
      endDate: 'Present',
      bullets: [
        'Led redesign of core onboarding flow, reducing drop-off by 34%',
        'Managed a team of 3 designers across 2 product lines',
        "Established the company's first design system",
      ],
    },
    {
      id: 'exp-2',
      company: 'Startup Inc',
      role: 'Product Designer',
      startDate: 'Jun 2019',
      endDate: 'Dec 2021',
      bullets: [
        'Shipped mobile app from 0 to 50k MAU in 18 months',
        'Ran weekly user research sessions and synthesized findings into product decisions',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      startYear: '2015',
      endYear: '2019',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Portfolio Site',
      description: 'Personal design and dev showcase built with Next.js and Framer Motion.',
      url: 'janesmith.design',
    },
  ],
  skills: [
    { id: 'sk-1', category: 'Design', items: ['Figma', 'Sketch', 'Prototyping', 'User Research'] },
    { id: 'sk-2', category: 'Code', items: ['HTML', 'CSS', 'React', 'TypeScript'] },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Google UX Design Certificate',
      issuer: 'Google / Coursera',
      issueDate: 'Mar 2022',
      expiryDate: '',
      credentialUrl: 'coursera.org/verify/abc123',
    },
  ],
  references: [
    {
      id: 'ref-1',
      name: 'Michael Torres',
      jobTitle: 'VP of Product',
      company: 'Acme Corp',
      email: 'm.torres@acme.com',
      phone: '+63 917 123 4567',
    },
  ],
  referencesOnRequest: false,
}

export const EMPTY_RESUME: ResumeData = {
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    photo: '',
  },
  work: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  references: [],
  referencesOnRequest: false,
}
