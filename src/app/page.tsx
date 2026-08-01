'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HiSparkles } from 'react-icons/hi2';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Header } from '@/components/chat/Header';
import { MessageItem, MessageData } from '@/components/chat/MessageItem';
import { ChatInput } from '@/components/chat/ChatInput';

export default function GenerativeUIPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<MessageData[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am Oxie, your AI assistant equipped with server-side Zod tools. Select one of the preset prompts on the left or type below to evaluate 4-state tool lifecycles, SVG metrics, interactive dialogs, and designed error handling in clean Light Mode.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [simulatedMode] = useState(true);
  const [simulatedError, setSimulatedError] = useState(false);
  const [activeToolChoosing, setActiveToolChoosing] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, activeToolChoosing]);

  const handleSubmitPrompt = async (promptText: string, forceErrorMode = simulatedError) => {
    if (!promptText.trim() || isLoading) return;

    const userMessage: MessageData = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: promptText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const promptLower = promptText.toLowerCase();
    let chosenTool = 'scoreLead';
    if (promptLower.includes('meta') || promptLower.includes('url') || promptLower.includes('http')) {
      chosenTool = 'fetchMetaTags';
    } else if (promptLower.includes('export') || promptLower.includes('confirm')) {
      chosenTool = 'confirmLeadExport';
    }

    setActiveToolChoosing(`Analyzing request & selecting tool: ${chosenTool}...`);
    await new Promise((r) => setTimeout(r, 600));
    setActiveToolChoosing(null);

    const assistantMsgId = `assistant_${Date.now()}`;
    const toolCallId = `call_${Date.now()}`;

    let sampleArgs: any = {
      companyName: 'TechCorp Solutions',
      companySize: '51-200',
      budget: 45000,
      useCase: 'Enterprise AI agent workflow automation',
      contactEmail: forceErrorMode ? 'error@fail.com' : 'alex@techcorp.io',
    };

    if (chosenTool === 'fetchMetaTags') {
      sampleArgs = {
        url: forceErrorMode ? 'https://error.com' : 'https://antigravity.dev',
        checkOgTags: true,
      };
    } else if (chosenTool === 'confirmLeadExport') {
      sampleArgs = {
        leadId: 'LEAD-884920',
        exportFormat: 'Salesforce',
        recipientEmail: forceErrorMode ? 'fail@export.com' : 'sales-ops@company.com',
      };
    }

    // Step 1: Input Streaming
    const assistantMessage: MessageData = {
      id: assistantMsgId,
      role: 'assistant',
      content: `Executing tool call \`${chosenTool}\` for your request.`,
      toolInvocations: [
        {
          toolCallId,
          toolName: chosenTool,
          args: { companyName: sampleArgs.companyName || sampleArgs.url },
          state: 'partial-call',
        },
      ],
    };
    setMessages((prev) => [...prev, assistantMessage]);

    // Step 2: Input Available
    await new Promise((r) => setTimeout(r, 800));
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === assistantMsgId
          ? {
              ...msg,
              toolInvocations: [{ toolCallId, toolName: chosenTool, args: sampleArgs, state: 'call' }],
            }
          : msg
      )
    );

    // Step 3 & 4: Output Available or Error
    await new Promise((r) => setTimeout(r, 1500));
    try {
      if (forceErrorMode || sampleArgs.contactEmail?.includes('fail') || sampleArgs.url?.includes('error')) {
        throw new Error(
          `TOOL_EXECUTION_ERROR: Server returned HTTP 503 for tool "${chosenTool}". Target host unreachable or parameter validation rejected by backend.`
        );
      }

      let resultData: any;
      if (chosenTool === 'scoreLead') {
        const { executeLeadScorer } = await import('@/lib/tools/lead-scorer');
        resultData = await executeLeadScorer(sampleArgs);
      } else if (chosenTool === 'fetchMetaTags') {
        const { executeMetaInspector } = await import('@/lib/tools/meta-inspector');
        resultData = await executeMetaInspector(sampleArgs);
      } else {
        const { executeLeadExporter } = await import('@/lib/tools/lead-exporter');
        resultData = await executeLeadExporter(sampleArgs);
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: 'Tool execution succeeded. Here is the structured visual component output:',
                toolInvocations: [
                  { toolCallId, toolName: chosenTool, args: sampleArgs, state: 'result', result: resultData },
                ],
              }
            : msg
        )
      );
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: '⚠️ Tool execution encountered a designed error state:',
                toolInvocations: [
                  {
                    toolCallId,
                    toolName: chosenTool,
                    args: sampleArgs,
                    state: 'error',
                    error: err.message || 'Execution error',
                    isError: true,
                  },
                ],
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fb] text-slate-900 overflow-hidden">
      <Sidebar
        onSubmitPrompt={handleSubmitPrompt}
        simulatedError={simulatedError}
        setSimulatedError={setSimulatedError}
      />

      <main className="flex-1 flex flex-col h-full bg-[#f8f9fb] relative">
        <Header />

        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl w-full mx-auto">
          {messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              onRetry={() => handleSubmitPrompt(msg.content, false)}
            />
          ))}

          {activeToolChoosing && (
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-800 bg-cyan-50 border border-cyan-300 p-3 rounded-lg animate-pulse max-w-md shadow-2xs">
              <HiSparkles className="w-4 h-4 animate-spin text-cyan-600" />
              <span>{activeToolChoosing}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitPrompt(input);
          }}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
