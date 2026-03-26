import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import { checkNesting, elements } from '../../data/html-nesting';

function buildResultSvg(
  child: string,
  parent: string,
  verdict: string,
  verdictColor: string,
): string {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#1C1917"/>
  <text x="80" y="100" font-family="Georgia, serif" font-size="52" fill="#E7E5E4">Can I Wrap?</text>
  <text x="600" y="290" font-family="monospace" font-size="36" fill="#A8A29E" text-anchor="middle">Can &lt;${child}&gt; go inside &lt;${parent}&gt;?</text>
  <line x1="200" y1="340" x2="1000" y2="340" stroke="#44403C" stroke-width="1"/>
  <text x="600" y="420" font-family="sans-serif" font-size="56" font-weight="bold" fill="${verdictColor}" text-anchor="middle">${verdict}</text>
  <text x="1120" y="590" font-family="monospace" font-size="24" fill="#78716C" text-anchor="end">caniwrap.com</text>
</svg>`;
}

function buildDefaultSvg(): string {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#1C1917"/>
  <text x="600" y="260" font-family="Georgia, serif" font-size="72" fill="#E7E5E4" text-anchor="middle">Can I Wrap?</text>
  <text x="600" y="340" font-family="sans-serif" font-size="32" fill="#A8A29E" text-anchor="middle">Check HTML element nesting rules</text>
  <text x="600" y="560" font-family="monospace" font-size="24" fill="#78716C" text-anchor="middle">caniwrap.com</text>
</svg>`;
}

export const GET: APIRoute = async ({ url }) => {
  const child = url.searchParams.get('child') || '';
  const parent = url.searchParams.get('parent') || '';

  let svg: string;
  if (child && parent && elements[child] && elements[parent]) {
    const result = checkNesting(child, parent);
    const verdict =
      result.valid === 'yes'
        ? '\u2713 Yes, you can!'
        : result.valid === 'no'
          ? '\u2717 No, you can\u2019t'
          : '? It depends';
    const verdictColor =
      result.valid === 'yes'
        ? '#4ADE80'
        : result.valid === 'no'
          ? '#F87171'
          : '#FBBF24';
    svg = buildResultSvg(child, parent, verdict, verdictColor);
  } else {
    svg = buildDefaultSvg();
  }

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000',
    },
  });
};
