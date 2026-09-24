export type Dialect = 'modern_standard' | 'gulf' | 'iraqi' | 'egyptian' | 'levantine';

export interface DialectInfo {
  id: Dialect;
  nameAr: string;
  region: string;
  flag: string;
  sampleVoiceText: string;
  accentCharacteristics: string;
}

export type AdType = 'video' | 'static_image';
export type AdStatus = 'draft_script' | 'queued' | 'processing' | 'done' | 'failed';
export type AspectRatio = '9:16' | '1:1' | '16:9';

export interface User {
  id: string;
  name: string;
  email: string;
  preferred_dialect: Dialect;
  plan_id: string;
  created_at: string;
}

export interface CreditWallet {
  id: string;
  user_id: string;
  balance: number;
  updated_at: string;
}

export type TransactionType = 'deduct' | 'add' | 'refund';

export interface CreditTransaction {
  id: string;
  wallet_id: string;
  type: TransactionType;
  amount: number;
  related_ad_id: string | null;
  reason: string;
  created_at: string;
}

export interface BrandKit {
  id: string;
  user_id: string;
  client_name?: string;
  name: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  preferred_voice_id?: string;
}

export interface ScriptText {
  hook: string;
  body: string;
  cta: string;
}

export interface Ad {
  id: string;
  user_id: string;
  brand_kit_id: string | null;
  source_image_url: string;
  product_name: string;
  type: AdType;
  dialect: Dialect;
  script_text: ScriptText;
  status: AdStatus;
  output_url: string | null;
  credits_spent: number;
  aspect_ratio: AspectRatio;
  video_duration_seconds: number;
  created_at: string;
  failure_reason?: string;
  audio_url?: string;
}

export interface GenerationJob {
  id: string;
  ad_id: string;
  provider_used: string;
  attempt_count: number;
  error_message: string | null;
  progress: number;
  current_stage: string;
  started_at: string;
  finished_at?: string;
}

export interface Plan {
  id: string;
  name: string;
  nameAr: string;
  monthly_price: number;
  monthly_credits: number;
  max_video_duration_seconds: number;
  free_tool_usage_cap: number;
  isPopular?: boolean;
  features: string[];
}

export interface Template {
  id: string;
  industry: 'restaurant' | 'clinic' | 'store' | 'real_estate' | 'general';
  nameAr: string;
  description: string;
  script_skeleton: {
    hook: string;
    body: string;
    cta: string;
  };
}

export interface FreeToolsUsage {
  month: string;
  background_removal_count: number;
  upscale_count: number;
}
