import { z } from 'zod';

export const leadScorerSchema = z.object({
  companyName: z.string().describe('The official name of the company or prospect organization'),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']).describe('Number of employees in the organization'),
  budget: z.number().min(0).describe('Annual allocated software budget in USD'),
  useCase: z.string().describe('Primary business objective or project requirements'),
  contactEmail: z.string().email().describe('Primary contact email address for validation'),
});

export type LeadScorerInput = z.infer<typeof leadScorerSchema>;

export interface LeadScorerResult {
  leadId: string;
  companyName: string;
  overallScore: number;
  tier: 'HOT' | 'WARM' | 'COLD';
  metrics: {
    budgetFit: number;
    teamFit: number;
    intentScore: number;
    urgencyRating: 'High' | 'Medium' | 'Low';
  };
  estimatedRevenue: string;
  keyRecommendations: string[];
  scoredAt: string;
}

export async function executeLeadScorer(input: LeadScorerInput): Promise<LeadScorerResult> {
  // Simulate network delay for realistic tool execution state
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Intentional Error Trigger for testing State 4 (output-error)
  if (
    input.contactEmail.toLowerCase().includes('fail') ||
    input.contactEmail.toLowerCase().includes('error') ||
    input.companyName.toLowerCase().includes('fail')
  ) {
    throw new Error(
      `LEAD_SCORING_ERROR: Unable to score lead "${input.companyName}". Contact email validation failed or lead database server returned 503 Service Unavailable.`
    );
  }

  // Calculate score based on inputs
  let score = 40;

  // Budget points
  if (input.budget >= 50000) score += 30;
  else if (input.budget >= 20000) score += 20;
  else if (input.budget >= 5000) score += 10;

  // Size points
  if (input.companySize === '1000+') score += 25;
  else if (input.companySize === '201-1000') score += 20;
  else if (input.companySize === '51-200') score += 15;
  else score += 5;

  // Use case complexity bonus
  if (input.useCase.length > 20) score += 5;

  const finalScore = Math.min(Math.max(score, 15), 98);
  const tier: 'HOT' | 'WARM' | 'COLD' =
    finalScore >= 80 ? 'HOT' : finalScore >= 55 ? 'WARM' : 'COLD';

  const budgetFit = Math.min(Math.round((input.budget / 60000) * 100), 100);
  const teamFitMap: Record<string, number> = {
    '1-10': 45,
    '11-50': 65,
    '51-200': 85,
    '201-1000': 95,
    '1000+': 100,
  };
  const teamFit = teamFitMap[input.companySize] || 70;
  const intentScore = Math.round((finalScore * 0.4) + (budgetFit * 0.6));

  return {
    leadId: `LEAD-${Math.floor(100000 + Math.random() * 900000)}`,
    companyName: input.companyName,
    overallScore: finalScore,
    tier,
    metrics: {
      budgetFit,
      teamFit,
      intentScore,
      urgencyRating: finalScore >= 75 ? 'High' : finalScore >= 50 ? 'Medium' : 'Low',
    },
    estimatedRevenue: `$${(Math.round(input.budget * 0.8 / 1000) * 1000).toLocaleString()}/yr`,
    keyRecommendations: [
      tier === 'HOT' ? 'Assign Senior AE within 2 hours' : 'Enroll in automated nurture sequence',
      `Target focus area: ${input.useCase.slice(0, 35)}...`,
      input.budget >= 30000 ? 'Offer custom enterprise pilot' : 'Send standard tier pricing deck',
    ],
    scoredAt: new Date().toLocaleTimeString(),
  };
}
