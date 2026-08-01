import { z } from 'zod';

export const metaInspectorSchema = z.object({
  url: z.string().describe('Target web address URL to inspect (e.g. https://example.com)'),
  checkOgTags: z.boolean().describe('Include social media Open Graph preview inspection'),
});

export type MetaInspectorInput = z.infer<typeof metaInspectorSchema>;

export interface MetaInspectorResult {
  url: string;
  domain: string;
  title: string;
  description: string;
  ogImage: string;
  ogType: string;
  seoScore: number;
  mobileReady: boolean;
  performanceGrade: 'A+' | 'A' | 'B' | 'C' | 'F';
  tagsFound: { name: string; content: string; status: 'ok' | 'warning' | 'missing' }[];
  issues: string[];
  inspectedAt: string;
}

export async function executeMetaInspector(input: MetaInspectorInput): Promise<MetaInspectorResult> {
  await new Promise((resolve) => setTimeout(resolve, 1600));

  // Intentional Error Trigger
  if (
    input.url.toLowerCase().includes('error.com') ||
    input.url.toLowerCase().includes('fail')
  ) {
    throw new Error(
      `META_FETCH_ERROR: Target URL "${input.url}" DNS resolution failed or origin server returned HTTP 504 Gateway Timeout.`
    );
  }

  let domain = 'example.com';
  try {
    const parsed = new URL(input.url.startsWith('http') ? input.url : `https://${input.url}`);
    domain = parsed.hostname;
  } catch {
    domain = input.url;
  }

  return {
    url: input.url,
    domain,
    title: `${domain.charAt(0).toUpperCase() + domain.slice(1)} | Next-Gen AI Experience`,
    description: `Official website of ${domain}. Providing high-performance AI tooling, structured outputs, and generative UI component workflows.`,
    ogImage: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80`,
    ogType: 'website',
    seoScore: 92,
    mobileReady: true,
    performanceGrade: 'A+',
    tagsFound: [
      { name: 'title', content: `${domain} - Modern Web App`, status: 'ok' },
      { name: 'description', content: 'Providing high-performance AI tooling...', status: 'ok' },
      { name: 'og:image', content: 'https://images.unsplash.com/...', status: input.checkOgTags ? 'ok' : 'missing' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1', status: 'ok' },
      { name: 'robots', content: 'index, follow', status: 'ok' },
    ],
    issues: [
      'Missing Twitter card image tag (twitter:image)',
      'Favicon format could be upgraded to SVG for retina displays',
    ],
    inspectedAt: new Date().toLocaleTimeString(),
  };
}
