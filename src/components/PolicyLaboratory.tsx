/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * User-Controlled National Policy Simulator Laboratory (Phases 1-6 Master)
 * مختبر السياسات الوطنية الشامل: تحكم كامل للمستخدم، معاينة تفاعلية، كشف التناقضات، وسجل التدقيق
 */

import React, { useState, useMemo } from 'react';
import {
  PolicySettings,
  PolicyAuditEntry,
  SimulationState,
  DeficitFinancingPreference,
  PolicyDraftItem,
  PolicyPackageConsequence,
  PolicyConflictItem,
} from '../types/simulation';
import { simulateNextYear } from '../simulation/engine';
import { defaultExternalShocks } from '../simulation/archetypes';
import { Language, TRANSLATIONS } from '../i18n/translations';
import {
  FlaskConical,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Play,
  Layers,
  ChevronDown,
  ChevronUp,
  History,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { ExplainerBubble } from './common/ExplainerBubble';

interface PolicyLaboratoryProps {
  policies: PolicySettings;
  baselinePolicies: PolicySettings;
  currentState: SimulationState;
  auditLog: PolicyAuditEntry[];
  onApplyPolicyChange: (
    key: keyof PolicySettings | 'policy_package',
    newValue: any,
    auditEntry: PolicyAuditEntry,
    packageUpdate?: Partial<PolicySettings>
  ) => void;
  onUndoLastChange: () => void;
  onResetAllPolicies: () => void;
  lang: Language;
}

interface PolicyDefinition {
  key: keyof PolicySettings;
  category: string;
  categoryAr: string;
  categoryEn: string;
  labelAr: string;
  labelEn: string;
  unit: string;
  type: 'slider' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: { value: DeficitFinancingPreference; labelAr: string; labelEn: string }[];
  descriptionAr: string;
  descriptionEn: string;
  timeLagYears: number;
  primarySectorsAr: string;
  primarySectorsEn: string;
}

export const PolicyLaboratory: React.FC<PolicyLaboratoryProps> = ({
  policies,
  baselinePolicies,
  currentState,
  auditLog,
  onApplyPolicyChange,
  onUndoLastChange,
  onResetAllPolicies,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // Active Draft Policies State (staged changes pending preview/acceptance)
  const [draftPolicies, setDraftPolicies] = useState<PolicySettings>({ ...policies });
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    taxes: true,
    spending: true,
    debt: false,
    monetary: false,
    subsidies: false,
    labor: false,
    energy: false,
    governance: false,
  });

  const [isPreviewActive, setIsPreviewActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'conflicts' | 'audit'>('editor');
  const [packageNameInput, setPackageNameInput] = useState<string>('');

  // 1. Comprehensive Documented Policy Catalog (All Connected to Simulation Engine)
  const policyCatalog: PolicyDefinition[] = useMemo(() => [
    // 1. Taxes, Tariffs & Exemptions
    {
      key: 'taxRateIncome',
      category: 'taxes',
      categoryAr: 'الضرائب والإيرادات والرسوم الجمركية',
      categoryEn: 'Taxes, Exemptions & Tariffs',
      labelAr: 'معدل ضريبة الدخل المتوسطة على الأفراد',
      labelEn: 'Personal Income Tax Rate',
      unit: '%',
      type: 'slider',
      min: 5,
      max: 55,
      step: 1,
      descriptionAr: 'اقتطاع مباشر يقلص الدخل المتاح للأسر، بميل حدي للاستهلاك 0.78.',
      descriptionEn: 'Direct subtraction from disposable income, with MPC = 0.78.',
      timeLagYears: 0,
      primarySectorsAr: 'المالية العامة، سوق العمل، الاستهلاك العائلي',
      primarySectorsEn: 'Fiscal, Labor Market, Household Consumption',
    },
    {
      key: 'taxRateCorporate',
      category: 'taxes',
      categoryAr: 'الضرائب والإيرادات والرسوم الجمركية',
      categoryEn: 'Taxes, Exemptions & Tariffs',
      labelAr: 'ضريبة أرباح الشركات والاستثمار',
      labelEn: 'Corporate Income Tax Rate',
      unit: '%',
      type: 'slider',
      min: 5,
      max: 45,
      step: 1,
      descriptionAr: 'تؤثر عكسياً على الاستثمار الخاص وجاذبية الاستثمار الأجنبي المباشر.',
      descriptionEn: 'Affects private capital formation and FDI inflows.',
      timeLagYears: 1,
      primarySectorsAr: 'الاستثمار الخاص، رأس المال الإنتاجي، التجارة',
      primarySectorsEn: 'Private Investment, Capital Stock, Trade',
    },
    {
      key: 'taxRateVat',
      category: 'taxes',
      categoryAr: 'الضرائب والإيرادات والرسوم الجمركية',
      categoryEn: 'Taxes, Exemptions & Tariffs',
      labelAr: 'ضريبة القيمة المضافة والمبيعات (VAT)',
      labelEn: 'Value Added Tax (VAT)',
      unit: '%',
      type: 'slider',
      min: 0,
      max: 28,
      step: 1,
      descriptionAr: 'ضريبة استهلاك غير مباشرة، ترفع مؤشر الأسعار وتزيد حصيلة الخزينة فوراً.',
      descriptionEn: 'Indirect consumption tax, shifts CPI upward and increases revenue.',
      timeLagYears: 0,
      primarySectorsAr: 'الأسعار، المالية العامة، العدالة التوزيعية',
      primarySectorsEn: 'Prices, Fiscal System, Distributional Equity',
    },
    {
      key: 'taxExemptionThreshold',
      category: 'taxes',
      categoryAr: 'الضرائب والإيرادات والرسوم الجمركية',
      categoryEn: 'Taxes, Exemptions & Tariffs',
      labelAr: 'حد الإعفاء الضريبي السنوي للدخل',
      labelEn: 'Annual Income Tax Exemption Threshold',
      unit: '$ ألف',
      type: 'slider',
      min: 0,
      max: 25,
      step: 0.5,
      descriptionAr: 'يعفي الشريحة الدنيا من الدخل؛ رفعه يترك سيولة أكبر للأسر ويقلص حصيلة الضريبة.',
      descriptionEn: 'Exempts low-income brackets; raising it protects purchasing power.',
      timeLagYears: 0,
      primarySectorsAr: 'دخل الأسر، الاستهلاك، العدالة الاجتماعية',
      primarySectorsEn: 'Household Disposable Income, Consumption, Social Justice',
    },
    {
      key: 'tariffRateAvg',
      category: 'taxes',
      categoryAr: 'الضرائب والإيرادات والرسوم الجمركية',
      categoryEn: 'Taxes, Exemptions & Tariffs',
      labelAr: 'متوسط الرسوم الجمركية على الواردات',
      labelEn: 'Average Import Tariff Rate',
      unit: '%',
      type: 'slider',
      min: 0,
      max: 35,
      step: 0.5,
      descriptionAr: 'حماية المنتجات المحلية لكنها ترفع التضخم المستورد وتقلص الواردات.',
      descriptionEn: 'Protects local substitutes but dampens import volumes and raises CPI.',
      timeLagYears: 0,
      primarySectorsAr: 'التجارة الخارجية، التضخم، ميزان المدفوعات',
      primarySectorsEn: 'Foreign Trade, Inflation, Current Account',
    },
    {
      key: 'exportIncentiveSubsidyPct',
      category: 'taxes',
      categoryAr: 'الضرائب والإيرادات والرسوم الجمركية',
      categoryEn: 'Taxes, Exemptions & Tariffs',
      labelAr: 'حوافز ودعم الصادرات غير النفطية',
      labelEn: 'Non-Resource Export Incentives & Rebates',
      unit: '%',
      type: 'slider',
      min: 0,
      max: 15,
      step: 0.5,
      descriptionAr: 'يعزز تنافسية الصادرات الصناعية والخدمية في الأسواق الخارجية.',
      descriptionEn: 'Stimulates export competitiveness and non-resource market share.',
      timeLagYears: 1,
      primarySectorsAr: 'الصناعة، التجارة الخارجية، احتياطيات العملة',
      primarySectorsEn: 'Manufacturing, External Trade, Reserves',
    },

    // 2. Spending Allocations
    {
      key: 'budgetPublicWagesPctGdp',
      category: 'spending',
      categoryAr: 'الإنفاق العام والمخصصات القطاعية',
      categoryEn: 'Public Spending & Sector Allocations',
      labelAr: 'كتلة الأجور والرواتب العامة',
      labelEn: 'Public Sector Wages & Payroll',
      unit: '% من الناتج',
      type: 'slider',
      min: 5,
      max: 22,
      step: 0.5,
      descriptionAr: 'الإنفاق على رواتب الموظفين الحكوميين؛ يرفع الدخل المتاح لكنه يثقل الميزانية.',
      descriptionEn: 'Public payroll share; stimulates consumer demand but limits fiscal space.',
      timeLagYears: 0,
      primarySectorsAr: 'المالية العامة، سوق العمل، الاستهلاك',
      primarySectorsEn: 'Fiscal, Labor Market, Household Consumption',
    },
    {
      key: 'budgetHealthcarePctGdp',
      category: 'spending',
      categoryAr: 'الإنفاق العام والمخصصات القطاعية',
      categoryEn: 'Public Spending & Sector Allocations',
      labelAr: 'مخصصات الرعاية الصحية والمستشفيات',
      labelEn: 'Healthcare & Hospital System Outlays',
      unit: '% من الناتج',
      type: 'slider',
      min: 2,
      max: 15,
      step: 0.5,
      descriptionAr: 'تحسين الطاقة الاستيعابية للمستشفيات ومتوسط العمر المتوقع والإنتاجية.',
      descriptionEn: 'Expands hospital capacity, life expectancy, and labor health resilience.',
      timeLagYears: 2,
      primarySectorsAr: 'الصحة، الديموغرافيا، رأس المال البشري',
      primarySectorsEn: 'Healthcare, Demographics, Human Capital',
    },
    {
      key: 'budgetEducationPctGdp',
      category: 'spending',
      categoryAr: 'الإنفاق العام والمخصصات القطاعية',
      categoryEn: 'Public Spending & Sector Allocations',
      labelAr: 'مخصصات التعليم والجامعات والمهارات',
      labelEn: 'Education & Human Capital Investment',
      unit: '% من الناتج',
      type: 'slider',
      min: 2,
      max: 15,
      step: 0.5,
      descriptionAr: 'يرفع جودة التعليم وإنتاجية العمل TFP على المدى المتوسط (3-7 سنوات).',
      descriptionEn: 'Raises schooling quality and TFP growth with multi-year structural lag.',
      timeLagYears: 3,
      primarySectorsAr: 'التعليم، الإنتاجية الكلية، سوق العمل',
      primarySectorsEn: 'Education, TFP, Labor Market',
    },
    {
      key: 'budgetInfrastructurePctGdp',
      category: 'spending',
      categoryAr: 'الإنفاق العام والمخصصات القطاعية',
      categoryEn: 'Public Spending & Sector Allocations',
      labelAr: 'الإنفاق الرأسمالي والبنية التحتية',
      labelEn: 'Public Infrastructure Capex',
      unit: '% من الناتج',
      type: 'slider',
      min: 1,
      max: 16,
      step: 0.5,
      descriptionAr: 'يوسع رصيد رأس المال العام ويحفز الاستثمار الخاص ويخفض تكاليف النقل.',
      descriptionEn: 'Expands public physical capital stock and crowds-in private business investment.',
      timeLagYears: 2,
      primarySectorsAr: 'البنية التحتية، الاستثمار الكلي، الإنتاج',
      primarySectorsEn: 'Infrastructure, Aggregate Investment, Production',
    },
    {
      key: 'budgetDefensePctGdp',
      category: 'spending',
      categoryAr: 'الإنفاق العام والمخصصات القطاعية',
      categoryEn: 'Public Spending & Sector Allocations',
      labelAr: 'مخصصات الدفاع والأمن السيادي',
      labelEn: 'Defense & National Resilience Budget',
      unit: '% من الناتج',
      type: 'slider',
      min: 1,
      max: 12,
      step: 0.2,
      descriptionAr: 'تعزيز الجاهزية الدفاعية وحماية المنشآت الحيوية واحتياطات الطوارئ.',
      descriptionEn: 'Strengthens strategic resilience, critical facility protection, and emergency stocks.',
      timeLagYears: 1,
      primarySectorsAr: 'الصمود الوطني والدفاع، المالية العامة',
      primarySectorsEn: 'Resilience & Defense, Public Finance',
    },
    {
      key: 'budgetAgricultureSupportPctGdp',
      category: 'spending',
      categoryAr: 'الإنفاق العام والمخصصات القطاعية',
      categoryEn: 'Public Spending & Sector Allocations',
      labelAr: 'دعم الزراعة والري والأمن الغذائي',
      labelEn: 'Agricultural Support & Food Security',
      unit: '% من الناتج',
      type: 'slider',
      min: 0.5,
      max: 8,
      step: 0.2,
      descriptionAr: 'يرفع الناتج الزراعي ويقلص الاعتماد على استيراد السلع الغذائية الاستراتيجية.',
      descriptionEn: 'Boosts agricultural output and shrinks food import vulnerability.',
      timeLagYears: 1,
      primarySectorsAr: 'الزراعة والأمن الغذائي، المياه، التجارة',
      primarySectorsEn: 'Agriculture, Water Security, Foreign Trade',
    },
    {
      key: 'budgetRnDPctGdp',
      category: 'spending',
      categoryAr: 'الإنفاق العام والمخصصات القطاعية',
      categoryEn: 'Public Spending & Sector Allocations',
      labelAr: 'مخصصات البحث والتطوير والابتكار الصناعي',
      labelEn: 'R&D & Industrial Innovation Subsidies',
      unit: '% من الناتج',
      type: 'slider',
      min: 0.2,
      max: 6,
      step: 0.1,
      descriptionAr: 'يعزز كثافة الابتكار وتسارع الإنتاجية الكلية TFP والتعقيد الصناعي.',
      descriptionEn: 'Expands R&D intensity and accelerates technological TFP advancement.',
      timeLagYears: 3,
      primarySectorsAr: 'الصناعة، الأنظمة الرقمية، الاقتصاد الكلي',
      primarySectorsEn: 'Industry, Digital Systems, Macroeconomy',
    },
    {
      key: 'budgetRegionalDevelopmentPctGdp',
      category: 'spending',
      categoryAr: 'الإنفاق العام والمخصصات القطاعية',
      categoryEn: 'Public Spending & Sector Allocations',
      labelAr: 'صندوق التوازن والتنمية الجهوية',
      labelEn: 'Regional Equalization & Peripheral Development Fund',
      unit: '% من الناتج',
      type: 'slider',
      min: 0.2,
      max: 6,
      step: 0.1,
      descriptionAr: 'يوجه الاستثمارات نحو الأقاليم الريفية والطرفية لتقليص فجوات التنمية والخدمات.',
      descriptionEn: 'Directs public capital to peripheral regions, narrowing geographic disparity.',
      timeLagYears: 1,
      primarySectorsAr: 'التنمية الجهوية، الخدمات العامة، التماسك الاجتماعي',
      primarySectorsEn: 'Regional Systems, Public Services, Social Cohesion',
    },

    // 3. Debt & Sovereign Financing
    {
      key: 'deficitFinancingPreference',
      category: 'debt',
      categoryAr: 'إدارة الدين العام وافتراضات التمويل',
      categoryEn: 'Public Debt & Sovereign Financing',
      labelAr: 'استراتيجية تمويل العجز المالي السنوي',
      labelEn: 'Deficit Financing Strategy',
      unit: 'خيار تمويلي',
      type: 'select',
      options: [
        { value: 'balanced_mix', labelAr: 'مزيج متوازن (سندات محلية + قروض خارجية)', labelEn: 'Balanced Mix (Domestic + External)' },
        { value: 'domestic_bonds', labelAr: 'سندات سيادية محلية بالكامل', labelEn: '100% Domestic Sovereign Bonds' },
        { value: 'external_debt', labelAr: 'اقتراض خارجي بالعملات الأجنبية', labelEn: 'External Foreign Currency Borrowing' },
        { value: 'reserve_drawdown', labelAr: 'سحب جزئي من احتياطيات النقد الأجنبي', labelEn: 'Drawdown on Sovereign Reserves' },
      ],
      descriptionAr: 'يحدد أداة تغطية فجوة الميزانية وتأثيرها على العوائد واحتياطيات النقد ومخاطر الصرف.',
      descriptionEn: 'Governs debt issuance composition, reserve depletion, and sovereign risk spread.',
      timeLagYears: 0,
      primarySectorsAr: 'المالية العامة، الدين السيادي، القطاع الخارجي',
      primarySectorsEn: 'Fiscal, Sovereign Debt, External Sector',
    },
    {
      key: 'debtCeilingTargetPctGdp',
      category: 'debt',
      categoryAr: 'إدارة الدين العام وافتراضات التمويل',
      categoryEn: 'Public Debt & Sovereign Financing',
      labelAr: 'سقف الدين العام المستهدف قانونياً',
      labelEn: 'Statutory Public Debt Ceiling Target',
      unit: '% من الناتج',
      type: 'slider',
      min: 40,
      max: 130,
      step: 5,
      descriptionAr: 'عتبة انضباط مالي؛ تجاوزها يفرض علاوة مخاطر إضافية على السندات السيادية.',
      descriptionEn: 'Fiscal discipline boundary; breaches add risk premium penalties to yields.',
      timeLagYears: 0,
      primarySectorsAr: 'الاستدامة المالية، أسعار الفائدة السيادية',
      primarySectorsEn: 'Fiscal Sustainability, Bond Yields',
    },

    // 4. Monetary Policy
    {
      key: 'monetaryTargetInflation',
      category: 'monetary',
      categoryAr: 'السياسة النقدية وأسعار الفائدة',
      categoryEn: 'Monetary Policy & Interest Rates',
      labelAr: 'مستهدف التضخم السنوي للبنك المركزي',
      labelEn: 'Central Bank Inflation Target',
      unit: '%',
      type: 'slider',
      min: 1.0,
      max: 8.0,
      step: 0.5,
      descriptionAr: 'يثبت توقعات التضخم في الأسواق ويوجه استجابة قاعدة تايلور لأسعار الفائدة.',
      descriptionEn: 'Anchors public inflation expectations and calibrates the Taylor rule target.',
      timeLagYears: 1,
      primarySectorsAr: 'السياسة النقدية، الأسعار، توقعات الأسواق',
      primarySectorsEn: 'Monetary Policy, Prices, Market Expectations',
    },
    {
      key: 'policyRateSpreadTarget',
      category: 'monetary',
      categoryAr: 'السياسة النقدية وأسعار الفائدة',
      categoryEn: 'Monetary Policy & Interest Rates',
      labelAr: 'هامش الموقف النقدي التقديري للبنك المركزي',
      labelEn: 'Discretionary Monetary Policy Spread',
      unit: '+/- %',
      type: 'slider',
      min: -3.0,
      max: 4.0,
      step: 0.25,
      descriptionAr: 'هامش إضافي فوق قاعدة تايلور: قيمة موجبة تعني تشديداً نقدياً وسالبة تعني تيسيراً.',
      descriptionEn: 'Discretionary shift above Taylor rule rate (+ tight stance, - accommodative).',
      timeLagYears: 0,
      primarySectorsAr: 'القطاع المصرفي، الائتمان، الاستثمار، التضخم',
      primarySectorsEn: 'Banking, Credit, Investment, Inflation',
    },

    // 5. Subsidies & Transfers
    {
      key: 'budgetSocialSafetyPctGdp',
      category: 'subsidies',
      categoryAr: 'الدعم والتحويلات والحماية الاجتماعية',
      categoryEn: 'Subsidies & Social Transfers',
      labelAr: 'مخصصات شبكات الأمان الاجتماعي والتحويلات',
      labelEn: 'Social Protection Outlays',
      unit: '% من الناتج',
      type: 'slider',
      min: 1.0,
      max: 18.0,
      step: 0.5,
      descriptionAr: 'تحويلات مباشرة للأسر الهشة؛ تخفف الفقر وتحسن معامل جيني للعدالة.',
      descriptionEn: 'Direct social transfers to vulnerable households, reducing poverty.',
      timeLagYears: 0,
      primarySectorsAr: 'العدالة الاجتماعية، دخل الأسر، المالية العامة',
      primarySectorsEn: 'Social Justice, Disposable Income, Fiscal System',
    },
    {
      key: 'fuelSubsidyTargetingPct',
      category: 'subsidies',
      categoryAr: 'الدعم والتحويلات والحماية الاجتماعية',
      categoryEn: 'Subsidies & Social Transfers',
      labelAr: 'نسبة ترشيد وتوجيه دعم المحروقات والطاقة',
      labelEn: 'Fuel Subsidy Targeting & Rationalization',
      unit: '%',
      type: 'slider',
      min: 0,
      max: 100,
      step: 5,
      descriptionAr: 'التحول من الدعم العيني الشامل (0%) إلى التحويل النقدي الموجه لمستحقيه (100%).',
      descriptionEn: 'Shifts from wasteful universal energy price subsidies to targeted cash support.',
      timeLagYears: 0,
      primarySectorsAr: 'الطاقة، المالية العامة، كفاءة الاستهلاك',
      primarySectorsEn: 'Energy, Public Finance, Energy Efficiency',
    },
    {
      key: 'cashTransferCoveragePct',
      category: 'subsidies',
      categoryAr: 'الدعم والتحويلات والحماية الاجتماعية',
      categoryEn: 'Subsidies & Social Transfers',
      labelAr: 'نسبة تغطية الأسر الهشة بالتحويلات المباشرة',
      labelEn: 'Vulnerable Household Cash Transfer Coverage',
      unit: '%',
      type: 'slider',
      min: 10,
      max: 95,
      step: 5,
      descriptionAr: 'توسيع السجل الاجتماعي الموحد لضمان وصول الدعم لجميع المستحقين.',
      descriptionEn: 'Expands unified social registry coverage across vulnerable demographics.',
      timeLagYears: 0,
      primarySectorsAr: 'الفقر، التماسك الاجتماعي، الاستهلاك الأساسي',
      primarySectorsEn: 'Poverty, Social Cohesion, Basic Consumption',
    },

    // 6. Labor & Employment
    {
      key: 'statutoryRetirementAge',
      category: 'labor',
      categoryAr: 'سوق العمل والأجور وتنمية المهارات',
      categoryEn: 'Labor, Wages & Workforce Skills',
      labelAr: 'سن التقاعد القانوني الإلزامي',
      labelEn: 'Statutory Retirement Age',
      unit: 'سنة',
      type: 'slider',
      min: 55,
      max: 72,
      step: 1,
      descriptionAr: 'رفع سن التقاعد يوسع القوى العاملة المتاحة ويحسن الملاءة المالية لصناديق المعاشات.',
      descriptionEn: 'Lengthens productive career, raises participation, and repairs pension solvency.',
      timeLagYears: 1,
      primarySectorsAr: 'الديموغرافيا، صناديق التقاعد، القوى العاملة',
      primarySectorsEn: 'Demographics, Pension Solvency, Labor Supply',
    },
    {
      key: 'minimumWageIndex',
      category: 'labor',
      categoryAr: 'سوق العمل والأجور وتنمية المهارات',
      categoryEn: 'Labor, Wages & Workforce Skills',
      labelAr: 'مؤشر الحد الأدنى للأجور',
      labelEn: 'Minimum Wage Policy Index',
      unit: 'مؤشر',
      type: 'slider',
      min: 60,
      max: 160,
      step: 5,
      descriptionAr: 'يرفع أجور الفئات الدنيا؛ الزيادات المفرطة قد ترفع البطالة بين صغار العمال.',
      descriptionEn: 'Raises bottom wage floors; steep increases can create youth employment friction.',
      timeLagYears: 0,
      primarySectorsAr: 'الأجور، التضخم، البطالة، حصة العمل من الناتج',
      primarySectorsEn: 'Wages, Inflation, Unemployment, Labor Share',
    },
    {
      key: 'laborMarketFlexibility',
      category: 'labor',
      categoryAr: 'سوق العمل والأجور وتنمية المهارات',
      categoryEn: 'Labor, Wages & Workforce Skills',
      labelAr: 'مرونة عقود وتشريعات سوق العمل',
      labelEn: 'Labor Market Flexibility Index',
      unit: '0-100',
      type: 'slider',
      min: 20,
      max: 90,
      step: 5,
      descriptionAr: 'تسهيل التوظيف وتأسيس الأعمال؛ المرونة العالية تقلص البطالة الهيكلية.',
      descriptionEn: 'Reduces hiring frictions and structural unemployment; encourages firm formation.',
      timeLagYears: 1,
      primarySectorsAr: 'البطالة الهيكلية، تأسيس الشركات، سوق العمل',
      primarySectorsEn: 'Structural Unemployment, Firm Formation, Labor',
    },
    {
      key: 'vocationalTrainingInvestmentPct',
      category: 'labor',
      categoryAr: 'سوق العمل والأجور وتنمية المهارات',
      categoryEn: 'Labor, Wages & Workforce Skills',
      labelAr: 'مخصصات التدريب والتأهيل المهني',
      labelEn: 'Vocational Training & Reskilling Outlays',
      unit: '% من الناتج',
      type: 'slider',
      min: 0.2,
      max: 5.0,
      step: 0.2,
      descriptionAr: 'تأهيل الخريجين والباحثين عن عمل؛ يخفض بطالة الشباب ويرفع ملاءمة المهارات.',
      descriptionEn: 'Funds vocational apprenticeships, reducing youth unemployment and skill gaps.',
      timeLagYears: 1,
      primarySectorsAr: 'بطالة الشباب، التعليم والمهارات، التوظيف',
      primarySectorsEn: 'Youth Unemployment, Education Skills, Employment',
    },

    // 7. Energy, Water & Housing
    {
      key: 'carbonTaxPerTon',
      category: 'energy',
      categoryAr: 'الطاقة والمياه والإسكان والبيئة',
      categoryEn: 'Energy, Water, Housing & Environment',
      labelAr: 'ضريبة الكربون البيئية',
      labelEn: 'Carbon Tax Per Ton CO2',
      unit: '$/طن',
      type: 'slider',
      min: 0,
      max: 150,
      step: 5,
      descriptionAr: 'تسعير الانبعاثات لتحفيز التحول للطاقة النظيفة، مع توليد إيرادات ضريبية للخزينة.',
      descriptionEn: 'Prices carbon emissions, accelerates clean transition, and generates green revenue.',
      timeLagYears: 1,
      primarySectorsAr: 'البيئة، الطاقة، الإيرادات الضريبية، التضخم',
      primarySectorsEn: 'Environment, Energy, Tax Revenues, Inflation',
    },
    {
      key: 'cleanEnergySubsidyPct',
      category: 'energy',
      categoryAr: 'الطاقة والمياه والإسكان والبيئة',
      categoryEn: 'Energy, Water, Housing & Environment',
      labelAr: 'دعم وحوافز الطاقة المتجددة',
      labelEn: 'Renewable Energy Capital Subsidies',
      unit: '%',
      type: 'slider',
      min: 0,
      max: 45,
      step: 2.5,
      descriptionAr: 'تخفيض تكلفة محطات الطاقة الشمسية والرياح ورفع حصة الطاقة النظيفة في الشبكة.',
      descriptionEn: 'Incentivizes clean power generation, shrinking fossil fuel reliance.',
      timeLagYears: 2,
      primarySectorsAr: 'الطاقة المتجددة، الانبعاثات، الاستثمار',
      primarySectorsEn: 'Renewable Energy, Emissions, Investment',
    },
    {
      key: 'waterDesalinationInvestmentPct',
      category: 'energy',
      categoryAr: 'الطاقة والمياه والإسكان والبيئة',
      categoryEn: 'Energy, Water, Housing & Environment',
      labelAr: 'استثمارات تحلية المياه والأمن المائي',
      labelEn: 'Water Desalination & Irrigation Capex',
      unit: '% من الناتج',
      type: 'slider',
      min: 0.2,
      max: 5.0,
      step: 0.2,
      descriptionAr: 'تمويل مشاريع تحلية مياه البحر وشبكات الري؛ يقلص الإجهاد المائي للزراعة والمدن.',
      descriptionEn: 'Funds desalination plants and irrigation networks, curbing water stress.',
      timeLagYears: 2,
      primarySectorsAr: 'الأمن المائي، الزراعة، البنية التحتية',
      primarySectorsEn: 'Water Security, Agriculture, Infrastructure',
    },
    {
      key: 'socialHousingAllocationPct',
      category: 'energy',
      categoryAr: 'الطاقة والمياه والإسكان والبيئة',
      categoryEn: 'Energy, Water, Housing & Environment',
      labelAr: 'مخصصات برامج الإسكان الحضري الاجتماعي',
      labelEn: 'Social Housing Development Allocation',
      unit: '% من الناتج',
      type: 'slider',
      min: 0.2,
      max: 6.0,
      step: 0.2,
      descriptionAr: 'بناء الوحدات السكنية المدعومة؛ يحد من التضخم العقاري ويزيد تملك المساكن.',
      descriptionEn: 'Finances affordable housing construction, improving price-to-income affordability.',
      timeLagYears: 2,
      primarySectorsAr: 'الإسكان، التضخم العقاري، الاستقرار الأسري',
      primarySectorsEn: 'Housing, Real Estate Affordability, Family Welfare',
    },

    // 8. Governance & Public Admin
    {
      key: 'governanceReformEffort',
      category: 'governance',
      categoryAr: 'الحوكمة وإصلاح الإدارة العامة',
      categoryEn: 'Governance & Institutional Reform',
      labelAr: 'جهد مكافحة الفساد والرقمنة المؤسسية',
      labelEn: 'Anti-Corruption & Digital Governance Effort',
      unit: '0-100',
      type: 'slider',
      min: 10,
      max: 95,
      step: 5,
      descriptionAr: 'يعزز سيادة القانون وثقة المستثمرين ويرفع كفاءة تنفيذ المشاريع الحكومية.',
      descriptionEn: 'Strengthens rule of law, institutional trust, and public capex execution efficiency.',
      timeLagYears: 2,
      primarySectorsAr: 'الحوكمة، الاستثمار الخاص، كفاءة الإنفاق',
      primarySectorsEn: 'Governance, Private Investment, Spending Efficiency',
    },
    {
      key: 'civilServiceEfficiencyProgram',
      category: 'governance',
      categoryAr: 'الحوكمة وإصلاح الإدارة العامة',
      categoryEn: 'Governance & Institutional Reform',
      labelAr: 'برنامج ترشيد وكفاءة الجهاز الإداري',
      labelEn: 'Civil Service Rationalization & Delivery',
      unit: '0-100',
      type: 'slider',
      min: 10,
      max: 95,
      step: 5,
      descriptionAr: 'تقليص البيروقراطية وتسريع المعاملات ورفع جودة تقديم الخدمات للمواطنين.',
      descriptionEn: 'Curbs bureaucratic friction and accelerates public service delivery.',
      timeLagYears: 1,
      primarySectorsAr: 'الإدارة العامة، الخدمات الحكومية، بيئة الأعمال',
      primarySectorsEn: 'Public Admin, Public Services, Business Environment',
    },
  ], []);

  // Filter modified items (Draft Package vs Active Saved Policies)
  const stagedChanges: PolicyDraftItem[] = useMemo(() => {
    const list: PolicyDraftItem[] = [];
    for (const def of policyCatalog) {
      const activeVal = policies[def.key];
      const draftVal = draftPolicies[def.key];
      if (activeVal !== draftVal) {
        list.push({
          policyKey: def.key,
          baselineValue: activeVal,
          draftValue: draftVal,
          unit: def.unit,
          category: def.category,
          labelAr: def.labelAr,
          labelEn: def.labelEn,
        });
      }
    }
    return list;
  }, [policies, draftPolicies, policyCatalog]);

  // Handle draft parameter changes
  const handleDraftChange = (key: keyof PolicySettings, val: any) => {
    setDraftPolicies((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Toggle category expansion
  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  // Reset current draft to saved baseline
  const handleResetDraftToSaved = () => {
    setDraftPolicies({ ...policies });
    setIsPreviewActive(false);
    setActiveTab('editor');
  };

  // 2. Dynamic Simulation of Draft Package in Sandbox (Without modifying baseline)
  const previewSimulation = useMemo(() => {
    if (stagedChanges.length === 0) return null;

    // Run dynamic single-year simulation in memory
    const nextState = simulateNextYear(currentState, draftPolicies, defaultExternalShocks);

    // Run trajectory multi-year simulation (3-year and 5-year projections)
    let trajState = currentState;
    const trajectoryStates: SimulationState[] = [trajState];
    for (let i = 0; i < 5; i++) {
      trajState = simulateNextYear(trajState, draftPolicies, defaultExternalShocks, { history: trajectoryStates });
      trajectoryStates.push(trajState);
    }
    const state3Years = trajectoryStates[3] || nextState;
    const state5Years = trajectoryStates[5] || nextState;

    // Detailed Indicator Consequences
    const consequences: PolicyPackageConsequence[] = [
      {
        indicatorKey: 'realGdp',
        labelAr: 'الناتج المحلي الإجمالي الحقيقي',
        labelEn: 'Real GDP',
        sector: 'الاقتصاد الكلي',
        unit: '$B',
        baselineValue: currentState.macro.realGdp,
        simulatedValue: nextState.macro.realGdp,
        absoluteDelta: Math.round((nextState.macro.realGdp - currentState.macro.realGdp) * 10) / 10,
        percentDelta: Math.round((((nextState.macro.realGdp - currentState.macro.realGdp) / currentState.macro.realGdp) * 100) * 10) / 10,
        timeLagYears: 1,
        trajectory: {
          shortTerm: nextState.macro.realGdp,
          mediumTerm: state3Years.macro.realGdp,
          longTerm: state5Years.macro.realGdp,
        },
        impactType: nextState.macro.realGdp >= currentState.macro.realGdp ? 'positive' : 'negative',
        causalMechanismAr: 'محصلة تفاعل الإنفاق الحكومي الكلي، والاستثمار الخاص المتأثر بالضرائب والفائدة، وصافي الصادرات.',
        causalMechanismEn: 'Aggregate outcome of public capex, private investment response, and net exports.',
        affectedGroups: ['المؤسسات الإنتاجية', 'القوى العاملة', 'المستهلكون'],
        budgetImplicationAr: 'زيادة الناتج توسع الوعاء الضريبي مستقبلاً.',
        budgetImplicationEn: 'GDP expansion widens future fiscal tax base.',
        uncertaintyRange: '± 1.2% هامش ثقة',
      },
      {
        indicatorKey: 'overallDeficit',
        labelAr: 'عجز الميزانية العامة السنوي',
        labelEn: 'Overall Fiscal Deficit',
        sector: 'المالية العامة',
        unit: '$B',
        baselineValue: currentState.macro.overallDeficit,
        simulatedValue: nextState.macro.overallDeficit,
        absoluteDelta: Math.round((nextState.macro.overallDeficit - currentState.macro.overallDeficit) * 10) / 10,
        percentDelta: Math.round((((nextState.macro.overallDeficit - currentState.macro.overallDeficit) / Math.max(0.1, currentState.macro.overallDeficit)) * 100) * 10) / 10,
        timeLagYears: 0,
        trajectory: {
          shortTerm: nextState.macro.overallDeficit,
          mediumTerm: state3Years.macro.overallDeficit,
          longTerm: state5Years.macro.overallDeficit,
        },
        impactType: nextState.macro.overallDeficit <= currentState.macro.overallDeficit ? 'positive' : 'negative',
        causalMechanismAr: 'متطابقة محاسبية ملزمة: النفقات الكلية مطروحاً منها الإيرادات الضريبية والنفطية.',
        causalMechanismEn: 'Binding accounting identity: Total outlays minus total tax and resource revenues.',
        affectedGroups: ['الخزينة العامة', 'أسواق السندات السيادية'],
        budgetImplicationAr: 'العجز يضاف حتمياً إلى رصيد الدين العام التراكمي.',
        budgetImplicationEn: 'Deficit strictly accumulates into sovereign debt stock.',
        uncertaintyRange: 'تطابق حسابي محكم (0% خطأ)',
      },
      {
        indicatorKey: 'publicDebtStock',
        labelAr: 'رصيد الدين العام التراكمي',
        labelEn: 'Public Debt Stock',
        sector: 'الدين السيادي',
        unit: '$B',
        baselineValue: currentState.macro.publicDebtStock,
        simulatedValue: nextState.macro.publicDebtStock,
        absoluteDelta: Math.round((nextState.macro.publicDebtStock - currentState.macro.publicDebtStock) * 10) / 10,
        percentDelta: Math.round((((nextState.macro.publicDebtStock - currentState.macro.publicDebtStock) / currentState.macro.publicDebtStock) * 100) * 10) / 10,
        timeLagYears: 1,
        trajectory: {
          shortTerm: nextState.macro.publicDebtStock,
          mediumTerm: state3Years.macro.publicDebtStock,
          longTerm: state5Years.macro.publicDebtStock,
        },
        impactType: nextState.macro.publicDebtStock <= currentState.macro.publicDebtStock ? 'positive' : 'negative',
        causalMechanismAr: 'تراكم المخزون والتدفق: دين السنة الحالية = دين العام السابق + عجز الميزانية السنوي.',
        causalMechanismEn: 'Stock-flow identity: Current debt = Prior debt + Annual deficit borrowing.',
        affectedGroups: ['الأجيال القادمة', 'دافعو الضرائب', 'التصنيف الائتماني'],
        budgetImplicationAr: 'ارتفاع الدين يرفع تلقائياً أعباء خدمة الفوائد السنوية.',
        budgetImplicationEn: 'Higher debt mechanically expands debt service interest outlays.',
        uncertaintyRange: 'متطابقة مخزون وتدفق قطعية',
      },
      {
        indicatorKey: 'inflationRate',
        labelAr: 'معدل التضخم السنوي (CPI)',
        labelEn: 'Annual CPI Inflation',
        sector: 'الأسعار والنقد',
        unit: '%',
        baselineValue: currentState.macro.inflationRate,
        simulatedValue: nextState.macro.inflationRate,
        absoluteDelta: Math.round((nextState.macro.inflationRate - currentState.macro.inflationRate) * 10) / 10,
        percentDelta: null,
        timeLagYears: 0,
        trajectory: {
          shortTerm: nextState.macro.inflationRate,
          mediumTerm: state3Years.macro.inflationRate,
          longTerm: state5Years.macro.inflationRate,
        },
        impactType: nextState.macro.inflationRate <= 3.0 ? 'positive' : 'negative',
        causalMechanismAr: 'منحنى فيليبس: فجوة الناتج + تمرير القيمة المضافة والرسوم الجمركية وضريبة الكربون.',
        causalMechanismEn: 'Phillips curve: Output gap pressure plus VAT, tariff, and carbon tax pass-through.',
        affectedGroups: ['المستهلكون', 'أصحاب الدخول الثابتة', 'المدخرون'],
        budgetImplicationAr: 'التضخم يرفع الناتج الاسمي لكنه يزيد تكاليف المشتريات العامة.',
        budgetImplicationEn: 'Inflation inflates nominal GDP but drives up public procurement costs.',
        uncertaintyRange: '± 0.8% نطاق تجريبي',
      },
      {
        indicatorKey: 'unemploymentRate',
        labelAr: 'معدل البطالة الكلي',
        labelEn: 'Unemployment Rate',
        sector: 'سوق العمل',
        unit: '%',
        baselineValue: currentState.demographics.unemploymentRate,
        simulatedValue: nextState.demographics.unemploymentRate,
        absoluteDelta: Math.round((nextState.demographics.unemploymentRate - currentState.demographics.unemploymentRate) * 10) / 10,
        percentDelta: null,
        timeLagYears: 1,
        trajectory: {
          shortTerm: nextState.demographics.unemploymentRate,
          mediumTerm: state3Years.demographics.unemploymentRate,
          longTerm: state5Years.demographics.unemploymentRate,
        },
        impactType: nextState.demographics.unemploymentRate <= currentState.demographics.unemploymentRate ? 'positive' : 'negative',
        causalMechanismAr: 'قانون أوكون: استجابة التوظيف لفجوة الناتج ونمو الاستثمار الرأسمالي ومرونة العمل.',
        causalMechanismEn: "Okun's law: Labor demand sensitivity to output gap and capital accumulation.",
        affectedGroups: ['الباحثون عن عمل', 'الشباب خريجو الجامعات'],
        budgetImplicationAr: 'تراجع البطالة يخفف تكاليف إعانات الدعم ويرفع حصيلة ضريبة الدخل.',
        budgetImplicationEn: 'Lower joblessness trims social transfers and expands payroll income tax.',
        uncertaintyRange: '± 0.5% تقدير أوكون',
      },
      {
        indicatorKey: 'purchasingPowerIndex',
        labelAr: 'مؤشر القوة الشرائية للأسر',
        labelEn: 'Household Purchasing Power Index',
        sector: 'الدخل والعدالة',
        unit: 'مؤشر',
        baselineValue: currentState.economic.households.purchasingPowerIndex,
        simulatedValue: nextState.economic.households.purchasingPowerIndex,
        absoluteDelta: Math.round((nextState.economic.households.purchasingPowerIndex - currentState.economic.households.purchasingPowerIndex) * 10) / 10,
        percentDelta: Math.round((((nextState.economic.households.purchasingPowerIndex - currentState.economic.households.purchasingPowerIndex) / currentState.economic.households.purchasingPowerIndex) * 100) * 10) / 10,
        timeLagYears: 0,
        trajectory: {
          shortTerm: nextState.economic.households.purchasingPowerIndex,
          mediumTerm: state3Years.economic.households.purchasingPowerIndex,
          longTerm: state5Years.economic.households.purchasingPowerIndex,
        },
        impactType: nextState.economic.households.purchasingPowerIndex >= currentState.economic.households.purchasingPowerIndex ? 'positive' : 'negative',
        causalMechanismAr: 'صافي الدخل المتاح الحقيقي بعد استقطاع الضرائب ومعدل التضخم وإضافة التحويلات.',
        causalMechanismEn: 'Real disposable income after taxes, transfers, and price deflator adjustments.',
        affectedGroups: ['الأسر محدودة الدخل', 'الطبقة المتوسطة'],
        budgetImplicationAr: 'استقرار القوة الشرائية يدعم الاستهلاك المحلي والنمو.',
        budgetImplicationEn: 'Stable consumer purchasing power sustains domestic absorption.',
        uncertaintyRange: '± 1.0 نقطة مؤشر',
      },
    ];

    // 3. Policy Conflicts & Contradiction Detection
    const conflicts: PolicyConflictItem[] = [];

    // Conflict 1: Unfunded Expenditure Expansion
    const totalOutlaysDiff = nextState.macro.totalExpenditure - currentState.macro.totalExpenditure;
    const totalRevDiff = nextState.macro.totalRevenue - currentState.macro.totalRevenue;
    if (totalOutlaysDiff > 10 && totalRevDiff < totalOutlaysDiff * 0.4) {
      conflicts.push({
        id: 'UNFUNDED_DEFICIT',
        titleAr: 'تناقض مالي: التزامات إنفاقية تفوق التمويل المتاح',
        titleEn: 'Fiscal Contradiction: Unfunded Expenditure Expansion',
        severity: 'critical',
        descriptionAr: `تتضمن الحزمة المقترحة زيادة في المصروفات العامة بمقدار +${totalOutlaysDiff.toFixed(1)} $B بينما لا ترتفع الإيرادات سوى بـ +${totalRevDiff.toFixed(1)} $B، مما يرفع العجز إلى ${nextState.macro.overallDeficit.toFixed(1)} $B.`,
        descriptionEn: `Proposed package expands outlays by +$${totalOutlaysDiff.toFixed(1)}B with only +$${totalRevDiff.toFixed(1)}B in new revenue, widening deficit to $${nextState.macro.overallDeficit.toFixed(1)}B.`,
        calculationProofAr: `العجز الجديد (${nextState.macro.overallDeficit.toFixed(1)} $B) = نفقات (${nextState.macro.totalExpenditure.toFixed(1)} $B) - إيرادات (${nextState.macro.totalRevenue.toFixed(1)} $B). الزيادة في الاقتراض: +${(nextState.macro.overallDeficit - currentState.macro.overallDeficit).toFixed(1)} $B.`,
        calculationProofEn: `New Deficit ($${nextState.macro.overallDeficit.toFixed(1)}B) = Outlays ($${nextState.macro.totalExpenditure.toFixed(1)}B) - Revenue ($${nextState.macro.totalRevenue.toFixed(1)}B). Net debt expansion: +$${(nextState.macro.overallDeficit - currentState.macro.overallDeficit).toFixed(1)}B.`,
        conflictingPolicies: ['budgetPublicWagesPctGdp', 'budgetInfrastructurePctGdp', 'taxRateIncome', 'taxRateVat'],
        userChoiceOptions: [
          {
            id: 'raise_revenue',
            labelAr: 'رفع ضريبة القيمة المضافة أو الشركات',
            labelEn: 'Raise Corporate or VAT Rates',
            suggestionAr: 'تغطية النفقات بإيرادات ضريبية إضافية لمنع انفجار الدين.',
            suggestionEn: 'Fund new spending via tax revenue to keep debt accumulation bounded.',
          },
          {
            id: 'phase_spending',
            labelAr: 'تقليص أو تدريج الإنفاق الرأسمالي',
            labelEn: 'Phase or Trim Capital Capex',
            suggestionAr: 'إرجاء جزء من مشاريع البنية التحتية لتفادي تفاقم عجز الميزانية.',
            suggestionEn: 'Reschedule large-scale capex to preserve fiscal sustainability margins.',
          },
          {
            id: 'accept_debt',
            labelAr: 'قبول زيادة الدين العام مؤقتاً',
            labelEn: 'Accept Debt Expansion Temporarily',
            suggestionAr: 'الاعتماد على الاقتراض السيادي إذا كانت المشاريع ذات مردود إنتاجي طويل الأجل.',
            suggestionEn: 'Finance via debt issuance relying on long-term growth yields.',
          },
        ],
      });
    }

    // Conflict 2: Rapid Investment Bottleneck (Absorption Capacity)
    const infraDiff = draftPolicies.budgetInfrastructurePctGdp - policies.budgetInfrastructurePctGdp;
    if (infraDiff > 3.0) {
      conflicts.push({
        id: 'CAPEX_ABSORPTION_BOTTLENECK',
        titleAr: 'اختناق استيعابي: وتيرة الاستثمار تتجاوز قدرة قطاع البناء',
        titleEn: 'Capacity Bottleneck: Investment Pace Exceeds Construction Capacity',
        severity: 'medium',
        descriptionAr: `رفع مخصصات البنية التحتية دفعة واحدة بمقدار +${infraDiff.toFixed(1)}% من الناتج قد يصطدم بمحدودية شركات المقاولات والكوادر الفنية، مما يقلص كفاءة التنفيذ بنسبة 20%.`,
        descriptionEn: `Steep capex jump of +${infraDiff.toFixed(1)}% of GDP risks overwhelming domestic contractor capacity, inducing project delivery frictions.`,
        calculationProofAr: `نسبة التوسع الرأسمالي الفوري (${infraDiff.toFixed(1)}%) تتجاوز الحد الاستيعابي السنوي المقدر بـ 2.5% من الناتج.`,
        calculationProofEn: `Immediate capital expansion (${infraDiff.toFixed(1)}%) exceeds domestic annual absorption threshold of ~2.5% of GDP.`,
        conflictingPolicies: ['budgetInfrastructurePctGdp'],
        userChoiceOptions: [
          {
            id: 'stagger_capex',
            labelAr: 'جدولة الإنفاق على 3 إلى 5 سنوات',
            labelEn: 'Stagger Outlays Across 3-5 Years',
            suggestionAr: 'تطبيق الزيادة تدريجياً لتمكين القطاع الخاص من رفع جاهزيته ومعداته.',
            suggestionEn: 'Phase investment smoothly to allow industry capacity to scale up.',
          },
          {
            id: 'keep_fast_push',
            labelAr: 'الإبقاء على الدفعة القوية السريعة',
            labelEn: 'Maintain Aggressive Big-Push',
            suggestionAr: 'تحمل تكاليف الاستيراد الإضافية مقابل إنجاز مشاريع البنية التحتية الكبرى بسرعة.',
            suggestionEn: 'Absorb higher initial friction costs to fast-track strategic assets.',
          },
        ],
      });
    }

    // Conflict 3: Tax Drag on Household Purchasing Power
    const incomeTaxDiff = draftPolicies.taxRateIncome - policies.taxRateIncome;
    const vatDiff = draftPolicies.taxRateVat - policies.taxRateVat;
    if (incomeTaxDiff + vatDiff >= 5) {
      conflicts.push({
        id: 'TAX_DRAG_HOUSEHOLDS',
        titleAr: 'انكماش استهلاكي: التشديد الضريبي يضغط القوة الشرائية للأسر',
        titleEn: 'Consumption Drag: Tax Hikes Compress Household Purchasing Power',
        severity: 'medium',
        descriptionAr: `تزامن رفع ضريبة الدخل (+${incomeTaxDiff}%) وضريبة القيمة المضافة (+${vatDiff}%) يقلص الدخل المتاح ويخفض الاستهلاك العائلي بمقدار ${(incomeTaxDiff * 0.7 + vatDiff * 0.5).toFixed(1)} $B.`,
        descriptionEn: `Simultaneous tax increases reduce household disposable income and shrink domestic consumption.`,
        calculationProofAr: `انخفاض الدخل المتاح للأسر بمقدار ${(incomeTaxDiff * 0.7 + vatDiff * 0.5).toFixed(1)} $B وتراجع القوة الشرائية بمقدار 2.8 نقطة.`,
        calculationProofEn: `Disposable income drops by $${(incomeTaxDiff * 0.7 + vatDiff * 0.5).toFixed(1)}B, lowering purchasing power by 2.8 points.`,
        conflictingPolicies: ['taxRateIncome', 'taxRateVat', 'budgetSocialSafetyPctGdp'],
        userChoiceOptions: [
          {
            id: 'raise_exemption',
            labelAr: 'رفع حد الإعفاء الضريبي للأسر محدودة الدخل',
            labelEn: 'Raise Income Tax Exemption Threshold',
            suggestionAr: 'حماية الفئات الفقيرة والمتوسطة عبر إعفاء الشرائح الأساسية من الضريبة.',
            suggestionEn: 'Protect vulnerable deciles by lifting basic income tax deductions.',
          },
          {
            id: 'compensate_transfers',
            labelAr: 'زيادة التحويلات النقدية الموجهة',
            labelEn: 'Expand Targeted Cash Transfers',
            suggestionAr: 'تعويض الأسر الهشة بزيادة مخصصات شبكات الأمان الاجتماعي.',
            suggestionEn: 'Offset consumption drag through targeted direct safety net transfers.',
          },
        ],
      });
    }

    return {
      nextState,
      consequences,
      conflicts,
      trajectoryStates,
    };
  }, [stagedChanges, currentState, draftPolicies, policies]);

  // Apply Staged Package as Atomic Policy Version
  const handleApplyPackage = () => {
    if (stagedChanges.length === 0) return;

    const versionId = `v${auditLog.length + 1}.0`;
    const defaultLabel = lang === 'ar'
      ? `حزمة سياسات (${versionId}): ${stagedChanges.map((s) => s.labelAr).slice(0, 2).join('، ')}${stagedChanges.length > 2 ? ' ...' : ''}`
      : `Policy Package (${versionId}): ${stagedChanges.map((s) => s.labelEn).slice(0, 2).join(', ')}`;

    const packageLabel = packageNameInput.trim() || defaultLabel;

    const auditEntry: PolicyAuditEntry = {
      id: `audit_pkg_${Date.now()}`,
      timestamp: new Date().toISOString(),
      simulatedYear: currentState.year,
      policyKey: 'policy_package',
      labelAr: packageLabel,
      labelEn: packageLabel,
      previousValue: 'حزمة سابقة',
      newValue: `${stagedChanges.length} سياسات معدلة`,
      delta: stagedChanges.length,
      status: 'accepted',
      rationaleAr: `تطبيق حزمة سياسات منسقة تشمل ${stagedChanges.length} تعديلاً مع مراجعة النتائج والتناقضات.`,
      packageDetails: stagedChanges.map((s) => ({
        key: s.policyKey,
        from: s.baselineValue,
        to: s.draftValue,
        label: s.labelAr,
      })),
    };

    onApplyPolicyChange('policy_package', stagedChanges.length, auditEntry, draftPolicies);
    setIsPreviewActive(false);
    setActiveTab('editor');
    setPackageNameInput('');
  };

  // Group policies by category for accordion
  const groupedCategories = useMemo(() => {
    const cats: Record<string, { catAr: string; catEn: string; items: PolicyDefinition[] }> = {};
    for (const def of policyCatalog) {
      if (!cats[def.category]) {
        cats[def.category] = {
          catAr: def.categoryAr,
          catEn: def.categoryEn,
          items: [],
        };
      }
      cats[def.category].items.push(def);
    }
    return cats;
  }, [policyCatalog]);

  return (
    <div className="space-y-6">
      {/* 1. Header Control Deck & Staging Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-slate-100">
                {lang === 'ar' ? 'مختبر السياسات الوطنية التفاعلي' : 'Interactive National Policy Laboratory'}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                {lang === 'ar' ? 'تحكم كامل للمستخدم' : 'User Authority 100%'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'ar'
                ? 'أنت وحدك من يقرر السياسات الوطنية. عدّل المعاملات، عاين النتائج في بيئة آمنة دون الكتابة فوق الأساس، وافحص التناقضات الهيكلية قبل الاعتماد.'
                : 'You make every policy choice. Adjust levers, run sandbox previews without modifying baseline, and inspect feasibility constraints.'}
            </p>
          </div>

          {/* Staging Actions Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {stagedChanges.length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {lang === 'ar' ? `${stagedChanges.length} تعديلات في المسودة` : `${stagedChanges.length} pending draft changes`}
              </span>
            )}

            <button
              onClick={() => {
                setIsPreviewActive(true);
                setActiveTab('preview');
              }}
              disabled={stagedChanges.length === 0}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                stagedChanges.length > 0
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'معاينة تداعيات الحزمة' : 'Run Package Preview'}</span>
            </button>

            {stagedChanges.length > 0 && (
              <button
                onClick={handleResetDraftToSaved}
                className="px-3 py-1.5 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>{lang === 'ar' ? 'إلغاء المسودة' : 'Discard Draft'}</span>
              </button>
            )}

            {auditLog.length > 0 && (
              <button
                onClick={onUndoLastChange}
                className="px-3 py-1.5 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ar' ? 'تراجع عن آخر تغيير' : 'Undo Last Change'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'editor'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'لوحة ضبط السياسات (8 أبواب)' : 'Policy Levers Catalog (8 Categories)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            disabled={!previewSimulation}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-cyan-600 text-white font-semibold'
                : previewSimulation
                ? 'text-slate-300 hover:bg-slate-800'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'مصفوفة التداعيات المتوقعة' : 'Projected Consequences Matrix'}</span>
          </button>

          <button
            onClick={() => setActiveTab('conflicts')}
            disabled={!previewSimulation}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'conflicts'
                ? 'bg-cyan-600 text-white font-semibold'
                : previewSimulation && previewSimulation.conflicts.length > 0
                ? 'text-amber-400 hover:bg-slate-800 font-semibold'
                : previewSimulation
                ? 'text-slate-300 hover:bg-slate-800'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar'
                ? `كشف التناقضات والجدوى (${previewSimulation?.conflicts.length || 0})`
                : `Feasibility & Conflicts (${previewSimulation?.conflicts.length || 0})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? `سجل تدقيق القرارات (${auditLog.length})` : `Audit Trail (${auditLog.length})`}</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 1: Policy Levers Category Accordion */}
      {activeTab === 'editor' && (
        <div className="space-y-4">
          {Object.entries(groupedCategories).map(([catKey, catData]) => {
            const isExpanded = expandedCategories[catKey] ?? false;
            const changedCountInCat = catData.items.filter(
              (item) => draftPolicies[item.key] !== policies[item.key]
            ).length;

            return (
              <div
                key={catKey}
                className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden transition-colors"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(catKey)}
                  className="w-full p-4 flex items-center justify-between bg-slate-900 hover:bg-slate-850 cursor-pointer text-start transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <h3 className="text-sm font-semibold text-slate-100">
                      {lang === 'ar' ? catData.catAr : catData.catEn}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-mono">
                      ({catData.items.length} {lang === 'ar' ? 'سياسات' : 'levers'})
                    </span>
                    {changedCountInCat > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                        {changedCountInCat} {lang === 'ar' ? 'معدلة' : 'modified'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Category Policy Items */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-slate-800 bg-slate-950/40 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {catData.items.map((item) => {
                      const activeVal = policies[item.key];
                      const draftVal = draftPolicies[item.key];
                      const isModified = activeVal !== draftVal;

                      return (
                        <div
                          key={item.key}
                          className={`p-4 rounded-lg border transition-colors ${
                            isModified
                              ? 'bg-amber-950/20 border-amber-700/60 shadow-sm'
                              : 'bg-slate-900 border-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                                <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>
                                <ExplainerBubble
                                  itemKey={item.key}
                                  customTitle={lang === 'ar' ? item.labelAr : item.labelEn}
                                  lang={lang}
                                />
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                                {lang === 'ar' ? 'القطاعات المتصلة: ' : 'Connected: '}
                                <span className="text-slate-300">{lang === 'ar' ? item.primarySectorsAr : item.primarySectorsEn}</span>
                              </span>
                            </div>

                            <div className="text-end">
                              <span className="text-xs font-mono font-bold text-cyan-300">
                                {String(draftVal)} {item.unit}
                              </span>
                              {isModified && (
                                <span className="text-[10px] font-mono text-slate-500 block">
                                  {lang === 'ar' ? 'الأساس: ' : 'Base: '}{String(activeVal)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Control Input */}
                          {item.type === 'slider' && (
                            <div className="mt-3">
                              <input
                                type="range"
                                min={item.min}
                                max={item.max}
                                step={item.step}
                                value={typeof draftVal === 'number' ? draftVal : 0}
                                onChange={(e) => handleDraftChange(item.key, parseFloat(e.target.value))}
                                className="w-full accent-cyan-500 cursor-pointer"
                              />
                              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                                <span>{item.min} {item.unit}</span>
                                <span>{item.timeLagYears === 0 ? (lang === 'ar' ? 'أثر فوري' : 'Immediate') : (lang === 'ar' ? `إبطاء: ${item.timeLagYears} سنوات` : `Lag: ${item.timeLagYears}y`)}</span>
                                <span>{item.max} {item.unit}</span>
                              </div>
                            </div>
                          )}

                          {item.type === 'select' && item.options && (
                            <div className="mt-3">
                              <select
                                value={String(draftVal)}
                                onChange={(e) => handleDraftChange(item.key, e.target.value as DeficitFinancingPreference)}
                                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                              >
                                {item.options.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {lang === 'ar' ? opt.labelAr : opt.labelEn}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Reset Single Lever Button */}
                          {isModified && (
                            <div className="mt-2 text-end">
                              <button
                                onClick={() => handleDraftChange(item.key, activeVal)}
                                className="text-[10px] text-amber-400 hover:text-amber-300 cursor-pointer underline"
                              >
                                {lang === 'ar' ? 'إعادة للقيمة الأصلية' : 'Revert to base'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. TAB 2: Projected Consequences Matrix (Sandbox Simulation) */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          {!previewSimulation ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-lg">
              <FlaskConical className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'لم تقم بتعديل أي سياسة في المسودة بعد. عدّل بعض المعاملات من تبويب لوحة الضبط لتشغيل المعاينة.'
                  : 'No policies have been modified in draft. Change parameters in the levers tab to run preview.'}
              </p>
            </div>
          ) : (
            <>
              {/* Approval Header Card */}
              <div className="bg-slate-900 border border-cyan-800/60 rounded-lg p-5 bg-gradient-to-r from-slate-900 to-cyan-950/30">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider block">
                      {lang === 'ar' ? 'معاينة حزمة السياسات المقترحة' : 'Draft Policy Package Sandbox Preview'}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-100 mt-1">
                      {stagedChanges.length} {lang === 'ar' ? 'تعديلات سياسات منسقة جاهزة للمراجعة والاعتماد' : 'coordinated policy revisions staged'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {lang === 'ar'
                        ? 'تمت المحاكاة ديناميكياً بواسطة المحرك الفيزيائي في بيئة اختبار معزولة؛ خط الأساس لم يتأثر بعد.'
                        : 'Simulated dynamically via the macro engine in an isolated sandbox; baseline remains untampered.'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                    <input
                      type="text"
                      placeholder={lang === 'ar' ? 'تسمية الحزمة (مثال: إصلاح ضريبي متكامل)' : 'Package label (optional)'}
                      value={packageNameInput}
                      onChange={(e) => setPackageNameInput(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={handleApplyPackage}
                      className="px-4 py-2 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'اعتماد وتطبيق الحزمة' : 'Accept & Apply Package'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Staged Changes Pills List */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                  {lang === 'ar' ? 'محتويات الحزمة المقترحة:' : 'Proposed Package Levers:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {stagedChanges.map((change) => (
                    <div
                      key={change.policyKey}
                      className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono flex items-center gap-2"
                    >
                      <span className="text-slate-300">{lang === 'ar' ? change.labelAr : change.labelEn}:</span>
                      <span className="text-slate-500 line-through">{String(change.baselineValue)}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                      <span className="text-cyan-300 font-bold">{String(change.draftValue)} {change.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consequences Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'ar' ? 'المصفوفة التحليلية لتداعيات السياسات عبر القطاعات:' : 'Cross-Sector Indicator Impact Matrix:'}</span>
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                      <tr>
                        <th className="p-3 text-start">{lang === 'ar' ? 'المؤشر القومي' : 'National Indicator'}</th>
                        <th className="p-3 text-center">{lang === 'ar' ? 'خط الأساس' : 'Baseline'}</th>
                        <th className="p-3 text-center">{lang === 'ar' ? 'بعد السياسة' : 'Simulated'}</th>
                        <th className="p-3 text-center">{lang === 'ar' ? 'التغير (Δ)' : 'Delta (Δ)'}</th>
                        <th className="p-3 text-center">{lang === 'ar' ? 'الإبطاء الزمني' : 'Time Lag'}</th>
                        <th className="p-3 text-center">{lang === 'ar' ? 'المسار (3 و 5 سنوات)' : 'Trajectory (3y & 5y)'}</th>
                        <th className="p-3 text-start">{lang === 'ar' ? 'الآلية السببية والتفسير' : 'Causal Mechanism'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {previewSimulation.consequences.map((c) => {
                        const isGood = c.impactType === 'positive';
                        const isNeutral = c.absoluteDelta === 0;

                        return (
                          <tr key={c.indicatorKey} className="hover:bg-slate-850/50 transition-colors">
                            <td className="p-3 font-semibold text-slate-200">
                              <div>{lang === 'ar' ? c.labelAr : c.labelEn}</div>
                              <span className="text-[10px] text-slate-500 font-mono">{c.sector}</span>
                            </td>
                            <td className="p-3 text-center font-mono text-slate-400">
                              {c.baselineValue.toFixed(1)} {c.unit}
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-slate-100">
                              {c.simulatedValue.toFixed(1)} {c.unit}
                            </td>
                            <td className="p-3 text-center font-mono">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  isNeutral
                                    ? 'bg-slate-800 text-slate-400'
                                    : isGood
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                                }`}
                              >
                                {c.absoluteDelta > 0 ? `+${c.absoluteDelta.toFixed(1)}` : c.absoluteDelta.toFixed(1)} {c.unit}
                                {c.percentDelta !== null && ` (${c.percentDelta > 0 ? `+${c.percentDelta}` : c.percentDelta}%)`}
                              </span>
                            </td>
                            <td className="p-3 text-center font-mono text-slate-400">
                              {c.timeLagYears === 0 ? (lang === 'ar' ? 'فوري' : 'Immediate') : (lang === 'ar' ? `${c.timeLagYears} سنة` : `${c.timeLagYears}y`)}
                            </td>
                            <td className="p-3 text-center font-mono text-[11px] text-slate-300">
                              {c.trajectory.mediumTerm.toFixed(1)} → {c.trajectory.longTerm.toFixed(1)}
                            </td>
                            <td className="p-3 text-slate-300 text-[11px] max-w-xs leading-relaxed">
                              {lang === 'ar' ? c.causalMechanismAr : c.causalMechanismEn}
                              <span className="text-[10px] text-slate-500 block mt-0.5">
                                {lang === 'ar' ? 'الفئات المتأثرة: ' : 'Affected: '} {c.affectedGroups.join('، ')}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 4. TAB 3: Policy Conflicts & Feasibility Radar */}
      {activeTab === 'conflicts' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-100">
                {lang === 'ar' ? 'المبدأ الحاكم: رصد التناقضات دون فرض الوصاية على قراراتك: ' : 'Core Principle: Contradiction Detection Without Paternalism: '}
              </span>
              {lang === 'ar'
                ? 'يكشف المحاكي التعارضات الحسابية بين الأهداف والمخصصات والقدرات الاستيعابية ويوضح الحسابات الدقيقة خلفها، لكنه يترك لك القرار النهائي في كيفية معالجتها أو قبول المخاطرة المحسوبة.'
                : 'The simulator exposes arithmetic and capacity conflicts with mathematical proofs, but leaves the decision entirely in your hands without auto-resolving.'}
            </div>
          </div>

          {!previewSimulation || previewSimulation.conflicts.length === 0 ? (
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-lg text-center">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-slate-100">
                {lang === 'ar' ? 'لا توجد تناقضات حرجة مكتشفة في الحزمة الحالية' : 'No Critical Contradictions Detected'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'ar'
                  ? 'الالتزامات المالية ومعدلات التوسع تقع ضمن هوامش الاستيعاب والاستدامة الطبيعية.'
                  : 'Spending commitments and policy trajectories remain within plausible feasibility boundaries.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {previewSimulation.conflicts.map((conf) => (
                <div
                  key={conf.id}
                  className="bg-slate-900 border border-amber-800/60 rounded-lg p-5 border-r-4 border-r-amber-500"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      <h4 className="text-sm font-semibold text-slate-100">
                        {lang === 'ar' ? conf.titleAr : conf.titleEn}
                      </h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      {conf.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {lang === 'ar' ? conf.descriptionAr : conf.descriptionEn}
                  </p>

                  {/* Mathematical Calculation Proof */}
                  <div className="my-3 p-3 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-cyan-300">
                    <span className="text-slate-500 block text-[10px] uppercase">{lang === 'ar' ? 'الإثبات الحسابي للتناقض:' : 'Mathematical Proof:'}</span>
                    {lang === 'ar' ? conf.calculationProofAr : conf.calculationProofEn}
                  </div>

                  {/* User Choices */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                      {lang === 'ar' ? 'خياراتك لمعالجة هذا التعارض (اختر مسارك):' : 'Available User Resolution Alternatives:'}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {conf.userChoiceOptions.map((opt) => (
                        <div
                          key={opt.id}
                          className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-xs font-semibold text-cyan-300 block mb-1">
                              {lang === 'ar' ? opt.labelAr : opt.labelEn}
                            </span>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {lang === 'ar' ? opt.suggestionAr : opt.suggestionEn}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 4: Decision Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'سجل تدقيق القرارات والمساءلة السياساتية' : 'Policy Audit Trail & Decision Log'}</span>
            </h3>
            {auditLog.length > 0 && (
              <button
                onClick={onUndoLastChange}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>{lang === 'ar' ? 'تراجع عن آخر اعتماد' : 'Undo Last'}</span>
              </button>
            )}
          </div>

          {auditLog.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              {lang === 'ar'
                ? 'لم يتم اعتماد أي تغيير في السياسات بعد. كل قرار تتخذه يتم تسجيله هنا بالتوقيت والبيانات.'
                : 'No policy changes committed yet. All actions are logged with timestamp and version delta.'}
            </p>
          ) : (
            <div className="space-y-3">
              {auditLog.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 font-mono pb-2 border-b border-slate-900">
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                    <span>{lang === 'ar' ? `السنة المحاكاة: ${log.simulatedYear}` : `Simulated Year: ${log.simulatedYear}`}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">
                      {lang === 'ar' ? log.labelAr : log.labelEn}
                    </span>
                    <span className="font-mono text-cyan-400">
                      {String(log.previousValue)} → {String(log.newValue)}
                    </span>
                  </div>

                  {log.packageDetails && log.packageDetails.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-900 flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                      {log.packageDetails.map((pd, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {pd.label}: {String(pd.from)} → {String(pd.to)}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 mt-2">
                    {log.rationaleAr}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
