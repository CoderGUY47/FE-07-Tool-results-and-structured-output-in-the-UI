import { leadScorerSchema, executeLeadScorer } from './lead-scorer';
import { metaInspectorSchema, executeMetaInspector } from './meta-inspector';
import { leadExporterSchema, executeLeadExporter } from './lead-exporter';

export * from './lead-scorer';
export * from './meta-inspector';
export * from './lead-exporter';

export const toolsDefinition = {
  scoreLead: {
    description: 'Scores a sales lead prospect based on company size, budget, industry, and use case. Returns structured metrics, tier classification, and SVG charts.',
    parameters: leadScorerSchema,
    execute: executeLeadScorer,
  },
  fetchMetaTags: {
    description: 'Fetches and inspects website meta tags, title, description, OpenGraph tags, mobile readiness, and SEO health.',
    parameters: metaInspectorSchema,
    execute: executeMetaInspector,
  },
  confirmLeadExport: {
    description: 'Exports qualified lead report to external CRM or file format. Requires explicit client-side user confirmation before executing.',
    parameters: leadExporterSchema,
    execute: executeLeadExporter,
  },
};
