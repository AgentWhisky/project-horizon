import { LatexSection } from './latex-editor.model';

export const MAX_COMMAND_HISTORY = 20;

export const LATEX_MENU: LatexSection[] = [
  {
    label: 'Greek Characters',
    commands: [
      { id: 1, label: 'Alpha', value: '\\alpha' },
      { id: 2, label: 'Beta', value: '\\beta' },
      { id: 3, label: 'Gamma', value: '\\gamma' },
      { id: 4, label: 'Delta', value: '\\delta' },
      { id: 5, label: 'Epsilon', value: '\\epsilon' },
      { id: 6, label: 'Zeta', value: '\\zeta' },
      { id: 7, label: 'Eta', value: '\\eta' },
      { id: 8, label: 'Theta', value: '\\theta' },
      { id: 9, label: 'Iota', value: '\\iota' },
      { id: 10, label: 'Kappa', value: '\\kappa' },
      { id: 11, label: 'Lambda', value: '\\lambda' },
      { id: 12, label: 'Mu', value: '\\mu' },
      { id: 13, label: 'Nu', value: '\\nu' },
      { id: 14, label: 'Xi', value: '\\xi' },
      { id: 15, label: 'Omicron', value: 'o' },
      { id: 16, label: 'Pi', value: '\\pi' },
      { id: 17, label: 'Rho', value: '\\rho' },
      { id: 18, label: 'Sigma', value: '\\sigma' },
      { id: 19, label: 'Tau', value: '\\tau' },
      { id: 20, label: 'Upsilon', value: '\\upsilon' },
      { id: 21, label: 'Phi', value: '\\phi' },
      { id: 22, label: 'Chi', value: '\\chi' },
      { id: 23, label: 'Psi', value: '\\psi' },
      { id: 24, label: 'Omega', value: '\\omega' },
      { id: 25, label: 'Varepsilon', value: '\\varepsilon' },
      { id: 26, label: 'Varphi', value: '\\varphi' },
      { id: 27, label: 'Varrho', value: '\\varrho' },
      { id: 28, label: 'Varkappa', value: '\\varkappa' },
      { id: 29, label: 'Varsigma', value: '\\varsigma' },
      { id: 30, label: 'Vartheta', value: '\\vartheta' },
      { id: 31, label: 'Digamma', value: '\\digamma' },
      { id: 32, label: 'Uppercase Gamma', value: '\\Gamma' },
      { id: 33, label: 'Uppercase Delta', value: '\\Delta' },
      { id: 34, label: 'Uppercase Theta', value: '\\Theta' },
      { id: 35, label: 'Uppercase Lambda', value: '\\Lambda' },
      { id: 36, label: 'Uppercase Xi', value: '\\Xi' },
      { id: 37, label: 'Uppercase Pi', value: '\\Pi' },
      { id: 38, label: 'Uppercase Sigma', value: '\\Sigma' },
      { id: 39, label: 'Uppercase Upsilon', value: '\\Upsilon' },
      { id: 40, label: 'Uppercase Phi', value: '\\Phi' },
      { id: 41, label: 'Uppercase Psi', value: '\\Psi' },
      { id: 42, label: 'Uppercase Omega', value: '\\Omega' },
    ],
  },
  {
    label: 'Hebrew Characters',
    commands: [
      { id: 101, label: 'Aleph', value: '\\aleph' },
      { id: 102, label: 'Beth', value: '\\beth' },
      { id: 103, label: 'Gimel', value: '\\gimel' },
      { id: 104, label: 'Daleth', value: '\\daleth' },
    ],
  },
  {
    label: 'Miscellaneous Symbols',
    commands: [
      { id: 201, label: 'Imath', value: '\\imath' },
      { id: 202, label: 'Jmath', value: '\\jmath' },
      { id: 203, label: 'Partial Differential', value: '\\partial' },
      { id: 204, label: 'Nabla', value: '\\nabla' },
      { id: 205, label: 'Weierstrass P', value: '\\wp' },
      { id: 206, label: 'Hbar', value: '\\hbar' },
      { id: 207, label: 'Hslash', value: '\\hslash' },
      { id: 208, label: 'Ell', value: '\\ell' },
      { id: 209, label: 'Eth', value: '\\eth' },
      { id: 2010, label: 'Reals (Symbol)', value: '\\Reals' },
      { id: 2011, label: 'Real Part', value: '\\Re' },
      { id: 2012, label: 'Imaginary Part', value: '\\Im' },
      { id: 2013, label: 'Complex Numbers', value: '\\Complex' },
      { id: 2014, label: 'Natural Numbers', value: '\\natnums' },
      { id: 2015, label: 'Integers', value: '\\Z' },
      { id: 2016, label: 'Finv', value: '\\Finv' },
      { id: 2017, label: 'Game', value: '\\Game' },
      { id: 2018, label: 'Bbbk', value: '\\Bbbk' },
      { id: 2019, label: 'AE Ligature', value: '\\text{\\AE}' },
      { id: 2020, label: 'ae Ligature', value: '\\text{\\ae}' },
      { id: 2021, label: 'OE Ligature', value: '\\text{\\OE}' },
      { id: 2022, label: 'oe Ligature', value: '\\text{\\oe}' },
      { id: 2023, label: 'O Slash', value: '\\text{\\O}' },
      { id: 2024, label: 'o Slash', value: '\\text{\\o}' },
      { id: 2025, label: 'AA Ligature', value: '\\text{\\AA}' },
      { id: 2026, label: 'aa Ligature', value: '\\text{\\aa}' },
      { id: 2027, label: 'Dotless I', value: '\\text{\\i}' },
      { id: 2028, label: 'Dotless J', value: '\\text{\\j}' },
      { id: 2029, label: 'Sharp S', value: '\\text{\\ss}' },
    ],
  },
  {
    label: 'Alphabets and Unicode',
    commands: [
      { id: 301, label: 'Variant Gamma (uppercase)', value: '\\varGamma' },
      { id: 302, label: 'Variant Delta (uppercase)', value: '\\varDelta' },
      { id: 303, label: 'Variant Theta (uppercase)', value: '\\varTheta' },
      { id: 304, label: 'Variant Lambda (uppercase)', value: '\\varLambda' },
      { id: 305, label: 'Variant Xi (uppercase)', value: '\\varXi' },
      { id: 306, label: 'Variant Pi (uppercase)', value: '\\varPi' },
      { id: 307, label: 'Variant Sigma (uppercase)', value: '\\varSigma' },
      { id: 308, label: 'Variant Upsilon (uppercase)', value: '\\varUpsilon' },
      { id: 309, label: 'Variant Phi (uppercase)', value: '\\varPhi' },
      { id: 3010, label: 'Variant Psi (uppercase)', value: '\\varPsi' },
      { id: 3011, label: 'Variant Omega (uppercase)', value: '\\varOmega' },
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
