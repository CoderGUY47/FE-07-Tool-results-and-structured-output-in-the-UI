import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import {
  leadScorerSchema,
  executeLeadScorer,
  metaInspectorSchema,
  executeMetaInspector,
  leadExporterSchema,
  executeLeadExporter,
} from '@/lib/tools';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, simulatedMode, simulatedError } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || '';

    // If simulated mode is enabled or no API key set in environment, use high-fidelity simulator
    const hasApiKey = process.env.OPENAI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (simulatedMode || !hasApiKey) {
      return handleSimulatedResponse(lastMessage, simulatedError);
    }

    const provider = process.env.GOOGLE_GENERATIVE_AI_API_KEY
      ? google('gemini-1.5-flash')
      : openai('gpt-4o-mini');

    const scoreLeadTool = tool({
      description: 'Scores a sales lead prospect based on company size, budget, industry, and use case.',
      parameters: leadScorerSchema,
      execute: async (args: any) => executeLeadScorer(args as any),
    } as any);

    const fetchMetaTagsTool = tool({
      description: 'Fetches and inspects website meta tags, title, description, OpenGraph tags, and SEO health.',
      parameters: metaInspectorSchema,
      execute: async (args: any) => executeMetaInspector(args as any),
    } as any);

    const confirmLeadExportTool = tool({
      description: 'Exports qualified lead report. Requires client-side user confirmation before running.',
      parameters: leadExporterSchema,
      execute: async (args: any) => executeLeadExporter(args as any),
    } as any);

    const result = streamText({
      model: provider as any,
      messages,
      system: `You are an AI assistant equipped with server-side tools.
When asked to evaluate prospects or company data, call the 'scoreLead' tool.
When asked to analyze websites, SEO, or URLs, call the 'fetchMetaTags' tool.
When asked to export or share reports, call the 'confirmLeadExport' tool.
Always utilize the appropriate tool and answer concisely after tool execution.`,
      tools: {
        scoreLead: scoreLeadTool,
        fetchMetaTags: fetchMetaTagsTool,
        confirmLeadExport: confirmLeadExportTool,
      } as any,
    });

    return (result as any).toDataStreamResponse ? (result as any).toDataStreamResponse() : (result as any).toTextStreamResponse();
  } catch (error: any) {
    console.error('API Route Error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Simulated data stream for offline / demo testing of all 4 tool states
function handleSimulatedResponse(prompt: string, forceError?: boolean) {
  const encoder = new TextEncoder();

  // Determine tool to trigger based on prompt keywords
  let toolName = 'scoreLead';
  let sampleArgs: any = {
    companyName: 'TechCorp Solutions',
    companySize: '51-200',
    budget: 45000,
    useCase: 'Enterprise AI agent workflow automation',
    contactEmail: forceError ? 'error@fail.com' : 'alex@techcorp.io',
  };

  if (prompt.toLowerCase().includes('meta') || prompt.toLowerCase().includes('url') || prompt.toLowerCase().includes('http')) {
    toolName = 'fetchMetaTags';
    sampleArgs = {
      url: forceError ? 'https://error.com' : 'https://antigravity.dev',
      checkOgTags: true,
    };
  } else if (prompt.toLowerCase().includes('export') || prompt.toLowerCase().includes('confirm')) {
    toolName = 'confirmLeadExport';
    sampleArgs = {
      leadId: 'LEAD-884920',
      exportFormat: 'Salesforce',
      recipientEmail: forceError ? 'fail@export.com' : 'sales-ops@company.com',
    };
  } else if (forceError) {
    sampleArgs.contactEmail = 'invalid@fail.com';
  }

  const toolCallId = `call_${Math.random().toString(36).substring(2, 9)}`;

  const stream = new ReadableStream({
    async start(controller) {
      // Step 1: Text introduction stream
      const textChunk1 = `0:${JSON.stringify(`Understood! I am executing the \`${toolName}\` tool with your requested parameters.`)}\n`;
      controller.enqueue(encoder.encode(textChunk1));
      await new Promise((r) => setTimeout(r, 400));

      // Step 2: Tool call streaming (partial-call -> input-streaming state)
      const partialCallChunk = `9:${JSON.stringify({
        toolCallId,
        toolName,
        args: { companyName: sampleArgs.companyName },
      })}\n`;
      controller.enqueue(encoder.encode(partialCallChunk));
      await new Promise((r) => setTimeout(r, 600));

      // Step 3: Tool call complete (input-available state)
      const fullCallChunk = `9:${JSON.stringify({
        toolCallId,
        toolName,
        args: sampleArgs,
      })}\n`;
      controller.enqueue(encoder.encode(fullCallChunk));
      await new Promise((r) => setTimeout(r, 800));

      // Step 4: Execute tool & return result or error
      try {
        let result: any;
        if (toolName === 'scoreLead') {
          result = await executeLeadScorer(sampleArgs);
        } else if (toolName === 'fetchMetaTags') {
          result = await executeMetaInspector(sampleArgs);
        } else {
          result = await executeLeadExporter(sampleArgs);
        }

        // State 3: Output available
        const resultChunk = `a:${JSON.stringify({
          toolCallId,
          result,
        })}\n`;
        controller.enqueue(encoder.encode(resultChunk));

        // Final text summary
        const textSummary = `0:${JSON.stringify(`\nExecution complete. View the structured output visual card above for detailed metrics.`)}\n`;
        controller.enqueue(encoder.encode(textSummary));
      } catch (err: any) {
        // State 4: Output error
        const errorChunk = `a:${JSON.stringify({
          toolCallId,
          isError: true,
          error: err.message || 'Tool execution failed',
        })}\n`;
        controller.enqueue(encoder.encode(errorChunk));

        const textError = `0:${JSON.stringify(`\n⚠️ The tool execution encountered an error. Please see the designed diagnostic error state above.`)}\n`;
        controller.enqueue(encoder.encode(textError));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/x-unknown',
      'X-Vercel-AI-Data-Stream': 'v1',
    },
  });
}
