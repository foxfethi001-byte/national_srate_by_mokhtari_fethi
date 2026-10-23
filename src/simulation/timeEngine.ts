/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Discrete Time Engine
 * محرك التوقيت والتحكم في الخطوات الزمنية والتسارع والمحطات المرجعية
 */

import { SimulatedDate, TimeStepUnit } from '../types/simulation';

export interface TimeEngineOptions {
  startDate: SimulatedDate;
  timeStep: TimeStepUnit;
  speedMultiplier?: number;
  maxHorizonYears?: number;
}

export class TimeEngine {
  private currentDate: SimulatedDate;
  private timeStep: TimeStepUnit;
  private isRunning: boolean = false;
  private speedMultiplier: number = 1;
  private maxYear: number;
  private timerId: number | null = null;
  private onStepCallback: ((newDate: SimulatedDate) => void) | null = null;

  constructor(options: TimeEngineOptions) {
    this.currentDate = { ...options.startDate };
    this.timeStep = options.timeStep;
    this.speedMultiplier = options.speedMultiplier || 1;
    this.maxYear = this.currentDate.year + (options.maxHorizonYears || 30);
  }

  public getCurrentDate(): SimulatedDate {
    return { ...this.currentDate };
  }

  public getTimeStep(): TimeStepUnit {
    return this.timeStep;
  }

  public setTimeStep(step: TimeStepUnit): void {
    this.timeStep = step;
    if (step === 'quarterly' && !this.currentDate.quarter) {
      this.currentDate.quarter = 1;
    }
  }

  public getSpeed(): number {
    return this.speedMultiplier;
  }

  public setSpeed(multiplier: number): void {
    this.speedMultiplier = Math.max(1, Math.min(multiplier, 10));
    if (this.isRunning) {
      this.pause();
      this.start();
    }
  }

  public isActive(): boolean {
    return this.isRunning;
  }

  public setOnStepCallback(cb: (newDate: SimulatedDate) => void): void {
    this.onStepCallback = cb;
  }

  /**
   * Advances the date by exactly one discrete step
   */
  public advanceOneStep(): SimulatedDate {
    if (this.currentDate.year >= this.maxYear) {
      this.pause();
      return { ...this.currentDate };
    }

    if (this.timeStep === 'quarterly') {
      const currentQuarter = this.currentDate.quarter || 1;
      if (currentQuarter < 4) {
        this.currentDate = {
          year: this.currentDate.year,
          quarter: (currentQuarter + 1) as 1 | 2 | 3 | 4,
        };
      } else {
        this.currentDate = {
          year: this.currentDate.year + 1,
          quarter: 1,
        };
      }
    } else {
      // Annual step
      this.currentDate = {
        year: this.currentDate.year + 1,
      };
    }

    if (this.onStepCallback) {
      this.onStepCallback({ ...this.currentDate });
    }

    return { ...this.currentDate };
  }

  /**
   * Starts simulation continuous clock
   */
  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    const baseIntervalMs = this.timeStep === 'quarterly' ? 600 : 1200;
    const intervalMs = Math.max(200, Math.round(baseIntervalMs / this.speedMultiplier));

    this.timerId = window.setInterval(() => {
      if (this.currentDate.year >= this.maxYear) {
        this.pause();
        return;
      }
      this.advanceOneStep();
    }, intervalMs);
  }

  /**
   * Pauses simulation continuous clock
   */
  public pause(): void {
    this.isRunning = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Resets date to initial state
   */
  public resetTo(date: SimulatedDate): void {
    this.pause();
    this.currentDate = { ...date };
  }

  /**
   * Advances a given date by one time step (pure static helper)
   */
  public static advanceDate(date: SimulatedDate, timeStep: TimeStepUnit): SimulatedDate {
    if (timeStep === 'quarterly') {
      const q = date.quarter || 1;
      if (q < 4) {
        return { year: date.year, quarter: (q + 1) as 1 | 2 | 3 | 4 };
      }
      return { year: date.year + 1, quarter: 1 };
    }
    return { year: date.year + 1 };
  }

  /**
   * Format date for display in Arabic & English
   */
  public static formatDate(date: SimulatedDate, lang: 'ar' | 'en'): string {
    if (date.quarter) {
      return lang === 'ar'
        ? `الربع ${date.quarter}، ${date.year}`
        : `Q${date.quarter} ${date.year}`;
    }
    return `${date.year}`;
  }
}
