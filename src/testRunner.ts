/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Standalone Test Runner Script
 * تشغيل اختبارات القبول الآلية عبر الطرفية (CLI)
 */

import { runAllAutomatedTests } from './simulation/automatedTests';

async function main() {
  console.log('=== Starting Phase 1 Automated Acceptance Tests ===');
  const results = await runAllAutomatedTests();
  let passedCount = 0;

  for (const res of results) {
    const symbol = res.passed ? '✓' : '✗';
    console.log(`[${symbol}] ${res.nameEn} (${res.durationMs}ms)`);
    console.log(`    ${res.messageEn}`);
    if (res.passed) passedCount++;
  }

  console.log(`\nResults: ${passedCount}/${results.length} passed.`);
  if (passedCount !== results.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
