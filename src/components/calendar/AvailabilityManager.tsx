import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { AvailabilitySlot } from '../../types';

interface AvailabilityManagerProps {
  slots: AvailabilitySlot[];
  onAdd: (date: string, startTime: string, endTime: string) => void;
  onRemove: (slotId: string) => void;
}

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
  slots,
  onAdd,
  onRemove,
}) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) return;
    onAdd(date, startTime, endTime);
    setDate('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-medium text-gray-900">My Availability</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <Input label="Start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          <Input label="End" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          <Button type="submit" leftIcon={<Plus size={16} />}>
            Add Slot
          </Button>
        </form>

        <div className="space-y-2">
          {slots.length === 0 && (
            <p className="text-sm text-gray-500">No availability slots yet. Add one above.</p>
          )}
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-md"
            >
              <div className="text-sm text-gray-700">
                <span className="font-medium">{slot.date}</span> {slot.startTime} - {slot.endTime}{' '}
                {slot.isBooked && (
                  <span className="ml-2 text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                    Booked
                  </span>
                )}
              </div>
              {!slot.isBooked && (
                <button
                  onClick={() => onRemove(slot.id)}
                  className="text-error-600 hover:text-error-700"
                  aria-label="Remove slot"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
