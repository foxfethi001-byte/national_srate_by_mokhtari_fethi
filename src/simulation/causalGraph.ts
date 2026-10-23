/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Formal Macroeconomic Causal Graph & Registry (Phase 2)
 * سجل شبكة العلاقات السببية والترابطات البينية للاقتصاد الكلي
 */

import { CausalNode, CausalEdge, CausalLink } from '../types/simulation';

export const CAUSAL_NODES: CausalNode[] = [
  { id: 'real_gdp', labelAr: 'الناتج المحلي الحقيقي (Y)', labelEn: 'Real GDP (Y)', sector: 'macroeconomy', unit: '$B', isStock: false },
  { id: 'nominal_gdp', labelAr: 'الناتج المحلي الاسمي', labelEn: 'Nominal GDP', sector: 'macroeconomy', unit: '$B', isStock: false },
  { id: 'gdp_deflator', labelAr: 'مكمش الناتج (P)', labelEn: 'GDP Deflator (P)', sector: 'monetary_prices', unit: 'index', isStock: false },
  { id: 'household_consumption', labelAr: 'الاستهلاك العائلي (C)', labelEn: 'Household Consumption (C)', sector: 'households', unit: '$B', isStock: false },
  { id: 'total_investment', labelAr: 'الاستثمار الكلي (I)', labelEn: 'Total Investment (I)', sector: 'macroeconomy', unit: '$B', isStock: false },
  { id: 'private_investment', labelAr: 'الاستثمار الخاص (Ip)', labelEn: 'Private Investment (Ip)', sector: 'macroeconomy', unit: '$B', isStock: false },
  { id: 'public_capex', labelAr: 'الاستثمار العام للبنية (Ig)', labelEn: 'Public Infra Capex (Ig)', sector: 'fiscal_debt', unit: '$B', isStock: false },
  { id: 'government_consumption', labelAr: 'الإنفاق الحكومي الجاري (G)', labelEn: 'Government Consumption (G)', sector: 'fiscal_debt', unit: '$B', isStock: false },
  { id: 'exports', labelAr: 'الصادرات (X)', labelEn: 'Exports (X)', sector: 'trade_external', unit: '$B', isStock: false },
  { id: 'imports', labelAr: 'الواردات (M)', labelEn: 'Imports (M)', sector: 'trade_external', unit: '$B', isStock: false },
  { id: 'disposable_income', labelAr: 'الدخل المتاح للأسر (Yd)', labelEn: 'Disposable Income (Yd)', sector: 'households', unit: '$B', isStock: false },
  { id: 'household_savings', labelAr: 'المدخرات العائلية (Sh)', labelEn: 'Household Savings (Sh)', sector: 'households', unit: '$B', isStock: false },
  { id: 'unemployment_rate', labelAr: 'معدل البطالة (u)', labelEn: 'Unemployment Rate (u)', sector: 'labor_production', unit: '%', isStock: false },
  { id: 'employed_workers', labelAr: 'المشتغلون (L_emp)', labelEn: 'Employed Workers (L_emp)', sector: 'labor_production', unit: 'M', isStock: true },
  { id: 'labor_productivity', labelAr: 'إنتاجية العمل (Y/L)', labelEn: 'Labor Productivity (Y/L)', sector: 'labor_production', unit: '$k/worker', isStock: false },
  { id: 'real_wage', labelAr: 'متوسط الأجر الحقيقي (w/p)', labelEn: 'Real Wage (w/p)', sector: 'labor_production', unit: '$/month', isStock: false },
  { id: 'inflation_rate', labelAr: 'معدل التضخم (π)', labelEn: 'Inflation Rate (π)', sector: 'monetary_prices', unit: '%', isStock: false },
  { id: 'central_bank_rate', labelAr: 'فائدة البنك المركزي (i)', labelEn: 'Policy Rate (i)', sector: 'monetary_prices', unit: '%', isStock: false },
  { id: 'sovereign_yield', labelAr: 'عائد السندات السيادية (10y)', labelEn: 'Sovereign 10y Yield', sector: 'fiscal_debt', unit: '%', isStock: false },
  { id: 'tax_revenue_total', labelAr: 'إجمالي الإيرادات الضريبية (T)', labelEn: 'Total Fiscal Revenue (T)', sector: 'fiscal_debt', unit: '$B', isStock: false },
  { id: 'corporate_tax_rate', labelAr: 'معدل ضريبة الشركات', labelEn: 'Corporate Tax Rate', sector: 'fiscal_debt', unit: '%', isStock: false },
  { id: 'income_tax_rate', labelAr: 'معدل ضريبة الدخل', labelEn: 'Income Tax Rate', sector: 'fiscal_debt', unit: '%', isStock: false },
  { id: 'vat_rate', labelAr: 'معدل ضريبة القيمة المضافة', labelEn: 'VAT Rate', sector: 'fiscal_debt', unit: '%', isStock: false },
  { id: 'public_expenditure_total', labelAr: 'إجمالي النفقات العامة (E)', labelEn: 'Total Fiscal Outlays (E)', sector: 'fiscal_debt', unit: '$B', isStock: false },
  { id: 'overall_deficit', labelAr: 'عجز الميزانية الصافي', labelEn: 'Budget Deficit', sector: 'fiscal_debt', unit: '$B', isStock: false },
  { id: 'public_debt_stock', labelAr: 'رصيد الدين العام (D)', labelEn: 'Public Debt Stock (D)', sector: 'fiscal_debt', unit: '$B', isStock: true },
  { id: 'debt_to_gdp', labelAr: 'نسبة الدين إلى الناتج (D/Y)', labelEn: 'Debt-to-GDP Ratio (D/Y)', sector: 'fiscal_debt', unit: '%', isStock: false },
  { id: 'capital_stock', labelAr: 'رأس المال الإنتاجي (K)', labelEn: 'Productive Capital Stock (K)', sector: 'macroeconomy', unit: '$B', isStock: true },
  { id: 'purchasing_power', labelAr: 'القوة الشرائية للأسر', labelEn: 'Household Purchasing Power', sector: 'households', unit: 'index', isStock: false },
];

export const CAUSAL_EDGES: CausalEdge[] = [
  // 1. National Accounts Expenditure Identity
  {
    id: 'EDGE_GDP_EXPENDITURE',
    source: 'household_consumption',
    target: 'real_gdp',
    sign: '+',
    mechanismAr: 'الاستهلاك يمثل المكون الأكبر من الطلب الكلي الفعال في متطابقة الحسابات القومية.',
    mechanismEn: 'Household consumption represents the largest component of aggregate demand in expenditure GDP.',
    formulaAr: 'Y = C + I + G + (X - M)',
    formulaEn: 'Y = C + I + G + (X - M)',
    parameters: 'معامل الإسهام = 1.0 (تطابق حسابي)',
    units: '$B USD',
    timeDelayYears: 0,
    conditions: 'سارية في كافة الحالات بدون استثناء',
    relationshipType: 'accounting_identity',
    confidence: 'accounting_identity',
    evidenceRef: 'UN System of National Accounts (SNA 2008)',
    testId: 'TEST_INV_GDP_EXPENDITURE',
  },
  {
    id: 'EDGE_INVESTMENT_TO_GDP',
    source: 'total_investment',
    target: 'real_gdp',
    sign: '+',
    mechanismAr: 'الاستثمار الخاص والعام يولد طلباً مباشراً على السلع الرأسمالية ومواد البناء.',
    mechanismEn: 'Gross fixed capital formation directly adds to current period aggregate demand.',
    formulaAr: 'Y = C + I + G + (X - M)',
    formulaEn: 'Y = C + I + G + (X - M)',
    parameters: 'معامل الإسهام = 1.0 (تطابق حسابي)',
    units: '$B USD',
    timeDelayYears: 0,
    conditions: 'سارية في كافة الحالات',
    relationshipType: 'accounting_identity',
    confidence: 'accounting_identity',
    evidenceRef: 'UN System of National Accounts (SNA 2008)',
    testId: 'TEST_INV_GDP_EXPENDITURE',
  },
  {
    id: 'EDGE_NET_EXPORTS_TO_GDP',
    source: 'exports',
    target: 'real_gdp',
    sign: '+',
    mechanismAr: 'الصادرات تضخ طلباً خارجياً صافياً في الاقتصاد المحلي.',
    mechanismEn: 'Exports represent foreign absorption injected into domestic output.',
    formulaAr: 'Y = C + I + G + (X - M)',
    formulaEn: 'Y = C + I + G + (X - M)',
    parameters: 'معامل = +1.0 للصادرات، -1.0 للواردات',
    units: '$B USD',
    timeDelayYears: 0,
    conditions: 'سارية دائماً',
    relationshipType: 'accounting_identity',
    confidence: 'accounting_identity',
    evidenceRef: 'Balance of Payments and International Investment Position Manual (BPM6)',
    testId: 'TEST_INV_GDP_EXPENDITURE',
  },

  // 2. Household Income & Consumption
  {
    id: 'EDGE_INCOME_TO_CONSUMPTION',
    source: 'disposable_income',
    target: 'household_consumption',
    sign: '+',
    mechanismAr: 'دالة الاستهلاك الكينزية: يخصص المستهلكون نسبة محددة (الميل الحدي للاستهلاك MPC) من دخلهم المتاح للإنفاق.',
    mechanismEn: 'Keynesian consumption function: households spend a marginal propensity out of disposable income.',
    formulaAr: 'C = C0 + MPC × Yd',
    formulaEn: 'C = C0 + MPC * Yd',
    parameters: 'الميل الحدي للاستهلاك MPC = 0.75 - 0.82',
    units: '$B USD',
    timeDelayYears: 0,
    conditions: 'Yd > 0',
    relationshipType: 'empirical_relationship',
    confidence: 'high_empirical',
    evidenceRef: 'Friedman Permanent Income Hypothesis / Carroll (2001)',
    testId: 'TEST_BEH_CONSUMPTION_INCOME',
  },
  {
    id: 'EDGE_INCOME_TAX_TO_DISPOSABLE',
    source: 'income_tax_rate',
    target: 'disposable_income',
    sign: '-',
    mechanismAr: 'اقتطاع ضريبة الدخل يقلص صافي الدخل النقدي المتاح للتصرف لدى الأسر.',
    mechanismEn: 'Direct personal income taxation directly subtracts from household disposable purchasing power.',
    formulaAr: 'Yd = GrossWages + Transfers - (GrossWages × TaxRate)',
    formulaEn: 'Yd = GrossWages + Transfers - (GrossWages * TaxRate)',
    parameters: 'معامل الاقتطاع = -1.0',
    units: '$B USD',
    timeDelayYears: 0,
    conditions: 'معدل الضريبة بين [0% - 60%]',
    relationshipType: 'accounting_identity',
    confidence: 'accounting_identity',
    evidenceRef: 'National Accounts Disposable Income Identity',
    testId: 'TEST_TAX_PROPAGATION',
  },

  // 3. Investment & Capital Formation
  {
    id: 'EDGE_INTEREST_TO_INVESTMENT',
    source: 'central_bank_rate',
    target: 'private_investment',
    sign: '-',
    mechanismAr: 'ارتفاع سعر الفائدة الحقيقي يزيد كلفة رأس المال ويثبط المشاريع الاستثمارية الهامشية.',
    mechanismEn: 'Higher cost of capital increases hurdle rates for corporate investment (Jorgenson neoclassical investment model).',
    formulaAr: 'Ip = Ip_base × [1 - 0.012 × (r - r_neutral)]',
    formulaEn: 'Ip = Ip_base * [1 - 0.012 * (r - r_neutral)]',
    parameters: 'مرونة الاستثمار للفائدة = -0.012 لكل نقطة فائدة حقيقية',
    units: '$B USD',
    timeDelayYears: 1,
    conditions: 'r > 0',
    relationshipType: 'empirical_relationship',
    confidence: 'high_empirical',
    evidenceRef: 'Jorgenson (1963) / Chirinko (1993)',
    testId: 'TEST_BEH_INVESTMENT_RATE',
  },
  {
    id: 'EDGE_CORP_TAX_TO_INVESTMENT',
    source: 'corporate_tax_rate',
    target: 'private_investment',
    sign: '-',
    mechanismAr: 'ضرائب أرباح الشركات تقلص العائد الصافي على رأس المال المستثمر وتثبط تدفقات الاستثمار الأجنبي.',
    mechanismEn: 'Corporate income taxes reduce the expected post-tax rate of return on capital additions.',
    formulaAr: 'Ip_mult = 1 - 0.008 × max(0, CorpTax - 20%)',
    formulaEn: 'Ip_mult = 1 - 0.008 * max(0, CorpTax - 20%)',
    parameters: 'حساسية = -0.008 لكل 1% فوق عتبة 20%',
    units: 'Multiplier',
    timeDelayYears: 1,
    conditions: 'CorpTax >= 0',
    relationshipType: 'empirical_relationship',
    confidence: 'moderate_empirical',
    evidenceRef: 'OECD Tax Policy Studies No. 20',
    testId: 'TEST_TAX_PROPAGATION',
  },
  {
    id: 'EDGE_INVESTMENT_TO_CAPITAL',
    source: 'total_investment',
    target: 'capital_stock',
    sign: '+',
    mechanismAr: 'الاستثمار السنوي يغذي رصيد رأس المال الإنتاجي التراكمي بعد خصم الاهتلاك الفيزيائي.',
    mechanismEn: 'Perpetual inventory capital accumulation: new gross investment adds to capital net of depreciation.',
    formulaAr: 'K(t) = K(t-1) × (1 - δ) + I(t)',
    formulaEn: 'K(t) = K(t-1) * (1 - delta) + I(t)',
    parameters: 'معدل الاهتلاك السنوي δ = 0.05 (5%)',
    units: '$B USD',
    timeDelayYears: 1,
    conditions: 'K > 0, delta > 0',
    relationshipType: 'accounting_identity',
    confidence: 'accounting_identity',
    evidenceRef: 'Perpetual Inventory Method (PIM) - OECD Manual',
    testId: 'TEST_INV_CAPITAL_ACCUMULATION',
  },

  // 4. Output Gap & Okun's Law
  {
    id: 'EDGE_GDP_TO_UNEMPLOYMENT',
    source: 'real_gdp',
    target: 'unemployment_rate',
    sign: '-',
    mechanismAr: 'قانون أوكون: تسارع نمو الناتج فوق الإمكانات الكامنة يولد طلباً إضافياً على العمالة ويخفض معدل البطالة.',
    mechanismEn: "Okun's Law: positive output gap leads to hiring expansion and cyclical unemployment reduction.",
    formulaAr: 'Δu = -0.38 × (نمو الناتج - نمو الناتج الكامن)',
    formulaEn: 'Delta_u = -0.38 * (g - g_pot)',
    parameters: 'معامل أوكون = -0.38',
    units: 'نقطة مئوية (%)',
    timeDelayYears: 0,
    conditions: 'معدل البطالة مقيد بين [2.5% - 30%]',
    relationshipType: 'empirical_relationship',
    confidence: 'high_empirical',
    evidenceRef: "Okun (1962) / Ball, Leigh, and Loungani (2017)",
    testId: 'TEST_BEH_OKUN_LAW',
  },

  // 5. Inflation & Phillips Curve
  {
    id: 'EDGE_OUTPUT_GAP_TO_INFLATION',
    source: 'real_gdp',
    target: 'inflation_rate',
    sign: '+',
    mechanismAr: 'منحنى فيليبس: تجاوز الناتج لطاقته الكامنة (فجوة موجبة) يخلق ضغوط طلب فائض ترفع الأسعار والأجور.',
    mechanismEn: 'New Keynesian Phillips curve: positive output gap generates demand-pull price pressures.',
    formulaAr: 'π = π_expect + 0.45 × max(0, OutputGap)',
    formulaEn: 'pi = pi_expect + 0.45 * max(0, OutputGap)',
    parameters: 'معامل حساسية الفجوة = 0.45',
    units: 'نسبة مئوية سنوية (%)',
    timeDelayYears: 0,
    conditions: 'سارية في كافة الحالات',
    relationshipType: 'empirical_relationship',
    confidence: 'high_empirical',
    evidenceRef: 'Galí and Gertler (1999)',
    testId: 'TEST_BEH_PHILLIPS_CURVE',
  },

  // 6. Monetary Policy (Taylor Rule)
  {
    id: 'EDGE_INFLATION_TO_RATE',
    source: 'inflation_rate',
    target: 'central_bank_rate',
    sign: '+',
    mechanismAr: 'قاعدة تايلور: يرفع البنك المركزي سعر الفائدة الاسمي بأكثر من الزيادة في التضخم لرفع الفائدة الحقيقية وكبح الأسعار.',
    mechanismEn: 'Taylor Principle: central bank increases policy rate more than one-for-one with excess inflation.',
    formulaAr: 'i = r* + π + 0.5 × (π - π*) + 0.5 × OutputGap',
    formulaEn: 'i = r_star + pi + 0.5 * (pi - pi_target) + 0.5 * OutputGap',
    parameters: 'معامل التضخم = 1.5 إجمالي (0.5 صافي انحراف)',
    units: '% سنوياً',
    timeDelayYears: 0,
    conditions: 'معدل الفائدة مقيد بسقف أدنى 0.25%',
    relationshipType: 'empirical_relationship',
    confidence: 'high_empirical',
    evidenceRef: 'Taylor (1993)',
    testId: 'TEST_BEH_TAYLOR_RULE',
  },

  // 7. Fiscal Budget & Debt Accumulation Flow
  {
    id: 'EDGE_DEFICIT_TO_DEBT',
    source: 'overall_deficit',
    target: 'public_debt_stock',
    sign: '+',
    mechanismAr: 'متطابقة تراكم الدين العام: عجز الميزانية السنوي يمثل صافي الاقتراض السيادي الذي يضاف مباشرة إلى رصيد الدين.',
    mechanismEn: 'Public debt accumulation identity: sovereign budget deficits require net debt issuance.',
    formulaAr: 'D(t) = D(t-1) + Deficit(t)',
    formulaEn: 'D(t) = D(t-1) + Deficit(t)',
    parameters: 'معامل التدفق = 1.0 (تطابق حسابي مطلق)',
    units: '$B USD',
    timeDelayYears: 1,
    conditions: 'عدم وجود شطب أو إعادة هيكلة ديون',
    relationshipType: 'accounting_identity',
    confidence: 'accounting_identity',
    evidenceRef: 'IMF Government Finance Statistics Manual (GFSM 2014)',
    testId: 'TEST_INV_DEBT_FLOW',
  },
  {
    id: 'EDGE_DEBT_TO_SOVEREIGN_SPREAD',
    source: 'public_debt_stock',
    target: 'sovereign_yield',
    sign: '+',
    mechanismAr: 'علاوة المخاطر السيادية: يفرض المستثمرون عائداً إضافياً لتعويض مخاطر الملاءة عندما يتجاوز الدين سقف 60% من الناتج.',
    mechanismEn: 'Non-linear sovereign risk premium pricing as public debt exceeds sustainability thresholds.',
    formulaAr: 'Spread = 0.04 × max(0, Debt/GDP - 60%) + 0.25 × (Deficit/GDP - 3%)',
    formulaEn: 'Spread = 0.04 * max(0, DebtGdp - 60%) + 0.25 * (DeficitGdp - 3%)',
    parameters: 'حساسية الدين = 4 نقاط أساس لكل 1% فوق عتبة 60%',
    units: '% سنوياً',
    timeDelayYears: 0,
    conditions: 'Debt/GDP > 60%',
    relationshipType: 'empirical_relationship',
    confidence: 'high_empirical',
    evidenceRef: 'Reinhart and Rogoff (2010) / IMF Sovereign Debt Restructuring',
    testId: 'TEST_BEH_SOVEREIGN_SPREAD',
  },
  {
    id: 'EDGE_DEBT_TO_INTEREST_OUTLAYS',
    source: 'sovereign_yield',
    target: 'public_expenditure_total',
    sign: '+',
    mechanismAr: 'كلفة خدمة الدين العام: ارتفاع عوائد السندات يرفع فوائد القروض الواجب سدادها، مما يزاحم الإنفاق التنموي في الميزانية.',
    mechanismEn: 'Debt servicing cost: higher borrowing yields expand the annual public interest outlays.',
    formulaAr: 'InterestService = DebtStock × EffectiveInterestRate',
    formulaEn: 'InterestService = DebtStock * EffectiveInterestRate',
    parameters: 'متوسط سعر الفائدة المرجح',
    units: '$B USD',
    timeDelayYears: 0,
    conditions: 'DebtStock > 0',
    relationshipType: 'accounting_identity',
    confidence: 'accounting_identity',
    evidenceRef: 'Government Finance Statistics Framework',
    testId: 'TEST_BUDGET_ACCOUNTING',
  },

  // 8. Purchasing Power & Wages
  {
    id: 'EDGE_INFLATION_TO_PURCHASING_POWER',
    source: 'inflation_rate',
    target: 'purchasing_power',
    sign: '-',
    mechanismAr: 'تآكل القوة الشرائية: ارتفاع أسعار المستهلك يقلل من كمية السلع والخدمات الحقيقية التي يمكن للأجر الاسمي شراؤها.',
    mechanismEn: 'Purchasing power erosion: headline inflation directly depresses real wage purchasing capacity.',
    formulaAr: 'RealWage = NominalWage / (CPI / 100)',
    formulaEn: 'RealWage = NominalWage / (CPI / 100)',
    parameters: 'انخفاض نسبي مكافئ للرقم القياسي',
    units: 'Index (Base 100)',
    timeDelayYears: 0,
    conditions: 'CPI > 0',
    relationshipType: 'accounting_identity',
    confidence: 'accounting_identity',
    evidenceRef: 'Consumer Price Index Theory and Practical Index Numbers',
    testId: 'TEST_REAL_VS_NOMINAL',
  },
];

// Graph Query Helpers
export function getAllCausalNodes(): CausalNode[] {
  return CAUSAL_NODES;
}

export function getAllCausalEdges(): CausalEdge[] {
  return CAUSAL_EDGES;
}

export function getIncomingEdges(targetNodeId: string): CausalEdge[] {
  return CAUSAL_EDGES.filter((e) => e.target === targetNodeId);
}

export function getOutgoingEdges(sourceNodeId: string): CausalEdge[] {
  return CAUSAL_EDGES.filter((e) => e.source === sourceNodeId);
}

export function getCausalSubnetwork(nodeId: string): {
  node: CausalNode;
  upstream: { node: CausalNode; edge: CausalEdge }[];
  downstream: { node: CausalNode; edge: CausalEdge }[];
} | null {
  const node = CAUSAL_NODES.find((n) => n.id === nodeId);
  if (!node) return null;

  const inEdges = getIncomingEdges(nodeId);
  const outEdges = getOutgoingEdges(nodeId);

  const upstream = inEdges
    .map((e) => {
      const srcNode = CAUSAL_NODES.find((n) => n.id === e.source);
      return srcNode ? { node: srcNode, edge: e } : null;
    })
    .filter((item): item is { node: CausalNode; edge: CausalEdge } => item !== null);

  const downstream = outEdges
    .map((e) => {
      const tgtNode = CAUSAL_NODES.find((n) => n.id === e.target);
      return tgtNode ? { node: tgtNode, edge: e } : null;
    })
    .filter((item): item is { node: CausalNode; edge: CausalEdge } => item !== null);

  return { node, upstream, downstream };
}

// Backward compatible CAUSAL_RELATIONSHIPS export
export const CAUSAL_RELATIONSHIPS: CausalLink[] = CAUSAL_EDGES.map((e) => ({
  id: e.id,
  sourceVar: e.source,
  targetVar: e.target,
  effectDirection: e.sign === '+' ? 'positive' : e.sign === '-' ? 'negative' : 'non_linear',
  formulaArabic: e.formulaAr,
  formulaEnglish: e.formulaEn,
  coefficientNotes: e.parameters,
  timeLagYears: e.timeDelayYears,
  confidence: e.confidence,
  economicRationaleAr: e.mechanismAr,
  economicRationaleEn: e.mechanismEn,
  verifiedByTestId: e.testId,
}));
