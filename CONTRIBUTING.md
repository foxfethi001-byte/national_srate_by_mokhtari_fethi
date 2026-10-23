# Contributing to the National State Simulator

Thank you for your interest in contributing to the **National State Simulator (محاكي الدولة الوطنية)**.

This project is a transparent, reproducible, mathematically rigorous policy laboratory designed to evaluate macroeconomic, social, resource, and governance trade-offs.

---

## 🏛 Core Architectural Principles

1. **Zero Black-Box Assertions:**
   Every relationship between a policy parameter and a simulated indicator must be explicitly declared, mathematically formulated, and bound by physical and accounting identities.
2. **Conservation Laws & Accounting Invariants:**
   - Budget Identity: $\text{Total Outlays} - \text{Total Revenues} = \text{Overall Deficit}$
   - Debt Accumulation: $\text{Debt}_t = \text{Debt}_{t-1} + \text{Deficit}_t$
   - Demographic Balance: $\sum \text{Cohorts} = \text{Total Population}$
   PRs that break any of these identities will be rejected.
3. **Epistemic Neutrality (No AI Moralizing):**
   The simulator models *consequences, constraints, and trade-offs*, not political endorsements. It must never award automatic bonus points for policies considered "socially desirable" without modeling their budget, resource, and labor opportunity costs.
4. **Bilingual Requirement (العربية / English):**
   All user-facing variables, descriptions, conflict explanations, and warnings must provide high-quality Arabic (RTL) and English (LTR) text.

---

## 🛠 Development Workflow

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### Setup
```bash
git clone https://github.com/your-username/national-state-simulator.git
cd national-state-simulator
npm install
npm run dev
```

### Verification Commands
Before submitting a Pull Request, run the full verification pipeline:
```bash
# 1. Typecheck and linting
npm run lint

# 2. Automated test suites & accounting invariants
npm test

# 3. Adversarial audit tests
npx tsx -e 'import { runAdversarialAudit } from "./src/simulation/adversarialAudit"; const res = runAdversarialAudit(); console.log(res);'

# 4. Production build check
npm run build
```

---

## 📝 Pull Request Checklist
- [ ] Code adheres to TypeScript strict typing (`npm run lint` passes with 0 errors).
- [ ] All 9 acceptance test suites in `npm test` pass.
- [ ] All 10 adversarial audit tests pass.
- [ ] Any new indicator has units, documentation, and a corresponding causal link in `src/simulation/causalGraph.ts`.
- [ ] Arabic terminology is verified for technical precision and correct RTL layout rendering.
