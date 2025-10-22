import { HzBreadcrumbItem, HzCommand } from '@hz/shared/components';

/** COMMANDS */
export const COMMANDS_LATEX: HzCommand[] = [
  { label: 'Fraction', value: '\\frac{}{}', example: '½' },
  { label: 'Square Root', value: '\\sqrt{}', example: '√x' },
  { label: 'Summation', value: '\\sum', example: '∑' },
  { label: 'Integral', value: '\\int', example: '∫' },
  { label: 'Pi', value: '\\pi', example: 'π' },
  { label: 'Alpha', value: '\\alpha', example: 'α' },
  { label: 'Theta', value: '\\theta', example: 'θ' },
  { label: 'Infinity', value: '\\infty', example: '∞' },
  { label: 'Proportional', value: '\\propto', example: '∝' },
  { label: 'Not Equal', value: '\\neq', example: '≠' },
];

export const COMMANDS_DEV: HzCommand[] = [
  { label: 'Build Project', value: 'npm run build' },
  { label: 'Start Server', value: 'npm start' },
  { label: 'Run Tests', value: 'npm test' },
  { label: 'Lint Files', value: 'npm run lint' },
  { label: 'Format Code', value: 'npm run format' },
  { label: 'Deploy', value: 'npm run deploy' },
  { label: 'Generate Component', value: 'ng generate component' },
  { label: 'Update Packages', value: 'npm update' },
  { label: 'Open Docs', value: 'docs.open()' },
  { label: 'Restart', value: 'app.restart()' },
];

export const COMMANDS_GIT: HzCommand[] = [
  { label: 'Clone Repo', value: 'git clone' },
  { label: 'Pull Changes', value: 'git pull' },
  { label: 'Push Changes', value: 'git push' },
  { label: 'Commit', value: 'git commit' },
  { label: 'Checkout Branch', value: 'git checkout' },
  { label: 'Merge Branch', value: 'git merge' },
  { label: 'Rebase', value: 'git rebase' },
  { label: 'View Log', value: 'git log' },
  { label: 'Create Tag', value: 'git tag' },
  { label: 'Init Repo', value: 'git init' },
];

export const COMMANDS_AI: HzCommand[] = [
  { label: 'Summarize Text', value: 'ai.summarize()' },
  { label: 'Translate Text', value: 'ai.translate()' },
  { label: 'Explain Code', value: 'ai.explain()' },
  { label: 'Generate Snippet', value: 'ai.generateSnippet()' },
  { label: 'Refactor Function', value: 'ai.refactor()' },
  { label: 'Optimize Query', value: 'ai.optimizeQuery()' },
  { label: 'Draft Email', value: 'ai.composeEmail()' },
  { label: 'Brainstorm Ideas', value: 'ai.brainstorm()' },
  { label: 'Suggest Tests', value: 'ai.testSuggestions()' },
  { label: 'Generate Docs', value: 'ai.generateDocs()' },
];

export const COMMANDS_BROWSER: HzCommand[] = [
  { label: 'Open New Tab', value: 'window.open()' },
  { label: 'Reload Page', value: 'location.reload()' },
  { label: 'Go Back', value: 'history.back()' },
  { label: 'Go Forward', value: 'history.forward()' },
  { label: 'Copy URL', value: 'navigator.clipboard.writeText(url)' },
  { label: 'View Source', value: 'view-source:' },
  { label: 'Clear Cache', value: 'window.caches.deleteAll()' },
  { label: 'Toggle DevTools', value: 'Ctrl+Shift+I' },
  { label: 'Inspect Element', value: 'Inspect' },
  { label: 'Print Page', value: 'Ctrl+P' },
];

export const COMMANDS_THEME: HzCommand[] = [
  { label: 'Toggle Light/Dark', value: 'theme.toggle()' },
  { label: 'Set Light Mode', value: 'theme.setLight()' },
  { label: 'Set Dark Mode', value: 'theme.setDark()' },
  { label: 'Enable System Mode', value: 'theme.auto()' },
  { label: 'Increase Contrast', value: 'theme.contrastUp()' },
  { label: 'Decrease Contrast', value: 'theme.contrastDown()' },
  { label: 'Change Primary Color', value: 'theme.primary()' },
  { label: 'Change Accent Color', value: 'theme.accent()' },
  { label: 'Reset Theme', value: 'theme.reset()' },
  { label: 'Preview Palette', value: 'theme.preview()' },
];

export const COMMANDS_NAV: HzCommand[] = [
  { label: 'Go to Dashboard', value: '/dashboard' },
  { label: 'Open Settings', value: '/settings' },
  { label: 'User Profile', value: '/profile' },
  { label: 'Notifications', value: '/notifications' },
  { label: 'Help Center', value: '/help' },
  { label: 'API Explorer', value: '/api' },
  { label: 'Logs', value: '/logs' },
  { label: 'Analytics', value: '/analytics' },
  { label: 'Reports', value: '/reports' },
  { label: 'Logout', value: '/logout' },
];

export const COMMANDS_UTIL: HzCommand[] = [
  { label: 'Copy', value: 'Ctrl+C' },
  { label: 'Paste', value: 'Ctrl+V' },
  { label: 'Cut', value: 'Ctrl+X' },
  { label: 'Undo', value: 'Ctrl+Z' },
  { label: 'Redo', value: 'Ctrl+Y' },
  { label: 'Select All', value: 'Ctrl+A' },
  { label: 'Find', value: 'Ctrl+F' },
  { label: 'Replace', value: 'Ctrl+H' },
  { label: 'Save', value: 'Ctrl+S' },
  { label: 'Print', value: 'Ctrl+P' },
];

export const COMMANDS_COMPONENTS: HzCommand[] = [
  { label: 'Create Card', value: 'hz.create("hz-card")' },
  { label: 'Create Chip', value: 'hz.create("hz-chip")' },
  { label: 'Create Button', value: 'hz.create("hz-button")' },
  { label: 'Create Breadcrumb', value: 'hz.create("hz-breadcrumb")' },
  { label: 'Create Dialog', value: 'hz.create("hz-dialog")' },
  { label: 'Create Icon', value: 'hz.create("hz-icon")' },
  { label: 'Create Banner', value: 'hz.create("hz-banner")' },
  { label: 'Create Timeline', value: 'hz.create("hz-timeline")' },
  { label: 'Create Spinner', value: 'hz.create("hz-spinner")' },
  { label: 'Create Tooltip', value: 'hz.create("hz-tooltip")' },
];

export const COMMANDS_MATH: HzCommand[] = [
  { label: 'Add', value: '+', example: '1 + 2' },
  { label: 'Subtract', value: '-', example: '5 - 3' },
  { label: 'Multiply', value: '×', example: '2 × 4' },
  { label: 'Divide', value: '÷', example: '8 ÷ 2' },
  { label: 'Equal', value: '=', example: 'a = b' },
  { label: 'Greater Than', value: '>', example: '5 > 3' },
  { label: 'Less Than', value: '<', example: '2 < 4' },
  { label: 'Approximately', value: '≈', example: 'π ≈ 3.14' },
  { label: 'Not Equal', value: '≠', example: 'x ≠ y' },
  { label: 'Infinity', value: '∞', example: 'x → ∞' },
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
