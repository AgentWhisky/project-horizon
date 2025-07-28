import { DashboardSection } from './dashboard';

export const dashboardSections: DashboardSection[] = [
  {
    sectionTitle: 'Libraries',
    tileConfigs: [
      {
        id: 1,
        title: 'Link Library',
        description: 'Library of Useful Links',
        routerLink: '/link-library',
        src: 'assets/images/dashboard/link-library-header-image.png',
        alt: 'Link Library Header Image',
      },
    ],
  },
  {
    sectionTitle: 'Tools',
    tileConfigs: [
      {
        id: 10,
        title: 'Text Analyzer',
        description: 'Analyze word and character counts, readability scores, and estimated reading, speaking, and typing times.',
        routerLink: '/text-analyzer',
        src: 'assets/images/dashboard/text-analyzer-header-image.png',
        alt: 'Text Analyzer Header Image',
      },
      {
        id: 11,
        title: 'Base Converter',
        description: 'Convert between number bases in real time. Add, reorder, and manage multiple conversion tiles at once.',
        routerLink: '/base-converter',

        src: 'assets/images/dashboard/base-converter-header-image.png',
        alt: 'Base Converter Header Image',
      },
      {
        id: 12,
        title: 'LaTeX Editor',
        description:
          'Write and preview LaTeX equations live. A simple, focused tool for testing math expressions and generating clean, formatted output.',
        routerLink: '/latex-editor',
        src: 'assets/images/dashboard/latex-editor-header-image.png',
        alt: 'LaTeX Editor Header Image',
      },
      {
        id: 13,
        title: 'Steam Insight',
        description:
          'Search Steam’s vast game library and explore detailed insights including achievements, downloadable content, release info, and more.',
        routerLink: '/steam-insight',
        src: 'assets/images/dashboard/steam-insight-header-image.png',
        alt: 'Steam Insight Header Image',
      },
    ],
  },
];
