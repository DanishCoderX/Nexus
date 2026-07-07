import React from 'react';
import { Wallet as WalletIcon } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';

interface WalletCardProps {
  balance: number;
}

export const WalletCard: React.FC<WalletCardProps> = ({ balance }) => {
  return (
    <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <CardBody>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm">Wallet Balance</p>
            <h2 className="text-3xl font-bold mt-1">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="p-3 bg-white/10 rounded-full">
            <WalletIcon size={28} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
