import { AvailabilitySlot, MeetingRequest, MeetingStatus } from '../types';

export const availabilitySlots: AvailabilitySlot[] = [
  { id: 'slot1', userId: 'e1', date: '2026-07-08', startTime: '10:00', endTime: '10:30', isBooked: true },
  { id: 'slot2', userId: 'e1', date: '2026-07-08', startTime: '14:00', endTime: '14:30', isBooked: false },
  { id: 'slot3', userId: 'i1', date: '2026-07-09', startTime: '11:00', endTime: '11:30', isBooked: false },
];

export const meetingRequests: MeetingRequest[] = [
  {
    id: 'meet1',
    requesterId: 'i1',
    recipientId: 'e1',
    slotId: 'slot1',
    date: '2026-07-08',
    startTime: '10:00',
    endTime: '10:30',
    topic: 'Discuss Series A terms for TechWave AI',
    status: 'accepted',
    createdAt: '2026-07-01T09:00:00Z',
  },
];

export const getSlotsForUser = (userId: string): AvailabilitySlot[] =>
  availabilitySlots
    .filter((s) => s.userId === userId)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

export const addAvailabilitySlot = (
  userId: string,
  date: string,
  startTime: string,
  endTime: string
): AvailabilitySlot => {
  const slot: AvailabilitySlot = {
    id: `slot${availabilitySlots.length + 1}`,
    userId,
    date,
    startTime,
    endTime,
    isBooked: false,
  };
  availabilitySlots.push(slot);
  return slot;
};

export const removeAvailabilitySlot = (slotId: string): boolean => {
  const idx = availabilitySlots.findIndex((s) => s.id === slotId);
  if (idx === -1) return false;
  availabilitySlots.splice(idx, 1);
  return true;
};

export const getMeetingsForUser = (userId: string): MeetingRequest[] =>
  meetingRequests
    .filter((m) => m.requesterId === userId || m.recipientId === userId)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

export const getConfirmedMeetingsForUser = (userId: string): MeetingRequest[] =>
  getMeetingsForUser(userId).filter((m) => m.status === 'accepted');

export const createMeetingRequest = (
  requesterId: string,
  recipientId: string,
  slotId: string,
  date: string,
  startTime: string,
  endTime: string,
  topic: string
): MeetingRequest => {
  const request: MeetingRequest = {
    id: `meet${meetingRequests.length + 1}`,
    requesterId,
    recipientId,
    slotId,
    date,
    startTime,
    endTime,
    topic,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  meetingRequests.push(request);
  return request;
};

export const updateMeetingStatus = (
  meetingId: string,
  status: MeetingStatus
): MeetingRequest | null => {
  const idx = meetingRequests.findIndex((m) => m.id === meetingId);
  if (idx === -1) return null;
  meetingRequests[idx] = { ...meetingRequests[idx], status };
  if (status === 'accepted') {
    const slot = availabilitySlots.find((s) => s.id === meetingRequests[idx].slotId);
    if (slot) slot.isBooked = true;
  }
  return meetingRequests[idx];
};
