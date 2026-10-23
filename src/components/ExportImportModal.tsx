/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Data Import & Export Suite (JSON / CSV) with Validation & Diagnostics
 * تصدير واستيراد بيانات المحاكاة وحزم المشاريع مع الفحص التشخيصي للسلامة
 */

import React, { useState } from 'react';
import { Scenario, SimulationState, CountryConfig, SimulationCheckpoint, ProjectStateExport } from '../types/simulation';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { validateImportedProjectBundle } from '../simulation/automatedTests';
import { Download, Upload, Copy, Check, FileSpreadsheet, FileCode, AlertOctagon } from 'lucide-react';

interface ExportImportModalProps {
  currentScenario: Scenario;
  countryConfig: CountryConfig;
  savedScenarios: Scenario[];
  checkpoints: SimulationCheckpoint[];
  onImportScenario: (imported: Scenario) => void;
  onImportProjectBundle?: (bundle: ProjectStateExport) => void;
  lang: Language;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  currentScenario,
  countryConfig,
  savedScenarios,
  checkpoints,
  onImportScenario,
  onImportProjectBundle,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Generate CSV data from history
  const generateCsv = (): string => {
    const headers = [
      'Year',
      'RealGDP_USD_B',
      'NominalGDP_USD_B',
      'GDPGrowth_Pct',
      'Inflation_Pct',
      'CentralBankRate_Pct',
      'SovereignYield10y_Pct',
      'TotalRevenue_USD_B',
      'TotalExpenditure_USD_B',
      'OverallDeficit_USD_B',
      'PublicDebtStock_USD_B',
      'DebtToGDP_Pct',
      'TotalPopulation_M',
      'LaborForce_M',
      'Employed_M',
      'Unemployment_Pct',
      'YouthUnemployment_Pct',
      'FertilityRate',
      'LifeExpectancy_Years',
      'EducationIndex',
      'HealthcareIndex',
      'PublicServiceCapacityIndex',
      'InfraStock_USD_B',
      'TFP_Index',
      'PrimaryEnergy_TWh',
      'Renewable_Pct',
      'CO2_Emissions_Mt',
      'Gini_Index',
      'Poverty_Pct',
      'PensionSolvency_Pct',
      'InstitutionalTrust_Index',
      'SocialTension_Index',
    ];

    const rows = currentScenario.history.map((s: SimulationState) => [
      s.year,
      s.macro.realGdp,
      s.macro.nominalGdp,
      s.macro.realGdpGrowthRate,
      s.macro.inflationRate,
      s.macro.centralBankRate,
      s.macro.sovereignBondYield10y,
      s.macro.totalRevenue,
      s.macro.totalExpenditure,
      s.macro.overallDeficit,
      s.macro.publicDebtStock,
      s.macro.debtToGdpRatio,
      s.demographics.totalPopulation,
      s.demographics.laborForceTotal,
      s.demographics.employedTotal,
      s.demographics.unemploymentRate,
      s.demographics.youthUnemploymentRate,
      s.demographics.fertilityRate,
      s.demographics.lifeExpectancy,
      s.humanCapital.educationQualityIndex,
      s.humanCapital.healthcareQualityIndex,
      s.humanCapital.publicServiceCapacityIndex,
      s.humanCapital.infrastructureStock,
      s.humanCapital.totalFactorProductivity,
      s.energy.primaryEnergyDemandTwh,
      s.energy.renewableEnergyPct,
      s.energy.annualCo2EmissionsMt,
      s.governance.giniCoefficient,
      s.governance.povertyRatePct,
      s.governance.pensionFundSolvencyPct,
      s.governance.institutionalTrustIndex,
      s.governance.socialTensionIndex,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const handleDownloadCsv = () => {
    const csvContent = generateCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `simulation_${currentScenario.id}_${currentScenario.currentYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadProjectBundle = () => {
    const bundle: ProjectStateExport = {
      formatVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      activeArchetypeId: currentScenario.baseArchetypeId,
      countryConfig,
      activeScenario: currentScenario,
      savedScenarios,
      checkpoints,
    };

    const jsonStr = JSON.stringify(bundle, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `project_bundle_${countryConfig.id}_${currentScenario.currentYear}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = () => {
    const latest = currentScenario.history[currentScenario.history.length - 1];
    const summary = `
المحاكي الوطني - ملخص السيناريو (${currentScenario.nameAr})
السنة: ${latest.year}
الناتج المحلي الحقيقي: ${latest.macro.realGdp} $B (النمو: ${latest.macro.realGdpGrowthRate}%)
التضخم: ${latest.macro.inflationRate}% | فائدة البنك المركزي: ${latest.macro.centralBankRate}%
نسبة الدين العام إلى الناتج: ${latest.macro.debtToGdpRatio}% | العجز الكلي: ${latest.macro.overallDeficit} $B
معدل البطالة: ${latest.demographics.unemploymentRate}% (المشتغلون: ${latest.demographics.employedTotal} M)
طاقة الخدمات العامة: ${latest.humanCapital.publicServiceCapacityIndex}/100 | الثقة المؤسسية: ${latest.governance.institutionalTrustIndex}/100
السكان: ${latest.demographics.totalPopulation} مليون | الخصوبة: ${latest.demographics.fertilityRate}
حصة الطاقة المتجددة: ${latest.energy.renewableEnergyPct}% | انبعاثات الكربون: ${latest.energy.annualCo2EmissionsMt} Mt
معامل جيني: ${latest.governance.giniCoefficient} | التوتر الاجتماعي: ${latest.governance.socialTensionIndex}/100
`.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let parsed: unknown;
        try {
          parsed = JSON.parse(text);
        } catch {
          throw new Error('الملف ليس بتنسيق JSON صالح (Malformed syntax).');
        }

        // Check if it's a full ProjectStateExport bundle
        if (parsed && typeof parsed === 'object' && 'formatVersion' in parsed) {
          const validation = validateImportedProjectBundle(parsed);
          if (!validation.valid) {
            setImportError(lang === 'ar' ? (validation.errorAr || 'الملف غير صالح.') : (validation.errorEn || 'Invalid bundle.'));
            return;
          }
          const bundle = parsed as ProjectStateExport;
          if (onImportProjectBundle) {
            onImportProjectBundle(bundle);
          } else {
            onImportScenario(bundle.activeScenario);
          }
          setImportSuccess('تم استيراد حزمة المشروع بنجاح!');
          return;
        }

        // Alternatively check if it's a standalone scenario
        const sc = parsed as Partial<Scenario>;
        if (sc.history && Array.isArray(sc.history) && sc.policies) {
          onImportScenario(sc as Scenario);
          setImportSuccess('تم استيراد السيناريو بنجاح!');
          return;
        }

        throw new Error('الملف لا يحتوي على حزمة مشروع (Project Bundle) أو سيناريو صالح.');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'فشل قراءة الملف.';
        setImportError(msg);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h2 className="text-base font-semibold text-slate-100">{t.dataExport.title}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{t.dataExport.subtitle}</p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Export Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                {t.dataExport.exportCsv}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تصدير السلسلة الزمنية الكاملة لكافة المؤشرات في جدول CSV ({currentScenario.history.length} صفوف)
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadCsv}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تحميل ملف CSV (Time-Series)</span>
          </button>
        </div>

        {/* JSON Export Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-3">
            <FileCode className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                تصدير حزمة المشروع الكاملة (Project Bundle JSON)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تتضمن إعدادات الدولة، الأقاليم، المحطات المرجعية، والسيناريو النشط (Format v1.0.0)
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadProjectBundle}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تحميل حزمة JSON (Full State)</span>
          </button>
        </div>
      </div>

      {/* Copy Summary and Import File */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Copy Text Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
          <h3 className="text-xs font-semibold text-slate-200">
            ملخص نصي للمؤشرات
          </h3>
          <p className="text-xs text-slate-400">
            نسخ ملخص تقريري للمؤشرات الرئيسية للعام الحالي لاستخدامه في التقارير أو العروض.
          </p>
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t.dataExport.copiedSuccess : t.dataExport.copyToClipboard}</span>
          </button>
        </div>

        {/* Import JSON */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
          <h3 className="text-xs font-semibold text-slate-200">
            {t.dataExport.importJson}
          </h3>
          <p className="text-xs text-slate-400">
            استعادة حزمة مشروع أو سيناريو من ملف JSON مع فحص تطابق المخطط وصحة البيانات.
          </p>
          <label className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700 border-dashed rounded cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>اختيار ملف JSON للاستيراد</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
          {importError && (
            <div className="text-xs text-rose-300 bg-rose-950/50 border border-rose-800/80 p-2.5 rounded flex items-start gap-2 mt-2">
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-mono text-[11px]">{importError}</div>
            </div>
          )}
          {importSuccess && (
            <div className="text-xs text-emerald-400 font-medium mt-1">
              {importSuccess}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
