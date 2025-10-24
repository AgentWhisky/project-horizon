import { LatexSection } from './latex-editor.model';

export const LATEX_MENU: LatexSection[] = [
  {
    label: 'Greek Characters',
    commands: [
      { label: 'Alpha', value: '\\alpha' },
      { label: 'Beta', value: '\\beta' },
      { label: 'Gamma', value: '\\gamma' },
      { label: 'Delta', value: '\\delta' },
      { label: 'Epsilon', value: '\\epsilon' },
      { label: 'Zeta', value: '\\zeta' },
      { label: 'Eta', value: '\\eta' },
      { label: 'Theta', value: '\\theta' },
      { label: 'Iota', value: '\\iota' },
      { label: 'Kappa', value: '\\kappa' },
      { label: 'Lambda', value: '\\lambda' },
      { label: 'Mu', value: '\\mu' },
      { label: 'Nu', value: '\\nu' },
      { label: 'Xi', value: '\\xi' },
      { label: 'Omicron', value: 'o' },
      { label: 'Pi', value: '\\pi' },
      { label: 'Rho', value: '\\rho' },
      { label: 'Sigma', value: '\\sigma' },
      { label: 'Tau', value: '\\tau' },
      { label: 'Upsilon', value: '\\upsilon' },
      { label: 'Phi', value: '\\phi' },
      { label: 'Chi', value: '\\chi' },
      { label: 'Psi', value: '\\psi' },
      { label: 'Omega', value: '\\omega' },
      { label: 'Varepsilon', value: '\\varepsilon' },
      { label: 'Varphi', value: '\\varphi' },
      { label: 'Varrho', value: '\\varrho' },
      { label: 'Varkappa', value: '\\varkappa' },
      { label: 'Varsigma', value: '\\varsigma' },
      { label: 'Vartheta', value: '\\vartheta' },
      { label: 'Digamma', value: '\\digamma' },
      { label: 'Uppercase Gamma', value: '\\Gamma' },
      { label: 'Uppercase Delta', value: '\\Delta' },
      { label: 'Uppercase Theta', value: '\\Theta' },
      { label: 'Uppercase Lambda', value: '\\Lambda' },
      { label: 'Uppercase Xi', value: '\\Xi' },
      { label: 'Uppercase Pi', value: '\\Pi' },
      { label: 'Uppercase Sigma', value: '\\Sigma' },
      { label: 'Uppercase Upsilon', value: '\\Upsilon' },
      { label: 'Uppercase Phi', value: '\\Phi' },
      { label: 'Uppercase Psi', value: '\\Psi' },
      { label: 'Uppercase Omega', value: '\\Omega' },
    ],
  },
  {
    label: 'Hebrew Characters',
    commands: [
      { label: 'Aleph', value: '\\aleph' },
      { label: 'Beth', value: '\\beth' },
      { label: 'Gimel', value: '\\gimel' },
      { label: 'Daleth', value: '\\daleth' },
    ],
  },
  {
    label: 'Miscellaneous Symbols',
    commands: [
      { label: 'Imath', value: '\\imath' },
      { label: 'Jmath', value: '\\jmath' },
      { label: 'Partial Differential', value: '\\partial' },
      { label: 'Nabla', value: '\\nabla' },
      { label: 'Weierstrass P', value: '\\wp' },
      { label: 'Hbar', value: '\\hbar' },
      { label: 'Hslash', value: '\\hslash' },
      { label: 'Ell', value: '\\ell' },
      { label: 'Eth', value: '\\eth' },
      { label: 'Reals (Symbol)', value: '\\Reals' },
      { label: 'Real Part', value: '\\Re' },
      { label: 'Imaginary Part', value: '\\Im' },
      { label: 'Complex Numbers', value: '\\Complex' },
      { label: 'Natural Numbers', value: '\\natnums' },
      { label: 'Integers', value: '\\Z' },
      { label: 'Finv', value: '\\Finv' },
      { label: 'Game', value: '\\Game' },
      { label: 'Bbbk', value: '\\Bbbk' },
      { label: 'AE Ligature', value: '\\text{\\AE}' },
      { label: 'ae Ligature', value: '\\text{\\ae}' },
      { label: 'OE Ligature', value: '\\text{\\OE}' },
      { label: 'oe Ligature', value: '\\text{\\oe}' },
      { label: 'O Slash', value: '\\text{\\O}' },
      { label: 'o Slash', value: '\\text{\\o}' },
      { label: 'AA Ligature', value: '\\text{\\AA}' },
      { label: 'aa Ligature', value: '\\text{\\aa}' },
      { label: 'Dotless I', value: '\\text{\\i}' },
      { label: 'Dotless J', value: '\\text{\\j}' },
      { label: 'Sharp S', value: '\\text{\\ss}' },
    ],
  },
  {
    label: 'Alphabets and Unicode',
    commands: [
      { label: 'Alpha (uppercase)', value: '\\Alpha' },
      { label: 'Beta (uppercase)', value: '\\Beta' },
      { label: 'Gamma (uppercase)', value: '\\Gamma' },
      { label: 'Delta (uppercase)', value: '\\Delta' },
      { label: 'Epsilon (uppercase)', value: '\\Epsilon' },
      { label: 'Zeta (uppercase)', value: '\\Zeta' },
      { label: 'Eta (uppercase)', value: '\\Eta' },
      { label: 'Theta (uppercase)', value: '\\Theta' },
      { label: 'Iota (uppercase)', value: '\\Iota' },
      { label: 'Kappa (uppercase)', value: '\\Kappa' },
      { label: 'Lambda (uppercase)', value: '\\Lambda' },
      { label: 'Mu (uppercase)', value: '\\Mu' },
      { label: 'Nu (uppercase)', value: '\\Nu' },
      { label: 'Xi (uppercase)', value: '\\Xi' },
      { label: 'Omicron (uppercase)', value: '\\Omicron' },
      { label: 'Pi (uppercase)', value: '\\Pi' },
      { label: 'Rho (uppercase)', value: '\\Rho' },
      { label: 'Sigma (uppercase)', value: '\\Sigma' },
      { label: 'Tau (uppercase)', value: '\\Tau' },
      { label: 'Upsilon (uppercase)', value: '\\Upsilon' },
      { label: 'Phi (uppercase)', value: '\\Phi' },
      { label: 'Chi (uppercase)', value: '\\Chi' },
      { label: 'Psi (uppercase)', value: '\\Psi' },
      { label: 'Omega (uppercase)', value: '\\Omega' },

      { label: 'Variant Gamma (uppercase)', value: '\\varGamma' },
      { label: 'Variant Delta (uppercase)', value: '\\varDelta' },
      { label: 'Variant Theta (uppercase)', value: '\\varTheta' },
      { label: 'Variant Lambda (uppercase)', value: '\\varLambda' },
      { label: 'Variant Xi (uppercase)', value: '\\varXi' },
      { label: 'Variant Pi (uppercase)', value: '\\varPi' },
      { label: 'Variant Sigma (uppercase)', value: '\\varSigma' },
      { label: 'Variant Upsilon (uppercase)', value: '\\varUpsilon' },
      { label: 'Variant Phi (uppercase)', value: '\\varPhi' },
      { label: 'Variant Psi (uppercase)', value: '\\varPsi' },
      { label: 'Variant Omega (uppercase)', value: '\\varOmega' },

      { label: 'Alpha', value: '\\alpha' },
      { label: 'Beta', value: '\\beta' },
      { label: 'Gamma', value: '\\gamma' },
      { label: 'Delta', value: '\\delta' },
      { label: 'Epsilon', value: '\\epsilon' },
      { label: 'Zeta', value: '\\zeta' },
      { label: 'Eta', value: '\\eta' },
      { label: 'Theta', value: '\\theta' },
      { label: 'Iota', value: '\\iota' },
      { label: 'Kappa', value: '\\kappa' },
      { label: 'Lambda', value: '\\lambda' },
      { label: 'Mu', value: '\\mu' },
      { label: 'Nu', value: '\\nu' },
      { label: 'Xi', value: '\\xi' },
      { label: 'Omicron', value: '\\omicron' },
      { label: 'Pi', value: '\\pi' },
      { label: 'Rho', value: '\\rho' },
      { label: 'Sigma', value: '\\sigma' },
      { label: 'Tau', value: '\\tau' },
      { label: 'Upsilon', value: '\\upsilon' },
      { label: 'Phi', value: '\\phi' },
      { label: 'Chi', value: '\\chi' },
      { label: 'Psi', value: '\\psi' },
      { label: 'Omega', value: '\\omega' },

      { label: 'Varepsilon', value: '\\varepsilon' },
      { label: 'Varkappa', value: '\\varkappa' },
      { label: 'Vartheta', value: '\\vartheta' },
      { label: 'Thetasym', value: '\\thetasym' },
      { label: 'Varpi', value: '\\varpi' },
      { label: 'Varrho', value: '\\varrho' },
      { label: 'Varsigma', value: '\\varsigma' },
      { label: 'Varphi', value: '\\varphi' },
      { label: 'Digamma', value: '\\digamma' },
    ],
  },
];

/**
 * Command palette Search
 *  - Alpha - α
 *
 * Left nav tree of options
 */

/**
 * https://quickref.me/latex.html
 *
 * Supported Functions
 * - Accents
 * - Emphasis in \text
 * - Delimiter Sizing
 * - Greek and Hebrew Letters
 * - (Other Letters)
 * - Alphabets and Unicode
 * - Annotation
 * - Vertical layout
 * - Overlap and Spacing
 *
 * “\LaTeX” math constructs
 * - Delimiters
 * - Variable Size Symbols
 * - Standard Function Names
 * - Logic and Set Theory
 * - (Special Symbols)
 *
 * Operators
 * - Mathematical Operator
 * - Big Operator
 * - Fractions & Binomials
 * - \sqrt
 * - Binary Operator
 *
 * Relations
 * - Relations
 * - Negative Relationship
 * - Arrow (Extensible Arrows)
 *
 * Symbols & Punctuation
 *
 * Environments
 * - Environments 1
 * - Environments 2
 */
