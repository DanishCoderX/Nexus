import React, { useMemo, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Repeat, Handshake } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { WalletCard } from '../../components/payments/WalletCard';
import { TransactionTable } from '../../components/payments/TransactionTable';
import { useAuth } from '../../context/AuthContext';
import { getWallet, getTransactionsForUser, deposit, withdraw, transfer, createFundingDeal } from '../../data/transactions';
import { users } from '../../data/users';

type ActiveForm = 'deposit' | 'withdraw' | 'transfer' | 'funding' | null;

export const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const [amount, setAmount] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const bump = () => setRefreshKey((k) => k + 1);
  const wallet = useMemo(() => (user ? getWallet(user.id) : { userId: '', balance: 0 }), [user, refreshKey]);
  const txs = useMemo(() => (user ? getTransactionsForUser(user.id) : []), [user, refreshKey]);
  const otherUsers = users.filter((u) => u.id !== user?.id);

  if (!user) return null;

  const resetForm = () => {
    setAmount('');
    setTargetUserId('');
    setNote('');
    setActiveForm(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setMessage({ type: 'error', text: 'Enter a valid amount.' });
      return;
    }

    if (activeForm === 'deposit') {
      deposit(user.id, amt);
      setMessage({ type: 'success', text: `Deposited $${amt.toLocaleString()}.` });
    } else if (activeForm === 'withdraw') {
      const result = withdraw(user.id, amt);
      if (!result) {
        setMessage({ type: 'error', text: 'Insufficient balance.' });
        return;
      }
      setMessage({ type: 'success', text: `Withdrew $${amt.toLocaleString()}.` });
    } else if (activeForm === 'transfer') {
      if (!targetUserId) {
        setMessage({ type: 'error', text: 'Select a recipient.' });
        return;
      }
      const result = transfer(user.id, targetUserId, amt, note);
      if (!result) {
        setMessage({ type: 'error', text: 'Insufficient balance.' });
        return;
      }
      setMessage({ type: 'success', text: `Transferred $${amt.toLocaleString()}.` });
    } else if (activeForm === 'funding') {
      if (!targetUserId) {
        setMessage({ type: 'error', text: 'Select an entrepreneur to fund.' });
        return;
      }
      const result = createFundingDeal(user.id, targetUserId, amt, note);
      if (!result) {
        setMessage({ type: 'error', text: 'Insufficient balance for this funding deal.' });
        return;
      }
      setMessage({ type: 'success', text: `Funding deal of $${amt.toLocaleString()} created.` });
    }

    resetForm();
    bump();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">Manage your wallet, transfers, and funding deals (simulated)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <WalletCard balance={wallet.balance} />

          <Card>
            <CardBody className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowDownCircle size={16} />}
                onClick={() => {
                  setActiveForm('deposit');
                  setMessage(null);
                }}
              >
                Deposit
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowUpCircle size={16} />}
                onClick={() => {
                  setActiveForm('withdraw');
                  setMessage(null);
                }}
              >
                Withdraw
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Repeat size={16} />}
                onClick={() => {
                  setActiveForm('transfer');
                  setMessage(null);
                }}
              >
                Transfer
              </Button>
              {user.role === 'investor' && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Handshake size={16} />}
                  onClick={() => {
                    setActiveForm('funding');
                    setMessage(null);
                  }}
                >
                  Fund Deal
                </Button>
              )}
            </CardBody>
          </Card>

          {activeForm && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900 capitalize">
                  {activeForm === 'funding' ? 'Fund a Deal' : activeForm}
                </h2>
              </CardHeader>
              <CardBody>
                {message && (
                  <div
                    className={`mb-3 text-sm px-3 py-2 rounded-md ${
                      message.type === 'success' ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'
                    }`}
                  >
                    {message.text}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Amount (USD)"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    fullWidth
                    required
                  />

                  {(activeForm === 'transfer' || activeForm === 'funding') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {activeForm === 'funding' ? 'Entrepreneur' : 'Recipient'}
                      </label>
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={targetUserId}
                        onChange={(e) => setTargetUserId(e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        {(activeForm === 'funding' ? otherUsers.filter((u) => u.role === 'entrepreneur') : otherUsers).map(
                          (u) => (
                            <option key={u.id} value={u.id}>
                              {u.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}

                  {(activeForm === 'transfer' || activeForm === 'funding') && (
                    <Input label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} fullWidth />
                  )}

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Confirm</Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
            </CardHeader>
            <CardBody>
              <TransactionTable transactions={txs} currentUserId={user.id} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
