import React, { useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalendarDays, Send } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AvailabilityManager } from '../../components/calendar/AvailabilityManager';
import { MeetingRequestCard } from '../../components/calendar/MeetingRequestCard';
import { useAuth } from '../../context/AuthContext';
import {
  getSlotsForUser,
  addAvailabilitySlot,
  removeAvailabilitySlot,
  getMeetingsForUser,
  getConfirmedMeetingsForUser,
  createMeetingRequest,
  updateMeetingStatus,
} from '../../data/meetings';
import { users } from '../../data/users';

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [recipientId, setRecipientId] = useState('');
  const [topic, setTopic] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const bump = () => setRefreshKey((k) => k + 1);

  const mySlots = useMemo(() => (user ? getSlotsForUser(user.id) : []), [user, refreshKey]);
  const myMeetings = useMemo(() => (user ? getMeetingsForUser(user.id) : []), [user, refreshKey]);
  const confirmedMeetings = useMemo(
    () => (user ? getConfirmedMeetingsForUser(user.id) : []),
    [user, refreshKey]
  );

  const otherUsers = users.filter((u) => u.id !== user?.id);

  if (!user) return null;

  const dateStr = selectedDate.toISOString().split('T')[0];

  const handleAddSlot = (date: string, start: string, end: string) => {
    addAvailabilitySlot(user.id, date, start, end);
    bump();
  };

  const handleRemoveSlot = (slotId: string) => {
    removeAvailabilitySlot(slotId);
    bump();
  };

  const handleRequestMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientId || !topic || !startTime || !endTime) return;
    createMeetingRequest(user.id, recipientId, `manual-${Date.now()}`, dateStr, startTime, endTime, topic);
    setTopic('');
    setStartTime('');
    setEndTime('');
    setRecipientId('');
    bump();
  };

  const meetingsOnSelectedDate = confirmedMeetings.filter((m) => m.date === dateStr);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <CalendarDays className="mr-2" size={24} /> Meeting Scheduler
        </h1>
        <p className="text-gray-600">Manage your availability and meeting requests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Calendar</h2>
          </CardHeader>
          <CardBody>
            <Calendar
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              className="border-0 w-full"
            />
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Confirmed meetings on {dateStr}
              </h3>
              {meetingsOnSelectedDate.length === 0 ? (
                <p className="text-sm text-gray-500">No confirmed meetings on this date.</p>
              ) : (
                <ul className="space-y-1 text-sm text-gray-700">
                  {meetingsOnSelectedDate.map((m) => (
                    <li key={m.id}>
                      {m.startTime}-{m.endTime}: {m.topic}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardBody>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Request a Meeting</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleRequestMeeting} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">With</label>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    required
                  >
                    <option value="">Select a person</option>
                    {otherUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Date"
                  type="date"
                  value={dateStr}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
                <Input label="Start Time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                <Input label="End Time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                <div className="sm:col-span-2">
                  <Input
                    label="Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="What's this meeting about?"
                    fullWidth
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" leftIcon={<Send size={16} />}>
                    Send Meeting Request
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

          <AvailabilityManager slots={mySlots} onAdd={handleAddSlot} onRemove={handleRemoveSlot} />

          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Meeting Requests</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {myMeetings.length === 0 ? (
                <p className="text-sm text-gray-500">No meeting requests yet.</p>
              ) : (
                myMeetings.map((m) => (
                  <MeetingRequestCard
                    key={m.id}
                    request={m}
                    currentUserId={user.id}
                    onAccept={(id) => {
                      updateMeetingStatus(id, 'accepted');
                      bump();
                    }}
                    onDecline={(id) => {
                      updateMeetingStatus(id, 'declined');
                      bump();
                    }}
                  />
                ))
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
