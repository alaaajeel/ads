import { Ad, GenerationJob } from '../../types';

export class ImageGenerationProvider {
  /**
   * Simulates async static image ad generation (Poster, Story, Banner)
   */
  static async startImageGeneration(
    ad: Ad,
    simulateFailure: boolean = false,
    onProgressUpdate?: (job: GenerationJob) => void
  ): Promise<{ success: boolean; outputUrl?: string; error?: string }> {
    const jobId = `job_img_${Date.now()}`;
    const job: GenerationJob = {
      id: jobId,
      ad_id: ad.id,
      provider_used: 'Arabic Marketing Vision Engine',
      attempt_count: 1,
      error_message: null,
      progress: 10,
      current_stage: 'تحديد المقاسات وتنسيق توزيع العناصر البصرية...',
      started_at: new Date().toISOString()
    };

    const stages = [
      { progress: 35, stage: 'تحسين إضاءة المنتج وعزل العناصر الرئيسية...' },
      { progress: 70, stage: 'تصميم التيبوغرافي العربي وإضافة نصوص الهوك والدعوة للإجراء...' },
      { progress: 90, stage: 'تطبيق ألوان الهوية والشعار ومطابقة المنصات...' }
    ];

    for (const step of stages) {
      await new Promise((r) => setTimeout(r, 600));

      if (simulateFailure && step.progress >= 70) {
        job.error_message = 'AI Image Engine Error: عطل مؤقت في سيرفر المعالجة الرسومية';
        job.progress = step.progress;
        job.current_stage = 'فشل التوليد';
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

    job.progress = 100;
    job.current_stage = 'اكتمل توليد الإعلان الصوري!';
    job.finished_at = new Date().toISOString();
    if (onProgressUpdate) onProgressUpdate(job);

    return {
      success: true,
      outputUrl: ad.source_image_url
    };
  }
}
