import { DialectInfo, Plan, Template, BrandKit, User, Ad } from '../types';

export const DIALECTS: DialectInfo[] = [
  {
    id: 'modern_standard',
    nameAr: 'العربية الفصحى (سرد سينمائي)',
    region: 'العالم العربي',
    flag: '🌍',
    sampleVoiceText: 'اكتشف الفرق الحقيقي، جودة لا مثيل لها تلبي تطلعاتك اليوم.',
    accentCharacteristics: 'نبرة فخمة ورسمية، تناسب المنتجات الفاخرة والخدمات الطبية والتقنية.'
  },
  {
    id: 'gulf',
    nameAr: 'اللهجة الخليجية (سعودي/إماراتي)',
    region: 'الخليج العربي',
    flag: '🇸🇦',
    sampleVoiceText: 'شيء فاخر من الآخر! لا يفوتك العرض الحين واطلب قبل ما يخلص.',
    accentCharacteristics: 'حيوية وقريبة من القلب، ممتازة للعطور والمطاعم والمتاجر الإلكترونية.'
  },
  {
    id: 'iraqi',
    nameAr: 'اللهجة العراقية',
    region: 'العراق',
    flag: '🇮🇶',
    sampleVoiceText: 'طعم ورتابة ما صايرة! دلل نفسك وطلبك يوصلك لباب البيت بأسرع وقت.',
    accentCharacteristics: 'دافئة ومؤثرة وذات شعبية هائلة على منصات تيك توك وريلز.'
  },
  {
    id: 'egyptian',
    nameAr: 'اللهجة المصرية',
    region: 'مصر',
    flag: '🇪🇬',
    sampleVoiceText: 'الحق العرض الجامد ده قبل ما يطير! جودة أصلية وسعر ميتعوضش خالص.',
    accentCharacteristics: 'إيقاع سريع وجذاب، أعلى نسب تحويل في إعلانات السوشيال ميديا.'
  },
  {
    id: 'levantine',
    nameAr: 'اللهجة الشامية (سوري/لبناني)',
    region: 'بلاد الشام',
    flag: '🇱🇧',
    sampleVoiceText: 'شي بياخد العقل وما إلو مثيل! طلبك هلق بكبسة زر وبأفضل سعر.',
    accentCharacteristics: 'راقية ولطيفة، مفضلة للأزياء ومستحضرات التجميل والأطعمة الفاخرة.'
  }
];

export const PLANS: Plan[] = [
  {
    id: 'plan_free',
    name: 'Free Trial',
    nameAr: 'الباقة التجريبية (مجانية)',
    monthly_price: 0,
    monthly_credits: 15,
    max_video_duration_seconds: 15,
    free_tool_usage_cap: 5,
    features: [
      '15 كريدت تجريبي مجاني عند التسجيل',
      'توليد إعلانات صورية وفيديوهات حتى 15 ثانية',
      '5 عمليات إزالة خلفية وتحسين جودة مجاناً شهرياً',
      'جميع اللهجات العربية الأساسية',
      'تحميل بجودة عالية (720p)'
    ]
  },
  {
    id: 'plan_basic',
    name: 'Basic',
    nameAr: 'الباقة الأساسية',
    monthly_price: 29,
    monthly_credits: 100,
    max_video_duration_seconds: 30,
    free_tool_usage_cap: 30,
    features: [
      '100 كريدت شهرياً (تكفي ~20 فيديو إعلاني)',
      'فيديوهات تصل لـ 30 ثانية',
      '30 عملية مجانية للأدوات الذكية شهرياً',
      'حفظ هوية علامة تجارية واحدة (Brand Kit)',
      'تنزيل بجودة Full HD 1080p بدون علامة مائية'
    ]
  },
  {
    id: 'plan_pro',
    name: 'Professional',
    nameAr: 'الباقة الاحترافية (الأكثر طلباً)',
    monthly_price: 79,
    monthly_credits: 350,
    max_video_duration_seconds: 60,
    free_tool_usage_cap: 100,
    isPopular: true,
    features: [
      '350 كريدت شهرياً (~70 فيديو أو 170 صورة)',
      'فيديوهات طويلة حتى 60 ثانية',
      '100 عملية مجانية للأدوات الذكية شهرياً',
      'توليد متزامن عالي السرعة (أولوية في الطابور)',
      'حفظ 5 هويات علامات تجارية مختلفة',
      'تصدير بثلاث مقاسات تلقائياً (9:16, 1:1, 16:9)'
    ]
  },
  {
    id: 'plan_agencies',
    name: 'Agencies',
    nameAr: 'باقة الوكالات والشركات',
    monthly_price: 199,
    monthly_credits: 1200,
    max_video_duration_seconds: 90,
    free_tool_usage_cap: 500,
    features: [
      '1200 كريدت شهرياً مع إمكانية شحن فوري بخصم',
      'إدارة غير محدودة لملفات عملاء متعددين (Multi-Brand Kits)',
      '500 عملية إزالة خلفية وتحسين دقة 4K فائقة',
      'وصول مباشر لـ API المنصة',
      'دعم مخصص على مدار الساعة وتصدير 4K UHD'
    ]
  }
];

export const TEMPLATES: Template[] = [
  {
    id: 'tmpl_restaurant',
    industry: 'restaurant',
    nameAr: 'مطاعم وكافيهات',
    description: 'تركيز على فتح الشهية، سرعة التوصيل وعروض الوجبات.',
    script_skeleton: {
      hook: 'جوعان ومحتار شتاكل هسا؟ الطعم اللي يدخل القلب وصل!',
      body: 'وجبتنا الطازة معمولة بحب ومكونات ولا غلطة، مقرمشة ولذيذة من أول لقمة.',
      cta: 'اطلب الحين من التطبيق واستفيد من التوصيل السريع!'
    }
  },
  {
    id: 'tmpl_store',
    industry: 'store',
    nameAr: 'متاجر إلكترونية ومنتجات',
    description: 'إبراز المظهر الفاخر والمواصفات وحل المشكلة للمشتري.',
    script_skeleton: {
      hook: 'تعبت تدور على منتج يجمع بين الأناقة والجودة العالية وسعر معقول؟',
      body: 'جبنالك الحل الأصلي اللي غير تجربة آلاف العملاء بتصميمه العصري والعملي.',
      cta: 'الكمية محدودة! اطلب الآن مع ضمان استرجاع وخصم 20% لفترة قصيرة.'
    }
  },
  {
    id: 'tmpl_clinic',
    industry: 'clinic',
    nameAr: 'عيادات ومراكز تجميل وصحة',
    description: 'نبرة طمأنينة، خبرة طبية ورعاية حقيقية للعميل.',
    script_skeleton: {
      hook: 'ابتسامتك وصحتك تستاهل اهتمام من أطباء وخبراء تثق فيهم.',
      body: 'بأحدث الأجهزة وبأعلى معايير التعقيم، بنقدملك تجربة علاجية وتجميلية مريحة جداً.',
      cta: 'احجز استشارتك المجانية اليوم وابدأ رحلة التغيير معنا.'
    }
  },
  {
    id: 'tmpl_real_estate',
    industry: 'real_estate',
    nameAr: 'عقارات ومشاريع استثمارية',
    description: 'فخامة الموقع، فرصة العائد الاستثماري وحياة الرفاهية.',
    script_skeleton: {
      hook: 'فرصة سكنية واستثمارية نادرة بأرقى موقع ما تتفوت!',
      body: 'مساحات متنوعة وتشطيب فندقي مع خطط سداد ميسرة وعائد استثماري مضمون.',
      cta: 'تواصل معنا الآن عبر واتساب لمعاينة الوحدات المتبقية.'
    }
  }
];

export const DEMO_PRODUCTS = [
  {
    name: 'عطر مسك ملكي فاخر',
    category: 'عطور ومستحضرات',
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    suggestedHook: 'ثبات يدوم لأيام وفخامة تلفت الأنظار من أول رشة!',
    suggestedBody: 'مزيج استثنائي من العود الملكي ونفحات المسك الأبيض النقي، صُمم خصيصاً لأصحاب الذوق الرفيع.',
    suggestedCta: 'اطلبه اليوم واحصل على شحن مجاني ودفع عند الاستلام.'
  },
  {
    name: 'برغر كلاسيك مشوي على اللهب',
    category: 'مطاعم وأغذية',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    suggestedHook: 'ريحة الشوي والصوص السري بتخليك ما تقاوم!',
    suggestedBody: 'لحم بقري بلدي 100% طازة يومياً مع جبنة ذائبة وخضار مقرمش وخبز البريوش الهش.',
    suggestedCta: 'حمّل التطبيق واطلب هسا واستمتع بأقوى وجبة بالمدينة.'
  },
  {
    name: 'ساعة يد ذكية مقاومة للماء',
    category: 'إلكترونيات وتقنية',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    suggestedHook: 'تابع لياقتك وإشعاراتك بلمسة واحدة وشاشة AMOLED فائقة الوضوح!',
    suggestedBody: 'بطارية تدوم 14 يوماً متواصلة مع مراقبة دقيقة لنبضات القلب ومقاومة كاملة للماء حتى عمق 50 متر.',
    suggestedCta: 'اشتريها الآن مع كفالة سنتين واستبدال فوري.'
  },
  {
    name: 'بن قهوة مختصة كولومبي',
    category: 'كافيهات ومشروبات',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    suggestedHook: 'صباحك يبدأ صح مع نكهة البن الكولومبي الفاخر وإيحاءات الشوكولاتة والكراميل.',
    suggestedBody: 'حبات بن منتقاة بعناية ومحمصة طازة بأعلى درجات الاحترافية لتضمنلك فنجان اسبريسو ومقطرة مثالي.',
    suggestedCta: 'اطلب بوكس التذوق الخاص بخصم 15% للطلب الأول.'
  }
];

export const INITIAL_USER: User = {
  id: 'usr_mvp_demo_01',
  name: 'أحمد التميمي',
  email: 'dhi9886@gmail.com',
  preferred_dialect: 'gulf',
  plan_id: 'plan_free',
  created_at: new Date().toISOString()
};

export const INITIAL_BRAND_KITS: BrandKit[] = [
  {
    id: 'bk_default',
    user_id: 'usr_mvp_demo_01',
    name: 'علامتي الأساسية',
    client_name: 'متجر دار النخبة',
    logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80',
    primary_color: '#f59e0b',
    secondary_color: '#0f172a',
    preferred_voice_id: 'gulf_voice_male'
  },
  {
    id: 'bk_client_agency',
    user_id: 'usr_mvp_demo_01',
    name: 'عميل: كافيه أصالة',
    client_name: 'كافيه أصالة بغداد (عميل وكالة)',
    logo_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80',
    primary_color: '#10b981',
    secondary_color: '#1e293b',
    preferred_voice_id: 'iraqi_voice_deep'
  }
];

export const INITIAL_ADS: Ad[] = [
  {
    id: 'ad_demo_sample_01',
    user_id: 'usr_mvp_demo_01',
    brand_kit_id: 'bk_default',
    product_name: 'عطر مسك ملكي فاخر',
    source_image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    type: 'video',
    dialect: 'gulf',
    script_text: {
      hook: 'ثبات يدوم لأيام وفخامة تلفت الأنظار من أول رشة!',
      body: 'مزيج استثنائي من العود الملكي ونفحات المسك الأبيض النقي، صُمم خصيصاً لأصحاب الذوق الرفيع.',
      cta: 'اطلبه اليوم واحصل على شحن مجاني ودفع عند الاستلام.'
    },
    status: 'done',
    output_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    credits_spent: 5,
    aspect_ratio: '9:16',
    video_duration_seconds: 15,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'ad_demo_sample_02',
    user_id: 'usr_mvp_demo_01',
    brand_kit_id: 'bk_client_agency',
    product_name: 'برغر كلاسيك مشوي على اللهب',
    source_image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    type: 'static_image',
    dialect: 'iraqi',
    script_text: {
      hook: 'طعم ورتابة ما صايرة! دلال ما ينوصف.',
      body: 'وجبتنا الطازة معمولة بحب ومكونات بلدي 100% لتستمتع بأحلى تجربة طعام.',
      cta: 'اطلب هسه من التطبيق ويوصلك بأسرع وقت لباب البيت.'
    },
    status: 'done',
    output_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    credits_spent: 2,
    aspect_ratio: '1:1',
    video_duration_seconds: 0,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];
