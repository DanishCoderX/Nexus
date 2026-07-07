import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { OtpInput } from '../../components/security/OtpInput';
import { useAuth } from '../../context/AuthContext';

export const TwoFactorPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const redirectTo =
    (location.state as { redirectTo?: string })?.redirectTo ||
    (user?.role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock verification: any 6-digit code is accepted for this demo.
    if (otp.length !== 6) {
      setError('Enter the 6-digit code sent to your device.');
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-primary-600" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Two-Factor Verification</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter the 6-digit code we sent to your registered device (demo: any 6-digit code works).
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleVerify} className="space-y-6">
            <OtpInput value={otp} onChange={setOtp} />
            {error && <p className="text-sm text-error-600 text-center">{error}</p>}
            <Button type="submit" fullWidth>
              Verify & Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
