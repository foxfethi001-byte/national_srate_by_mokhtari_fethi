/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Causal Graph Visualizer (Phase 2)
 * شبكة العلاقات السببية التفاعلية مع فحص المسارات المباشرة وغير المباشرة
 */

import React, { useState } from 'react';
import {
  CAUSAL_NODES,
  CAUSAL_EDGES,
  getCausalSubnetwork,
} from '../simulation/causalGraph';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { CausalNode } from '../types/simulation';
import {
  Share2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  FileText,
  Search,
} from 'lucide-react';

interface InteractiveCausalGraphProps {
  lang: Language;
  onSelectVariable?: (variableId: string) => void;
}

export const InteractiveCausalGraph: React.FC<InteractiveCausalGraphProps> = ({
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedNodeId, setSelectedNodeId] = useState<string>('real_gdp');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const activeSubnet = getCausalSubnetwork(selectedNodeId);

  // SVG Diagram Coordinates for Core Macroeconomic System
  const nodePositions: Record<string, { x: number; y: number }> = {
    // Top Row: Policy Levers & Taxes
    corporate_tax_rate: { x: 80, y: 50 },
    income_tax_rate: { x: 260, y: 50 },
    vat_rate: { x: 440, y: 50 },
    central_bank_rate: { x: 620, y: 50 },
    public_capex: { x: 800, y: 50 },

    // Row 2: Incomes & Balances
    disposable_income: { x: 260, y: 150 },
    household_savings: { x: 100, y: 170 },
    private_investment: { x: 440, y: 150 },
    government_consumption: { x: 640, y: 150 },
    exports: { x: 800, y: 150 },

    // Center Row: Core Output & Expenditure
    household_consumption: { x: 220, y: 260 },
    total_investment: { x: 400, y: 260 },
    real_gdp: { x: 580, y: 260 },
    nominal_gdp: { x: 760, y: 260 },
    imports: { x: 900, y: 260 },

    // Row 4: Labor & Capital
    capital_stock: { x: 340, y: 370 },
    employed_workers: { x: 500, y: 370 },
    unemployment_rate: { x: 680, y: 370 },
    labor_productivity: { x: 840, y: 370 },

    // Row 5: Prices & Public Finances
    inflation_rate: { x: 200, y: 470 },
    purchasing_power: { x: 380, y: 470 },
    tax_revenue_total: { x: 540, y: 470 },
    public_expenditure_total: { x: 700, y: 470 },
    overall_deficit: { x: 860, y: 470 },

    // Row 6: Debt & Sovereignty
    public_debt_stock: { x: 660, y: 560 },
    debt_to_gdp: { x: 820, y: 560 },
    sovereign_yield: { x: 500, y: 560 },
  };

  const filteredNodes = CAUSAL_NODES.filter((n) =>
    searchTerm === ''
      ? true
      : n.labelAr.includes(searchTerm) ||
        n.labelEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.id.includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>شبكة العلاقات والترابطات السببية التفاعلية (Interactive Causal Graph)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            انقر على أي متغير لاستكشاف مسارات التأثير المباشرة (Upstream Causes) والتداعيات اللاحقة (Downstream Effects).
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute top-2.5 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
          <input
            type="text"
            placeholder="بحث في المتغيرات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 text-xs rounded border border-slate-700 py-1.5 pr-8 pl-3 rtl:pr-8 rtl:pl-3 ltr:pl-8 ltr:pr-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans"
          />
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Visual SVG Network Map */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-lg p-4 relative overflow-x-auto min-h-[580px]">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span>المتغير المحدد</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span>أسباب مباشرة (Upstream)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>تداعيات مباشرة (Downstream)</span>
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">
              {CAUSAL_NODES.length} عقدة | {CAUSAL_EDGES.length} رابط سببي
            </span>
          </div>

          {/* SVG Canvas */}
          <svg
            viewBox="0 0 980 620"
            className="w-full h-auto select-none"
            style={{ minWidth: '750px' }}
          >
            <defs>
              <marker
                id="arrow-upstream"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
              </marker>
              <marker
                id="arrow-downstream"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
              </marker>
              <marker
                id="arrow-neutral"
                viewBox="0 0 10 10"
                refX="20"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#334155" />
              </marker>
            </defs>

            {/* Render Edges */}
            {CAUSAL_EDGES.map((edge) => {
              const src = nodePositions[edge.source];
              const tgt = nodePositions[edge.target];
              if (!src || !tgt) return null;

              const isUpstream = edge.target === selectedNodeId;
              const isDownstream = edge.source === selectedNodeId;

              let strokeColor = 'rgba(51, 65, 85, 0.4)';
              let strokeWidth = '1';
              let markerEnd = 'url(#arrow-neutral)';

              if (isUpstream) {
                strokeColor = '#38bdf8';
                strokeWidth = '2.5';
                markerEnd = 'url(#arrow-upstream)';
              } else if (isDownstream) {
                strokeColor = '#fbbf24';
                strokeWidth = '2.5';
                markerEnd = 'url(#arrow-downstream)';
              }

              // Curved bezier path
              const dx = tgt.x - src.x;
              const dy = tgt.y - src.y;
              const cx = src.x + dx * 0.5;
              const cy = src.y + dy * 0.5 - 15;

              return (
                <path
                  key={edge.id}
                  d={`M ${src.x} ${src.y} Q ${cx} ${cy} ${tgt.x} ${tgt.y}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  markerEnd={markerEnd}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Render Nodes */}
            {CAUSAL_NODES.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const isSelected = node.id === selectedNodeId;
              const isUpstream = activeSubnet?.upstream.some((u) => u.node.id === node.id);
              const isDownstream = activeSubnet?.downstream.some((d) => d.node.id === node.id);

              let nodeBg = '#1e293b';
              let strokeBorder = '#334155';
              let textColor = '#cbd5e1';

              if (isSelected) {
                nodeBg = '#0369a1';
                strokeBorder = '#38bdf8';
                textColor = '#ffffff';
              } else if (isUpstream) {
                nodeBg = '#0c4a6e';
                strokeBorder = '#38bdf8';
                textColor = '#bae6fd';
              } else if (isDownstream) {
                nodeBg = '#78350f';
                strokeBorder = '#fbbf24';
                textColor = '#fef3c7';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isSelected ? 18 : 14}
                    fill={nodeBg}
                    stroke={strokeBorder}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-all duration-200"
                  />
                  <text
                    y={isSelected ? 30 : 25}
                    textAnchor="middle"
                    className={`text-[10px] select-none font-sans transition-all ${
                      isSelected ? 'font-bold fill-white' : 'font-medium fill-slate-300'
                    }`}
                  >
                    {lang === 'ar' ? node.labelAr : node.labelEn}
                  </text>
                  {node.isStock && (
                    <circle
                      r={3}
                      cx={10}
                      cy={-10}
                      fill="#a855f7"
                    >
                      <title>رصيد تراكمي (Stock)</title>
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Detailed Node Inspection & Causal Linkages */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5 max-h-[640px] overflow-y-auto">
          {activeSubnet ? (
            <>
              {/* Node Title & Badges */}
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
                  <span>ID: {activeSubnet.node.id}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {activeSubnet.node.isStock ? 'رصيد تراكمي (Stock)' : 'تدفق سنوي (Flow)'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {lang === 'ar' ? activeSubnet.node.labelAr : activeSubnet.node.labelEn}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                  <span>الوحدة: <strong className="text-cyan-400 font-mono">{activeSubnet.node.unit}</strong></span>
                  <span>&bull;</span>
                  <span>القطاع: <span className="text-slate-300">{activeSubnet.node.sector}</span></span>
                </div>
              </div>

              {/* Direct Causes (Upstream Drivers) */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>المتغيرات المؤثرة مباشرة (Direct Drivers: {activeSubnet.upstream.length})</span>
                </h4>

                {activeSubnet.upstream.length === 0 ? (
                  <div className="text-[11px] text-slate-500 p-2 bg-slate-950/60 rounded">
                    متغير خارجي أو محدد سياسات أساسي بدون ارتباطات سابقة مباشرة في هذا النموذج.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeSubnet.upstream.map(({ node, edge }) => (
                      <div
                        key={edge.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className="p-2.5 rounded bg-slate-950/80 border border-slate-800 hover:border-sky-500/60 cursor-pointer transition-colors text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">
                            {lang === 'ar' ? node.labelAr : node.labelEn}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                              edge.sign === '+' ? 'text-emerald-400 bg-emerald-950/80' : 'text-rose-400 bg-rose-950/80'
                            }`}
                          >
                            {edge.sign} {edge.sign === '+' ? 'طردي' : 'عكسي'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {lang === 'ar' ? edge.mechanismAr : edge.mechanismEn}
                        </p>
                        <div className="text-[10px] font-mono text-cyan-300 pt-0.5">
                          {edge.formulaAr}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Consequences (Downstream Effects) */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>المتغيرات المتأثرة مباشرة (Downstream Consequences: {activeSubnet.downstream.length})</span>
                </h4>

                {activeSubnet.downstream.length === 0 ? (
                  <div className="text-[11px] text-slate-500 p-2 bg-slate-950/60 rounded">
                    متغير نتيجة نهائي بدون أثر مباشر إضافي محدد في هذا العرض.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeSubnet.downstream.map(({ node, edge }) => (
                      <div
                        key={edge.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className="p-2.5 rounded bg-slate-950/80 border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-colors text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">
                            {lang === 'ar' ? node.labelAr : node.labelEn}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                              edge.sign === '+' ? 'text-emerald-400 bg-emerald-950/80' : 'text-rose-400 bg-rose-950/80'
                            }`}
                          >
                            {edge.sign} {edge.sign === '+' ? 'طردي' : 'عكسي'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {lang === 'ar' ? edge.mechanismAr : edge.mechanismEn}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-slate-500">
              اختر متغيراً من الرسم التخطيطي لعرض علاقاته وتفاصيله
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
