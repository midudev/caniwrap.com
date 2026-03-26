import { elements, checkNesting, getAllTags, getDisplayType, VOID_ELEMENTS, type NestingResult } from '../data/html-nesting';

const childInput = document.getElementById('child-input') as HTMLInputElement;
const parentInput = document.getElementById('parent-input') as HTMLInputElement;
const childWrapper = document.getElementById('child-wrapper')!;
const parentWrapper = document.getElementById('parent-wrapper')!;
const childDropdown = document.getElementById('child-dropdown')!;
const parentDropdown = document.getElementById('parent-dropdown')!;
const resultEl = document.getElementById('result')!;
const swapBtn = document.getElementById('swap-btn')!;
const resetBtn = document.getElementById('reset-btn')!;

let selectedChild: string | null = null;
let selectedParent: string | null = null;
let swapRotation = 0;
const allTags = getAllTags();

function highlightHtml(raw: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return raw.replace(
    /(<!--[\s\S]*?-->)|(<\/?)(\w[\w-]*)((?:\s+[\w-]+(?:="[^"]*")?)*)\s*(\/?>)/g,
    (_match, comment, open, tag, attrs, close) => {
      if (comment) return `<span class="hl-comment">${esc(comment)}</span>`;
      const highlightedAttrs = (attrs || '').replace(
        /([\w-]+)(="[^"]*")?/g,
        (_: string, name: string, val: string) => {
          if (!name) return esc(_);
          let result = `<span class="hl-attr">${esc(name)}</span>`;
          if (val) {
            const inner = val.slice(1);
            result += `=<span class="hl-string">${esc(inner)}</span>`;
          }
          return result;
        },
      );
      return `${esc(open)}<span class="hl-tag">${esc(tag)}</span>${highlightedAttrs}${esc(close)}`;
    },
  );
}

function setupAutocomplete(
  input: HTMLInputElement,
  wrapper: HTMLElement,
  dropdown: HTMLElement,
  prefix: string,
  onSelect: (tag: string) => void,
) {
  let activeIndex = -1;

  function render(filter: string = '') {
    const lower = filter.toLowerCase().trim();
    const filtered = lower
      ? allTags.filter(tag => tag.startsWith(lower) || elements[tag].desc.toLowerCase().includes(lower))
      : allTags;

    if (filtered.length === 0 || (filtered.length === 1 && filtered[0] === lower)) {
      dropdown.classList.add('hidden');
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      return;
    }

    activeIndex = -1;
    input.removeAttribute('aria-activedescendant');
    dropdown.innerHTML = filtered
      .map(
        tag =>
          `<div role="option" id="${prefix}-opt-${tag}" class="autocomplete-option" data-tag="${tag}">
            <span class="tag-name"><span class="tag-bracket">&lt;</span><span class="tag-el">${tag}</span><span class="tag-bracket">&gt;</span></span>
            <span class="tag-desc">${elements[tag].desc}</span>
          </div>`,
      )
      .join('');
    dropdown.classList.remove('hidden');
    input.setAttribute('aria-expanded', 'true');
  }

  function selectTag(tag: string) {
    input.value = tag;
    wrapper.classList.add('has-value');
    dropdown.classList.add('hidden');
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    onSelect(tag);
    updateResetVisibility();
  }

  input.addEventListener('input', () => {
    const val = input.value.toLowerCase().trim();
    wrapper.classList.toggle('has-value', val.length > 0);
    render(input.value);
    if (elements[val]) {
      onSelect(val);
      updateResetVisibility();
    }
  });

  input.addEventListener('focus', () => render(input.value));

  input.addEventListener('keydown', (e) => {
    const options = dropdown.querySelectorAll<HTMLElement>('.autocomplete-option');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, options.length - 1);
      updateActive(options);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActive(options);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && options[activeIndex]) {
        const tag = options[activeIndex].dataset.tag!;
        selectTag(tag);
      } else {
        const val = input.value.toLowerCase().trim();
        if (elements[val]) selectTag(val);
      }
    } else if (e.key === 'Escape') {
      dropdown.classList.add('hidden');
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }
  });

  function updateActive(options: NodeListOf<HTMLElement>) {
    options.forEach((o, i) => o.classList.toggle('active', i === activeIndex));
    if (activeIndex >= 0 && options[activeIndex]) {
      options[activeIndex].scrollIntoView({ block: 'nearest' });
      input.setAttribute('aria-activedescendant', options[activeIndex].id);
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  dropdown.addEventListener('click', (e) => {
    const option = (e.target as HTMLElement).closest('[data-tag]') as HTMLElement;
    if (option) selectTag(option.dataset.tag!);
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target as Node) && !dropdown.contains(e.target as Node)) {
      dropdown.classList.add('hidden');
      input.setAttribute('aria-expanded', 'false');
    }
  });

  return { selectTag };
}

function check() {
  if (!selectedChild || !selectedParent) {
    resultEl.innerHTML = '';
    return;
  }
  const result = checkNesting(selectedChild, selectedParent);
  displayResult(result, selectedChild, selectedParent);
  updateURL();
  updateResetVisibility();
}

function updateURL() {
  if (!selectedChild || !selectedParent) return;
  const url = new URL(window.location.href);
  url.searchParams.set('child', selectedChild);
  url.searchParams.set('parent', selectedParent);
  window.history.replaceState({}, '', url.toString());
  document.title = `Can <${selectedChild}> go inside <${selectedParent}>? — Can I Wrap?`;
}

function updateResetVisibility() {
  const hasValues = !!selectedChild || !!selectedParent || childInput.value.trim() !== '' || parentInput.value.trim() !== '';
  resetBtn.classList.toggle('hidden', !hasValues);
}

function resetAll() {
  selectedChild = null;
  selectedParent = null;
  childInput.value = '';
  parentInput.value = '';
  childWrapper.classList.remove('has-value');
  parentWrapper.classList.remove('has-value');
  childInput.setAttribute('aria-expanded', 'false');
  parentInput.setAttribute('aria-expanded', 'false');
  childInput.removeAttribute('aria-activedescendant');
  parentInput.removeAttribute('aria-activedescendant');
  resultEl.innerHTML = '';
  resetBtn.classList.add('hidden');
  const url = new URL(window.location.href);
  url.searchParams.delete('child');
  url.searchParams.delete('parent');
  window.history.replaceState({}, '', url.toString());
  document.title = 'Can I Wrap? — HTML Element Nesting Checker';
}

async function copyLink() {
  const btn = resultEl.querySelector('.copy-link-btn');
  if (!btn) return;
  try {
    await navigator.clipboard.writeText(window.location.href);
    const original = btn.innerHTML;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Copied!`;
    setTimeout(() => { btn.innerHTML = original; }, 2000);
  } catch {
    // Clipboard API unavailable
  }
}

const DISPLAY_META: Record<string, { label: string; color: string }> = {
  'inline':       { label: 'Inline',          color: '#0369a1' },
  'block':        { label: 'Block',            color: '#c2410c' },
  'inline-block': { label: 'Inline replaced',  color: '#7c3aed' },
  'table':        { label: 'Table',            color: '#0f766e' },
  'list-item':    { label: 'List item',        color: '#b45309' },
  'none':         { label: 'Hidden',           color: '#78716c' },
};

const CONTENT_MODEL_LABELS: Record<string, string> = {
  flow: 'Flow content',
  phrasing: 'Phrasing content',
  transparent: 'Transparent (inherits parent)',
  void: 'No children (void)',
  text: 'Text only',
  nothing: 'No content',
  specific: 'Specific children only',
};

function buildElementCard(tag: string, role: 'child' | 'parent') {
  const def = elements[tag];
  const display = getDisplayType(tag);
  const dm = DISPLAY_META[display] || DISPLAY_META['block'];
  const isVoid = VOID_ELEMENTS.has(tag);
  const contentLabel = CONTENT_MODEL_LABELS[def.content] || def.content;

  const catBadges = def.cats.length > 0
    ? def.cats.map(c => `<a href="#${c}" class="el-cat-badge">${c}</a>`).join('')
    : '<span class="el-cat-badge el-cat-none">no category</span>';

  const modelRow = role === 'parent'
    ? `<div class="el-card-model">
        <span class="el-card-model-label">Accepts</span>
        <span class="el-card-model-value">${contentLabel}</span>
      </div>`
    : '';

  const roleLabel = role === 'parent' ? 'Parent' : 'Child';

  return `
    <div class="el-card" data-role="${role}">
      <span class="el-card-role">${roleLabel}</span>
      <div class="el-card-top">
        <span class="el-card-tag">&lt;${tag}&gt;</span>
        <span class="el-card-display" style="--dc: ${dm.color}">${dm.label}</span>
      </div>
      <span class="el-card-desc">${def.desc}${isVoid ? ' · <span class="el-void">void</span>' : ''}</span>
      <div class="el-card-cats">${catBadges}</div>
      ${modelRow}
    </div>
  `;
}

function displayResult(result: NestingResult, child: string, parent: string) {
  const cls = result.valid === 'yes' ? 'result-yes' : result.valid === 'no' ? 'result-no' : 'result-depends';
  const icon = result.valid === 'yes' ? '✓' : result.valid === 'no' ? '✗' : '?';
  const verdict =
    result.valid === 'yes'
      ? 'Yes, you can!'
      : result.valid === 'no'
        ? "No, you can't"
        : 'It depends on context';

  const codeLabel =
    result.valid === 'yes' ? 'Valid HTML' : result.valid === 'no' ? 'Invalid HTML' : 'Context-dependent';

  const LINKABLE_CATS = ['flow', 'phrasing', 'interactive', 'heading', 'sectioning', 'embedded'];
  const explanation = result.explanation.replace(
    /<em>(\w+)<\/em>/g,
    (_, cat) => LINKABLE_CATS.includes(cat)
      ? `<a href="#${cat}" class="cat-link">${cat}</a>`
      : `<em>${cat}</em>`,
  );

  resultEl.innerHTML = `
    <div class="result-card ${cls}">
      <div class="verdict"><span class="verdict-icon">${icon}</span> ${verdict}</div>
      <p class="explanation">${explanation}</p>

      <div class="el-cards">
        ${buildElementCard(parent, 'parent')}
        ${buildElementCard(child, 'child')}
      </div>

      ${result.browserNote ? `<div class="browser-note"><strong>Browser behavior:</strong> ${result.browserNote}</div>` : ''}
      ${
        result.codeExample
          ? `<div class="code-block">
              <div class="code-header">${codeLabel}</div>
              <pre><code>${highlightHtml(result.codeExample)}</code></pre>
            </div>`
          : ''
      }
      <div class="references">
        <a href="${result.childMdn}" target="_blank" rel="noopener">MDN: &lt;${child}&gt; ↗</a>
        <a href="${result.parentMdn}" target="_blank" rel="noopener">MDN: &lt;${parent}&gt; ↗</a>
        <button type="button" class="copy-link-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copy link
        </button>
      </div>
    </div>
  `;
}

resultEl.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('.copy-link-btn')) {
    copyLink();
  }
});

// ── Setup autocomplete ──
setupAutocomplete(childInput, childWrapper, childDropdown, 'child', (tag) => {
  selectedChild = tag;
  check();
});

setupAutocomplete(parentInput, parentWrapper, parentDropdown, 'parent', (tag) => {
  selectedParent = tag;
  check();
});

// ── Swap button ──
swapBtn.addEventListener('click', () => {
  swapRotation += 180;
  const svg = swapBtn.querySelector('svg') as SVGElement;
  if (svg) svg.style.transform = `rotate(${swapRotation}deg)`;

  const tmpChild = selectedChild;
  const tmpParent = selectedParent;
  selectedChild = tmpParent;
  selectedParent = tmpChild;
  childInput.value = selectedChild || '';
  parentInput.value = selectedParent || '';
  childWrapper.classList.toggle('has-value', !!selectedChild);
  parentWrapper.classList.toggle('has-value', !!selectedParent);
  check();
});

// ── Reset button ──
resetBtn.addEventListener('click', resetAll);

// ── Popular checks ──
document.querySelectorAll<HTMLElement>('[data-check]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const [child, parent] = btn.dataset.check!.split(',');
    selectedChild = child;
    selectedParent = parent;
    childInput.value = child;
    parentInput.value = parent;
    childWrapper.classList.add('has-value');
    parentWrapper.classList.add('has-value');
    check();
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

// ── Category tag clicks → select as child ──
document.querySelectorAll<HTMLElement>('.cat-tag[data-child]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const tag = btn.dataset.child!;
    selectedChild = tag;
    childInput.value = tag;
    childWrapper.classList.add('has-value');
    if (selectedParent) check();
    updateResetVisibility();
    childInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ── URL params on load ──
const params = new URLSearchParams(window.location.search);
const urlChild = params.get('child');
const urlParent = params.get('parent');
if (urlChild && urlParent && elements[urlChild] && elements[urlParent]) {
  selectedChild = urlChild;
  selectedParent = urlParent;
  childInput.value = urlChild;
  parentInput.value = urlParent;
  childWrapper.classList.add('has-value');
  parentWrapper.classList.add('has-value');
  check();
}
