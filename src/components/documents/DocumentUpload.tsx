import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface DocumentUploadProps {
  onUpload: (file: { name: string; type: string; size: string; dataUrl: string }) => void;
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUpload }) => {
  const [isReading, setIsReading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setIsReading(true);
      const reader = new FileReader();
      reader.onload = () => {
        onUpload({
          name: file.name,
          type: file.type.includes('pdf') ? 'PDF' : file.type.split('/')[1]?.toUpperCase() || 'File',
          size: formatSize(file.size),
          dataUrl: reader.result as string,
        });
        setIsReading(false);
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc', '.docx'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud size={32} className="mx-auto text-gray-400 mb-2" />
      <p className="text-sm text-gray-600">
        {isReading ? 'Processing file...' : isDragActive ? 'Drop the file here' : 'Drag & drop a document, or click to browse'}
      </p>
      <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, PNG, JPG</p>
    </div>
  );
};
