'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiPlus,
  FiSliders,
  FiSearch,
  FiDownload,
  FiLogIn,
  FiZap,
  FiCpu,
  FiGlobe,
} from 'react-icons/fi';
import { LuFolderOpen } from 'react-icons/lu';
import { TbAdjustmentsDown } from 'react-icons/tb';
import { RiMessageAi3Line } from 'react-icons/ri';
import { PiCompassToolBold, PiUserCircleDuotone } from 'react-icons/pi';
import { FaLaptopCode } from 'react-icons/fa';
import { MdOutlineDraw, MdOutlineMarkChatUnread, MdOutlineMarkUnreadChatAlt } from 'react-icons/md';
import { BiGhost, BiCrown } from 'react-icons/bi';
import { GrCompare } from 'react-icons/gr';
import { VscRepoPinned } from 'react-icons/vsc';
import { HiOutlineInboxArrowDown, HiGlobeAlt } from 'react-icons/hi2';
import { AiOutlineBug } from 'react-icons/ai';

interface SidebarProps {
  onSubmitPrompt: (prompt: string, forceError?: boolean) => void;
  simulatedError: boolean;
  setSimulatedError: (val: boolean) => void;
}

export function Sidebar({ onSubmitPrompt, simulatedError, setSimulatedError }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('chats');

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`h-full bg-white border-r border-black/10 flex flex-col p-3 shrink-0 z-20 select-none font-sans transition-all duration-200 ${
        isCollapsed ? 'w-16 items-center' : 'w-72'
      }`}
    >
      {/* ── Top Header: Logo + Title + Collapse Toggle ── */}
      <div className={`flex items-center justify-between pb-3 px-1 w-full ${isCollapsed ? 'flex-col gap-3 px-0' : ''}`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-2 font-extrabold text-lg tracking-tight text-slate-900">
            <img src="/images/oxie.png" alt="Oxie AI Logo" className="w-9 h-9 object-contain" />
            <span>Oxie</span>
          </div>
        ) : (
          <img src="/images/oxie.png" alt="Oxie AI Logo" className="w-9 h-9 object-contain my-1 shrink-0" />
        )}

        <div className={`flex items-center gap-1 ${isCollapsed ? 'flex-col gap-1.5' : ''}`}>
          <button
            type="button"
            onClick={toggleSidebar}
            className={`w-7 h-7 rounded-[4px] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors border border-black/10 hover:border-black/15 bg-white cursor-pointer outline-none ${
              isCollapsed ? 'w-9 h-9' : ''
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <GrCompare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Main Navigation ── */}
      <div className={`flex flex-col gap-1 mb-3 w-full ${isCollapsed ? 'items-center' : ''}`}>
        {/* New Chat Primary Button */}
        <button
          type="button"
          onClick={() => onSubmitPrompt('Score a lead for TechCorp Solutions', false)}
          title="New chat"
          className={`bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-[4px] transition-colors cursor-pointer border border-black/15 outline-none mb-1 flex items-center justify-center shrink-0 ${
            isCollapsed ? 'w-9 h-9 p-0' : 'w-full h-9 px-3 text-[13.5px] gap-2.5'
          }`}
        >
          <MdOutlineMarkChatUnread className="w-4.5 h-4.5" />
          {!isCollapsed && <span>New chat</span>}
        </button>

        {/* Navigation Items */}
        {[
          { id: 'chats', label: 'Chats', icon: MdOutlineMarkUnreadChatAlt },
          { id: 'projects', label: 'Projects', icon: LuFolderOpen },
          { id: 'artifacts', label: 'Artifacts', icon: PiCompassToolBold },
        ].map((nav) => {
          const Icon = nav.icon;
          const isActive = activeNav === nav.id;
          return (
            <button
              key={nav.id}
              type="button"
              onClick={() => setActiveNav(nav.id)}
              title={isCollapsed ? nav.label : undefined}
              className={`rounded-[4px] text-[13.5px] font-medium flex items-center transition-colors cursor-pointer border appearance-none outline-none shrink-0 ${
                isCollapsed ? 'w-9 h-9 justify-center p-0' : 'w-full h-8.5 px-3 gap-2.5 text-left'
              } ${
                isActive
                  ? 'bg-slate-100 text-slate-900 font-semibold border-black/15'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:border-black/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {!isCollapsed && <span>{nav.label}</span>}
            </button>
          );
        })}

        {/* Code Item */}
        <button
          type="button"
          onClick={() => setActiveNav('code')}
          title={isCollapsed ? 'Code' : undefined}
          className={`rounded-[4px] text-[13.5px] font-medium flex items-center transition-colors cursor-pointer border appearance-none outline-none shrink-0 ${
            isCollapsed ? 'w-9 h-9 justify-center p-0' : 'w-full h-8.5 px-3 justify-between'
          } ${
            activeNav === 'code'
              ? 'bg-slate-100 text-slate-900 font-semibold border-black/15'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:border-black/10'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FaLaptopCode className="w-4 h-4" />
            {!isCollapsed && <span>Code</span>}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] bg-slate-200 text-slate-800 border border-black/10 flex items-center gap-1">
              <BiCrown className="w-3 h-3 text-purple-600" />
              Upgrade
            </span>
          )}
        </button>
      </div>

      {/* ── Quick Demo Tools Section ── */}
      {!isCollapsed && (
        <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-full">
          Zod Generative UI Prompts
        </div>
      )}
      <div className={`flex flex-col gap-1 mb-3 w-full ${isCollapsed ? 'items-center' : ''}`}>
        <button
          type="button"
          onClick={() => onSubmitPrompt('Score a lead for TechCorp Solutions with 200 employees and $50k budget.', false)}
          className={`rounded-[4px] text-[13px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center transition-colors border border-transparent hover:border-black/10 cursor-pointer ${
            isCollapsed ? 'w-9 h-9 justify-center p-0' : 'w-full p-2 gap-2 text-left'
          }`}
        >
          <FiCpu className="w-4 h-4 text-cyan-600 shrink-0" />
          {!isCollapsed && <span className="truncate">Score Lead (FE1)</span>}
        </button>

        <button
          type="button"
          onClick={() => onSubmitPrompt('Fetch meta tags and audit SEO for https://antigravity.dev', false)}
          className={`rounded-[4px] text-[13px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center transition-colors border border-transparent hover:border-black/10 cursor-pointer ${
            isCollapsed ? 'w-9 h-9 justify-center p-0' : 'w-full p-2 gap-2 text-left'
          }`}
        >
          <HiGlobeAlt className="w-4 h-4 text-blue-600 shrink-0" />
          {!isCollapsed && <span className="truncate">Fetch Meta Tags (FE2)</span>}
        </button>

        <button
          type="button"
          onClick={() => onSubmitPrompt('Export lead report for LEAD-884920 to Salesforce for sales-ops@company.com', false)}
          className={`rounded-[4px] text-[13px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center transition-colors border border-transparent hover:border-black/10 cursor-pointer ${
            isCollapsed ? 'w-9 h-9 justify-center p-0' : 'w-full p-2 gap-2 text-left'
          }`}
        >
          <HiOutlineInboxArrowDown className="w-4 h-4 text-amber-600 shrink-0" />
          {!isCollapsed && <span className="truncate">User Dialog Tool</span>}
        </button>

        <button
          type="button"
          onClick={() => onSubmitPrompt('Score lead for company FailCorp with contact error@fail.com', true)}
          className={`rounded-[4px] text-[13px] font-medium text-rose-800 hover:bg-rose-50 flex items-center transition-colors border border-rose-200 hover:border-rose-300 cursor-pointer ${
            isCollapsed ? 'w-9 h-9 justify-center p-0' : 'w-full p-2 gap-2 text-left'
          }`}
        >
          <AiOutlineBug className="w-4 h-4 text-rose-600 shrink-0" />
          {!isCollapsed && <span className="truncate">Trigger Designed Error</span>}
        </button>
      </div>

      {/* ── Mode Toggle & Footer Profile Card ── */}
      <div className={`pt-2 border-t border-black/10 mt-auto w-full space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {!isCollapsed && (
          <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer bg-slate-50 p-2 rounded-[4px] border border-black/10">
            <span className="font-semibold text-[11px]">Force Error Mode</span>
            <input
              type="checkbox"
              checked={simulatedError}
              onChange={(e) => setSimulatedError(e.target.checked)}
              className="accent-rose-600 w-3.5 h-3.5 rounded cursor-pointer"
            />
          </label>
        )}

        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-[4px] border border-black/10 hover:border-black/15 bg-white transition-colors">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <PiUserCircleDuotone className="w-7.5 h-7.5 text-slate-800 shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-slate-900 truncate">New User</span>
                <span className="text-[11px] text-slate-400">Free plan</span>
              </div>
            </div>
            <button
              type="button"
              className="px-2.5 py-1 text-[11.5px] font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-[4px] border border-black/15 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <FiLogIn className="w-3 h-3" />
              <span>Log in</span>
            </button>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-[4px] border border-black/10 bg-white flex items-center justify-center text-slate-900">
            <PiUserCircleDuotone className="w-6.5 h-6.5 text-slate-800" />
          </div>
        )}
      </div>
    </aside>
  );
}
