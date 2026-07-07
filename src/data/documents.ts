import { DealDocument, DocumentStatus } from '../types';

export const dealDocuments: DealDocument[] = [
  {
    id: 'doc1',
    name: 'Term Sheet - TechWave AI.pdf',
    type: 'PDF',
    size: '245 KB',
    uploadedAt: '2026-06-20T10:00:00Z',
    ownerId: 'e1',
    sharedWith: ['i1'],
    status: 'In Review',
  },
  {
    id: 'doc2',
    name: 'NDA - GreenLife Solutions.pdf',
    type: 'PDF',
    size: '120 KB',
    uploadedAt: '2026-06-15T10:00:00Z',
    ownerId: 'e2',
    sharedWith: ['i2'],
    status: 'Signed',
    signedBy: 'e2',
    signedAt: '2026-06-16T09:00:00Z',
  },
];

export const getDocumentsForUser = (userId: string): DealDocument[] =>
  dealDocuments
    .filter((d) => d.ownerId === userId || d.sharedWith.includes(userId))
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

export const addDocument = (
  name: string,
  type: string,
  size: string,
  ownerId: string,
  sharedWith: string[] = [],
  fileDataUrl?: string
): DealDocument => {
  const doc: DealDocument = {
    id: `doc${dealDocuments.length + 1}`,
    name,
    type,
    size,
    uploadedAt: new Date().toISOString(),
    ownerId,
    sharedWith,
    status: 'Draft',
    fileDataUrl,
  };
  dealDocuments.push(doc);
  return doc;
};

export const updateDocumentStatus = (
  docId: string,
  status: DocumentStatus
): DealDocument | null => {
  const idx = dealDocuments.findIndex((d) => d.id === docId);
  if (idx === -1) return null;
  dealDocuments[idx] = { ...dealDocuments[idx], status };
  return dealDocuments[idx];
};

export const signDocument = (
  docId: string,
  userId: string,
  signatureDataUrl: string
): DealDocument | null => {
  const idx = dealDocuments.findIndex((d) => d.id === docId);
  if (idx === -1) return null;
  dealDocuments[idx] = {
    ...dealDocuments[idx],
    status: 'Signed',
    signatureDataUrl,
    signedBy: userId,
    signedAt: new Date().toISOString(),
  };
  return dealDocuments[idx];
};
