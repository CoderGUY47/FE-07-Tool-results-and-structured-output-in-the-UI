'use client';

import React, { useState } from 'react';
import { AiOutlineBug, AiTwotoneBug } from 'react-icons/ai';
import { FiRefreshCw, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface ToolOutputErrorProps {
  toolName: string;
  error: string;
  args?: Record<string, any>;
  onRetry?: () => void;
}

export function ToolOutputError({ toolName, error, args, onRetry }: ToolOutputErrorProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Extract clean error message and generate diagnostic code badge
  const cleanError = error?.replace(/^Error:\s*/, '') || 'An unexpected tool execution error occurred.';
  const errorCode = cleanError.includes(':')
    ? cleanError.split(':')[0]
    : 'TOOL_EXECUTION_FAILURE';

  return (
    <div className="rounded-lg border border-rose-300 bg-white p-5 space-y-4 text-slate-900 shadow-md">
      {/* Error Header */}
      <div className="flex items-start justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-rose-600">
          <AiTwotoneBug className="w-5 h-5 shrink-0 animate-bounce" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Tool Execution Failed</h4>
            <span className="text-[11px] text-slate-500 font-medium">Tool: {toolName}</span>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded">
          {errorCode}
        </span>
      </div>

      {/* User-friendly Explanation */}
      <div className="space-y-2 bg-rose-50 p-3.5 rounded-lg border border-rose-200">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800">
          <AiOutlineBug className="w-4 h-4 text-rose-600" /> Diagnostic Summary:
        </div>
        <p className="text-xs text-rose-900 font-sans leading-relaxed">
          {cleanError}
        </p>
      </div>

      {/* Collapsible Technical Details / Stack Trace */}
      <div className="space-y-2">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="flex items-center justify-between w-full text-xs text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 p-2.5 rounded-md border border-slate-200 cursor-pointer font-medium"
        >
          <span className="flex items-center gap-1.5">
            <AiOutlineBug className="w-4 h-4 text-rose-600" />
            Technical Stack Details & Arguments
          </span>
          {showTechnicalDetails ? (
            <FiChevronUp className="w-4 h-4" />
          ) : (
            <FiChevronDown className="w-4 h-4" />
          )}
        </button>

        {showTechnicalDetails && (
          <div className="rounded-lg bg-slate-900 p-3.5 border border-slate-800 text-[11px] text-slate-200 space-y-2 overflow-x-auto">
            <div>
              <span className="text-slate-400 font-semibold">Failed Arguments:</span>
              <pre className="text-amber-300 mt-1 bg-slate-950 p-2 rounded border border-slate-800 font-mono">
                {JSON.stringify(args || {}, null, 2)}
              </pre>
            </div>
            <div>
              <span className="text-slate-400 font-semibold">Raw Stack Log:</span>
              <p className="text-rose-300 mt-1 bg-slate-950 p-2 rounded border border-slate-800 text-[10px] font-mono">
                {error}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-500 font-medium">
          Tip: Pass a valid contact email or URL to retry.
        </span>

        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-1.5 px-3 rounded-md flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <FiRefreshCw className="w-3.5 h-3.5" /> Retry Tool Call
          </button>
        )}
      </div>
    </div>
  );
}
