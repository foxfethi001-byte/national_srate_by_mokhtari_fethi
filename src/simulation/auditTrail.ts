/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Audit Trail & Accountability Engine (Phase 5)
 * سجل التدقيق والمساءلة الشامل ومفسر تباين السيناريوهات والنتائج
 */

import { Scenario, SimulationState } from '../types/simulation';
import { AuditRecord, AuditEventType, ScenarioDivergenceReport, ScenarioDivergenceFactor } from '../types/planning';

const AUDIT_STORAGE_KEY = 'nss_audit_trail_v1';

class AuditTrailService {
  private records: AuditRecord[] = [];

  constructor() {
    this.loadFromStorage();
    if (this.records.length === 0) {
      this.initDefaultRecords();
    }
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (data) {
        this.records = JSON.parse(data);
      }
    } catch {
      this.records = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.records.slice(-200))); // keep latest 200 records
    } catch {
      // storage unavailable or quota exceeded
    }
  }

  private initDefaultRecords() {
    this.records = [
      {
        id: 'aud_init_1',
        timestamp: new Date().toISOString(),
        simulatedYear: 2024,
        eventType: 'model_version_changed',
        actor: 'النظام المحاسبي الوطني',
        titleAr: 'تهيئة نموذج المحاكاة الوطني (الإصدار 5.0)',
        titleEn: 'National Simulation Model Initialized (v5.0)',
        detailsAr: 'تفعيل محرك التخطيط الاستراتيجي، الإنذار المبكر، وإدارة الأزمات الشاملة.',
        detailsEn: 'Activated strategic planning, early-warning, and crisis management engines.',
      },
      {
        id: 'aud_init_2',
        timestamp: new Date().toISOString(),
        simulatedYear: 2024,
        eventType: 'plan_created',
        actor: 'مجلس التخطيط الوطني',
        titleAr: 'اعتماد مسودة خطة التحول الصناعي والطاقة النظيفة 2035',
        titleEn: 'Adopted Vision 2035: Industrial Transformation & Clean Energy draft',
        detailsAr: 'تحديد 3 أهداف استراتيجية وموازنة إجمالية بقيمة 89 مليار دولار حتى 2034.',
        detailsEn: 'Defined 3 strategic national objectives with $89B envelope through 2034.',
      },
    ];
    this.saveToStorage();
  }

  public getRecords(): AuditRecord[] {
    return [...this.records].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public logEvent(record: Omit<AuditRecord, 'id' | 'timestamp'>): AuditRecord {
    const newRecord: AuditRecord = {
      ...record,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.records.push(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  public clearAuditTrail() {
    this.records = [];
    this.initDefaultRecords();
  }
}

export const auditTrailManager = new AuditTrailService();

/**
 * Explains mathematically and logically why two scenarios produced different results.
 * Identifies key policy and shock drivers.
 */
export function explainScenarioDivergence(
  scenarioA: Scenario,
  scenarioB: Scenario,
  metricKey: 'realGdp' | 'debtToGdpRatio' | 'inflationRate' | 'unemploymentRate'
): ScenarioDivergenceReport {
  const latestA = scenarioA.history[scenarioA.history.length - 1];
  const latestB = scenarioB.history[scenarioB.history.length - 1];

  let valA = 0;
  let valB = 0;
  let metricNameAr = '';

  if (metricKey === 'realGdp') {
    valA = latestA.macro.realGdp;
    valB = latestB.macro.realGdp;
    metricNameAr = 'الناتج المحلي الإجمالي الحقيقي ($B)';
  } else if (metricKey === 'debtToGdpRatio') {
    valA = latestA.macro.debtToGdpRatio;
    valB = latestB.macro.debtToGdpRatio;
    metricNameAr = 'نسبة الدين العام إلى الناتج (%)';
  } else if (metricKey === 'inflationRate') {
    valA = latestA.macro.inflationRate;
    valB = latestB.macro.inflationRate;
    metricNameAr = 'معدل التضخم السنوي (%)';
  } else {
    valA = latestA.demographics.unemploymentRate;
    valB = latestB.demographics.unemploymentRate;
    metricNameAr = 'معدل البطالة (%)';
  }

  const absoluteDiff = Math.round((valB - valA) * 100) / 100;
  const pctDiff = Math.abs(valA) > 0.001 ? Math.round(((valB - valA) / valA) * 1000) / 10 : 0;

  // Breakdown drivers
  const drivers: ScenarioDivergenceFactor[] = [];

  // 1. Fiscal and investment policy delta
  const investA = scenarioA.policies.budgetInfrastructurePctGdp || 5.0;
  const investB = scenarioB.policies.budgetInfrastructurePctGdp || 5.0;
  const investDiff = investB - investA;

  if (Math.abs(investDiff) > 0.3) {
    const weight = metricKey === 'realGdp' ? 45 : metricKey === 'debtToGdpRatio' ? 40 : 25;
    drivers.push({
      factorAr: `فارق الاستثمار العام الرأسمالي (${investDiff > 0 ? '+' : ''}${investDiff.toFixed(1)}% من الناتج)`,
      factorEn: `Public Capital Investment Divergence (${investDiff > 0 ? '+' : ''}${investDiff.toFixed(1)}% of GDP)`,
      contributionPct: weight,
      explanationAr: investDiff > 0
        ? 'زيادة الإنفاق الاستثماري في السيناريو الثاني حفزت الطاقة الإنتاجية والطلب الكلي ولكنه تطلب اقتراضاً إضافياً.'
        : 'تقليص الاستثمار العام كبح التوسع الرأسمالي ولكنه وفر سيولة خفضت وتيرة نمو الدين العام.',
      explanationEn: investDiff > 0
        ? 'Higher public investment in scenario B spurred aggregate demand and productive capacity at the cost of additional borrowing.'
        : 'Leaner capital outlays conserved fiscal space while dampening output potential.',
    });
  }

  // 2. Tax rate policy delta
  const taxA = scenarioA.policies.taxRateIncome || 20;
  const taxB = scenarioB.policies.taxRateIncome || 20;
  const taxDiff = taxB - taxA;
  if (Math.abs(taxDiff) > 0.5) {
    const weight = metricKey === 'debtToGdpRatio' ? 35 : 20;
    drivers.push({
      factorAr: `فارق العبء الضريبي على الدخل (${taxDiff > 0 ? '+' : ''}${taxDiff.toFixed(1)}%)`,
      factorEn: `Income Tax Differential (${taxDiff > 0 ? '+' : ''}${taxDiff.toFixed(1)}%)`,
      contributionPct: weight,
      explanationAr: taxDiff > 0
        ? 'رفع الضرائب وسع الإيرادات الذاتية للدولة مما حد من عجز الموازنة، مع تقليص طفيف في القوة الشرائية العائلية.'
        : 'خفض الضرائب حفز الاستهلاك الخاص ولكنه زاد الحاجة لإصدار سندات لتغطية الفجوة التمويلية.',
      explanationEn: taxDiff > 0
        ? 'Higher tax rate broadened domestic revenue mobilization, narrowing the deficit while dampening disposable income.'
        : 'Tax relief bolstered consumer spending while widening the borrowing requirement.',
    });
  }

  // 3. Monetary policy delta
  const rateA = scenarioA.policies.monetaryTargetInflation || 3.0;
  const rateB = scenarioB.policies.monetaryTargetInflation || 3.0;
  const rateDiff = rateB - rateA;
  if (Math.abs(rateDiff) > 0.2) {
    const weight = metricKey === 'inflationRate' ? 45 : 20;
    drivers.push({
      factorAr: `فارق المستهدف التضخمي للسياسة النقدية (${rateDiff > 0 ? '+' : ''}${rateDiff.toFixed(1)}%)`,
      factorEn: `Monetary Policy Inflation Target Spread (${rateDiff > 0 ? '+' : ''}${rateDiff.toFixed(1)}%)`,
      contributionPct: weight,
      explanationAr: rateDiff > 0
        ? 'التشديد النقدي خفض التضخم وعزز قوة العملة المحلية، ولكنه رفع كلفة تمويل استثمارات الشركات الخاصة.'
        : 'التيسير النقدي رخص كلفة الاقتراض ولكنه غذى الضغوط التضخمية وتآكل القوة الشرائية.',
      explanationEn: rateDiff > 0
        ? 'Monetary tightening reined in inflation but elevated enterprise borrowing hurdles.'
        : 'Accommodative policy lowered financing costs while feeding price pressures.',
    });
  }

  // 4. Shocks divergence
  const shockA = scenarioA.shocks.commodityPriceShockPct || 0;
  const shockB = scenarioB.shocks.commodityPriceShockPct || 0;
  if (shockA !== shockB) {
    drivers.push({
      factorAr: `التعرض لصدمات الأسعار العالمية (فارق: ${shockB - shockA}%)`,
      factorEn: `Global Terms of Trade Shock Delta (${shockB - shockA}%)`,
      contributionPct: 30,
      explanationAr: 'الصدمة السلعية المتباينة أحدثت تغيراً كبيراً في كلفة الواردات وأسعار الطاقة المحلية.',
      explanationEn: 'Divergent commodity shocks altered import bills and domestic energy inflation.',
    });
  }

  // Default driver if no large single delta
  if (drivers.length === 0) {
    drivers.push({
      factorAr: 'تراكم الفوارق الهيكلية عبر الزمن (التفاعل التراكمي)',
      factorEn: 'Cumulative dynamic path divergence over simulation time steps',
      contributionPct: 100,
      explanationAr: 'الفارق نتج عن تراكم تدريجي لتفاعلات الاستهلاك والاستثمار وحجم السكان بين السيناريوهين.',
      explanationEn: 'Difference stems from multi-period compounding of consumption, investment, and demographics.',
    });
  }

  // Normalize contribution percentages to sum to 100
  const totalWeight = drivers.reduce((sum, d) => sum + d.contributionPct, 0);
  drivers.forEach((d) => {
    d.contributionPct = Math.round((d.contributionPct / totalWeight) * 100);
  });

  return {
    scenarioAId: scenarioA.id,
    scenarioAName: scenarioA.nameAr,
    scenarioBId: scenarioB.id,
    scenarioBName: scenarioB.nameAr,
    comparedMetricKey: metricKey,
    comparedMetricNameAr: metricNameAr,
    valueA: Math.round(valA * 100) / 100,
    valueB: Math.round(valB * 100) / 100,
    absoluteDiff,
    pctDiff,
    keyDrivers: drivers,
    summaryConclusionAr: `التباين البالغ ${absoluteDiff > 0 ? '+' : ''}${absoluteDiff} (${pctDiff}%) يعود بالدرجة الأولى إلى ${drivers[0].factorAr} بنسبة ${drivers[0].contributionPct}%.`,
    summaryConclusionEn: `The observed variance of ${absoluteDiff > 0 ? '+' : ''}${absoluteDiff} (${pctDiff}%) is primarily driven by ${drivers[0].factorEn} (${drivers[0].contributionPct}% of total divergence).`,
  };
}
