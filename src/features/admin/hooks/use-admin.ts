'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminService } from '../services/admin-service';
import { AdminMember, AdminMeeting, AttendanceRecord, AdminStats } from '@/types/admin';

export function useAdmin() {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [meetings, setMeetings] = useState<AdminMeeting[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [membersData, meetingsData, statsData] = await Promise.all([
        AdminService.getMembers({ search: searchQuery }),
        AdminService.getMeetings(),
        AdminService.getAdminStats(),
      ]);

      setMembers(membersData);
      setMeetings(meetingsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addMember = async (data: Omit<AdminMember, 'id' | 'joinedDate' | 'status'>) => {
    const newMember = await AdminService.createMember(data);
    await fetchAll();
    return newMember;
  };

  const updateMemberStatus = async (id: string, status: 'ACTIVE' | 'PENDING' | 'SUSPENDED') => {
    await AdminService.updateMember(id, { status });
    await fetchAll();
  };

  const deleteMember = async (id: string) => {
    await AdminService.deleteMember(id);
    await fetchAll();
  };

  const scheduleMeeting = async (data: Omit<AdminMeeting, 'id' | 'status' | 'presentCount' | 'absentCount' | 'visitorCount'>) => {
    const newMeeting = await AdminService.createMeeting(data);
    await fetchAll();
    return newMeeting;
  };

  const updateMeetingStatus = async (id: string, status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED') => {
    await AdminService.updateMeetingStatus(id, status);
    await fetchAll();
  };

  return {
    members,
    meetings,
    stats,
    loading,
    searchQuery,
    setSearchQuery,
    refresh: fetchAll,
    addMember,
    updateMemberStatus,
    deleteMember,
    scheduleMeeting,
    updateMeetingStatus,
  };
}
