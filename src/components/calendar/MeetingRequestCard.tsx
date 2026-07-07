import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MeetingRequest } from '../../types';
import { findUserById } from '../../data/users';

interface MeetingRequestCardProps {
  request: MeetingRequest;
  currentUserId: string;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

export const MeetingRequestCard: React.FC<MeetingRequestCardProps> = ({
  request,
  currentUserId,
  onAccept,
  onDecline,
}) => {
  const isIncoming = request.recipientId === currentUserId;
  const otherPartyId = isIncoming ? request.requesterId : request.recipientId;
  const otherParty = findUserById(otherPartyId);
  if (!otherParty) return null;

  const statusVariant =
    request.status === 'pending' ? 'warning' : request.status === 'accepted' ? 'success' : 'error';

  return (
    <Card>
      <CardBody className="flex items-start justify-between">
        <div className="flex items-start">
          <Avatar src={otherParty.avatarUrl} alt={otherParty.name} size="md" className="mr-3" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{otherParty.name}</h3>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Clock size={12} className="mr-1" />
              {request.date} • {request.startTime}-{request.endTime}
            </p>
            <p className="text-sm text-gray-600 mt-2">{request.topic}</p>
          </div>
        </div>
        <Badge variant={statusVariant}>{request.status}</Badge>
      </CardBody>
      {isIncoming && request.status === 'pending' && (
        <CardFooter className="flex justify-end gap-2 bg-gray-50">
          <Button variant="outline" size="sm" leftIcon={<X size={14} />} onClick={() => onDecline?.(request.id)}>
            Decline
          </Button>
          <Button variant="success" size="sm" leftIcon={<Check size={14} />} onClick={() => onAccept?.(request.id)}>
            Accept
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
