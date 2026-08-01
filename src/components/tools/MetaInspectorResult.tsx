'use client';

import React from 'react';
import type { MetaInspectorResult } from '@/lib/tools/meta-inspector';
import { FiGlobe, FiCheck } from 'react-icons/fi';
import { HiGlobeAlt } from 'react-icons/hi2';
import { RiGalleryLine } from 'react-icons/ri';
import { AiOutlineBug } from 'react-icons/ai';

interface MetaInspectorResultProps {
  result: MetaInspectorResult;
}

export function MetaInspectorResult({ result }: MetaInspectorResultProps) {
  const { domain, title, description, ogImage, seoScore, performanceGrade, mobileReady, tagsFound, issues } = result;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4 text-slate-900 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <HiGlobeAlt className="w-5 h-5 text-cyan-600" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{domain}</h4>
            <a
              href={result.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-cyan-600 hover:underline flex items-center gap-1 font-medium"
            >
              {result.url}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold">
            SEO: {seoScore}/100
          </span>
          <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs px-2.5 py-1 rounded-full font-bold">
            Grade: {performanceGrade}
          </span>
        </div>
      </div>

      {/* Social OG Preview Card Mockup */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden space-y-2 p-3">
        <span className="text-[11px] text-slate-600 uppercase font-semibold flex items-center gap-1.5">
          <RiGalleryLine className="w-4 h-4 text-blue-600" /> OpenGraph Social Preview
        </span>
        <div className="flex flex-col sm:flex-row gap-3 items-center bg-white p-3 rounded-md border border-slate-200 shadow-2xs">
          {ogImage && (
            <img
              src={ogImage}
              alt="OG Preview"
              className="w-full sm:w-32 h-20 object-cover rounded border border-slate-200"
            />
          )}
          <div className="space-y-1 text-xs">
            <h5 className="font-bold text-slate-900 line-clamp-1">{title}</h5>
            <p className="text-slate-600 text-[11px] line-clamp-2">{description}</p>
            <span className="text-[10px] font-semibold text-cyan-600">{domain}</span>
          </div>
        </div>
      </div>

      {/* Tags Table */}
      <div className="space-y-2">
        <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
          <FiCheck className="w-3.5 h-3.5 text-emerald-600" /> Detected Meta Tags
        </span>
        <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50 text-xs overflow-hidden">
          {tagsFound.map((tag, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 px-3.5 bg-white">
              <span className="text-cyan-700 font-semibold">{tag.name}</span>
              <span className="text-slate-600 truncate max-w-50 text-[11px]">{tag.content}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  tag.status === 'ok'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {tag.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Issues list */}
      {issues.length > 0 && (
        <div className="space-y-1.5 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
          <span className="text-amber-800 font-semibold flex items-center gap-1.5">
            <AiOutlineBug className="w-4 h-4 text-amber-600" /> Optimization Opportunities ({issues.length})
          </span>
          <ul className="list-disc list-inside text-slate-700 space-y-1 text-[11px]">
            {issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
