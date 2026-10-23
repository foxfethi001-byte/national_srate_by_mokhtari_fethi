/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Simulation Checkpoints Manager
 * إدارة المحطات المرجعية وحفظ واسترجاع نقاط التوقف الزمنية
 */

import React, { useState, useEffect } from 'react';
import { SimulationCheckpoint, SimulationState, PolicySettings, ExternalShocks } from '../types/simulation';
import { storageManager } from '../storage/indexedDb';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { Bookmark, RotateCcw, Trash2, Plus, Check } from 'lucide-react';
import { TimeEngine } from '../simulation/timeEngine';

interface CheckpointsManagerProps {
  currentState: SimulationState;
  policies: PolicySettings;
  shocks: ExternalShocks;
  onRestoreCheckpoint: (checkpoint: SimulationCheckpoint) => void;
  lang: Language;
}

export const CheckpointsManager: React.FC<CheckpointsManagerProps> = ({
  currentState,
  policies,
  shocks,
  onRestoreCheckpoint,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [checkpoints, setCheckpoints] = useState<SimulationCheckpoint[]>([]);
  const [newCheckpointName, setNewCheckpointName] = useState('');
  const [newCheckpointNotes, setNewCheckpointNotes] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [restoredNotice, setRestoredNotice] = useState<string | null>(null);

  const loadCheckpoints = async () => {
    const list = await storageManager.getCheckpoints();
    setCheckpoints(list);
  };

  useEffect(() => {
    loadCheckpoints();
  }, []);

  const handleCreateCheckpoint = async () => {
    if (!newCheckpointName.trim()) return;

    const newCp: SimulationCheckpoint = {
      id: `cp_${Date.now()}`,
      name: newCheckpointName.trim(),
      createdAt: new Date().toISOString(),
      date: currentState.date || { year: currentState.year },
      state: currentState,
      policies: { ...policies },
      shocks: { ...shocks },
      notes: newCheckpointNotes.trim() || undefined,
    };

    await storageManager.saveCheckpoint(newCp);
    setNewCheckpointName('');
    setNewCheckpointNotes('');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
    loadCheckpoints();
  };

  const handleDelete = async (id: string) => {
    await storageManager.deleteCheckpoint(id);
    loadCheckpoints();
  };

  const handleRestore = (cp: SimulationCheckpoint) => {
    onRestoreCheckpoint(cp);
    setRestoredNotice(cp.id);
    setTimeout(() => setRestoredNotice(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Checkpoint */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              <span>المحطات المرجعية وحفظ الحالة (Checkpoints)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تثبيت وحفظ نقاط توقف كاملة للمحاكاة واستعادتها في أي لحظة مع حفظها في قاعدة البيانات المحلية.
            </p>
          </div>

          <div className="font-mono text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded">
            الحالة الحالية: {TimeEngine.formatDate(currentState.date || { year: currentState.year }, lang)}
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-5">
            <input
              type="text"
              placeholder="اسم المحطة المرجعية (مثال: قبل صدمة أسعار النفط)..."
              value={newCheckpointName}
              onChange={(e) => setNewCheckpointName(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div className="sm:col-span-5">
            <input
              type="text"
              placeholder="ملاحظات توضيحية (اختياري)..."
              value={newCheckpointNotes}
              onChange={(e) => setNewCheckpointNotes(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              onClick={handleCreateCheckpoint}
              disabled={!newCheckpointName.trim()}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء محطة</span>
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="text-xs text-emerald-400 font-medium">
            تم حفظ المحطة المرجعية بنجاح في قاعدة البيانات المحلية!
          </div>
        )}
      </div>

      {/* Checkpoints List */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h4 className="text-sm font-semibold text-slate-200">
          المحطات المرجعية المحفوظة ({checkpoints.length})
        </h4>

        {checkpoints.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            لا توجد محطات مرجعية محفوظة حالياً. يمكنك إنشاء محطة جديدة للرجوع إليها لاحقاً.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {checkpoints.map((cp) => (
              <div
                key={cp.id}
                className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200 text-sm">{cp.name}</span>
                    <span className="font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded text-[11px]">
                      {TimeEngine.formatDate(cp.date, lang)}
                    </span>
                  </div>
                  {cp.notes && (
                    <p className="text-slate-400 text-[11px]">{cp.notes}</p>
                  )}
                  <div className="text-[10px] text-slate-500 font-mono">
                    تاريخ الحفظ: {new Date(cp.createdAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleRestore(cp)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors cursor-pointer"
                  >
                    {restoredNotice === cp.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تمت الاستعادة</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                        <span>استعادة الحالة</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(cp.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    title="حذف هذه المحطة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
