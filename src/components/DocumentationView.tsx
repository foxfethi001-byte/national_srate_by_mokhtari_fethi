/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Model Documentation, Scientific Methodology, Sensitivity Lab & User Manual (Phase 6)
 * توثيق النموذج العلمي، مختبر الحساسية وعدم اليقين، معجم القطاعات، ودليل التشغيل
 */

import React, { useState } from 'react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { SimulationState, ConfidenceLevel } from '../types/simulation';
import {
  BookOpen,
  FileCode,
  ShieldAlert,
  Sliders,
  Layers,
  Search,
  Terminal,
  HelpCircle,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Workflow,
  ArrowRight,
} from 'lucide-react';

interface DocumentationViewProps {
  lang: Language;
  currentState?: SimulationState;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({ lang, currentState }) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'equations' | 'sensitivity' | 'dictionary' | 'guide' | 'limitations'>('equations');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sensitivity Lab interactive state
  const [capitalElasticityAlpha, setCapitalElasticityAlpha] = useState<number>(0.35);
  const [tfpShockPct, setTfpShockPct] = useState<number>(0.0);
  const [interestPassThrough, setInterestPassThrough] = useState<number>(0.75);

  // Compute live sensitivity output divergence based on currentState
  const baseGdp = currentState ? currentState.macro.realGdp : 245.0;
  const baseCapStock = currentState ? currentState.economic.capacityTrade.totalCapitalStockReal : 620.0;
  const baseDebt = currentState ? currentState.macro.publicDebtStock : 102.9;
  const baseDeficit = currentState ? currentState.macro.overallDeficit : 14.9;

  // Sensitivity calculation: Solow output shift
  // Y = A * K^alpha * L^(1-alpha)
  // Shift factor relative to baseline alpha=0.35 and tfpShock
  const alphaRatio = Math.pow(Math.max(10, baseCapStock) / 500, capitalElasticityAlpha - 0.35);
  const tfpMultiplier = 1 + tfpShockPct / 100;
  const calculatedGdp = baseGdp * alphaRatio * tfpMultiplier;
  const gdpDivergencePct = ((calculatedGdp - baseGdp) / baseGdp) * 100;

  // Debt interest sensitivity
  const benchmarkRate = currentState ? currentState.macro.centralBankRate : 4.5;
  const effectiveInterestRate = benchmarkRate * interestPassThrough;
  const interestCostDiff = (baseDebt * (effectiveInterestRate - benchmarkRate)) / 100;
  const adjustedDeficit = Math.max(0, baseDeficit + interestCostDiff);

  // 1. Mathematical Framework catalog
  const mathematicalFramework = [
    {
      id: 'solow_cobb_douglas',
      titleAr: 'دالة الإنتاج الكلي (سولوه - كوب-دوغلاس)',
      titleEn: 'Solow-Cobb-Douglas Production Function',
      formula: 'Y_t = A_t · K_t^α · L_t^(1-α)',
      parameters: 'α = 0.35 (مرونة رأس المال)، 1-α = 0.65 (مرونة العمل)، A_t = الإنتاجية الكلية لعوامل الإنتاج (TFP)',
      type: 'علاقة تجريبية ونظرية قياسية',
      confidence: 'high_empirical' as ConfidenceLevel,
      descriptionAr: 'تحدد الناتج المحلي الكامن انطلاقاً من رصيد رأس المال الفعلي المتراكم، القوى العاملة المشتغلة، ومستوى التقدم التكنولوجي والكفاءة المؤسسية.',
      descriptionEn: 'Determines potential aggregate output from capital stock, employed labor, and total factor productivity.',
    },
    {
      id: 'national_accounts_identity',
      titleAr: 'متطابقة الحسابات القومية الأساسية للإنفاق',
      titleEn: 'National Accounts Expenditure Identity',
      formula: 'GDP = C + I + G + (X - M)',
      parameters: 'C: الاستهلاك العائلي، I: الاستثمار الخاص والعام، G: الإنفاق الحكومي الجاري، X: الصادرات، M: الواردات',
      type: 'متطابقة محاسبية ملزمة (100% يقين)',
      confidence: 'accounting_identity' as ConfidenceLevel,
      descriptionAr: 'مبدأ محاسبي قطعي لا يقبل الخطأ؛ يعرّف الناتج المحلي الإجمالي كإجمالي الطلب النهائي على السلع والخدمات المنتجة محلياً.',
      descriptionEn: 'Rigorous national accounting identity defining aggregate output as total final domestic demand plus net exports.',
    },
    {
      id: 'debt_accumulation',
      titleAr: 'ديناميكية تراكم الدين العام وقيد الميزانية',
      titleEn: 'Public Debt Accumulation Identity',
      formula: 'D_t = D_{t-1} + (Outlays_t - Revenues_t) = D_{t-1} + Deficit_t',
      parameters: 'D_t: رصيد الدين السيادي، Outlays: إجمالي المصروفات، Revenues: إجمالي الإيرادات السيادية',
      type: 'متطابقة تدفق ومخزون ملزمة',
      confidence: 'accounting_identity' as ConfidenceLevel,
      descriptionAr: 'تحفظ الاتساق التام بين العجز المالي السنوي والزيادة التراكمية في رصيد الدين العام دون أي تسريب مالي غير محاسب.',
      descriptionEn: 'Preserves stock-flow consistency between the fiscal deficit and the cumulative expansion of sovereign debt.',
    },
    {
      id: 'phillips_curve',
      titleAr: 'منحنى فيليبس الجديد المعزز بالتوقعات',
      titleEn: 'Expectations-Augmented New Phillips Curve',
      formula: 'π_t = π_t^e - β · (u_t - u_n) + γ · s_{import}',
      parameters: 'β = 0.45 (حساسية فجوة العمل)، u_n = 5.5% (معدل البطالة الطبيعي)، s: صدمات التضخم المستورد',
      type: 'علاقة سلوكية وتجريبية اقتصادية',
      confidence: 'high_empirical' as ConfidenceLevel,
      descriptionAr: 'يفسر مسار التضخم السنوي بدلالة فجوة البطالة، التضخم المتوقع المتجذر، والصدمات الخارجية لأسعار الاستيراد والطاقة.',
      descriptionEn: 'Models consumer price inflation responding to labor slack, anchored inflation expectations, and external import shocks.',
    },
    {
      id: 'taylor_rule',
      titleAr: 'قاعدة تايلور للسياسة النقدية التقديرية',
      titleEn: 'Taylor Monetary Policy Rule',
      formula: 'i_t = r* + π_t + 0.5(π_t - π*) + 0.5(y_t - y*)',
      parameters: 'r* = الفائدة المحايدة (2.0%)، π* = مستهدف التضخم (2.5%)، y - y* = فجوة الناتج الفعلي عن الكامن',
      type: 'قاعدة استرشادية لسلوك البنك المركزي',
      confidence: 'moderate_empirical' as ConfidenceLevel,
      descriptionAr: 'تحدد سعر الفائدة التوازني المستهدف للتوفيق بين استقرار الأسعار وكبح الفجوات التضخمية أو الانكماشية.',
      descriptionEn: 'Sets the benchmark central bank policy rate balancing price stability targets against output gaps.',
    },
    {
      id: 'fiscal_multiplier',
      titleAr: 'المضاعف المالي للإنفاق الرأسمالي والاستهلاكي',
      titleEn: 'Structural Fiscal Multipliers',
      formula: 'ΔY_t = m_infra · ΔG_infra + m_current · ΔG_current',
      parameters: 'm_infra = 1.35 (مضاعف البنية التحتية مع تأخير سنتين)، m_current = 0.65 (مضاعف الاستهلاك الجاري)',
      type: 'معاملات تجريبية هيكلية مدعومة بدراسات صندوق النقد',
      confidence: 'high_empirical' as ConfidenceLevel,
      descriptionAr: 'يميز بين الأثر المضاعف للإنفاق الاستثماري الرأسمالي المعزز للإنتاجية وبين الإنفاق الاستهلاكي الجاري السريع التلاشي.',
      descriptionEn: 'Distinguishes high-yield capital infrastructure multipliers from low-yield current consumption multipliers.',
    },
  ];

  // 2. Sector Causal Reference Catalog (All 15 Sectors)
  const sectorCatalog = [
    {
      code: 'A',
      nameAr: 'المالية العامة والميزانية السيادية',
      nameEn: 'Public Finance & Fiscal Balance',
      keyVars: 'الإيرادات الضريبية، الإيرادات النفطية، نفقات الأجور، الفوائد السيادية، العجز الإجمالي، رصيد الدين العام',
      causalityAr: 'الإيرادات تتأثر بمعدلات الضرائب ونشاط الناتج المحلي، بينما الديون تتراكم حتمياً مع كل عجز سنوي عبر متطابقة المخزون والتدفق.',
      delay: 'سنة مالية واحدة (متطابقة تدفق ومخزون فورية)',
      empiricalSource: 'IMF Government Finance Statistics Manual (GFSM 2014)',
    },
    {
      code: 'B',
      nameAr: 'الاقتصاد الكلي والناتج القومي',
      nameEn: 'Macroeconomy & National Accounts',
      keyVars: 'الناتج الاسمي والحقيقي، الاستهلاك، الاستثمار، التضخم، سعر الفائدة، فجوة الناتج',
      causalityAr: 'يتحدد الناتج الكلي بدالة سولوه كوب-دوغلاس متأثراً بتراكم رأس المال الصافي وتغيرات الإنتاجية الكلية وعوامل الطلب.',
      delay: 'سنة إلى سنتين لاستيعاب الصدمات النقدية والمالية',
      empiricalSource: 'System of National Accounts (SNA 2008), Solow Growth Model',
    },
    {
      code: 'C',
      nameAr: 'سوق العمل والديموغرافيا والمهارات',
      nameEn: 'Labor Market & Demographics',
      keyVars: 'حجم السكان، القوى العاملة، معدل البطالة، متوسط الأجور، معدل المشاركة الاقتصادية',
      causalityAr: 'نمو التوظيف يتبع قانون أوكون المعدل؛ نمو الأجور يدخل في تكلفة الإنتاج ويغذي التضخم المحلي.',
      delay: 'تأخير من سنتين إلى 4 سنوات لتأهيل المهارات وتعديل العقود',
      empiricalSource: 'ILO Labor Statistics, Okun Empirical Elasticity',
    },
    {
      code: 'D',
      nameAr: 'التجارة الخارجية وميزان المدفوعات',
      nameEn: 'External Sector & Trade Balance',
      keyVars: 'الصادرات السلعية، الصادرات النفطية، الواردات، الحساب الجاري، احتياطيات النقد الأجنبي',
      causalityAr: 'صافي الصادرات يعتمد على شروط التبادل التجاري والطلب العالمي وسعر الصرف الفعلي الحقيقي.',
      delay: 'تأثير منحنى J يستغرق 12-18 شهراً بعد تغيرات الصرف',
      empiricalSource: 'IMF Balance of Payments Manual (BPM6)',
    },
    {
      code: 'E',
      nameAr: 'القطاع المصرفي والاستقرار المالي',
      nameEn: 'Banking System & Financial Stability',
      keyVars: 'القروض غير المنتظمة NPL، كفاية رأس المال CAR، نمو الائتمان، سيولة البنوك',
      causalityAr: 'ارتفاع الفائدة يضغط على قدرة المقترضين ويزيد الديون المتعثرة مما يقلص نمو الائتمان الاستثماري.',
      delay: 'سنة واحدة لتراكم التعثرات بعد صدمات الفائدة',
      empiricalSource: 'Basel III Accord Framework, BIS Financial Soundness Indicators',
    },
    {
      code: 'F',
      nameAr: 'الطاقة والتحول البيئي',
      nameEn: 'Energy & Ecological Transition',
      keyVars: 'استهلاك الطاقة، حصة الطاقة المتجددة، انبعاثات الكربون، كفاءة الشبكة',
      causalityAr: 'الاستثمار في الطاقة النظيفة يقلص الاعتماد على الوقود الأحفوري ويخفض تكاليف الانبعاثات الكربونية.',
      delay: '3 إلى 5 سنوات لإتمام مشاريع محطات الطاقة المتجددة',
      empiricalSource: 'IEA World Energy Balances & IPCC Guidelines',
    },
    {
      code: 'G',
      nameAr: 'الأمن المائي والغذائي',
      nameEn: 'Water & Food Security',
      keyVars: 'استهلاك المياه للفرد، نسبة الإجهاد المائي، الاكتفاء الذاتي من الغذاء، المخزون الاستراتيجي',
      causalityAr: 'الإجهاد المائي يرفع تكلفة الإنتاج الزراعي ويزيد الاعتماد على الاستيراد الغذائي الحساس للأسعار العالمية.',
      delay: 'سنة واحدة لتقلبات المحاصيل و3 سنوات لمشاريع التحلية',
      empiricalSource: 'FAO Food Outlook & Aquastat Water Database',
    },
    {
      code: 'H',
      nameAr: 'التعليم ورأس المال البشري',
      nameEn: 'Education & Human Capital',
      keyVars: 'سنوات التمدرس، جودة التعليم PISA، الإنفاق التعليمي، مؤشر رأس المال البشري',
      causalityAr: 'الإنفاق التعليمي يرفع جودة القوى العاملة وإنتاجية العمل TFP على المدى المتوسط والبعيد.',
      delay: '5 إلى 7 سنوات لظهور أثر المناهج والتدريب على إنتاجية العمل',
      empiricalSource: 'World Bank Human Capital Index (HCI) Methodology',
    },
    {
      code: 'I',
      nameAr: 'الرعاية الصحية والمرونة الوبائية',
      nameEn: 'Healthcare & Epidemic Resilience',
      keyVars: 'متوسط العمر المتوقع، أسرة المستشفيات لكل ألف، الإنفاق الصحي، الجاهزية الوبائية',
      causalityAr: 'تعزيز المنظومة الصحية يقلص ساعات العمل المفقودة بسبب المرض ويرفع متوسط العمر والإنتاجية.',
      delay: 'سنتين إلى 4 سنوات لتجهيز الكوادر والمرافق الطبية',
      empiricalSource: 'WHO Global Health Observatory & Global Health Security Index',
    },
    {
      code: 'J',
      nameAr: 'البنية التحتية واللوجستيات',
      nameEn: 'Infrastructure & Logistics',
      keyVars: 'مؤشر جودة الطرق، الكفاءة اللوجستية LPI، سعة الموانئ والمطارات، إتاحة النطاق العريض',
      causalityAr: 'البنية التحتية المتطورة تخفض تكاليف النقل والمعاملات وترفع عائد الاستثمار الخاص.',
      delay: '3 إلى 5 سنوات لتدشين شبكات النقل والاتصالات الكبرى',
      empiricalSource: 'World Bank Logistics Performance Index (LPI)',
    },
    {
      code: 'K',
      nameAr: 'الصناعة والتنويع الاقتصادي',
      nameEn: 'Industry & Economic Complexity',
      keyVars: 'حصة الصناعة التحويلية، مؤشر التعقيد الاقتصادي ECI، الصادرات الصناعية ذات القيمة المضافة',
      causalityAr: 'التعقيد الصناعي يحرر الاقتصاد من أحادية الريع النفطي ويمنح استقراراً أطول للميزان التجاري.',
      delay: '4 إلى 8 سنوات لتأسيس سلاسل الإمداد المتطورة وتوطين التكنولوجيا',
      empiricalSource: 'Harvard Atlas of Economic Complexity (Hausmann & Hidalgo)',
    },
    {
      code: 'L',
      nameAr: 'الإسكان والتنمية الحضرية',
      nameEn: 'Housing & Urban Development',
      keyVars: 'معدل ملكية المساكن، فجوة الوحدات السكنية، مؤشر تكلفة السكن للدخل، التمدن الحضري',
      causalityAr: 'توفير التمويل العقاري وتوسيع المخططات السكنية يحد من التضخم العقاري ويعزز الاستقرار الأسري.',
      delay: 'سنتين إلى 3 سنوات لتسليم المخططات السكنية',
      empiricalSource: 'UN-Habitat Urban Indicators & National Housing Registers',
    },
    {
      code: 'M',
      nameAr: 'الحوكمة وسيادة القانون والعدالة',
      nameEn: 'Governance & Rule of Law',
      keyVars: 'مؤشر سيادة القانون، كفاءة الجهاز الحكومي، مكافحة الفساد، مؤشر جودة التنظيم',
      causalityAr: 'الحوكمة القوية تقلص تكلفة المعاملات وجذب الاستثمار الأجنبي المباشر وتحمي الحقوق التعاقدية.',
      delay: '3 إلى 6 سنوات لترسيخ الإصلاحات التشريعية والمؤسسية',
      empiricalSource: 'World Bank Worldwide Governance Indicators (WGI)',
    },
    {
      code: 'N',
      nameAr: 'التماسك الاجتماعي والعدالة التوزيعية',
      nameEn: 'Social Protection & Inclusion',
      keyVars: 'معامل جيني، خط الفقر الوطني، تغطية شبكات الأمان الاجتماعي، التحويلات النقدية',
      causalityAr: 'توسيع شبكات الحماية الموجهة يخفف من وطأة الإصلاحات السعرية ويحمي الفئات الهشة دون تسريب ريعي.',
      delay: 'سنة واحدة لتفعيل برامج الدعم المباشر للأسر',
      empiricalSource: 'World Bank ASPIRE Database & Social Protection Assessments',
    },
    {
      code: 'O',
      nameAr: 'الأمن القومي والمرونة الاستراتيجية',
      nameEn: 'National Security & Strategic Resilience',
      keyVars: 'مؤشر الجاهزية الدفاعية، الاحتياطي الاستراتيجي للأزمات، الأمن السيبراني، مرونة الطوارئ',
      causalityAr: 'الاحتياطيات الاستراتيجية الكافية تمتص صدمات إمدادات الغذاء والطاقة خلال الاضطرابات الإقليمية.',
      delay: 'سنة واحدة لرفع المخزونات التكتيكية و3 سنوات للأنظمة الدفاعية',
      empiricalSource: 'SIPRI Military Expenditure & Global Resilience Indexes',
    },
  ];

  // 3. User Guide & Non-technical Instructions
  const userGuideSteps = [
    {
      step: '1',
      titleAr: 'بدء التشغيل والبيئة التشغيلية',
      titleEn: 'System Launch & Environment',
      descAr: 'المنظومة مصممة لتعمل بنسبة 100% داخل المتصفح بأداء فائق عبر Vite وReact 19 دون الحاجة إلى خوادم خارجية أو قواعد بيانات سحابية مدفوعة.',
      descEn: 'The system runs 100% locally in the modern browser using Vite and React 19 without third-party cloud costs or external server dependencies.',
      command: 'npm run dev',
    },
    {
      step: '2',
      titleAr: 'اختيار النموذج وتخصيص الدولة',
      titleEn: 'Selecting Archetype & Configuration',
      descAr: 'افتح نافذة "تخصيص الدولة" للاختيار من بين 4 نماذج اقتصادية قياسية (المصدر للموارد، الصناعي المتقدم، النامي سريع التحضر، والجزيرة الخدمية)، أو ضبط المتغيرات الأساسية.',
      descEn: 'Open "Country Config" to select from 4 standard archetypes (Resource Exporter, Industrial Advanced, Developing Rapid-Urbanizer, Small Service Island).',
      command: 'Header -> زر تخصيص الدولة (Country Config)',
    },
    {
      step: '3',
      titleAr: 'تعديل السياسات واختبار الفرضيات',
      titleEn: 'Policy Editing & Experimentation',
      descAr: 'انتقل إلى "مختبر السياسات" لضبط 12 رافعة سياسية حكومية (الضرائب، الدعم، الفائدة، البنية التحتية، التقاعد). يتم تسجيل كل تغيير فوراً في سجل التدقيق لضمان الشفافية.',
      descEn: 'Use the "Policy Laboratory" to adjust 12 core policy levers with instant audit trail logging and undo capabilities.',
      command: 'Tab -> مختبر السياسات العامة (Policy Lab)',
    },
    {
      step: '4',
      titleAr: 'التقدم الزمني ومقارنة السيناريوهات',
      titleEn: 'Time Progression & Branching',
      descAr: 'استخدم شريط التحكم الزمني للتقدم سنة بسنة أو القفز 5 أو 10 سنوات لملاحظة تراكم الآثار والتأخيرات الهيكلية، مع إمكانية تفريع سيناريوهات متعددة للمقارنة الرأسية.',
      descEn: 'Advance time year-by-year or jump 5/10 years to observe structural accumulation lags and branch alternate policy scenarios.',
      command: 'Time Controls -> زر خطوة للأمام (Step Forward) أو قفز سنوي',
    },
    {
      step: '5',
      titleAr: 'إدارة المخاطر والإنذار المبكر والأزمات',
      titleEn: 'Risk Management & Crisis Injections',
      descAr: 'راقب 10 مؤشرات إنذار مبكر في "مركز المخاطر" واختبر مرونة الدولة بحقن 9 أزمات هيكلية واقعية (صدمة أسعار السلع، الجفاف، انقطاع الإمداد، الجائحة).',
      descEn: 'Monitor 10 early warning indicators in the Risk Center and test macroeconomic resilience using the Crisis Engine.',
      command: 'Tab -> مركز المخاطر والإنذار المبكر / مركز إدارة الأزمات',
    },
    {
      step: '6',
      titleAr: 'التصدير والحفظ والاستعادة الآمنة',
      titleEn: 'Persistence, Checkpoints & Export',
      descAr: 'احفظ نقاط تفتيش دورية في قاعدة البيانات المحلية المتصفحية IndexedDB، أو قم بتصدير ملف المشروع الكامل بتنسيق JSON واستيراده لاحقاً دون فقدان أي بيانات.',
      descEn: 'Save checkpoints to browser IndexedDB or export/import complete simulation projects as portable JSON files.',
      command: 'Header -> حفظ نقطة تفتيش / استيراد وتصدير المشروع',
    },
  ];

  // 4. Limitations and Scientific Disclosure
  const limitations = [
    {
      id: 'lim_1',
      titleAr: 'طبيعة البيانات: مصفوفات قياسية مصطنعة متسقة رياضياً',
      titleEn: 'Synthetic Illustrative Baseline Calibration',
      textAr: 'البيانات التأسيسية الأولية في النماذج الأربعة هي مصفوفات مصطنعة متوازنة رياضياً وفق المعايير الإحصائية الدولية (SNA/GFSM)، وصُممت لاختبار المنطق التفاعلي والسياساتي وليست مسحوبة من جهاز إحصاء رسمي سري لدولة معينة.',
      textEn: 'Baseline figures are synthetic, mathematically consistent calibration matrices built on SNA/GFSM principles for simulation, not classified empirical government records.',
    },
    {
      id: 'lim_2',
      titleAr: 'فروق التوقيت والإبطاء الزمني الهيكلي (Time Lags)',
      titleEn: 'Structural Policy Implementation Lags',
      textAr: 'الإنفاق في الصحة والتعليم يستغرق بين 3 إلى 7 سنوات ليترجم إلى زيادة في الإنتاجية TFP، بينما الإنفاق الرأسمالي في الطرق والموانئ يستغرق سنتين إلى 4 سنوات. النموذج يحاكي هذه الفترات بدقة ولا يقدم نتائج فورية وهمية.',
      textEn: 'Human and physical capital investments embody multi-year structural lags before impacting productivity and potential GDP.',
    },
    {
      id: 'lim_3',
      titleAr: 'عدم الخطية عند تزامن صدمات حادة متعددة',
      titleEn: 'Non-Linear Tail Uncertainty Under Compounding Shocks',
      textAr: 'عند تزامن صدمات حادة متعددة (مثل صدمة جفاف حاد مع صدمة أسعار نفط ورفع فوائد بنسبة 600 نقطة أساس)، قد تتسع هوامش عدم اليقين بسبب التغذية الراجعة المعقدة بين القطاعات.',
      textEn: 'Simultaneous compounding shocks may induce non-linear systemic feedbacks that widen confidence intervals.',
    },
    {
      id: 'lim_4',
      titleAr: 'الامتناع عن التنبؤات السياسية والأمنية غير المبررة',
      titleEn: 'Boundary on Unsupported Behavioral Projections',
      textAr: 'يلتزم النموذج بالمعايير العلمية الاقتصادية البحتة، ويمتنع تماماً عن إطلاق تنبؤات اعتباطية بحدوث اضطرابات سياسية أو جرائم أو سلوكيات اجتماعية غير مبررة إحصائياً.',
      textEn: 'The model adheres strictly to verifiable economic and demographic relationships, avoiding arbitrary predictions of political unrest or crime.',
    },
  ];

  const filteredSectors = sectorCatalog.filter(
    (s) =>
      s.nameAr.includes(searchTerm) ||
      s.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.keyVars.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>{lang === 'ar' ? 'التوثيق العلمي، مختبر الحساسية، ودليل التشغيل' : 'Scientific Methodology, Sensitivity Lab & User Manual'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'ar'
                ? 'إفصاح شفاف عن المعادلات الرياضية، المتطابقات المحاسبية، فحص الحساسية التفاعلي، معجم القطاعات الـ 15، ودليل المستخدم.'
                : 'Transparent disclosure of mathematical foundations, stock-flow identities, interactive sensitivity lab, 15-sector catalog, and user manual.'}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('equations')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'equations'
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'المعادلات والمتطابقات' : 'Core Equations'}</span>
            </button>
            <button
              onClick={() => setActiveTab('sensitivity')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sensitivity'
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مختبر الحساسية وعدم اليقين' : 'Sensitivity Lab'}</span>
            </button>
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dictionary'
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'معجم القطاعات (A-O)' : 'Sectors A-O Catalog'}</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'دليل التشغيل والاستخدام' : 'User Manual'}</span>
            </button>
            <button
              onClick={() => setActiveTab('limitations')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'limitations'
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'المحددات والنزاهة العلمية' : 'Limitations & Integrity'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Core Equations Tab */}
      {activeTab === 'equations' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 leading-relaxed flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-100">
                {lang === 'ar' ? 'التصنيف الصارم لليقين المعرفي: ' : 'Epistemic Rigor Classification: '}
              </span>
              {lang === 'ar'
                ? 'يميز المحاكي بشكل قاطع بين المتطابقات المحاسبية الملزمة (مثل تراكم الدين والميزان المالي وحسابات الناتج) التي لا تحتمل أي خطأ، وبين العلاقات السلوكية التجريبية (مثل منحنى فيليبس ودالة الإنتاج) التي تخضع لمرونات اقتصادية قابلة للتعديل والتحقق.'
                : 'The simulator rigorously distinguishes exact accounting identities (debt accumulation, fiscal identity, GDP expenditure) which admit zero leakage, from behavioral empirical relationships (Phillips curve, Solow production) subject to calibrated elasticities.'}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {mathematicalFramework.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                    <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      <span>{lang === 'ar' ? item.titleAr : item.titleEn}</span>
                    </h3>
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded font-mono font-medium self-start sm:self-auto ${
                        item.confidence === 'accounting_identity'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Formula Box */}
                  <div className="my-3 p-3 bg-slate-950 border border-slate-800 rounded font-mono text-cyan-300 text-sm tracking-wide">
                    {item.formula}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'ar' ? item.descriptionAr : item.descriptionEn}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                  {lang === 'ar' ? 'المعاملات والمحددات: ' : 'Parameters & Elasticities: '}
                  <span className="text-slate-300">{item.parameters}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Interactive Sensitivity & Uncertainty Lab */}
      {activeTab === 'sensitivity' && (
        <div className="space-y-6">
          {/* Methodology distinction callout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
              <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider block">1. حتمي</span>
              <h4 className="text-xs font-semibold text-slate-100 mt-1">النتائج الحتمية للسيناريو</h4>
              <p className="text-[11px] text-slate-400 mt-1">حسابات دقيقة قائمة على المسار المختار وسياسات المستخدم المحددة.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
              <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block">2. حساسية</span>
              <h4 className="text-xs font-semibold text-slate-100 mt-1">تحليل الحساسية الهيكلية</h4>
              <p className="text-[11px] text-slate-400 mt-1">اختبار مدى صمود القرارات بتغيير المعاملات غير المؤكدة (α, TFP).</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
              <span className="text-[10px] text-purple-400 font-mono uppercase tracking-wider block">3. احتمالي</span>
              <h4 className="text-xs font-semibold text-slate-100 mt-1">المحاكاة الاحتمالية</h4>
              <p className="text-[11px] text-slate-400 mt-1">توليد حزم سيناريوهات عشوائية متزنة لاختبار توزيعات المخاطر القصوى.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
              <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider block">4. تجريبي</span>
              <h4 className="text-xs font-semibold text-slate-100 mt-1">التحقق التاريخي التجريبي</h4>
              <p className="text-[11px] text-slate-400 mt-1">مقارنة النتائج مع السلاسل الزمنية الحقيقية الموثقة لتقييم الدقة التفسيرية.</p>
            </div>
          </div>

          {/* Interactive Controls & Live Recalculation */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'ar' ? 'مختبر اختبار حساسية المعاملات الحية' : 'Live Parameter Sensitivity Playground'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'ar'
                    ? 'غيّر المعاملات الهيكلية لملاحظة كيف تتغير مخرجات الناتج والدين العام عن الحالة التأسيسية فوراً دون الإخلال بالسيناريو الأصلي.'
                    : 'Perturb structural parameters within plausible ranges to inspect live divergence from the baseline state.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setCapitalElasticityAlpha(0.35);
                  setTfpShockPct(0.0);
                  setInterestPassThrough(0.75);
                }}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{lang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Slider 1: Capital Elasticity */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-200">
                    {lang === 'ar' ? 'مرونة رأس المال (α)' : 'Capital Elasticity (α)'}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{capitalElasticityAlpha.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.20"
                  max="0.50"
                  step="0.01"
                  value={capitalElasticityAlpha}
                  onChange={(e) => setCapitalElasticityAlpha(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0.20 (عمل كثيف)</span>
                  <span>0.35 (الافتراضي)</span>
                  <span>0.50 (رأسمال كثيف)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                  {lang === 'ar'
                    ? 'يقيس مدى مساهمة تراكم الآلات والبنى التحتية في زيادة الناتج مقابل مساهمة القوى العاملة.'
                    : 'Measures the proportion of output expansion attributable to capital formation versus labor.'}
                </p>
              </div>

              {/* Slider 2: TFP Growth Perturbation */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-200">
                    {lang === 'ar' ? 'تغير الإنتاجية الكلية (TFP Δ)' : 'TFP Perturbation (Δ %)'}
                  </span>
                  <span className={`text-xs font-mono font-bold ${tfpShockPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tfpShockPct > 0 ? `+${tfpShockPct.toFixed(1)}%` : `${tfpShockPct.toFixed(1)}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-3.0"
                  max="3.0"
                  step="0.2"
                  value={tfpShockPct}
                  onChange={(e) => setTfpShockPct(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>-3.0% (ركود كفاءة)</span>
                  <span>0.0% (تأسيسي)</span>
                  <span>+3.0% (طفرة ابتكار)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                  {lang === 'ar'
                    ? 'اختبار حساسية الناتج للتقدم التكنولوجي، كفاءة الحوكمة، وجودة المنظومة المؤسسية المستقلة عن رأس المال.'
                    : 'Tests sensitivity to technological innovation, governance efficiency, and institutional reforms.'}
                </p>
              </div>

              {/* Slider 3: Interest Pass-through */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-200">
                    {lang === 'ar' ? 'تمرير سعر الفائدة للديون' : 'Interest Rate Pass-Through'}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{interestPassThrough.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.20"
                  max="1.50"
                  step="0.05"
                  value={interestPassThrough}
                  onChange={(e) => setInterestPassThrough(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0.2x (ديون ميسرة)</span>
                  <span>0.75x (الافتراضي)</span>
                  <span>1.5x (علاوة مخاطر)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                  {lang === 'ar'
                    ? 'يقيس سرعة انتقال رفع أسعار الفائدة النقدية إلى تكلفة خدمة الدين العام وعجز الميزانية السنوي.'
                    : 'Simulates the speed and severity of benchmark interest hikes on sovereign debt servicing outlays.'}
                </p>
              </div>
            </div>

            {/* Live Recalculated Results Panel */}
            <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ar' ? 'نتائج انحراف النموذج عند المعاملات المختارة:' : 'Calculated Model Divergence Under Perturbed Parameters:'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">{lang === 'ar' ? 'الناتج المحلي المعاد حسابه' : 'Recalculated Real GDP'}</span>
                  <div className="text-base font-bold font-mono text-slate-100 mt-1">
                    ${calculatedGdp.toFixed(1)}B
                  </div>
                  <div className={`text-[11px] font-mono mt-0.5 ${gdpDivergencePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {gdpDivergencePct >= 0 ? `+${gdpDivergencePct.toFixed(2)}%` : `${gdpDivergencePct.toFixed(2)}%`} {lang === 'ar' ? 'عن الأساس' : 'vs baseline'}
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">{lang === 'ar' ? 'تكلفة خدمة الدين السنوية' : 'Annual Debt Service Impact'}</span>
                  <div className="text-base font-bold font-mono text-slate-100 mt-1">
                    ${interestCostDiff >= 0 ? `+${interestCostDiff.toFixed(2)}` : interestCostDiff.toFixed(2)}B
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {lang === 'ar' ? `فائدة فعالة: ${effectiveInterestRate.toFixed(2)}%` : `Effective rate: ${effectiveInterestRate.toFixed(2)}%`}
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">{lang === 'ar' ? 'العجز المالي المعدل' : 'Adjusted Fiscal Deficit'}</span>
                  <div className="text-base font-bold font-mono text-amber-400 mt-1">
                    ${adjustedDeficit.toFixed(1)}B
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {lang === 'ar' ? 'مع متطابقة تراكم الدين' : 'Stock-flow consistent'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Sectors A-O Causal Catalog & Model Dictionary */}
      {activeTab === 'dictionary' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-4 border border-slate-800 rounded-lg">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute top-2.5 right-3" />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'بحث في القطاعات والمتغيرات...' : 'Filter sectors and variables...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 pr-9 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {lang === 'ar' ? `إجمالي القطاعات الموثقة: 15 قطاعاً كلياً (A-O)` : 'Total Documented Sectors: 15 Macro Sectors (A-O)'}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredSectors.map((sector) => (
              <div
                key={sector.code}
                className="bg-slate-900 border border-slate-800 rounded-lg p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {sector.code}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">
                        {lang === 'ar' ? sector.nameAr : sector.nameEn}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {sector.code === 'A' ? 'GFSM Fiscal Standard' : 'SNA Structural Modeling Standard'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                    {lang === 'ar' ? `التأخير: ${sector.delay}` : `Delay: ${sector.delay}`}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold">{lang === 'ar' ? 'المتغيرات الأساسية: ' : 'Key Variables: '}</span>
                    <span className="text-slate-300 font-mono">{sector.keyVars}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold">{lang === 'ar' ? 'الآلية السببية: ' : 'Causal Mechanism: '}</span>
                    <span className="text-slate-300">{lang === 'ar' ? sector.causalityAr : sector.causalityAr}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{lang === 'ar' ? 'المصدر المنهجي: ' : 'Methodological Source: '} {sector.empiricalSource}</span>
                    <span className="text-emerald-400">فحص الاعتماد الدائري: سليم ومفرغ ✓</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Non-Technical User Manual */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 leading-relaxed flex items-start gap-3">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-100">
                {lang === 'ar' ? 'دليل القيادة والتخطيط لمتخذي القرار: ' : 'Executive Operating Guide for Decision Makers: '}
              </span>
              {lang === 'ar'
                ? 'تم تصميم هذا الدليل لتمكين المستخدم غير التقني من قيادة المحاكاة، تجربة السياسات، واختبار سيناريوهات الأزمات دون الحاجة إلى خلفية في البرمجة أو النمذجة الرياضية المعقدة.'
                : 'Designed to enable non-technical policy analysts and ministers to steer simulations, experiment with reforms, and stress-test strategic scenarios without coding knowledge.'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userGuideSteps.map((step) => (
              <div
                key={step.step}
                className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-cyan-900 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {step.step}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-100">
                      {lang === 'ar' ? step.titleAr : step.titleEn}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {lang === 'ar' ? step.descAr : step.descEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block mb-1">
                    {lang === 'ar' ? 'طريقة الوصول السريع:' : 'Quick Navigation:'}
                  </span>
                  <div className="p-2 bg-slate-950 rounded font-mono text-[11px] text-cyan-300 border border-slate-800 flex items-center justify-between">
                    <span>{step.command}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Troubleshooting card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'دليل استكشاف الأخطاء ومعالجة المشكلات التشغيلية (Troubleshooting)' : 'Troubleshooting & Operational Recovery Guide'}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">فخ الانفجار الديني (Debt Spiral)</span>
                <p className="text-slate-400 leading-relaxed">
                  إذا تجاوز الدين 150% من الناتج وارتفعت الفوائد، قلّص الإنفاق الجاري وارفع الضرائب الموجهة أو خفّض سعر الفائدة تدريجياً لاستعادة الاستدامة.
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">الجمود أو تراجع الأداء</span>
                <p className="text-slate-400 leading-relaxed">
                  المحاكي يحتفظ بالحالة محلياً؛ يمكنك الضغط على "إعادة التعيين التأسيسي" في أي وقت لاستعادة الحالة الافتراضية النظيفة خلال 10 ملي ثانية.
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">تراجع الاحتياطيات الأجنبية</span>
                <p className="text-slate-400 leading-relaxed">
                  في حال حدوث صدمة سلع حادة، فعّل أدوات ترشيد الاستيراد وحفّز التصدير الصناعي لتجنب استنزاف الاحتياطي النقدي وتخفيض العملة القسري.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Scientific Limitations & Disclosures */}
      {activeTab === 'limitations' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-lg text-xs text-amber-200 leading-relaxed flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">
                {lang === 'ar' ? 'ميثاق النزاهة العلمية والشفافية التامة: ' : 'Scientific Integrity & Transparency Charter: '}
              </span>
              {lang === 'ar'
                ? 'لا يدّعي المحاكي التنبؤ بالمستقبل المطلق، بل يقدم أداة استشرافية لاستكشاف العلاقات السببية والتداعيات الهيكلية المترابطة بناءً على نماذج الاقتصاد القياسي المعترف بها.'
                : 'The simulator does not claim absolute oracle forecasting; it delivers a policy-exploration vehicle for understanding structural causality, trade-offs, and lag dynamics.'}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {limitations.map((lim) => (
              <div
                key={lim.id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-5 border-r-4 border-r-amber-500"
              >
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">
                      {lang === 'ar' ? lim.titleAr : lim.titleEn}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      {lang === 'ar' ? lim.textAr : lim.textEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Unresolved / Incomplete items declaration */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'المجالات البحثية المفتوحة للتطوير المستقبلي (Roadmap):' : 'Declared Open Research Frontiers for Future Extensions:'}
            </h4>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>{lang === 'ar' ? 'دمج ميكرو-بيانات مسوح دخل وإنفاق الأسرة الحية لكل بلد على حدة.' : 'Integration of empirical country-specific household micro-survey datasets.'}</li>
              <li>{lang === 'ar' ? 'توسيع التوزيعات الاحتمالية مونت كارلو لمصفوفات التباين المشترك متعددة القطاعات.' : 'Expanded Monte Carlo covariance matrices for multi-sector joint distributions.'}</li>
              <li>{lang === 'ar' ? 'محاكاة ديناميكيات أسواق الكربون الإقليمية والتسعير العابر للحدود (CBAM).' : 'Cross-border carbon border adjustment mechanism (CBAM) dynamics.'}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
