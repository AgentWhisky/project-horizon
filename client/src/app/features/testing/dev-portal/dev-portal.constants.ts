import { HzBreadcrumbItem, HzCommand } from '@hz/shared/components';

/** COMMANDS */
export const COMMANDS_LATEX: HzCommand[] = [
  { id: 1, label: 'Fraction', value: '\\frac{}{}', latex: '\\frac{1}{2}' },
  { id: 2, label: 'Square Root', value: '\\sqrt{}', latex: '\\sqrt{2}' },
  { id: 3, label: 'Summation', value: '\\sum', latex: '\\sum' },
  { id: 4, label: 'Integral', value: '\\int', latex: '\\int' },
  { id: 5, label: 'Pi', value: '\\pi', latex: '\\pi' },
  { id: 6, label: 'Alpha', value: '\\alpha', latex: '\\alpha' },
  { id: 7, label: 'Theta', value: '\\theta', latex: '\\theta' },
  { id: 8, label: 'Infinity', value: '\\infty', latex: '\\infty' },
  { id: 9, label: 'Proportional', value: '\\propto', latex: '\\propto' },
  { id: 10, label: 'Not Equal', value: '\\neq', latex: '\\neq' },
];

export const COMMANDS_DEV: HzCommand[] = [
  { id: 1, label: 'Build Project', value: 'npm run build' },
  { id: 2, label: 'Start Server', value: 'npm start' },
  { id: 3, label: 'Run Tests', value: 'npm test' },
  { id: 4, label: 'Lint Files', value: 'npm run lint' },
  { id: 5, label: 'Format Code', value: 'npm run format' },
  { id: 6, label: 'Deploy', value: 'npm run deploy' },
  { id: 7, label: 'Generate Component', value: 'ng generate component' },
  { id: 8, label: 'Update Packages', value: 'npm update' },
  { id: 9, label: 'Open Docs', value: 'docs.open()' },
  { id: 10, label: 'Restart', value: 'app.restart()' },
];

export const COMMANDS_GIT: HzCommand[] = [
  { id: 1, label: 'Clone Repo', value: 'git clone' },
  { id: 2, label: 'Pull Changes', value: 'git pull' },
  { id: 3, label: 'Push Changes', value: 'git push' },
  { id: 4, label: 'Commit', value: 'git commit' },
  { id: 5, label: 'Checkout Branch', value: 'git checkout' },
  { id: 6, label: 'Merge Branch', value: 'git merge' },
  { id: 7, label: 'Rebase', value: 'git rebase' },
  { id: 8, label: 'View Log', value: 'git log' },
  { id: 9, label: 'Create Tag', value: 'git tag' },
  { id: 10, label: 'Init Repo', value: 'git init' },
];

export const COMMANDS_AI: HzCommand[] = [
  { id: 1, label: 'Summarize Text', value: 'ai.summarize()' },
  { id: 2, label: 'Translate Text', value: 'ai.translate()' },
  { id: 3, label: 'Explain Code', value: 'ai.explain()' },
  { id: 4, label: 'Generate Snippet', value: 'ai.generateSnippet()' },
  { id: 5, label: 'Refactor Function', value: 'ai.refactor()' },
  { id: 6, label: 'Optimize Query', value: 'ai.optimizeQuery()' },
  { id: 7, label: 'Draft Email', value: 'ai.composeEmail()' },
  { id: 8, label: 'Brainstorm Ideas', value: 'ai.brainstorm()' },
  { id: 9, label: 'Suggest Tests', value: 'ai.testSuggestions()' },
  { id: 10, label: 'Generate Docs', value: 'ai.generateDocs()' },
];

export const COMMANDS_BROWSER: HzCommand[] = [
  { id: 1, label: 'Open New Tab', value: 'window.open()' },
  { id: 2, label: 'Reload Page', value: 'location.reload()' },
  { id: 3, label: 'Go Back', value: 'history.back()' },
  { id: 4, label: 'Go Forward', value: 'history.forward()' },
  { id: 5, label: 'Copy URL', value: 'navigator.clipboard.writeText(url)' },
  { id: 6, label: 'View Source', value: 'view-source:' },
  { id: 7, label: 'Clear Cache', value: 'window.caches.deleteAll()' },
  { id: 8, label: 'Toggle DevTools', value: 'Ctrl+Shift+I' },
  { id: 9, label: 'Inspect Element', value: 'Inspect' },
  { id: 10, label: 'Print Page', value: 'Ctrl+P' },
];

export const COMMANDS_THEME: HzCommand[] = [
  { id: 1, label: 'Toggle Light/Dark', value: 'theme.toggle()' },
  { id: 2, label: 'Set Light Mode', value: 'theme.setLight()' },
  { id: 3, label: 'Set Dark Mode', value: 'theme.setDark()' },
  { id: 4, label: 'Enable System Mode', value: 'theme.auto()' },
  { id: 5, label: 'Increase Contrast', value: 'theme.contrastUp()' },
  { id: 6, label: 'Decrease Contrast', value: 'theme.contrastDown()' },
  { id: 7, label: 'Change Primary Color', value: 'theme.primary()' },
  { id: 8, label: 'Change Accent Color', value: 'theme.accent()' },
  { id: 9, label: 'Reset Theme', value: 'theme.reset()' },
  { id: 10, label: 'Preview Palette', value: 'theme.preview()' },
];

export const COMMANDS_NAV: HzCommand[] = [
  { id: 1, label: 'Go to Dashboard', value: '/dashboard' },
  { id: 2, label: 'Open Settings', value: '/settings' },
  { id: 3, label: 'User Profile', value: '/profile' },
  { id: 4, label: 'Notifications', value: '/notifications' },
  { id: 5, label: 'Help Center', value: '/help' },
  { id: 6, label: 'API Explorer', value: '/api' },
  { id: 7, label: 'Logs', value: '/logs' },
  { id: 8, label: 'Analytics', value: '/analytics' },
  { id: 9, label: 'Reports', value: '/reports' },
  { id: 10, label: 'Logout', value: '/logout' },
];

export const COMMANDS_UTIL: HzCommand[] = [
  { id: 1, label: 'Copy', value: 'Ctrl+C' },
  { id: 2, label: 'Paste', value: 'Ctrl+V' },
  { id: 3, label: 'Cut', value: 'Ctrl+X' },
  { id: 4, label: 'Undo', value: 'Ctrl+Z' },
  { id: 5, label: 'Redo', value: 'Ctrl+Y' },
  { id: 6, label: 'Select All', value: 'Ctrl+A' },
  { id: 7, label: 'Find', value: 'Ctrl+F' },
  { id: 8, label: 'Replace', value: 'Ctrl+H' },
  { id: 9, label: 'Save', value: 'Ctrl+S' },
  { id: 10, label: 'Print', value: 'Ctrl+P' },
];

export const COMMANDS_COMPONENTS: HzCommand[] = [
  { id: 1, label: 'Create Card', value: 'hz.create("hz-card")' },
  { id: 2, label: 'Create Chip', value: 'hz.create("hz-chip")' },
  { id: 3, label: 'Create Button', value: 'hz.create("hz-button")' },
  { id: 4, label: 'Create Breadcrumb', value: 'hz.create("hz-breadcrumb")' },
  { id: 5, label: 'Create Dialog', value: 'hz.create("hz-dialog")' },
  { id: 6, label: 'Create Icon', value: 'hz.create("hz-icon")' },
  { id: 7, label: 'Create Banner', value: 'hz.create("hz-banner")' },
  { id: 8, label: 'Create Timeline', value: 'hz.create("hz-timeline")' },
  { id: 9, label: 'Create Spinner', value: 'hz.create("hz-spinner")' },
  { id: 10, label: 'Create Tooltip', value: 'hz.create("hz-tooltip")' },
];

export const COMMANDS_MATH: HzCommand[] = [
  { id: 1, label: 'Add', value: '+', example: '1 + 2' },
  { id: 2, label: 'Subtract', value: '-', example: '5 - 3' },
  { id: 3, label: 'Multiply', value: '×', example: '2 × 4' },
  { id: 4, label: 'Divide', value: '÷', example: '8 ÷ 2' },
  { id: 5, label: 'Equal', value: '=', example: 'a = b' },
  { id: 6, label: 'Greater Than', value: '>', example: '5 > 3' },
  { id: 7, label: 'Less Than', value: '<', example: '2 < 4' },
  { id: 8, label: 'Approximately', value: '≈', example: 'π ≈ 3.14' },
  { id: 9, label: 'Not Equal', value: '≠', example: 'x ≠ y' },
  { id: 10, label: 'Infinity', value: '∞', example: 'x → ∞' },
];

/** BREADCRUMBS */
export const HZ_BREAKCRUMB_SETS = {
  set1: [
    { label: 'Root', route: '/root' },
    { label: 'Route 1', route: '/root/route1' },
    { label: 'Route 2', route: '/root/route1/route2' },
    { label: 'Route 3', route: '/root/route1/route2/route3' },
    { label: 'Route 4', route: '/root/route1/route2/route3/route4' },
  ],

  set2: [
    { label: 'Root', route: '/root', icon: 'line_start_circle' },
    { label: 'Route 1', route: '/root/route1', icon: 'counter_1' },
    { label: 'Route 2', route: '/root/route1/route2', icon: 'counter_2' },
    { label: 'Route 3', route: '/root/route1/route2/route3', icon: 'counter_3' },
    { label: 'Route 4', route: '/root/route1/route2/route3/route4', icon: 'counter_4' },
  ],

  set3: [
    { label: 'Root', route: '/root', icon: 'line_start_circle' },
    { label: 'Route 1', route: '/root/route1', icon: 'counter_1', disabled: true },
    { label: 'Route 2', route: '/root/route1/route2', icon: 'counter_2', disabled: true },
    { label: 'Route 3', route: '/root/route1/route2/route3', icon: 'counter_3' },
    { label: 'Route 4', route: '/root/route1/route2/route3/route4', icon: 'counter_4' },
  ],

  set4: [
    { label: 'Root', route: '/root', icon: 'line_start_circle', tooltip: 'Root' },
    { label: 'Route 1', route: '/root/route1', icon: 'counter_1', tooltip: 'Route 1' },
    { label: 'Route 2', route: '/root/route1/route2', icon: 'counter_2', tooltip: 'Route 2' },
    { label: 'Route 3', route: '/root/route1/route2/route3', icon: 'counter_3', tooltip: 'Route 3' },
    { label: 'Route 4', route: '/root/route1/route2/route3/route4', icon: 'counter_4', tooltip: 'Route 4' },
  ],

  set5: [
    { label: 'Root', route: '/root', icon: 'line_start_circle', tooltip: 'Root' },
    { label: 'Route 1', route: '/root/route1', icon: 'counter_1', tooltip: 'Route 1', disabled: true },
    { label: 'Route 2', route: '/root/route1/route2', icon: 'counter_2', tooltip: 'Route 2', disabled: true },
    { label: 'Route 3', route: '/root/route1/route2/route3', icon: 'counter_3', tooltip: 'Route 3' },
    { label: 'Route 4', route: '/root/route1/route2/route3/route4', icon: 'counter_4', tooltip: 'Route 4' },
  ],
};
