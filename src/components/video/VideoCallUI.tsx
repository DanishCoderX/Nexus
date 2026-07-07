import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, Phone } from 'lucide-react';
import { Button } from '../ui/Button';

interface VideoCallUIProps {
  partnerName: string;
  partnerAvatar: string;
}

export const VideoCallUI: React.FC<VideoCallUIProps> = ({ partnerName, partnerAvatar }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Attach the captured stream to the <video> element only once it has
  // actually mounted (i.e. after inCall flips to true). Doing this inline
  // inside startCall() is too early — the ref is still null at that point.
  useEffect(() => {
    if (inCall && streamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = streamRef.current;
    }
  }, [inCall]);

  const startCall = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setInCall(true);
    } catch (err) {
      setError(
        'Camera/microphone access was denied or unavailable. This is a frontend mock — the call UI still works without live media.'
      );
      setInCall(true);
    }
  };

  const endCall = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setInCall(false);
    setIsSharing(false);
  };

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    setMicOn((v) => !v);
  };

  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !camOn));
    setCamOn((v) => !v);
  };

  const toggleShare = async () => {
    if (!isSharing) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = displayStream;
        }
        setIsSharing(true);
        displayStream.getVideoTracks()[0].onended = () => {
          setIsSharing(false);
          if (localVideoRef.current && streamRef.current) {
            localVideoRef.current.srcObject = streamRef.current;
          }
        };
      } catch {
        setError('Screen share was cancelled or is unavailable.');
      }
    } else {
      if (localVideoRef.current && streamRef.current) {
        localVideoRef.current.srcObject = streamRef.current;
      }
      setIsSharing(false);
    }
  };

  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    []
  );

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden relative h-[600px] flex flex-col">
      <div className="flex-1 relative flex items-center justify-center bg-gray-800">
        {inCall ? (
          <div className="text-center">
            <img
              src={partnerAvatar}
              alt={partnerName}
              className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
            />
            <p className="text-white font-medium">{partnerName}</p>
            <p className="text-gray-400 text-sm mt-1">Connected • Mock remote stream</p>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <Phone size={48} className="mx-auto mb-3" />
            <p>Ready to call {partnerName}</p>
          </div>
        )}

        {inCall && (
          <div className="absolute bottom-4 right-4 w-40 h-28 bg-black rounded-md overflow-hidden border-2 border-gray-700">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {error && <div className="bg-warning-50 text-warning-700 text-xs px-4 py-2">{error}</div>}

      <div className="bg-gray-900 border-t border-gray-800 p-4 flex justify-center gap-3">
        {!inCall ? (
          <Button leftIcon={<Phone size={18} />} onClick={startCall}>
            Start Call
          </Button>
        ) : (
          <>
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full ${micOn ? 'bg-gray-700 text-white' : 'bg-error-600 text-white'}`}
              aria-label="Toggle microphone"
            >
              {micOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button
              onClick={toggleCam}
              className={`p-3 rounded-full ${camOn ? 'bg-gray-700 text-white' : 'bg-error-600 text-white'}`}
              aria-label="Toggle camera"
            >
              {camOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
            <button
              onClick={toggleShare}
              className={`p-3 rounded-full ${isSharing ? 'bg-primary-600 text-white' : 'bg-gray-700 text-white'}`}
              aria-label="Toggle screen share"
            >
              <ScreenShare size={18} />
            </button>
            <button onClick={endCall} className="p-3 rounded-full bg-error-600 text-white" aria-label="End call">
              <PhoneOff size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};