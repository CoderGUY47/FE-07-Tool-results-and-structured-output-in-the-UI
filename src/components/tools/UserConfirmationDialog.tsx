'use client';

import React, { useState } from 'react';
import type { LeadExporterInput, LeadExporterResult } from '@/lib/tools/lead-exporter';
import { executeLeadExporter } from '@/lib/tools/lead-exporter';
import { FiLock, FiCheck, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { CgTrashEmpty } from 'react-icons/cg';

interface UserConfirmationDialogProps {
  args: LeadExporterInput;
  toolCallId: string;
  onConfirm?: (result: LeadExporterResult) => void;
}

export function UserConfirmationDialog({ args, onConfirm }: UserConfirmationDialogProps) {
  const [status, setStatus] = useState<'PENDING' | 'EXECUTING' | 'APPROVED' | 'CANCELLED'>('PENDING');
  const [resultData, setResultData] = useState<LeadExporterResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApprove = async () => {
    setStatus('EXECUTING');
    try {
      const res = await executeLeadExporter(args);
      setResultData(res);
      setStatus('APPROVED');
      if (onConfirm) onConfirm(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Export failed');
      setStatus('CANCELLED');
    }
  };

  const handleCancel = () => {
    setStatus('CANCELLED');
  };

  return (
    <div className="rounded-lg border border-amber-300 bg-white p-5 space-y-4 text-slate-900 shadow-md">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-amber-700 font-bold">
          <FiLock className="w-4 h-4 animate-pulse text-amber-600" />
          <h4 className="text-slate-900 text-sm">User Action Confirmation Required</h4>
        </div>
        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded">
          INTERACTIVE TOOL
        </span>
      </div>

      <p className="text-xs text-slate-600">
        The AI assistant is requesting authorization to export lead report data to an external integration.
      </p>

      {/* Payload summary */}
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Target Lead ID:</span>
          <span className="font-bold text-cyan-700">{args.leadId}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Export Format / CRM:</span>
          <span className="font-bold text-emerald-700">{args.exportFormat}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Recipient Email:</span>
          <span className="font-bold text-purple-700">{args.recipientEmail}</span>
        </div>
      </div>

      {/* Action Buttons & State updates */}
      {status === 'PENDING' && (
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleApprove}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <FiCheck className="w-4 h-4" /> Approve & Execute Export
          </button>
          <button
            onClick={handleCancel}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
          >
            <CgTrashEmpty className="w-4 h-4 text-slate-500" /> Cancel
          </button>
        </div>
      )}

      {status === 'EXECUTING' && (
        <div className="flex items-center justify-center gap-2 text-xs text-blue-700 py-3 bg-blue-50 rounded-lg border border-blue-200 font-medium">
          <FiRefreshCw className="w-4 h-4 animate-spin text-blue-600" /> Processing authorization & executing export pipeline...
        </div>
      )}

      {status === 'APPROVED' && resultData && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 space-y-1 text-xs text-emerald-900">
          <div className="flex items-center gap-2 font-bold text-emerald-700">
            <FiCheck className="w-4 h-4" /> Export Confirmed & Successfully Dispatched
          </div>
          <div className="text-[11px] text-slate-600">
            Export ID: <strong className="text-slate-900">{resultData.exportId}</strong> • Timestamp: {resultData.timestamp}
          </div>
        </div>
      )}

      {status === 'CANCELLED' && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800 flex items-center gap-2 font-medium">
          <CgTrashEmpty className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg || 'Action was explicitly cancelled by the user.'}</span>
        </div>
      )}
    </div>
  );
}
