/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Central Cross-Sector Dependency Registry (Phase 4)
 * سجل الترابطات البينية المركزية بين القطاعات الوطنية والافتراضات والإبطاءات الزمنية
 */

import { CrossSectorDependency, SectorId } from '../types/simulation';

export const CROSS_SECTOR_DEPENDENCIES: CrossSectorDependency[] = [
  // 1. Education & Skills -> Productivity (TFP) [Multi-year delay]
  {
    id: 'DEP_EDU_TO_PRODUCTIVITY',
    sourceSector: 'education_skills',
    targetSector: 'economy_production',
    sourceVar: 'workforceSkillMatchIndex',
    sourceVarNameAr: 'مؤشر مواءمة المهارات وسوق العمل',
    targetVar: 'totalFactorProductivity',
    targetVarNameAr: 'الإنتاجية الكلية لعوامل الإنتاج (TFP)',
    sign: '+',
    formula: 'ΔTFP = α_edu · (SkillMatch_t-3 - 50) / 100',
    timeLagYears: 3,
    elasticity: 0.045,
    rationaleAr: 'تطوير رأس المال البشري والتعليم العالي والتقني يرفع كفاءة العامل والابتكار مع إبطاء زمني هيكلي يتراوح بين 3 إلى 5 سنوات.',
    rationaleEn: 'Skill formation and technical qualifications augment total factor productivity with a structural 3-year transmission lag.',
    conditionsAr: 'مشروط بمرونة سوق العمل وتوفر رأس مال استثماري لاستيعاب الخريجين.',
    conditionsEn: 'Conditioned on labor market absorption capacity and capital deepening.',
    confidence: 'high_empirical',
    isConfigurable: true,
  },

  // 2. Healthcare Access -> Labor Participation & Workforce Capacity
  {
    id: 'DEP_HEALTH_TO_LABOR_PARTICIPATION',
    sourceSector: 'healthcare_health',
    targetSector: 'population_labor',
    sourceVar: 'healthcareAccessCoveragePct',
    sourceVarNameAr: 'نسبة التغطية الصحية وسهولة الوصول',
    targetVar: 'laborParticipationPct',
    targetVarNameAr: 'معدل المشاركة في القوى العاملة',
    sign: '+',
    formula: 'ΔPart = β_health · (Coverage - 75) · 0.08',
    timeLagYears: 1,
    elasticity: 0.035,
    rationaleAr: 'تحسن خدمات الطب الوقائي والرعاية الصحية يقلص أيام الغياب المرضي ويزيد سنوات العمل النشطة للسكان.',
    rationaleEn: 'Broader healthcare access curbs morbidity-induced absenteeism and prolongs productive working lifespan.',
    conditionsAr: 'سارية بشكل خاص على الفئات العمرية فوق 45 سنة.',
    conditionsEn: 'Applies prominently to mature cohorts aged 45+.',
    confidence: 'high_empirical',
    isConfigurable: true,
  },

  // 3. Energy Prices -> Production Costs & Inflation
  {
    id: 'DEP_ENERGY_TO_PRODUCTION_COSTS',
    sourceSector: 'energy_resources',
    targetSector: 'economy_production',
    sourceVar: 'fossilFuelSharePct',
    sourceVarNameAr: 'حصة الوقود الأحفوري في مزيج الطاقة',
    targetVar: 'industrialCapacityUtilizationPct',
    targetVarNameAr: 'معدل استغلال الطاقة الصناعية',
    sign: '-',
    formula: 'CostPush = γ_energy · (FossilShare · CommodityShock) / 100',
    timeLagYears: 0,
    elasticity: 0.065,
    rationaleAr: 'ارتفاع أسعار الوقود الأحفوري يزيد التكاليف المباشرة للمصانع والخدمات اللوجستية ويضغط على هوامش التشغيل والتضخم الفوري.',
    rationaleEn: 'Fossil fuel dependence exposes industries to global price volatility, depressing short-run capacity utilization.',
    conditionsAr: 'يتناسب طردياً مع كثافة الطاقة في الناتج الصناعي.',
    conditionsEn: 'Scales with energy intensity per unit of industrial value-added.',
    confidence: 'high_empirical',
    isConfigurable: true,
  },

  // 4. Water Availability -> Agriculture Output & Food Prices
  {
    id: 'DEP_WATER_TO_AGRICULTURE',
    sourceSector: 'environment_climate',
    targetSector: 'agriculture_food',
    sourceVar: 'freshwaterWithdrawalStressPct',
    sourceVarNameAr: 'مؤشر الإجهاد المائي وسحب المياه العذبة',
    targetVar: 'agriculturalOutputRealUsdB',
    targetVarNameAr: 'الناتج الزراعي الحقيقي',
    sign: '-',
    formula: 'YieldFactor = 1.0 - θ_water · max(0, WaterStress - 65) / 100',
    timeLagYears: 0,
    elasticity: 0.080,
    rationaleAr: 'الإجهاد المائي وشح الري يفرضان قيوداً حاسمة على الإنتاج المحصولي، مما يرفع أسعار الغذاء ويزيد الحاجة للاستيراد.',
    rationaleEn: 'Freshwater withdrawal constraints throttle crop yields, amplifying food price inflation and import dependency.',
    conditionsAr: 'يخفف من حدتها الاستثمار في تقنيات الري الذكي وتحلية المياه.',
    conditionsEn: 'Mitigated by irrigation modernization capex and water recycling.',
    confidence: 'high_empirical',
    isConfigurable: true,
  },

  // 5. Housing Affordability -> Household Disposable Income & Labor Mobility
  {
    id: 'DEP_HOUSING_TO_HOUSEHOLD_INCOME',
    sourceSector: 'housing_infrastructure',
    targetSector: 'economy_production',
    sourceVar: 'housingAffordabilityPriceToIncome',
    sourceVarNameAr: 'مضاعف سعر المسكن إلى الدخل السنوي',
    targetVar: 'smeShareOfOutputPct',
    targetVarNameAr: 'حصة المشروعات الصغيرة والمتوسطة',
    sign: '-',
    formula: 'MobilityFriction = μ_housing · max(0, AffordabilityRatio - 5.0)',
    timeLagYears: 1,
    elasticity: 0.040,
    rationaleAr: 'تفاقم كلفة الإسكان يمتص سيولة الأسر ويعيق تنقل العمالة نحو المراكز الاقتصادية الواعدة ويقلص تأسيس الأعمال الجديدة.',
    rationaleEn: 'Severe housing costs crowd out disposable income and hinder geographic labor mobility towards growth hubs.',
    conditionsAr: 'أكثر حدة في إقليم العاصمة والمدن الكبرى.',
    conditionsEn: 'Particularly acute in metropolitan urban hubs.',
    confidence: 'moderate_empirical',
    isConfigurable: true,
  },

  // 6. Infrastructure Investment -> Construction Demand & Logistics Efficiency
  {
    id: 'DEP_INFRA_TO_LOGISTICS_EFFICIENCY',
    sourceSector: 'housing_infrastructure',
    targetSector: 'economy_production',
    sourceVar: 'constructionCapacityIndex',
    sourceVarNameAr: 'كفاءة البناء والنقل اللوجستي',
    targetVar: 'supplyChainFrictionIndex',
    targetVarNameAr: 'مؤشر اختناق سلاسل التوريد',
    sign: '-',
    formula: 'Friction = max(10, 100 - λ_infra · InfraQuality)',
    timeLagYears: 2,
    elasticity: 0.055,
    rationaleAr: 'توسيع شبكات النقل والموانئ يقلص كلفة الشحن وأوقات الانتظار ويسهل وصول المنتجات إلى الأسواق التصديرية.',
    rationaleEn: 'Transport capex diminishes domestic freight bottlenecks and expedites supply chain delivery times.',
    conditionsAr: 'مشروط بجودة الإشراف والشفافية وتجنب تعثر المشروعات.',
    conditionsEn: 'Dependent on project execution governance and procurement integrity.',
    confidence: 'high_empirical',
    isConfigurable: true,
  },

  // 7. Public Service Quality -> Public Trust in Institutions
  {
    id: 'DEP_SERVICES_TO_PUBLIC_TRUST',
    sourceSector: 'public_admin',
    targetSector: 'politics_opinion',
    sourceVar: 'publicServiceDeliveryScore',
    sourceVarNameAr: 'كفاءة تقديم الخدمات الحكومية',
    targetVar: 'publicTrustInInstitutionsPct',
    targetVarNameAr: 'مستوى الثقة في المؤسسات العامة',
    sign: '+',
    formula: 'Trust = ω_gov · (DeliveryScore · 0.6 + Transparency · 0.4)',
    timeLagYears: 1,
    elasticity: 0.070,
    rationaleAr: 'رضا المواطن عن جودة المرافق العامة والمدارس والمستشفيات يدعم الثقة المؤسسية والقبول المجتمعي لبرامج الإصلاح.',
    rationaleEn: 'Reliable public services foster civic institutional trust and enhance public tolerance for fiscal reforms.',
    conditionsAr: 'يتأثر سلباً بانتشار الفساد أو غياب العدالة التوزيعية.',
    conditionsEn: 'Severely dampened in the presence of perceived corruption or regional disparities.',
    confidence: 'moderate_empirical',
    isConfigurable: true,
  },

  // 8. Trade Disruptions -> Import Vulnerability & Consumer Prices
  {
    id: 'DEP_TRADE_DISRUPTIONS_TO_PRICES',
    sourceSector: 'foreign_trade',
    targetSector: 'economy_production',
    sourceVar: 'criticalImportsVulnerabilityIndex',
    sourceVarNameAr: 'مؤشر هشاشة الواردات الاستراتيجية',
    targetVar: 'capitalGoodsImportSharePct',
    targetVarNameAr: 'حصة السلع الرأسمالية والمدخلات',
    sign: '-',
    formula: 'ImportSupply = 1.0 - ψ_trade · TradeFriction / 100',
    timeLagYears: 0,
    elasticity: 0.060,
    rationaleAr: 'الاحتكاكات الجمركية واضطرابات الملاحة ترفع كلفة المدخلات الوسيطة وتضغط على مخزون السلع الأساسية.',
    rationaleEn: 'Supply chain friction and tariff escalation elevate intermediate input costs, constraining production lines.',
    conditionsAr: 'يزداد الأثر كلما زاد تركز الشركاء التجاريين.',
    conditionsEn: 'Amplified if bilateral trade partner concentration exceeds 40%.',
    confidence: 'high_empirical',
    isConfigurable: true,
  },

  // 9. Environmental Quality -> Long-term Public Health & Economic Costs
  {
    id: 'DEP_ENVIRONMENT_TO_HEALTHCARE',
    sourceSector: 'environment_climate',
    targetSector: 'healthcare_health',
    sourceVar: 'ambientAirQualityIndexAqi',
    sourceVarNameAr: 'مؤشر تلوث الهواء (AQI)',
    targetVar: 'hospitalServicePressureIndex',
    targetVarNameAr: 'مؤشر الضغط على المنظومة الصحية',
    sign: '+',
    formula: 'PressureDelta = ξ_env · max(0, AQI - 50) / 50',
    timeLagYears: 1,
    elasticity: 0.040,
    rationaleAr: 'تلوث الهواء والانبعاثات الصناعية يرفعان معدلات الأمراض التنفسية والقلبية، مما يرفع الإنفاق العلاجي العام.',
    rationaleEn: 'Particulate air pollution accelerates respiratory morbidities, elevating emergency hospital admissions.',
    conditionsAr: 'يتركز الأثر في الأحواض الصناعية والمراكز الحضرية المكتظة.',
    conditionsEn: 'Concentrated around industrial basins and dense urban centers.',
    confidence: 'high_empirical',
    isConfigurable: true,
  },

  // 10. Digital Infrastructure -> Small Business Formation & Administrative Speed
  {
    id: 'DEP_DIGITAL_TO_SME_FORMATION',
    sourceSector: 'digital_cyber',
    targetSector: 'economy_production',
    sourceVar: 'broadbandHighSpeedPenetrationPct',
    sourceVarNameAr: 'نسبة النطاق العريض والرقمنة',
    targetVar: 'businessFormationRatePct',
    targetVarNameAr: 'معدل تأسيس المنشآت الجديدة',
    sign: '+',
    formula: 'Formation = δ_dig · (Broadband - 40) / 60',
    timeLagYears: 1,
    elasticity: 0.050,
    rationaleAr: 'البنية التحتية الرقمية تقلص تكاليف التأسيس وتفتح أسواق التجارة الإلكترونية للمشاريع الصغيرة والمتوسطة.',
    rationaleEn: 'Broadband availability lowers entry barriers, catalyzing digital entrepreneurship and SME growth.',
    conditionsAr: 'مشروط بتوفر تشريعات حماية الملكية الفكرية وسهولة المدفوعات.',
    conditionsEn: 'Conditional upon secure payment gateways and digital property rights.',
    confidence: 'high_empirical',
    isConfigurable: true,
  },
];

/**
 * Retrieves dependencies where the specified sector is either the source or the target
 */
export function getSectorDependencies(sectorId: SectorId): {
  asSource: CrossSectorDependency[];
  asTarget: CrossSectorDependency[];
} {
  return {
    asSource: CROSS_SECTOR_DEPENDENCIES.filter((d) => d.sourceSector === sectorId),
    asTarget: CROSS_SECTOR_DEPENDENCIES.filter((d) => d.targetSector === sectorId),
  };
}
