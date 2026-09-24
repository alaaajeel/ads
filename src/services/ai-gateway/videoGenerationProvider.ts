import { Ad, GenerationJob } from '../../types';

export class VideoGenerationProvider {
  /**
   * Simulates async video generation via primary AI provider (Higgsfield / Kling adapter).
   * Supports simulation of provider errors to test automatic credit refund (FR-014).
   */
  static async startVideoGeneration(
    ad: Ad,
    simulateFailure: boolean = false,
    onProgressUpdate?: (job: GenerationJob) => void
  ): Promise<{ success: boolean; outputUrl?: string; error?: string }> {
    const jobId = `job_${Date.now()}`;
    const job: GenerationJob = {
      id: jobId,
      ad_id: ad.id,
      provider_used: 'Higgsfield AI Video Adapter (v2.4 Arabized)',
      attempt_count: 1,
      error_message: null,
      progress: 5,
      current_stage: 'تهيئة مساحة العمل واستلام مدخلات الإعلان...',
      started_at: new Date().toISOString()
    };

    const stages = [
      { progress: 20, stage: 'تحليل تكوين الصورة وعزل طبقات المنتج ثلاثية الأبعاد...' },
      { progress: 40, stage: 'توليد الحركة السينمائية وضبط زوايا الكاميرا (Camera Motion)...' },
      { progress: 65, stage: 'توليد التعليق الصوتي باللهجة المحددة ومطابقة مخارج الحروف...' },
      { progress: 85, stage: 'تركيب النصوص العربية المتحركة ومزامنة الصوت مع المشاهد...' },
      { progress: 95, stage: 'معالجة الألوان النهائية وتصدير الفيديو بدقة عالية...' }
    ];

    for (const step of stages) {
      await new Promise((r) => setTimeout(r, 800));
      
      // If simulateFailure is triggered at 65% (TTS or Video engine error)
      if (simulateFailure && step.progress >= 65) {
        job.error_message = 'AI Provider Timeout: خطأ غير متوقع من مزوّد توليد الفيديو الخارجي (Higgsfield API 504 Gateway Timeout)';
        job.progress = step.progress;
        job.current_stage = 'فشل المعالجة من المزوّد الخارجي';
        job.finished_at = new Date().toISOString();
        if (onProgressUpdate) onProgressUpdate(job);
        
        return {
          success: false,
          error: job.error_message
        };
      }

      job.progress = step.progress;
      job.current_stage = step.stage;
      if (onProgressUpdate) onProgressUpdate(job);
    }

    // Success output
    job.progress = 100;
    job.current_stage = 'اكتمل توليد الفيديو بنجاح!';
    job.finished_at = new Date().toISOString();
    if (onProgressUpdate) onProgressUpdate(job);

    return {
      success: true,
      outputUrl: ad.source_image_url
    };
  }
}
