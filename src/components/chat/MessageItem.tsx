'use client';

import React from 'react';
import { FiUser } from 'react-icons/fi';
import { ToolInvocationHandler } from '@/components/tools/ToolInvocationHandler';

export interface MessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: Array<{
    toolCallId: string;
    toolName: string;
    args?: Record<string, any>;
    state?: 'partial-call' | 'call' | 'result' | 'error';
    result?: any;
    error?: string;
    isError?: boolean;
  }>;
}

interface MessageItemProps {
  message: MessageData;
  onRetry: () => void;
}

export function MessageItem({ message, onRetry }: MessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500 shadow-2xs shrink-0 bg-white mt-1">
          <img
            src="/images/oxie.png"
            alt="Oxie Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-3 max-w-2xl">
        {message.content && (
          <div
            className={`rounded-lg p-4 text-xs leading-relaxed shadow-2xs ${
              isUser
                ? 'bg-linear-to-r from-cyan-600 to-blue-600 text-white font-medium shadow-sm'
                : 'bg-white border border-slate-200 text-slate-800'
            }`}
          >
            {message.content}
          </div>
        )}

        {/* Render Generative UI Tool Parts */}
        {message.toolInvocations?.map((invocation) => (
          <ToolInvocationHandler
            key={invocation.toolCallId}
            toolInvocation={invocation}
            onRetry={onRetry}
          />
        ))}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 shrink-0 mt-1 shadow-2xs">
          <FiUser className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
