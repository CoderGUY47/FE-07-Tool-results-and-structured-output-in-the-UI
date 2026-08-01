'use client';

import React from 'react';
import { ToolInvocationContainer } from './ToolInvocationContainer';
import { ToolInputStreaming } from './ToolInputStreaming';
import { ToolInputAvailable } from './ToolInputAvailable';
import { LeadScoreResult } from './LeadScoreResult';
import { MetaInspectorResult } from './MetaInspectorResult';
import { UserConfirmationDialog } from './UserConfirmationDialog';
import { ToolOutputError } from './ToolOutputError';

export interface ToolInvocationHandlerProps {
  toolInvocation: {
    toolCallId: string;
    toolName: string;
    args?: Record<string, any>;
    state?: 'partial-call' | 'call' | 'result' | 'error';
    result?: any;
    error?: string;
    isError?: boolean;
  };
  onRetry?: () => void;
}

export function ToolInvocationHandler({ toolInvocation, onRetry }: ToolInvocationHandlerProps) {
  const { toolName, args = {}, state = 'result', result, error, isError } = toolInvocation;

  // Determine state machine phase
  let currentPhase: 'input-streaming' | 'input-available' | 'output-available' | 'output-error' =
    'output-available';

  if (isError || state === 'error' || error) {
    currentPhase = 'output-error';
  } else if (state === 'partial-call') {
    currentPhase = 'input-streaming';
  } else if (state === 'call') {
    currentPhase = 'input-available';
  } else {
    currentPhase = 'output-available';
  }

  return (
    <ToolInvocationContainer toolName={toolName} state={currentPhase}>
      {/* State 1: Input Streaming */}
      {currentPhase === 'input-streaming' && <ToolInputStreaming args={args} />}

      {/* State 2: Input Available / Executing */}
      {currentPhase === 'input-available' && <ToolInputAvailable args={args} />}

      {/* State 4: Output Error */}
      {currentPhase === 'output-error' && (
        <ToolOutputError
          toolName={toolName}
          error={error || result?.error || 'Execution encountered an unhandled exception.'}
          args={args}
          onRetry={onRetry}
        />
      )}

      {/* State 3: Output Available (Component Rendering based on Tool Name) */}
      {currentPhase === 'output-available' && (
        <>
          {toolName === 'scoreLead' && result && <LeadScoreResult result={result} />}

          {toolName === 'fetchMetaTags' && result && <MetaInspectorResult result={result} />}

          {toolName === 'confirmLeadExport' && (
            <UserConfirmationDialog
              args={args as any}
              toolCallId={toolInvocation.toolCallId}
            />
          )}

          {/* Fallback if result object doesn't match predefined components */}
          {!['scoreLead', 'fetchMetaTags', 'confirmLeadExport'].includes(toolName) && (
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </>
      )}
    </ToolInvocationContainer>
  );
}
