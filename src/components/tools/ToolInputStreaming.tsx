'use client';

import React from 'react';
import { HiSparkles } from 'react-icons/hi2';

interface ToolInputStreamingProps {
  args: Record<string, any>;
}

export function ToolInputStreaming({ args }: ToolInputStreamingProps) {
  const argKeys = Object.keys(args || {});

  return (
    <div className="space-y-3 py-1">
      <div className="flex items-center justify-between text-xs text-amber-700">
        <div className="flex items-center gap-2 font-medium">
          <HiSparkles className="w-4 h-4 animate-spin text-amber-600" />
          <span>Generating parameter arguments...</span>
        </div>
        <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
          LIVE PARSING
        </span>
      </div>

      {/* Shimmer skeleton box */}
      <div className="relative overflow-hidden rounded-lg bg-slate-50 p-3.5 border border-amber-200">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-amber-200/50 to-transparent" />

        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">Streamed parameters:</span>
            {argKeys.length === 0 ? (
              <span className="text-xs italic text-slate-400">Awaiting schema tokens...</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {argKeys.map((key) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 rounded bg-amber-100/80 px-2.5 py-1 text-[11px] text-amber-900 border border-amber-300 shadow-2xs"
                  >
                    <span className="font-bold">{key}:</span>
                    <span className="text-slate-800 truncate max-w-30">
                      {JSON.stringify(args[key])}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
