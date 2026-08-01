'use client';

import React from 'react';
import { HiSparkles, HiArrowRight } from 'react-icons/hi2';
import { FiCpu, FiGlobe, FiDownload } from 'react-icons/fi';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({ input, setInput, onSubmit, isLoading }: ChatInputProps) {
  return (
    <div className="p-4 border-t border-slate-200/80 bg-white/90 backdrop-blur-md space-y-3">
      {/* Quick Suggestion Chips */}
      <div className="max-w-4xl mx-auto flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => setInput('Score a lead for TechCorp Solutions with 200 employees and $50k budget.')}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 text-slate-600 border border-slate-200 transition-colors cursor-pointer text-[11px] font-medium"
        >
          <FiCpu className="w-3 h-3 text-cyan-600" /> Score Lead Demo
        </button>

        <button
          type="button"
          onClick={() => setInput('Fetch meta tags and audit SEO for https://antigravity.dev')}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 transition-colors cursor-pointer text-[11px] font-medium"
        >
          <FiGlobe className="w-3 h-3 text-blue-600" /> Audit SEO Demo
        </button>

        <button
          type="button"
          onClick={() => setInput('Export lead report for LEAD-884920 to Salesforce for sales-ops@company.com')}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 border border-slate-200 transition-colors cursor-pointer text-[11px] font-medium"
        >
          <FiDownload className="w-3 h-3 text-amber-600" /> Interactive Dialog Demo
        </button>
      </div>

      <form onSubmit={onSubmit} className="max-w-4xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Oxie AI to score a lead, audit a website, or export reports..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white focus:ring-2 focus:ring-cyan-600/20 transition-all font-sans"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white px-5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0"
        >
          <HiSparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span>Send</span>
          <HiArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
