'use client';

import React from 'react';
import { BiCrown } from 'react-icons/bi';
import { PiUserCircleDuotone } from 'react-icons/pi';

export function Header() {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100/80 bg-white/50 backdrop-blur-xs">
      <div className="flex-1 text-xs font-semibold text-slate-700">
        Oxie AI Workbench • FE-03 / FE-07
      </div>

      {/* Center Plan Pill with BiCrown */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-[4px] text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer transition-colors border border-black/10 hover:border-black/15">
        <BiCrown className="w-3.5 h-3.5 text-purple-600" />
        <span>Free plan</span>
        <span className="text-purple-600 font-bold">· Upgrade</span>
      </div>

      {/* Right Account Link Button */}
      <div className="flex-1 flex justify-end">
        <div
          title="New User - Log in"
          className="w-8 h-8 rounded-full bg-white hover:bg-slate-50 border border-black/10 hover:border-black/15 flex items-center justify-center text-slate-800 transition-colors cursor-pointer outline-none"
        >
          <PiUserCircleDuotone className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}
