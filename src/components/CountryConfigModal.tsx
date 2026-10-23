/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Country Configuration & Safe Reset Modal
 * إعدادات الدولة والهيكل الجهوي والديموغرافي مع تأكيد إعادة الضبط
 */

import React, { useState } from 'react';
import { CountryConfig, TimeStepUnit } from '../types/simulation';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { Sliders, AlertTriangle, ShieldCheck, MapPin, Users, BookOpen, RotateCcw } from 'lucide-react';

interface CountryConfigModalProps {
  config: CountryConfig;
  onUpdateConfig: (updated: CountryConfig) => void;
  onResetConfirmed: () => void;
  lang: Language;
}

export const CountryConfigModal: React.FC<CountryConfigModalProps> = ({
  config,
  onUpdateConfig,
  onResetConfirmed,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [formData, setFormData] = useState({
    nameAr: config.nameAr,
    nameEn: config.nameEn,
    currencySymbol: config.currencySymbol,
    timeStepUnit: config.timeStepUnit,
  });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    onUpdateConfig({
      ...config,
      nameAr: formData.nameAr,
      nameEn: formData.nameEn,
      currencySymbol: formData.currencySymbol,
      timeStepUnit: formData.timeStepUnit,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Explicit Scientific Disclaimer Banner */}
      <div className="bg-amber-950/30 border border-amber-800/80 rounded-lg p-4 text-xs text-amber-200 space-y-1">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {lang === 'ar' ? 'تنبيه النزاهة العلمية والبيانات الافتراضية' : 'Scientific Integrity & Synthetic Dataset Disclosure'}
          </span>
        </div>
        <p className="leading-relaxed">
          {lang === 'ar' ? config.dataSourceDisclosureAr : config.dataSourceDisclosureEn}
        </p>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>إعدادات وهوية الدولة الوطنية</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تحديد المسمى الرسمي، وحدة العملة، والخطوة الزمنية المعتمدة
            </p>
          </div>

          <div className="flex items-center gap-2">
            {savedNotice && (
              <span className="text-xs text-emerald-400 font-medium">تم الحفظ بنجاح!</span>
            )}
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors cursor-pointer"
            >
              حفظ التعديلات
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">اسم الدولة (بالعربية)</label>
            <input
              type="text"
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Country Name (English)</label>
            <input
              type="text"
              value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">رمز العملة (Currency Symbol)</label>
            <input
              type="text"
              value={formData.currencySymbol}
              onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">الخطوة الزمنية للمحاكاة (Time Step)</label>
            <select
              value={formData.timeStepUnit}
              onChange={(e) => setFormData({ ...formData, timeStepUnit: e.target.value as TimeStepUnit })}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="annual">سنوي (Annual: 1 Year)</option>
              <option value="quarterly">فصلي (Quarterly: 3 Months)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Regional Composition & Demographic Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regions */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-semibold text-slate-200">
              الهيكل الجغرافي والجهوي ({config.regions.length} أقاليم)
            </h4>
          </div>

          <div className="space-y-2.5 text-xs">
            {config.regions.map((reg) => (
              <div key={reg.id} className="p-3 bg-slate-800/60 border border-slate-700/60 rounded space-y-1">
                <div className="flex justify-between items-center font-semibold text-slate-200">
                  <span>{lang === 'ar' ? reg.nameAr : reg.nameEn}</span>
                  <span className="font-mono text-cyan-400">{reg.populationMillions} مليون ({reg.populationSharePct}%)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                  <div>الناتج: {reg.regionalGdpUsdBillion} $B</div>
                  <div>كفاءة الخدمات: {reg.publicServiceCapacityIndex}/100</div>
                  <div>البطالة: {reg.unemploymentRatePct}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demographic Groups */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-slate-200">
              الفئات السكانية والهرم العمري ({config.populationGroups.length} فئات)
            </h4>
          </div>

          <div className="space-y-2.5 text-xs">
            {config.populationGroups.map((grp) => (
              <div key={grp.id} className="p-3 bg-slate-800/60 border border-slate-700/60 rounded space-y-1">
                <div className="flex justify-between items-center font-semibold text-slate-200">
                  <span>{lang === 'ar' ? grp.nameAr : grp.nameEn}</span>
                  <span className="font-mono text-emerald-400">{grp.countMillions} مليون ({grp.shareOfTotalPct}%)</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>الفئة العمرية: {grp.ageRange}</span>
                  <span>المشاركة في العمل: {grp.laborParticipationRatePct}%</span>
                  <span>{grp.isDependent ? 'معال (Dependent)' : 'نشط اقتصادياً'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Assumptions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h4 className="text-sm font-semibold text-slate-200">
            الافتراضات والمعايير الرياضية المعتمدة ({config.modelAssumptions.length} افتراضات)
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
            <thead className="bg-slate-950 text-slate-400 font-mono">
              <tr>
                <th className="p-2.5">المعامل / الافتراض</th>
                <th className="p-2.5">القيمة</th>
                <th className="p-2.5">النطاق الساري</th>
                <th className="p-2.5">الأساس النظري والتجريبي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
              {config.modelAssumptions.map((assump) => (
                <tr key={assump.id} className="hover:bg-slate-800/40">
                  <td className="p-2.5 font-sans font-medium text-slate-200">
                    {lang === 'ar' ? assump.parameterNameAr : assump.parameterNameEn}
                  </td>
                  <td className="p-2.5 text-cyan-400 font-bold">{assump.unit}</td>
                  <td className="p-2.5 text-slate-400">{assump.validRange}</td>
                  <td className="p-2.5 font-sans text-slate-400 text-[11px]">
                    {lang === 'ar' ? assump.rationaleAr : assump.rationaleEn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset State with Confirmation Dialog */}
      <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" />
            <span>إعادة ضبط المحاكاة للحالة التأسيسية (Factory Reset)</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            إعادة تعيين كافة السياسات والسلاسل الزمنية لسنة الأساس {config.baseYear}.
          </p>
        </div>

        {showResetConfirm ? (
          <div className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-rose-800">
            <span className="text-xs text-rose-300 font-semibold">هل أنت متأكد تماماً؟</span>
            <button
              onClick={() => {
                setShowResetConfirm(false);
                onResetConfirmed();
              }}
              className="px-3 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded cursor-pointer"
            >
              نعم، أعد الضبط
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded"
            >
              إلغاء
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 rounded transition-colors cursor-pointer"
          >
            بدء إعادة الضبط...
          </button>
        )}
      </div>
    </div>
  );
};
