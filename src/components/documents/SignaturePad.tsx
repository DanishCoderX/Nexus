import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '../ui/Button';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
  const sigRef = useRef<SignatureCanvas>(null);

  const handleClear = () => sigRef.current?.clear();

  const handleSave = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  return (
    <div className="space-y-3">
      <div className="border border-gray-300 rounded-md bg-white">
        <SignatureCanvas
          ref={sigRef}
          penColor="#1D4ED8"
          canvasProps={{ width: 400, height: 160, className: 'w-full' }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave}>
          Save Signature
        </Button>
      </div>
    </div>
  );
};
