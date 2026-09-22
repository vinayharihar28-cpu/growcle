import { db } from "@/shared/lib/db";

/**
 * Generate a structured Chapter Code, e.g., 'SVF-01', 'BNG-02', 'GRC-CH03'
 */
export async function generateChapterCode(organizationId: string, chapterName?: string): Promise<string> {
  let prefix = "CH";
  if (chapterName && chapterName.trim().length > 0) {
    const words = chapterName.trim().split(/\s+/);
    if (words.length >= 2) {
      prefix = words.map(w => w[0].toUpperCase()).slice(0, 3).join("");
    } else {
      prefix = chapterName.trim().substring(0, 3).toUpperCase();
    }
  }

  // Count existing chapters in this org
  const count = await db.chapter.count({
    where: { organizationId },
  });

  const nextSeq = String(count + 1).padStart(2, "0");
  const candidate = `${prefix}-${nextSeq}`;

  // Check if exists, if so increment
  const existing = await db.chapter.findFirst({
    where: { organizationId, chapterCode: candidate },
  });

  if (existing) {
    return `${prefix}-${String(count + 2).padStart(2, "0")}`;
  }

  return candidate;
}

/**
 * Generate a structured Member ID (membershipNumber)
 * Format: GRC-{CHAPTER_CODE}-{YYYY}-{4-digit-seq}
 * Example: GRC-SVF01-2026-0001
 */
export async function generateMemberId(chapterId?: string | null): Promise<string> {
  const year = new Date().getFullYear();
  let chapterCode = "GEN";

  if (chapterId) {
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId },
      select: { chapterCode: true, name: true },
    });

    if (chapter?.chapterCode) {
      chapterCode = chapter.chapterCode.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    } else if (chapter?.name) {
      chapterCode = chapter.name.substring(0, 4).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    }
  }

  // Count members in this chapter (or overall if no chapter)
  const count = await db.member.count({
    where: chapterId ? { chapterId } : {},
  });

  const sequence = String(count + 1).padStart(4, "0");
  const memberCode = `GRC-${chapterCode}-${year}-${sequence}`;

  // Verify uniqueness
  const existing = await db.member.findFirst({
    where: { membershipNumber: memberCode },
  });

  if (existing) {
    const fallbackSeq = String(count + 2).padStart(4, "0");
    return `GRC-${chapterCode}-${year}-${fallbackSeq}`;
  }

  return memberCode;
}
