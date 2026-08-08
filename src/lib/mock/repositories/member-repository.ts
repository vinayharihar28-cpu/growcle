import { AdminMember, AdminStats } from '@/types/admin';
import { MOCK_MEMBERS, MOCK_STATS, MOCK_ROLES } from '../mock-store';

/**
 * MemberRepository
 * Abstracted async data repository for member management.
 */
export class MemberRepository {
  private static members: AdminMember[] = [...MOCK_MEMBERS];

  static async findAll(query?: { search?: string; chapterId?: string; roleCode?: string }): Promise<AdminMember[]> {
    await new Promise((resolve) => setTimeout(resolve, 150)); // Simulate async latency

    let result = [...this.members];

    if (query?.search) {
      const s = query.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.firstName.toLowerCase().includes(s) ||
          m.lastName.toLowerCase().includes(s) ||
          m.email.toLowerCase().includes(s) ||
          m.businessName?.toLowerCase().includes(s) ||
          m.industry?.toLowerCase().includes(s)
      );
    }

    if (query?.chapterId) {
      result = result.filter((m) => m.chapterId === query.chapterId);
    }

    if (query?.roleCode) {
      result = result.filter((m) => m.roleCode === query.roleCode);
    }

    return result;
  }

  static async findById(id: string): Promise<AdminMember | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.members.find((m) => m.id === id) || null;
  }

  static async create(data: Omit<AdminMember, 'id' | 'joinedDate' | 'status'>): Promise<AdminMember> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const roleDef = MOCK_ROLES.find((r) => r.code === data.roleCode);

    const newMember: AdminMember = {
      ...data,
      id: `mem-${Date.now()}`,
      roleName: roleDef?.name || data.roleCode,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    this.members.unshift(newMember);
    return newMember;
  }

  static async update(id: string, updates: Partial<AdminMember>): Promise<AdminMember> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const idx = this.members.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Member not found');

    if (updates.roleCode) {
      const roleDef = MOCK_ROLES.find((r) => r.code === updates.roleCode);
      if (roleDef) updates.roleName = roleDef.name;
    }

    this.members[idx] = { ...this.members[idx], ...updates };
    return this.members[idx];
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const initialLen = this.members.length;
    this.members = this.members.filter((m) => m.id !== id);
    return this.members.length < initialLen;
  }

  static async getStats(): Promise<AdminStats> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      ...MOCK_STATS,
      totalMembers: this.members.length,
    };
  }
}
