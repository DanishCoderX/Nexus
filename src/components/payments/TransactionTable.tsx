import React from 'react';
import { Badge } from '../ui/Badge';
import { Transaction } from '../../types';
import { findUserById } from '../../data/users';

interface TransactionTableProps {
  transactions: Transaction[];
  currentUserId: string;
}

const typeLabel: Record<Transaction['type'], string> = {
  deposit: 'Deposit',
  withdraw: 'Withdrawal',
  transfer: 'Transfer',
  funding: 'Funding Deal',
};

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, currentUserId }) => {
  if (transactions.length === 0) {
    return <p className="text-sm text-gray-500 py-4">No transactions yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">From</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">To</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((tx) => {
            const sender = findUserById(tx.senderId);
            const receiver = findUserById(tx.receiverId);
            const isOutgoing = tx.senderId === currentUserId && tx.senderId !== tx.receiverId;
            return (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{typeLabel[tx.type]}</td>
                <td className={`px-4 py-3 text-sm font-medium ${isOutgoing ? 'text-error-600' : 'text-success-700'}`}>
                  {isOutgoing ? '-' : '+'}${tx.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{sender?.name || tx.senderId}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{receiver?.name || tx.receiverId}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'error'}
                    size="sm"
                  >
                    {tx.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
