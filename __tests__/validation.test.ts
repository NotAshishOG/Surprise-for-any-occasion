import { describe, it, expect } from 'vitest';
import { updateSurpriseSchema } from '@/lib/validation';

describe('Validation Schemas', () => {
  describe('updateSurpriseSchema', () => {
    it('should validate a valid update payload', () => {
      const payload = {
        occasion: 'FRIENDSHIP_DAY',
        recipientNickname: 'BESTIE',
        senderName: 'Alice',
        message: 'You are the best!',
      };
      
      const result = updateSurpriseSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should require customOccasion when occasion is CUSTOM', () => {
      const payload = {
        occasion: 'CUSTOM',
        // missing customOccasion
      };
      
      const result = updateSurpriseSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('customOccasion is required when occasion is CUSTOM');
      }
    });

    it('should reject customOccasion when occasion is not CUSTOM', () => {
      const payload = {
        occasion: 'BIRTHDAY',
        customOccasion: 'Oops',
      };
      
      const result = updateSurpriseSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('customOccasion must be absent when occasion is not CUSTOM');
      }
    });

    it('should require youtubeUrl when musicType is YOUTUBE', () => {
      const payload = {
        musicType: 'YOUTUBE',
      };
      
      const result = updateSurpriseSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('youtubeUrl is required when musicType is YOUTUBE');
      }
    });
  });
});
