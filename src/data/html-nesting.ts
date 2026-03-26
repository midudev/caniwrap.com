export type ContentCategory = 'flow' | 'phrasing' | 'interactive' | 'heading' | 'sectioning' | 'embedded' | 'metadata';

export interface ElementDef {
  cats: ContentCategory[];
  content: 'flow' | 'phrasing' | 'transparent' | 'void' | 'text' | 'nothing' | 'specific';
  children?: string[];
  also?: string[];
  noDesc?: string[];
  desc: string;
}

export interface NestingResult {
  valid: 'yes' | 'no' | 'depends';
  reason: string;
  explanation: string;
  codeExample: string;
  browserNote?: string;
  parentMdn: string;
  childMdn: string;
}

const FP: ContentCategory[] = ['flow', 'phrasing'];
const FPI: ContentCategory[] = ['flow', 'phrasing', 'interactive'];
const FPIE: ContentCategory[] = ['flow', 'phrasing', 'interactive', 'embedded'];
const FPE: ContentCategory[] = ['flow', 'phrasing', 'embedded'];
const F: ContentCategory[] = ['flow'];
const FS: ContentCategory[] = ['flow', 'sectioning'];
const FH: ContentCategory[] = ['flow', 'heading'];
const MFP: ContentCategory[] = ['metadata', 'flow', 'phrasing'];
const NONE: ContentCategory[] = [];
const FI: ContentCategory[] = ['flow', 'interactive'];

export const elements: Record<string, ElementDef> = {
  // ── Inline text semantics (flow + phrasing) ──
  a:      { cats: FPI, content: 'transparent', noDesc: ['@interactive'], desc: 'Hyperlink' },
  abbr:   { cats: FP, content: 'phrasing', desc: 'Abbreviation' },
  b:      { cats: FP, content: 'phrasing', desc: 'Bring attention' },
  bdi:    { cats: FP, content: 'phrasing', desc: 'Bidirectional isolate' },
  bdo:    { cats: FP, content: 'phrasing', desc: 'Bidirectional override' },
  br:     { cats: FP, content: 'void', desc: 'Line break' },
  cite:   { cats: FP, content: 'phrasing', desc: 'Citation' },
  code:   { cats: FP, content: 'phrasing', desc: 'Code fragment' },
  data:   { cats: FP, content: 'phrasing', desc: 'Machine-readable data' },
  dfn:    { cats: FP, content: 'phrasing', noDesc: ['dfn'], desc: 'Definition' },
  em:     { cats: FP, content: 'phrasing', desc: 'Emphasis' },
  i:      { cats: FP, content: 'phrasing', desc: 'Idiomatic text' },
  kbd:    { cats: FP, content: 'phrasing', desc: 'Keyboard input' },
  mark:   { cats: FP, content: 'phrasing', desc: 'Highlighted text' },
  q:      { cats: FP, content: 'phrasing', desc: 'Inline quotation' },
  ruby:   { cats: FP, content: 'phrasing', also: ['rt', 'rp'], desc: 'Ruby annotation' },
  s:      { cats: FP, content: 'phrasing', desc: 'Strikethrough' },
  samp:   { cats: FP, content: 'phrasing', desc: 'Sample output' },
  small:  { cats: FP, content: 'phrasing', desc: 'Side comment' },
  span:   { cats: FP, content: 'phrasing', desc: 'Inline container' },
  strong: { cats: FP, content: 'phrasing', desc: 'Strong importance' },
  sub:    { cats: FP, content: 'phrasing', desc: 'Subscript' },
  sup:    { cats: FP, content: 'phrasing', desc: 'Superscript' },
  time:   { cats: FP, content: 'phrasing', desc: 'Date/time' },
  u:      { cats: FP, content: 'phrasing', desc: 'Unarticulated annotation' },
  var:    { cats: FP, content: 'phrasing', desc: 'Variable' },
  wbr:    { cats: FP, content: 'void', desc: 'Word break opportunity' },

  // ── Text-level edits (transparent) ──
  del: { cats: FP, content: 'transparent', desc: 'Deleted text' },
  ins: { cats: FP, content: 'transparent', desc: 'Inserted text' },

  // ── Interactive / form elements ──
  button:   { cats: FPI, content: 'phrasing', noDesc: ['@interactive'], desc: 'Clickable button' },
  input:    { cats: FPI, content: 'void', desc: 'Input field' },
  label:    { cats: FPI, content: 'phrasing', noDesc: ['label'], desc: 'Form label' },
  select:   { cats: FPI, content: 'specific', children: ['option', 'optgroup', 'hr', 'script', 'template'], desc: 'Dropdown list' },
  textarea: { cats: FPI, content: 'text', desc: 'Multi-line text input' },
  details:  { cats: FI, content: 'flow', also: ['summary'], desc: 'Disclosure widget' },
  dialog:   { cats: F, content: 'flow', desc: 'Dialog box' },

  // ── Embedded content ──
  audio:   { cats: FPIE, content: 'transparent', also: ['source', 'track'], desc: 'Audio content' },
  canvas:  { cats: FPE, content: 'transparent', desc: 'Drawing surface' },
  embed:   { cats: FPIE, content: 'void', desc: 'External plugin content' },
  iframe:  { cats: FPIE, content: 'nothing', desc: 'Inline frame' },
  img:     { cats: FPE, content: 'void', desc: 'Image' },
  object:  { cats: FPIE, content: 'transparent', desc: 'External object' },
  picture: { cats: FPE, content: 'specific', children: ['source', 'img', 'script', 'template'], desc: 'Responsive image container' },
  svg:     { cats: FPE, content: 'specific', children: [], desc: 'SVG vector graphic' },
  video:   { cats: FPIE, content: 'transparent', also: ['source', 'track'], desc: 'Video content' },

  // ── Sections & grouping (flow only) ──
  address:    { cats: F, content: 'flow', noDesc: ['@heading', '@sectioning', 'header', 'footer', 'address'], desc: 'Contact information' },
  article:    { cats: FS, content: 'flow', desc: 'Independent article' },
  aside:      { cats: FS, content: 'flow', desc: 'Tangential content' },
  blockquote: { cats: F, content: 'flow', desc: 'Block quotation' },
  div:        { cats: F, content: 'flow', desc: 'Generic block container' },
  figure:     { cats: F, content: 'flow', also: ['figcaption'], desc: 'Self-contained figure' },
  footer:     { cats: F, content: 'flow', noDesc: ['header', 'footer', 'main'], desc: 'Section footer' },
  form:       { cats: F, content: 'flow', noDesc: ['form'], desc: 'Input form' },
  header:     { cats: F, content: 'flow', noDesc: ['header', 'footer', 'main'], desc: 'Section header' },
  hr:         { cats: F, content: 'void', desc: 'Thematic break' },
  main:       { cats: F, content: 'flow', desc: 'Main content' },
  nav:        { cats: FS, content: 'flow', desc: 'Navigation links' },
  p:          { cats: F, content: 'phrasing', desc: 'Paragraph' },
  pre:        { cats: F, content: 'phrasing', desc: 'Preformatted text' },
  search:     { cats: F, content: 'flow', desc: 'Search section' },
  section:    { cats: FS, content: 'flow', desc: 'Generic section' },

  // ── Headings ──
  h1:     { cats: FH, content: 'phrasing', desc: 'Heading level 1' },
  h2:     { cats: FH, content: 'phrasing', desc: 'Heading level 2' },
  h3:     { cats: FH, content: 'phrasing', desc: 'Heading level 3' },
  h4:     { cats: FH, content: 'phrasing', desc: 'Heading level 4' },
  h5:     { cats: FH, content: 'phrasing', desc: 'Heading level 5' },
  h6:     { cats: FH, content: 'phrasing', desc: 'Heading level 6' },
  hgroup: { cats: FH, content: 'specific', children: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'script', 'template'], desc: 'Heading group' },

  // ── Lists ──
  ul:   { cats: F, content: 'specific', children: ['li', 'script', 'template'], desc: 'Unordered list' },
  ol:   { cats: F, content: 'specific', children: ['li', 'script', 'template'], desc: 'Ordered list' },
  li:   { cats: NONE, content: 'flow', desc: 'List item' },
  dl:   { cats: F, content: 'specific', children: ['dt', 'dd', 'div', 'script', 'template'], desc: 'Description list' },
  dt:   { cats: NONE, content: 'flow', noDesc: ['@heading', '@sectioning', 'header', 'footer'], desc: 'Description term' },
  dd:   { cats: NONE, content: 'flow', desc: 'Description details' },
  menu: { cats: F, content: 'specific', children: ['li', 'script', 'template'], desc: 'Toolbar menu' },

  // ── Tables ──
  table:    { cats: F, content: 'specific', children: ['caption', 'colgroup', 'thead', 'tbody', 'tfoot', 'tr', 'script', 'template'], desc: 'Data table' },
  caption:  { cats: NONE, content: 'flow', noDesc: ['table'], desc: 'Table caption' },
  colgroup: { cats: NONE, content: 'specific', children: ['col', 'template'], desc: 'Column group' },
  col:      { cats: NONE, content: 'void', desc: 'Table column' },
  thead:    { cats: NONE, content: 'specific', children: ['tr', 'script', 'template'], desc: 'Table head group' },
  tbody:    { cats: NONE, content: 'specific', children: ['tr', 'script', 'template'], desc: 'Table body group' },
  tfoot:    { cats: NONE, content: 'specific', children: ['tr', 'script', 'template'], desc: 'Table foot group' },
  tr:       { cats: NONE, content: 'specific', children: ['td', 'th', 'script', 'template'], desc: 'Table row' },
  td:       { cats: NONE, content: 'flow', desc: 'Table data cell' },
  th:       { cats: NONE, content: 'flow', noDesc: ['@heading', '@sectioning', 'header', 'footer'], desc: 'Table header cell' },

  // ── Form-related ──
  fieldset: { cats: F, content: 'flow', also: ['legend'], desc: 'Form field group' },
  legend:   { cats: NONE, content: 'phrasing', also: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup'], desc: 'Fieldset legend' },
  datalist: { cats: FP, content: 'phrasing', also: ['option'], desc: 'Predefined options' },
  optgroup: { cats: NONE, content: 'specific', children: ['option', 'script', 'template'], desc: 'Option group' },
  option:   { cats: NONE, content: 'text', desc: 'Select option' },
  output:   { cats: FP, content: 'phrasing', desc: 'Calculation result' },
  progress: { cats: FP, content: 'phrasing', noDesc: ['progress'], desc: 'Progress indicator' },
  meter:    { cats: FP, content: 'phrasing', noDesc: ['meter'], desc: 'Scalar measurement' },

  // ── No-category children ──
  figcaption: { cats: NONE, content: 'flow', desc: 'Figure caption' },
  summary:    { cats: NONE, content: 'phrasing', also: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup'], desc: 'Disclosure summary' },
  rt:         { cats: NONE, content: 'phrasing', desc: 'Ruby text component' },
  rp:         { cats: NONE, content: 'text', desc: 'Ruby fallback parenthesis' },
  source:     { cats: NONE, content: 'void', desc: 'Media source' },
  track:      { cats: NONE, content: 'void', desc: 'Timed text track' },

  // ── Scripting ──
  script:   { cats: MFP, content: 'text', desc: 'Executable script' },
  noscript: { cats: MFP, content: 'flow', desc: 'No-script fallback' },
  template: { cats: MFP, content: 'flow', desc: 'Content template' },

  // ── Other ──
  map:  { cats: FP, content: 'transparent', desc: 'Image map' },
  area: { cats: FP, content: 'void', desc: 'Image map region' },
  slot: { cats: FP, content: 'transparent', desc: 'Web component slot' },
};

export const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'source', 'track', 'wbr',
]);

export type DisplayType = 'inline' | 'block' | 'inline-block' | 'table' | 'none' | 'list-item';

const displayTypes: Record<string, DisplayType> = {
  a: 'inline', abbr: 'inline', area: 'inline', b: 'inline', bdi: 'inline',
  bdo: 'inline', br: 'inline', cite: 'inline', code: 'inline', data: 'inline',
  datalist: 'inline', del: 'inline', dfn: 'inline', em: 'inline', i: 'inline',
  ins: 'inline', kbd: 'inline', label: 'inline', map: 'inline', mark: 'inline',
  meter: 'inline', output: 'inline', progress: 'inline', q: 'inline',
  ruby: 'inline', rp: 'inline', rt: 'inline', s: 'inline', samp: 'inline',
  small: 'inline', span: 'inline', slot: 'inline', strong: 'inline',
  sub: 'inline', sup: 'inline', time: 'inline', u: 'inline', var: 'inline',
  wbr: 'inline',

  address: 'block', article: 'block', aside: 'block', blockquote: 'block',
  dd: 'block', details: 'block', dialog: 'block', div: 'block', dl: 'block',
  dt: 'block', fieldset: 'block', figcaption: 'block', figure: 'block',
  footer: 'block', form: 'block', h1: 'block', h2: 'block', h3: 'block',
  h4: 'block', h5: 'block', h6: 'block', header: 'block', hgroup: 'block',
  hr: 'block', legend: 'block', main: 'block', menu: 'block', nav: 'block',
  noscript: 'block', ol: 'block', optgroup: 'block', option: 'block',
  p: 'block', pre: 'block', search: 'block', section: 'block', summary: 'block',
  ul: 'block',

  audio: 'inline-block', button: 'inline-block', canvas: 'inline-block',
  embed: 'inline-block', iframe: 'inline-block', img: 'inline-block',
  input: 'inline-block', object: 'inline-block', picture: 'inline-block',
  select: 'inline-block', svg: 'inline-block', textarea: 'inline-block',
  video: 'inline-block',

  table: 'table', caption: 'table', col: 'table', colgroup: 'table',
  thead: 'table', tbody: 'table', tfoot: 'table', tr: 'table',
  td: 'table', th: 'table',

  script: 'none', template: 'none', source: 'none', track: 'none',

  li: 'list-item',
};

export function getDisplayType(tag: string): DisplayType {
  return displayTypes[tag] || 'block';
}

const BROWSER_NOTES: Record<string, string> = {
  'p,p':       'The browser auto-closes the first &lt;p&gt; before opening the second, creating two siblings instead of nested elements.',
  'div,p':     'The browser auto-closes the &lt;p&gt; before the &lt;div&gt;, creating sibling elements in the DOM.',
  'ul,p':      'The browser auto-closes the &lt;p&gt; before the &lt;ul&gt;.',
  'ol,p':      'The browser auto-closes the &lt;p&gt; before the &lt;ol&gt;.',
  'table,p':   'The browser auto-closes the &lt;p&gt; before the table.',
  'h1,p':      'The browser auto-closes the &lt;p&gt; before the heading.',
  'h2,p':      'The browser auto-closes the &lt;p&gt; before the heading.',
  'h3,p':      'The browser auto-closes the &lt;p&gt; before the heading.',
  'h4,p':      'The browser auto-closes the &lt;p&gt; before the heading.',
  'h5,p':      'The browser auto-closes the &lt;p&gt; before the heading.',
  'h6,p':      'The browser auto-closes the &lt;p&gt; before the heading.',
  'a,a':       'The browser closes the outer &lt;a&gt; before opening the inner one, breaking the expected structure.',
  'button,button': 'Browsers may render this incorrectly with broken event handling and accessibility.',
  'a,button':  'Interactive content inside a &lt;button&gt; creates UX and accessibility issues.',
  'button,a':  'Interactive content inside an &lt;a&gt; creates UX and accessibility issues.',
  'form,form': 'Nested forms are not allowed. The browser ignores the inner form.',
  'label,label': 'Nested labels create ambiguous associations with form controls.',
  'div,span':  'Browsers may move the &lt;div&gt; outside the &lt;span&gt;, creating unexpected layout.',
  'header,header': 'Browsers may render nested headers, but the semantics are incorrect.',
  'footer,footer': 'Browsers may render nested footers, but the semantics are incorrect.',
};

const CATEGORY_LABELS: Record<string, string> = {
  flow: 'flow',
  phrasing: 'phrasing',
  interactive: 'interactive',
  heading: 'heading',
  sectioning: 'sectioning',
  embedded: 'embedded',
  metadata: 'metadata',
};

function getMdnUrl(tag: string): string {
  const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  if (headingTags.includes(tag)) {
    return 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements';
  }
  return `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/${tag}`;
}

function getExampleContent(tag: string): string {
  const map: Record<string, string> = {
    a: 'Link text', button: 'Click me', p: 'Hello world', span: 'text',
    div: '...', h1: 'Title', h2: 'Subtitle', h3: 'Heading', h4: 'Heading',
    h5: 'Heading', h6: 'Heading', li: 'Item', td: 'Cell', th: 'Header',
    em: 'emphasized', strong: 'important', code: 'code()', pre: 'preformatted text',
    blockquote: 'A quote...', label: 'Label text', caption: 'Table caption',
    figcaption: 'Figure caption', summary: 'Summary text', legend: 'Legend text',
    option: 'Option', small: 'fine print', cite: 'Reference', q: 'quote',
    abbr: 'HTML', dfn: 'term', kbd: 'Enter', samp: 'output', mark: 'highlighted',
    time: '2025-01-01', data: 'Value', b: 'bold', i: 'italic', s: 'deleted',
    u: 'annotated', sub: 'sub', sup: 'sup', var: 'x', dt: 'Term', dd: 'Definition',
    output: 'Result', nav: '...', header: '...', footer: '...', main: '...',
    section: '...', article: '...', aside: '...', form: '...', fieldset: '...',
    figure: '...', details: '...', dialog: '...', address: '...', search: '...',
    table: '...', thead: '...', tbody: '...', tfoot: '...', tr: '...',
    rt: 'text', rp: '(', bdi: 'text', bdo: 'text', ruby: '漢字',
    meter: '', progress: '', select: '\n    <option>Option</option>\n  ',
    textarea: 'Text content', ul: '\n    <li>Item</li>\n  ',
    ol: '\n    <li>Item</li>\n  ', dl: '\n    <dt>Term</dt>\n    <dd>Def</dd>\n  ',
    hgroup: '\n    <h2>Title</h2>\n  ', colgroup: '\n    <col />\n  ',
    picture: '\n    <img src="photo.jpg" alt="..." />\n  ',
    datalist: '\n    <option value="opt" />\n  ',
    optgroup: '\n    <option>Opt</option>\n  ',
    menu: '\n    <li>Action</li>\n  ',
  };
  return map[tag] ?? '...';
}

function getExampleAttrs(tag: string): string {
  const map: Record<string, string> = {
    a: ' href="#"', img: ' src="photo.jpg" alt="..."', input: ' type="text"',
    form: ' action="/submit"', iframe: ' src="page.html"', video: ' src="video.mp4" controls',
    audio: ' src="audio.mp3" controls', embed: ' src="file.pdf"', object: ' data="file.swf"',
    canvas: ' width="300" height="150"', source: ' src="media.mp4" type="video/mp4"',
    track: ' src="subs.vtt" kind="subtitles"', area: ' shape="rect" coords="0,0,50,50" href="#"',
    label: ' for="input-id"', select: '', textarea: ' rows="3"',
    meter: ' value="0.7"', progress: ' value="70" max="100"',
    time: ' datetime="2025-01-01"', data: ' value="42"', col: ' span="2"',
    link: ' rel="stylesheet" href="style.css"', meta: ' name="description" content="..."',
    script: ' type="module"', abbr: ' title="HyperText Markup Language"',
    blockquote: ' cite="https://example.com"', q: ' cite="https://example.com"',
    ol: ' type="1"',
  };
  return map[tag] ?? '';
}

function generateCodeExample(childTag: string, parentTag: string): string {
  const childIsVoid = VOID_ELEMENTS.has(childTag);
  const parentIsVoid = VOID_ELEMENTS.has(parentTag);

  if (parentIsVoid) {
    return `<${parentTag}${getExampleAttrs(parentTag)} />\n<!-- Void elements can't have children -->`;
  }

  const childStr = childIsVoid
    ? `<${childTag}${getExampleAttrs(childTag)} />`
    : `<${childTag}${getExampleAttrs(childTag)}>${getExampleContent(childTag)}</${childTag}>`;

  const parentAttrs = getExampleAttrs(parentTag);
  return `<${parentTag}${parentAttrs}>\n  ${childStr}\n</${parentTag}>`;
}

function formatSpecificChildren(children: string[]): string {
  return children
    .filter(c => c !== 'script' && c !== 'template')
    .map(c => `<${c}>`)
    .join(', ');
}

export function checkNesting(childTag: string, parentTag: string): NestingResult {
  const parentDef = elements[parentTag];
  const childDef = elements[childTag];

  if (!parentDef || !childDef) {
    return {
      valid: 'no',
      reason: 'unknown',
      explanation: 'One or both elements are not in our database.',
      codeExample: '',
      parentMdn: getMdnUrl(parentTag),
      childMdn: getMdnUrl(childTag),
    };
  }

  const code = generateCodeExample(childTag, parentTag);
  const noteKey = `${childTag},${parentTag}`;
  const browserNote = BROWSER_NOTES[noteKey];
  const baseMdns = { parentMdn: getMdnUrl(parentTag), childMdn: getMdnUrl(childTag) };

  // 1. Void / nothing / text parents
  if (parentDef.content === 'void') {
    return {
      valid: 'no', reason: 'void',
      explanation: `<strong>&lt;${parentTag}&gt;</strong> is a void element and cannot have any children.`,
      codeExample: code, browserNote, ...baseMdns,
    };
  }
  if (parentDef.content === 'nothing') {
    return {
      valid: 'no', reason: 'nothing',
      explanation: `<strong>&lt;${parentTag}&gt;</strong> does not accept any content. Its content model is "nothing".`,
      codeExample: code, browserNote, ...baseMdns,
    };
  }
  if (parentDef.content === 'text') {
    return {
      valid: 'no', reason: 'text-only',
      explanation: `<strong>&lt;${parentTag}&gt;</strong> only accepts plain text content, not HTML elements.`,
      codeExample: code, browserNote, ...baseMdns,
    };
  }

  // 2. Specific children model
  if (parentDef.content === 'specific') {
    if (parentDef.children?.length === 0) {
      return {
        valid: 'no', reason: 'own-content-model',
        explanation: `<strong>&lt;${parentTag}&gt;</strong> has its own content model and does not accept standard HTML elements as direct children.`,
        codeExample: code, browserNote, ...baseMdns,
      };
    }
    if (!parentDef.children?.includes(childTag)) {
      const allowed = formatSpecificChildren(parentDef.children || []);
      return {
        valid: 'no', reason: 'not-allowed-child',
        explanation: `<strong>&lt;${parentTag}&gt;</strong> only accepts these direct children: ${allowed}. <strong>&lt;${childTag}&gt;</strong> is not in that list.`,
        codeExample: code, browserNote, ...baseMdns,
      };
    }
    // Child IS in the allowed list — check restrictions
    if (parentDef.noDesc) {
      const restriction = checkRestrictions(childTag, childDef, parentTag, parentDef);
      if (restriction) return { ...restriction, codeExample: code, browserNote, ...baseMdns };
    }
    return {
      valid: 'yes', reason: 'specific-child',
      explanation: `<strong>&lt;${childTag}&gt;</strong> is an allowed child of <strong>&lt;${parentTag}&gt;</strong>.`,
      codeExample: code, browserNote, ...baseMdns,
    };
  }

  // 3. Transparent content model
  if (parentDef.content === 'transparent') {
    // Check restrictions first (e.g. <a> no interactive descendants)
    if (parentDef.noDesc) {
      const restriction = checkRestrictions(childTag, childDef, parentTag, parentDef);
      if (restriction) return { ...restriction, codeExample: code, browserNote, ...baseMdns };
    }
    // Check also-accepted specific children
    if (parentDef.also?.includes(childTag)) {
      return {
        valid: 'yes', reason: 'also-accepted',
        explanation: `<strong>&lt;${childTag}&gt;</strong> is explicitly allowed as a child of <strong>&lt;${parentTag}&gt;</strong>.`,
        codeExample: code, browserNote, ...baseMdns,
      };
    }
    // Phrasing content is always safe inside transparent
    if (childDef.cats.includes('phrasing')) {
      return {
        valid: 'yes', reason: 'phrasing-in-transparent',
        explanation: `<strong>&lt;${childTag}&gt;</strong> is <em>phrasing</em> content, which is always valid inside <strong>&lt;${parentTag}&gt;</strong> (transparent content model).`,
        codeExample: code, browserNote, ...baseMdns,
      };
    }
    // Flow-only content depends on the context of the transparent parent
    if (childDef.cats.includes('flow')) {
      return {
        valid: 'depends', reason: 'transparent-context',
        explanation: `<strong>&lt;${parentTag}&gt;</strong> has a <em>transparent content model</em>: it inherits the content model of its parent. <strong>&lt;${childTag}&gt;</strong> is <em>flow</em> content (not <em>phrasing</em>), so it's only valid if <strong>&lt;${parentTag}&gt;</strong> is placed inside a flow content context (e.g. a &lt;div&gt;). If <strong>&lt;${parentTag}&gt;</strong> were inside a &lt;p&gt; or &lt;span&gt;, this would be invalid.`,
        codeExample: code, browserNote, ...baseMdns,
      };
    }
    // No-category element inside transparent
    if (childDef.cats.length === 0) {
      return {
        valid: 'no', reason: 'no-category',
        explanation: `<strong>&lt;${childTag}&gt;</strong> does not belong to any standard content category. It can only be used as a child of specific elements (like &lt;${getTypicalParent(childTag)}&gt;).`,
        codeExample: code, browserNote, ...baseMdns,
      };
    }
    return {
      valid: 'depends', reason: 'transparent-unknown',
      explanation: `<strong>&lt;${parentTag}&gt;</strong> has a transparent content model. The result depends on the context where <strong>&lt;${parentTag}&gt;</strong> is used.`,
      codeExample: code, browserNote, ...baseMdns,
    };
  }

  // 4. Flow content model
  if (parentDef.content === 'flow') {
    const allowed = childDef.cats.includes('flow') || parentDef.also?.includes(childTag);
    if (!allowed) {
      if (childDef.cats.length === 0) {
        return {
          valid: 'no', reason: 'no-category',
          explanation: `<strong>&lt;${childTag}&gt;</strong> does not belong to any content category. It can only be used inside its specific parent (like &lt;${getTypicalParent(childTag)}&gt;), not inside <strong>&lt;${parentTag}&gt;</strong>.`,
          codeExample: code, browserNote, ...baseMdns,
        };
      }
      return {
        valid: 'no', reason: 'not-flow',
        explanation: `<strong>&lt;${parentTag}&gt;</strong> accepts <em>flow</em> content, but <strong>&lt;${childTag}&gt;</strong> is not flow content.`,
        codeExample: code, browserNote, ...baseMdns,
      };
    }
    // Check restrictions
    if (parentDef.noDesc) {
      const restriction = checkRestrictions(childTag, childDef, parentTag, parentDef);
      if (restriction) return { ...restriction, codeExample: code, browserNote, ...baseMdns };
    }
    const catList = childDef.cats.map(c => `<em>${CATEGORY_LABELS[c]}</em>`).join(', ');
    return {
      valid: 'yes', reason: 'flow-accepted',
      explanation: `<strong>&lt;${parentTag}&gt;</strong> accepts <em>flow</em> content and <strong>&lt;${childTag}&gt;</strong> is ${catList} content.`,
      codeExample: code, browserNote, ...baseMdns,
    };
  }

  // 5. Phrasing content model
  if (parentDef.content === 'phrasing') {
    const allowed = childDef.cats.includes('phrasing') || parentDef.also?.includes(childTag);
    if (!allowed) {
      if (childDef.cats.includes('flow') && !childDef.cats.includes('phrasing')) {
        return {
          valid: 'no', reason: 'not-phrasing',
          explanation: `<strong>&lt;${parentTag}&gt;</strong> only accepts <em>phrasing</em> content (inline-level elements). <strong>&lt;${childTag}&gt;</strong> is <em>flow</em> content (block-level), not <em>phrasing</em>.`,
          codeExample: code, browserNote, ...baseMdns,
        };
      }
      if (childDef.cats.length === 0) {
        return {
          valid: 'no', reason: 'no-category',
          explanation: `<strong>&lt;${childTag}&gt;</strong> does not belong to any content category. It can only be used inside its specific parent (like &lt;${getTypicalParent(childTag)}&gt;), not inside <strong>&lt;${parentTag}&gt;</strong>.`,
          codeExample: code, browserNote, ...baseMdns,
        };
      }
      return {
        valid: 'no', reason: 'not-phrasing-generic',
        explanation: `<strong>&lt;${parentTag}&gt;</strong> only accepts <em>phrasing</em> content. <strong>&lt;${childTag}&gt;</strong> is not phrasing content.`,
        codeExample: code, browserNote, ...baseMdns,
      };
    }
    // Check restrictions
    if (parentDef.noDesc) {
      const restriction = checkRestrictions(childTag, childDef, parentTag, parentDef);
      if (restriction) return { ...restriction, codeExample: code, browserNote, ...baseMdns };
    }
    return {
      valid: 'yes', reason: 'phrasing-accepted',
      explanation: `<strong>&lt;${parentTag}&gt;</strong> accepts <em>phrasing</em> content and <strong>&lt;${childTag}&gt;</strong> is <em>phrasing</em> content.`,
      codeExample: code, browserNote, ...baseMdns,
    };
  }

  return {
    valid: 'no', reason: 'unknown-model',
    explanation: 'Could not determine the validity of this combination.',
    codeExample: code, browserNote, ...baseMdns,
  };
}

function checkRestrictions(
  childTag: string, childDef: ElementDef,
  parentTag: string, parentDef: ElementDef,
): Omit<NestingResult, 'codeExample' | 'browserNote' | 'parentMdn' | 'childMdn'> | null {
  if (!parentDef.noDesc) return null;

  for (const forbidden of parentDef.noDesc) {
    if (forbidden.startsWith('@')) {
      const category = forbidden.slice(1) as ContentCategory;
      if (childDef.cats.includes(category)) {
        return {
          valid: 'no',
          reason: 'forbidden-category',
          explanation: `<strong>&lt;${parentTag}&gt;</strong> cannot contain <em>${CATEGORY_LABELS[category]}</em> content descendants. <strong>&lt;${childTag}&gt;</strong> is <em>${CATEGORY_LABELS[category]}</em> content, so this combination is invalid.`,
        };
      }
    } else if (forbidden === childTag) {
      return {
        valid: 'no',
        reason: 'forbidden-element',
        explanation: `<strong>&lt;${parentTag}&gt;</strong> cannot contain <strong>&lt;${childTag}&gt;</strong> as a descendant. This restriction is explicitly defined in the HTML specification.`,
      };
    }
  }
  return null;
}

function getTypicalParent(tag: string): string {
  const map: Record<string, string> = {
    li: 'ul, ol', dt: 'dl', dd: 'dl', tr: 'tbody, table', td: 'tr', th: 'tr',
    thead: 'table', tbody: 'table', tfoot: 'table', caption: 'table',
    colgroup: 'table', col: 'colgroup', option: 'select', optgroup: 'select',
    legend: 'fieldset', figcaption: 'figure', summary: 'details',
    source: 'video, audio, picture', track: 'video, audio',
    rt: 'ruby', rp: 'ruby',
  };
  return map[tag] ?? '...';
}

export function getAllTags(): string[] {
  return Object.keys(elements).sort();
}

export function getElementsByCategory(category: ContentCategory): string[] {
  return Object.entries(elements)
    .filter(([, def]) => def.cats.includes(category))
    .map(([tag]) => tag)
    .sort();
}

// ── Easter eggs for fun/absurd combinations ──
export const EASTER_EGGS: Record<string, string> = {
  'br,br':           '💔 A break inside a break? That\'s already broken in every possible way.',
  'hr,hr':           '🎭 A thematic break inside a thematic break — peak drama.',
  'p,p':             '⚡ The classic trap! Browsers auto-close the first &lt;p&gt; before you even finish thinking.',
  'div,span':        '🥊 The eternal battle: block vs inline. Block always wins… by breaking out.',
  'div,p':           '🏆 The #1 HTML nesting mistake on the internet. Welcome to the club!',
  'a,a':             '🔗 Links inside links — the HTML spec\'s forbidden love story.',
  'a,button':        '🚫 Interactive inside interactive: a recipe for browser chaos.',
  'button,a':        '🤔 The interactive content paradox — who gets the click?',
  'button,button':   '🪆 Button inception! The spec woke up before this dream could work.',
  'form,form':       '🥷 Nested forms: the forbidden technique. Not even CSS can save you.',
  'table,p':         '📊 Tables don\'t fit inside paragraphs. They\'re too big for that!',
  'img,div':         '🖼️ Fun fact: &lt;img&gt; is a void element — no children allowed. Not even a text node!',
  'input,div':       '🚪 &lt;input&gt; is a void element — it lives alone, no children allowed.',
  'h1,p':            '📢 Headings are too important to be trapped inside a paragraph.',
  'ul,p':            '📝 Lists break out of paragraphs — the browser literally splits the &lt;p&gt; in two.',
  'span,span':       '🎯 Perfectly valid! Inline elements nesting happily — as HTML intended.',
  'div,div':         '📦 Divs inside divs — the backbone of every web developer\'s career.',
  'li,div':          '🎉 Plot twist: &lt;li&gt; can actually contain almost anything. It\'s surprisingly permissive!',
  'header,header':   '🤕 Two headers? Even your website gets a headache from this.',
  'footer,footer':   '👟 Footers inside footers — it\'s turtles all the way down.',
  'form,form':       '🚫 The browser literally ignores the inner form. It\'s like it doesn\'t exist.',
};

// ── Well-known tricky combinations ──
export const TRICKY_COMBOS = new Set([
  'div,p', 'div,span', 'p,p', 'a,button', 'button,a', 'a,a',
  'button,button', 'ul,p', 'ol,p', 'h1,p', 'h2,p', 'table,p',
  'form,form', 'header,header', 'footer,footer', 'main,main',
  'div,a', 'label,label', 'section,p', 'img,button',
]);

// ── DOM correction visualization ──
const P_AUTO_CLOSE = new Set([
  'address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl',
  'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2',
  'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'menu',
  'nav', 'ol', 'p', 'pre', 'search', 'section', 'table', 'ul',
]);

const INLINE_ELEMENTS = new Set([
  'span', 'em', 'strong', 'b', 'i', 'small', 'cite', 'q', 'code',
  'abbr', 'dfn', 'kbd', 'mark', 's', 'samp', 'sub', 'sup', 'u', 'var',
]);

export function getDomCorrection(
  child: string, parent: string,
): { wrote: string; sees: string } | null {
  const isVoid = VOID_ELEMENTS.has(child);
  const childStr = isVoid ? `<${child}>` : `<${child}>...</${child}>`;

  if (parent === 'p' && P_AUTO_CLOSE.has(child)) {
    if (child === 'p') {
      return {
        wrote: `<p>\n  <p>...</p>\n</p>`,
        sees: `<p></p>\n<p>...</p>`,
      };
    }
    return {
      wrote: `<p>\n  ${childStr}\n</p>`,
      sees: `<p></p>\n${childStr}\n<p></p>`,
    };
  }

  if (INLINE_ELEMENTS.has(parent) && getDisplayType(child) === 'block') {
    return {
      wrote: `<${parent}>\n  ${childStr}\n</${parent}>`,
      sees: `<${parent}></${parent}>\n${childStr}`,
    };
  }

  if (['a', 'button'].includes(parent) && ['a', 'button'].includes(child)) {
    return {
      wrote: `<${parent}>\n  <${child}>...</${child}>\n</${parent}>`,
      sees: `<${parent}></${parent}>\n<${child}>...</${child}>`,
    };
  }

  return null;
}

// ── Quiz question pool ──
export interface QuizQuestion {
  child: string;
  parent: string;
  answer: 'yes' | 'no' | 'depends';
}

export const QUIZ_POOL: QuizQuestion[] = [
  { child: 'div', parent: 'p', answer: 'no' },
  { child: 'p', parent: 'p', answer: 'no' },
  { child: 'a', parent: 'a', answer: 'no' },
  { child: 'button', parent: 'a', answer: 'no' },
  { child: 'a', parent: 'button', answer: 'no' },
  { child: 'div', parent: 'span', answer: 'no' },
  { child: 'ul', parent: 'p', answer: 'no' },
  { child: 'h1', parent: 'p', answer: 'no' },
  { child: 'form', parent: 'form', answer: 'no' },
  { child: 'button', parent: 'button', answer: 'no' },
  { child: 'header', parent: 'header', answer: 'no' },
  { child: 'table', parent: 'p', answer: 'no' },
  { child: 'section', parent: 'p', answer: 'no' },
  { child: 'h2', parent: 'h1', answer: 'no' },
  { child: 'label', parent: 'label', answer: 'no' },
  { child: 'span', parent: 'div', answer: 'yes' },
  { child: 'div', parent: 'div', answer: 'yes' },
  { child: 'p', parent: 'div', answer: 'yes' },
  { child: 'img', parent: 'button', answer: 'yes' },
  { child: 'span', parent: 'span', answer: 'yes' },
  { child: 'input', parent: 'label', answer: 'yes' },
  { child: 'strong', parent: 'em', answer: 'yes' },
  { child: 'img', parent: 'p', answer: 'yes' },
  { child: 'li', parent: 'ul', answer: 'yes' },
  { child: 'td', parent: 'tr', answer: 'yes' },
  { child: 'em', parent: 'a', answer: 'yes' },
  { child: 'video', parent: 'div', answer: 'yes' },
  { child: 'nav', parent: 'div', answer: 'yes' },
  { child: 'div', parent: 'a', answer: 'depends' },
  { child: 'ul', parent: 'a', answer: 'depends' },
  { child: 'div', parent: 'del', answer: 'depends' },
];
