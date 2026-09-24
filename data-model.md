# نموذج البيانات | Data Model

مستخرج من قسم "الكيانات الأساسية" في `spec.md`. كل كيان مستقل بما يكفي ليُبنى ويُختبَر بمعزل (المبدأ السادس بالدستور).

---

## User (المستخدم)
| الحقل | النوع | ملاحظات |
|---|---|---|
| id | UUID | معرّف أساسي |
| name | string | |
| email | string, unique | |
| preferred_dialect | enum | فصحى / خليجي / عراقي / مصري / شامي |
| plan_id | FK → Plan | الباقة الحالية |
| created_at | timestamp | |

**قواعد الصحة:** `email` فريد وإلزامي. `preferred_dialect` له قيمة افتراضية عند التسجيل الأول.

---

## CreditWallet (محفظة الكريدت)
| الحقل | النوع | ملاحظات |
|---|---|---|
| id | UUID | |
| user_id | FK → User | علاقة 1-إلى-1 |
| balance | integer | لا يجوز أن يكون سالبًا |
| updated_at | timestamp | |

### CreditTransaction (حركة كريدت)
| الحقل | النوع | ملاحظات |
|---|---|---|
| id | UUID | |
| wallet_id | FK → CreditWallet | |
| type | enum | خصم / إضافة / استرجاع |
| amount | integer | |
| related_ad_id | FK → Ad, nullable | مرجع العملية التي سببت الحركة |
| created_at | timestamp | |

**قاعدة صارمة (من المبدأ الرابع بالدستور):** لا تُنشأ أي مهمة توليد (Ad) قبل إنشاء `CreditTransaction` من نوع "خصم" ناجحة. فشل خصم الكريدت = رفض فوري للطلب قبل أي استدعاء لمزوّد AI خارجي.

---

## BrandKit (هوية العلامة)
| الحقل | النوع | ملاحظات |
|---|---|---|
| id | UUID | |
| user_id | FK → User | |
| client_name | string, nullable | لدعم متعدد العملاء (باقة الوكالات) |
| logo_url | string | |
| primary_color | string (hex) | |
| secondary_color | string (hex) | |
| preferred_voice_id | FK → VoiceProfile, nullable | |

---

## Ad (الإعلان)
| الحقل | النوع | ملاحظات |
|---|---|---|
| id | UUID | |
| user_id | FK → User | |
| brand_kit_id | FK → BrandKit, nullable | |
| source_image_url | string | الصورة الأصلية المرفوعة |
| type | enum | video / static_image |
| dialect | enum | مطابق لقيم `preferred_dialect` |
| script_text | text | السيناريو المعتمد من المستخدم |
| status | enum | draft_script / queued / processing / done / failed |
| output_url | string, nullable | رابط الملف النهائي |
| credits_spent | integer | |
| created_at | timestamp | |

**انتقالات الحالة المسموحة:** `draft_script → queued → processing → (done | failed)`. لا يُسمح بالقفز المباشر من `draft_script` إلى `done`.

---

## GenerationJob (مهمة المعالجة الخلفية)
| الحقل | النوع | ملاحظات |
|---|---|---|
| id | UUID | |
| ad_id | FK → Ad | |
| provider_used | string | اسم مزوّد AI الفعلي المُستدعى (عبر ai-gateway) |
| attempt_count | integer | |
| error_message | text, nullable | |
| started_at / finished_at | timestamp | |

**علاقة بالمبدأ الثالث (Async-by-Default):** هذا الكيان هو التمثيل الفعلي لحالة الطابور، ويُستعلَم عنه من الواجهة دوريًا أو عبر إشعار عند الاكتمال.

---

## Template (القالب القطاعي)
| الحقل | النوع | ملاحظات |
|---|---|---|
| id | UUID | |
| industry | enum | مطعم / عيادة / متجر / عقار / عام |
| script_skeleton | text | بنية سيناريو جاهزة قابلة للتخصيص |

---

## Plan (الباقة)
| الحقل | النوع | ملاحظات |
|---|---|---|
| id | UUID | |
| name | string | مجانية / أساسية / احترافية / وكالات |
| monthly_price | decimal | |
| monthly_credits | integer | |
| max_video_duration_seconds | integer | حد أقصى لمدة الفيديو ضمن هذه الباقة |
| free_tool_usage_cap | integer | سقف استخدام إزالة الخلفية/تحسين الجودة الشهري |

---

## مخطط العلاقات المختصر (Relationship Summary)

```
User 1─1 CreditWallet 1─N CreditTransaction
User 1─N BrandKit
User 1─N Ad N─1 Plan (عبر User)
Ad 1─1 GenerationJob
BrandKit 1─N Ad (اختياري)
Template — مرجعي، لا علاقة مباشرة بـ Ad إلا عبر script_text المُنسوخ عند الإنشاء
```
