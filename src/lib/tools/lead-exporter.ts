import { z } from 'zod';

export const leadExporterSchema = z.object({
  leadId: z.string().describe('Unique Lead ID to be exported'),
  exportFormat: z.enum(['CSV', 'JSON', 'Salesforce', 'HubSpot']).describe('Format or target platform for export'),
  recipientEmail: z.string().email().describe('Email to receive export notification/data'),
});

export type LeadExporterInput = z.infer<typeof leadExporterSchema>;

export interface LeadExporterResult {
  exportId: string;
  leadId: string;
  status: 'COMPLETED' | 'CANCELLED';
  format: string;
  recipientEmail: string;
  timestamp: string;
}

export async function executeLeadExporter(input: LeadExporterInput): Promise<LeadExporterResult> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (input.recipientEmail.toLowerCase().includes('fail')) {
    throw new Error(`EXPORT_DENIED: Lead export to recipient ${input.recipientEmail} failed permission verification.`);
  }

  return {
    exportId: `EXP-${Math.floor(100000 + Math.random() * 900000)}`,
    leadId: input.leadId,
    status: 'COMPLETED',
    format: input.exportFormat,
    recipientEmail: input.recipientEmail,
    timestamp: new Date().toLocaleTimeString(),
  };
}
