import { z } from 'zod';

export const draftSchema = z.object({
  // Allows empty object to create bare draft
}).strict();

export const updateSurpriseSchema = z.object({
  occasion: z.enum(['FRIENDSHIP_DAY', 'BIRTHDAY', 'ANNIVERSARY', 'VALENTINES_DAY', 'CUSTOM']).optional(),
  customOccasion: z.string().max(40).optional().nullable(),
  recipientNickname: z.enum(['BESTIE', 'YAAR', 'DOST', 'BRO', 'SIS', 'BEST_FRIEND', 'OTHER']).optional(),
  customNickname: z.string().max(30).optional().nullable(),
  senderName: z.string().max(40).optional(),
  message: z.string().max(600).optional(),
  polaroidCaption: z.string().max(120).optional().nullable(),
  musicType: z.enum(['NONE', 'YOUTUBE', 'UPLOAD']).optional(),
  youtubeUrl: z.string().url().regex(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/).optional().nullable(),
}).strict().superRefine((data, ctx) => {
  if (data.occasion === 'CUSTOM' && !data.customOccasion) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "customOccasion is required when occasion is CUSTOM", path: ['customOccasion'] });
  }
  if (data.occasion !== 'CUSTOM' && data.customOccasion) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "customOccasion must be absent when occasion is not CUSTOM", path: ['customOccasion'] });
  }
  
  if (data.recipientNickname === 'OTHER' && !data.customNickname) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "customNickname is required when recipientNickname is OTHER", path: ['customNickname'] });
  }
  if (data.recipientNickname !== 'OTHER' && data.customNickname) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "customNickname must be absent when recipientNickname is not OTHER", path: ['customNickname'] });
  }

  if (data.musicType === 'YOUTUBE' && !data.youtubeUrl) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "youtubeUrl is required when musicType is YOUTUBE", path: ['youtubeUrl'] });
  }
});

export const publishSurpriseSchema = z.object({
  editToken: z.string(),
  userInfo: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10)
  }).optional()
}).strict();

export const reportSurpriseSchema = z.object({
  reason: z.string().max(300),
}).strict();

export const contactSchema = z.object({
  name: z.string().max(80),
  email: z.string().email().max(120),
  subject: z.string().max(140),
  message: z.string().max(2000),
  honeypot: z.string().max(0).optional(), // Honeypot field must be empty
}).strict();
