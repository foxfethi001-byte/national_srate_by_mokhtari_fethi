/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Stress Testing & External Shocks Sandbox
 * صندوق اختبارات الإجهاد والمحاكاة العكسية للصدمات الخارجية
 */

import React from 'react';
import { ExternalShocks } from '../types/simulation';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { Zap, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ShockSandboxProps {
  shocks: ExternalShocks;
  onUpdateShock: <K extends keyof ExternalShocks>(key: K, value: ExternalShocks[K]) => void;
  onClearShocks: () => void;
  lang: Language;
}

export const ShockSandbox: React.FC<ShockSandboxProps> = ({
  shocks,
  onUpdateShock,
  onClearShocks,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  const hasActiveShocks =
    shocks.commodityPriceShockPct !== 0 ||
    shocks.globalInterestRateShock !== 0 ||
    shocks.tradeFrictionShockPct !== 0 ||
    shocks.climateShockIntensity !== 0 ||
    shocks.pandemicShockActive;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{t.shocks.title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.shocks.subtitle}</p>
        </div>

        {hasActiveShocks ? (
          <button
            onClick={onClearShocks}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 rounded transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.shocks.clearShocks}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>البيئة الخارجية مستقرة (بدون صدمات)</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Global Commodity Price Shock */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-semibold text-slate-200">
                {t.shocks.commodityPriceShock}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                تذبذب أسعار المحروقات والمعادن في الأسواق العالمية
              </p>
            </div>
            <span
              className={`font-mono text-xs font-bold tabular-nums px-2 py-0.5 rounded ${
                shocks.commodityPriceShockPct === 0
                  ? 'text-slate-400 bg-slate-800'
                  : shocks.commodityPriceShockPct > 0
                  ? 'text-amber-400 bg-amber-950/60'
                  : 'text-rose-400 bg-rose-950/60'
              }`}
            >
              {shocks.commodityPriceShockPct > 0 ? '+' : ''}
              {shocks.commodityPriceShockPct}%
            </span>
          </div>

          <input
            type="range"
            min="-50"
            max="100"
            step="5"
            value={shocks.commodityPriceShockPct}
            onChange={(e) => onUpdateShock('commodityPriceShockPct', Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>انهيار الأسعار (-50%)</span>
            <span>استقرار (0%)</span>
            <span>طفرة سعرية (+100%)</span>
          </div>
        </div>

        {/* 2. Global Interest Rate Spike */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-semibold text-slate-200">
                {t.shocks.globalInterestRateShock}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                تشديد السياسة النقدية من البنوك المركزية الكبرى وهروب رؤوس الأموال
              </p>
            </div>
            <span
              className={`font-mono text-xs font-bold tabular-nums px-2 py-0.5 rounded ${
                shocks.globalInterestRateShock === 0
                  ? 'text-slate-400 bg-slate-800'
                  : 'text-rose-400 bg-rose-950/60'
              }`}
            >
              +{shocks.globalInterestRateShock.toFixed(1)}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="4"
            step="0.25"
            value={shocks.globalInterestRateShock}
            onChange={(e) => onUpdateShock('globalInterestRateShock', Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0.0% (محايد)</span>
            <span>+2.0% (تشديد قوي)</span>
            <span>+4.0% (صدمة حادة)</span>
          </div>
        </div>

        {/* 3. Global Trade Friction / Tariffs */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-semibold text-slate-200">
                {t.shocks.tradeFrictionShock}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                حمائية جمركية، نزاعات تجارية واضطراب سلاسل الإمداد العالمية
              </p>
            </div>
            <span
              className={`font-mono text-xs font-bold tabular-nums px-2 py-0.5 rounded ${
                shocks.tradeFrictionShockPct === 0
                  ? 'text-slate-400 bg-slate-800'
                  : 'text-amber-400 bg-amber-950/60'
              }`}
            >
              {shocks.tradeFrictionShockPct > 0 ? '+' : ''}
              {shocks.tradeFrictionShockPct}%
            </span>
          </div>

          <input
            type="range"
            min="-20"
            max="30"
            step="5"
            value={shocks.tradeFrictionShockPct}
            onChange={(e) => onUpdateShock('tradeFrictionShockPct', Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>انفتاح إضافي (-20%)</span>
            <span>اعتيادي (0%)</span>
            <span>حرب تجارية (+30%)</span>
          </div>
        </div>

        {/* 4. Climate Shock Intensity */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-semibold text-slate-200">
                {t.shocks.climateShock}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                موجات جفاف حادة أو كوارث مناخية تضرب الإنتاج الزراعي والبنية
              </p>
            </div>
            <span
              className={`font-mono text-xs font-bold tabular-nums px-2 py-0.5 rounded ${
                shocks.climateShockIntensity === 0
                  ? 'text-slate-400 bg-slate-800'
                  : 'text-orange-400 bg-orange-950/60'
              }`}
            >
              {shocks.climateShockIntensity} / 100
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={shocks.climateShockIntensity}
            onChange={(e) => onUpdateShock('climateShockIntensity', Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0 (طبيعي)</span>
            <span>50 (موسم جفاف)</span>
            <span>100 (كارثة بيئية)</span>
          </div>
        </div>
      </div>

      {/* 5. Pandemic Shock Toggle */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className={`w-5 h-5 ${shocks.pandemicShockActive ? 'text-rose-400' : 'text-slate-500'}`} />
          <div>
            <h3 className="text-xs font-semibold text-slate-200">
              {t.shocks.pandemicShock}
            </h3>
            <p className="text-[11px] text-slate-400">
              صدمة صحية طارئة تؤثر على الطاقة الاستيعابية للمستشفيات والنمو الاقتصادي
            </p>
          </div>
        </div>

        <button
          onClick={() => onUpdateShock('pandemicShockActive', !shocks.pandemicShockActive)}
          className={`px-4 py-2 text-xs font-semibold rounded cursor-pointer transition-colors ${
            shocks.pandemicShockActive
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          {shocks.pandemicShockActive ? 'مفعلة (صدمة نشطة)' : 'معطلة'}
        </button>
      </div>
    </div>
  );
};
