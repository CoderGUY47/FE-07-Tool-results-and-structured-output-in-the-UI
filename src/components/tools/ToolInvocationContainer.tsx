'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToolInvocationContainerProps {
  toolName: string;
  state: 'input-streaming' | 'input-available' | 'output-available' | 'output-error';
  children: React.ReactNode;
}

export function ToolInvocationContainer({
  toolName,
  state,
  children,
}: ToolInvocationContainerProps) {
  // Light Mode state badge styles
  const stateStyles = {
    'input-streaming': 'border-amber-300 bg-amber-50 text-amber-800',
    'input-available': 'border-blue-300 bg-blue-50 text-blue-800',
    'output-available': 'border-emerald-300 bg-emerald-50 text-emerald-800',
    'output-error': 'border-rose-300 bg-rose-50 text-rose-800',
  };

  const badgeLabels = {
    'input-streaming': 'Streaming Input Args...',
    'input-available': 'Input Ready • Executing',
    'output-available': 'Result Available',
    'output-error': 'Execution Error',
  };

  return (
    <div className="my-4 rounded-lg border border-slate-200 bg-white p-4.5 shadow-md overflow-hidden transition-all duration-300">
      {/* Tool Header bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-600 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tool: <strong className="text-cyan-700 font-bold">{toolName}</strong>
          </span>
        </div>
        <span
          className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${stateStyles[state]}`}
        >
          {badgeLabels[state]}
        </span>
      </div>

      {/* Smooth 200ms morphing crossfade container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 4, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.99 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
