import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '../ui/Button';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
  const sigRef = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(400);

  // Match the canvas's internal drawing resolution to its actual displayed
  // width. Without this, a fixed width stretched via CSS causes touch/mouse
  // coordinates to misalign with the drawn strokes on narrower screens.
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleClear = () => sigRef.current?.clear();

  const handleSave = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="border border-gray-300 rounded-md bg-white">
        <SignatureCanvas
          ref={sigRef}
          penColor="#1D4ED8"
          canvasProps={{ width: canvasWidth, height: 160 }}
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
