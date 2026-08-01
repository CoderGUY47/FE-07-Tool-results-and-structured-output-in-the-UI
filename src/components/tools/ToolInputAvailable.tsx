'use client';

import React from 'react';
import { FiRefreshCw, FiCheck } from 'react-icons/fi';

interface ToolInputAvailableProps {
  args: Record<string, any>;
}

export function ToolInputAvailable({ args }: ToolInputAvailableProps) {
  const entries = Object.entries(args || {});

  return (
    <div className="space-y-3 py-1">
      <div className="flex items-center justify-between text-xs text-blue-700">
        <div className="flex items-center gap-2 font-medium">
          <FiRefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
          <span>Parameters Available • Executing server function...</span>
        </div>
        <span className="text-[10px] text-blue-800 font-semibold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
          VALIDATED ZOD SCHEMA
        </span>
      </div>

      <div className="rounded-lg bg-slate-50 p-3.5 border border-blue-200 space-y-2.5">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <FiCheck className="w-3.5 h-3.5 text-blue-600" /> Execution Payload Input
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {entries.map(([key, val]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-md bg-white px-3 py-1.5 border border-slate-200 shadow-2xs"
            >
              <span className="text-slate-500 font-medium">{key}:</span>
              <span className="font-semibold text-blue-900 truncate max-w-35">
                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
