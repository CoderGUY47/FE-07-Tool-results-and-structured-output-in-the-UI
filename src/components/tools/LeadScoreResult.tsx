'use client';

import React from 'react';
import type { LeadScorerResult } from '@/lib/tools/lead-scorer';
import { FiCheck, FiCpu, FiUser } from 'react-icons/fi';
import { PiBrainBold } from 'react-icons/pi';
import { HiSparkles } from 'react-icons/hi2';

interface LeadScoreResultProps {
  result: LeadScorerResult;
}

export function LeadScoreResult({ result }: LeadScoreResultProps) {
  const { overallScore, tier, companyName, metrics, estimatedRevenue, keyRecommendations, leadId } = result;

  // SVG Gauge Math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const tierColors = {
    HOT: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      ring: 'stroke-emerald-500',
      bgGradient: 'from-emerald-50/60 to-white',
    },
    WARM: {
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      ring: 'stroke-amber-500',
      bgGradient: 'from-amber-50/60 to-white',
    },
    COLD: {
      badge: 'bg-sky-100 text-sky-800 border-sky-300',
      ring: 'stroke-sky-500',
      bgGradient: 'from-sky-50/60 to-white',
    },
  };

  const style = tierColors[tier] || tierColors.WARM;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4 text-slate-900 shadow-md">
      {/* Header section */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <FiCpu className="w-3.5 h-3.5 text-cyan-600" />
            <span>ID: {leadId}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">{companyName}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style.badge}`}>
          {tier} LEAD
        </span>
      </div>

      {/* Main score layout: SVG Radial Gauge + Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        {/* Radial SVG Gauge Chart */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-2">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-200"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className={`transition-all duration-1000 ease-out ${style.ring}`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-extrabold text-slate-900">{overallScore}</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Score / 100</span>
            </div>
          </div>
          <div className="text-xs text-slate-600 mt-2 flex items-center gap-1 font-medium">
            <HiSparkles className="w-3.5 h-3.5 text-amber-500" />
            Urgency: <strong className="text-slate-900">{metrics.urgencyRating}</strong>
          </div>
        </div>

        {/* Metric Progress Bars */}
        <div className="sm:col-span-7 space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-700 mb-1 font-medium">
              <span>Budget Fit</span>
              <span className="font-bold text-emerald-600">{metrics.budgetFit}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${metrics.budgetFit}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-700 mb-1 font-medium">
              <span>Team Scale Fit</span>
              <span className="font-bold text-cyan-600">{metrics.teamFit}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                style={{ width: `${metrics.teamFit}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-700 mb-1 font-medium">
              <span>Intent Signals</span>
              <span className="font-bold text-purple-600">{metrics.intentScore}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${metrics.intentScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue & Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-slate-50 px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs">
          <span className="text-slate-600 font-medium flex items-center gap-1.5">
            <PiBrainBold className="w-4 h-4 text-emerald-600" />
            Estimated Revenue Potential:
          </span>
          <span className="font-bold text-emerald-700 text-sm">{estimatedRevenue}</span>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
            <FiCheck className="w-3.5 h-3.5 text-cyan-600" />
            Recommended Next Actions:
          </span>
          <div className="space-y-1">
            {keyRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-700 bg-white px-3 py-2 rounded-md border border-slate-200 shadow-2xs"
              >
                <FiCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
