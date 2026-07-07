import React from 'react';
import { useParams } from 'react-router-dom';
import { Video } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { VideoCallUI } from '../../components/video/VideoCallUI';
import { ChatUserList } from '../../components/chat/ChatUserList';
import { useAuth } from '../../context/AuthContext';
import { findUserById } from '../../data/users';
import { getConversationsForUser } from '../../data/messages';

export const VideoCallPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  if (!user) return null;

  const partner = userId ? findUserById(userId) : null;
  const conversations = getConversationsForUser(user.id);

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 animate-fade-in">
      <div className="hidden md:block w-1/4 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <ChatUserList conversations={conversations} linkPrefix="/video-call" />
      </div>

      <div className="flex-1">
        {partner ? (
          <VideoCallUI partnerName={partner.name} partnerAvatar={partner.avatarUrl} />
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardBody className="text-center">
              <Video size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-medium text-gray-700">Select a contact to start a video call</h2>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};