import { z } from 'zod';

export const MemberCreateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  chapterId: z.string().optional(),
});

export const ReferralCreateSchema = z.object({
  fromMemberId: z.string().uuid(),
  toMemberId: z.string().uuid(),
  chapterId: z.string().uuid(),
  referralName: z.string().min(1),
  referralEmail: z.string().email().optional(),
  referralPhone: z.string().optional(),
  notes: z.string().optional(),
});

export const PaginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().nullable().optional(),
});
