import { FreeToolsUsage } from '../../types';

export class FreeToolsProvider {
  private static STORAGE_KEY = 'ai_ads_free_tools_usage';

  static getUsage(): FreeToolsUsage {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed: FreeToolsUsage = JSON.parse(stored);
        if (parsed.month === currentMonth) {
          return parsed;
        }
      }
    } catch {}

    const fresh: FreeToolsUsage = {
      month: currentMonth,
      background_removal_count: 0,
      upscale_count: 0
    };
    this.saveUsage(fresh);
    return fresh;
  }

  static saveUsage(usage: FreeToolsUsage): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usage));
    } catch {}
  }

  /**
   * Checks if user has exceeded their free monthly cap.
   * As per FR-007, FR-008 & Scenario 5:
   * Returns clear error + upgrade prompt when cap is reached without blocking other features.
   */
  static checkToolCap(
    toolType: 'background_removal' | 'upscale',
    monthlyCap: number
  ): { allowed: boolean; remaining: number; error?: string } {
    const usage = this.getUsage();
    const used = toolType === 'background_removal' ? usage.background_removal_count : usage.upscale_count;

    if (used >= monthlyCap) {
      const toolName = toolType === 'background_removal' ? 'إزالة الخلفية' : 'تحسين جودة الصورة';
      return {
        allowed: false,
        remaining: 0,
        error: `لقد استنفدت الحد المجاني الشهري لأداة "${toolName}" (${monthlyCap} من ${monthlyCap} عمليات مستخدمة). يمكنك ترقية باقتك للحصول على سقف استخدام أعلى أو الاستمرار في توليد الإعلانات من خلال رصيد الكريدت الخاص بك دون قيود.`
      };
    }

    return {
      allowed: true,
      remaining: monthlyCap - used
    };
  }

  static incrementUsage(toolType: 'background_removal' | 'upscale'): FreeToolsUsage {
    const usage = this.getUsage();
    if (toolType === 'background_removal') {
      usage.background_removal_count += 1;
    } else {
      usage.upscale_count += 1;
    }
    this.saveUsage(usage);
    return usage;
  }
}
