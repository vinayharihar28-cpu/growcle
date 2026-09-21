'use client';

import { useState, useEffect } from 'react';
import { getAdminPaymentsData, recordAdminManualPayment } from '../actions/admin-actions';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { 
  CreditCard, 
  IndianRupee, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Receipt,
  Download
} from 'lucide-react';

export function PaymentsManagementView() {
  const [data, setData] = useState<{
    kpis: { totalCollected: number; pending: number; failed: number; outstanding: number };
    payments: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recording, setRecording] = useState(false);

  // New payment form state
  const [memberName, setMemberName] = useState('');
  const [chapterName, setChapterName] = useState('Silicon Valley Founders');
  const [amount, setAmount] = useState('25000');
  const [paymentMethod, setPaymentMethod] = useState('UPI / Bank Transfer');
  const [reference, setReference] = useState('');

  const loadPayments = async () => {
    setLoading(true);
    const res = await getAdminPaymentsData();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !amount) return;
    setRecording(true);
    await recordAdminManualPayment({
      memberName,
      chapterName,
      amount: Number(amount),
      paymentMethod,
      reference: reference || `MANUAL-${Date.now().toString().slice(-6)}`,
    });
    await loadPayments();
    setRecording(false);
    setIsRecordModalOpen(false);
    setMemberName('');
    setReference('');
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const filteredPayments = data.payments.filter((p) =>
    p.member.toLowerCase().includes(search.toLowerCase()) ||
    p.chapter.toLowerCase().includes(search.toLowerCase()) ||
    p.reference.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-500" /> Platform Payments & Revenue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Global monitoring of chapter dues collection, invoice payments, and transaction history.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsRecordModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Record Payment
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Total Collected</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">
            {formatCurrency(data.kpis.totalCollected)}
          </div>
          <span className="text-[10px] text-muted-foreground">Successful settlements</span>
        </div>

        <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Pending Invoices</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">
            {formatCurrency(data.kpis.pending)}
          </div>
          <span className="text-[10px] text-muted-foreground">Awaiting payment verification</span>
        </div>

        <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Failed / Bounced</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600">
            {formatCurrency(data.kpis.failed)}
          </div>
          <span className="text-[10px] text-muted-foreground">Action required</span>
        </div>

        <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Outstanding Dues</span>
            <AlertTriangle className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            {formatCurrency(data.kpis.outstanding)}
          </div>
          <span className="text-[10px] text-muted-foreground">Due this billing cycle</span>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by member, chapter, or reference ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-full border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
              <tr>
                <th className="px-6 py-3.5">Invoice / Ref</th>
                <th className="px-6 py-3.5">Member</th>
                <th className="px-6 py-3.5">Chapter</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No transactions match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-foreground">
                      {p.reference}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {p.member}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {p.chapter}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {p.method}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                      {p.date}
                    </td>
                    <td className="px-6 py-4">
                      {p.status === 'SUCCEEDED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                      )}
                      {p.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {p.status === 'FAILED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                          <XCircle className="w-3 h-3" /> Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-card border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground">Record Manual / Offline Payment</h3>
            <p className="text-xs text-muted-foreground">
              Manually record membership dues or event fee payments settled via cash, check, or direct bank transfer.
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-foreground">Member Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Chapter</label>
                <input
                  type="text"
                  required
                  value={chapterName}
                  onChange={(e) => setChapterName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden mt-1"
                  >
                    <option value="UPI / QR">UPI / QR</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="Cash / Cheque">Cash / Cheque</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Reference / Transaction ID</label>
                <input
                  type="text"
                  placeholder="Optional reference number"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRecordModalOpen(false)}
                  disabled={recording}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={recording}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {recording ? 'Recording...' : 'Save Payment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
