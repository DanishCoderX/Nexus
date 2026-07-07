import { Transaction, TransactionType, Wallet } from '../types';

export const wallets: Wallet[] = [
  { userId: 'e1', balance: 15000 },
  { userId: 'e2', balance: 8200 },
  { userId: 'e3', balance: 4200 },
  { userId: 'e4', balance: 6100 },
  { userId: 'i1', balance: 250000 },
  { userId: 'i2', balance: 480000 },
  { userId: 'i3', balance: 310000 },
];

export const transactions: Transaction[] = [
  {
    id: 'tx1',
    type: 'funding',
    amount: 50000,
    senderId: 'i1',
    receiverId: 'e1',
    status: 'completed',
    note: 'Seed follow-on for TechWave AI',
    createdAt: '2026-06-10T10:00:00Z',
  },
  {
    id: 'tx2',
    type: 'deposit',
    amount: 20000,
    senderId: 'i2',
    receiverId: 'i2',
    status: 'completed',
    note: 'Wallet top-up',
    createdAt: '2026-06-01T10:00:00Z',
  },
];

export const getWallet = (userId: string): Wallet => {
  let wallet = wallets.find((w) => w.userId === userId);
  if (!wallet) {
    wallet = { userId, balance: 0 };
    wallets.push(wallet);
  }
  return wallet;
};

export const getTransactionsForUser = (userId: string): Transaction[] =>
  transactions
    .filter((t) => t.senderId === userId || t.receiverId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const createTransaction = (
  type: TransactionType,
  amount: number,
  senderId: string,
  receiverId: string,
  note?: string
): Transaction => {
  const tx: Transaction = {
    id: `tx${transactions.length + 1}`,
    type,
    amount,
    senderId,
    receiverId,
    status: 'completed',
    note,
    createdAt: new Date().toISOString(),
  };
  transactions.push(tx);
  return tx;
};

export const deposit = (userId: string, amount: number): Transaction => {
  const wallet = getWallet(userId);
  wallet.balance += amount;
  return createTransaction('deposit', amount, userId, userId, 'Wallet deposit');
};

export const withdraw = (userId: string, amount: number): Transaction | null => {
  const wallet = getWallet(userId);
  if (wallet.balance < amount) return null;
  wallet.balance -= amount;
  return createTransaction('withdraw', amount, userId, userId, 'Wallet withdrawal');
};

export const transfer = (
  senderId: string,
  receiverId: string,
  amount: number,
  note?: string
): Transaction | null => {
  const senderWallet = getWallet(senderId);
  if (senderWallet.balance < amount) return null;
  const receiverWallet = getWallet(receiverId);
  senderWallet.balance -= amount;
  receiverWallet.balance += amount;
  return createTransaction('transfer', amount, senderId, receiverId, note);
};

export const createFundingDeal = (
  investorId: string,
  entrepreneurId: string,
  amount: number,
  dealNote: string
): Transaction | null => {
  return transfer(investorId, entrepreneurId, amount, dealNote || 'Funding deal');
};
