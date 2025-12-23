import React, { useContext, useEffect, useState } from 'react';
import UserNavBar from './UserNavBar';
import axiosInstance from '../../utlis/axiosinstance';
import { UserContext } from '../../context/userContext.jsx';
import { LuWallet, LuArrowUpRight, LuArrowDownLeft, LuRefreshCw, LuShoppingBag, LuHistory } from 'react-icons/lu';

function UserHistory() {
    const { user, logout } = useContext(UserContext);
    const [transactions, setTransactions] = useState([]);
    const [orders, setOrders] = useState([]);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const [txRes, orderRes] = await Promise.all([
                axiosInstance.get('/users/me/transactions'),
                axiosInstance.get('/users/me/orders')
            ]);
            setTransactions(txRes.data.transactions || []);
            setOrders(orderRes.data.orders || []);
        } catch (err) {
            if (err.response?.status === 401) logout();
            setError("Failed to sync data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleWalletAction = async (type) => {
        if (!amount || Number(amount) <= 0) return setError("Enter a valid amount");
        if (type === 'withdraw' && !window.confirm(`Confirm withdrawal of ₹${amount}?`)) return;

        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const endpoint = type === 'deposit' ? '/users/me/deposit' : '/users/me/withdraw';
            const res = await axiosInstance.post(endpoint, { amount: Number(amount) });
            
            setAmount("");
            setSuccess(res.data.message);
            window.dispatchEvent(new CustomEvent('userBalanceUpdated', { detail: { balance: res.data.userBalance } }));
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || "Transaction failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <UserNavBar />
            
            <main className="max-w-6xl mx-auto p-6">
                {/* Header & Stats */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Financial Overview</h1>
                        <p className="text-slate-500">Manage your wallet and view order history</p>
                    </div>
                    <button 
                        onClick={fetchData} 
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all text-slate-600 font-medium"
                    >
                        <LuRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Wallet Card & Actions */}
                    <div className="space-y-6">
                        <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-1">Available Balance</p>
                                <h2 className="text-5xl font-bold mb-6 italic">₹{user?.balance?.toLocaleString() ?? 0}</h2>
                                <div className="flex gap-4 text-xs text-indigo-100 font-medium">
                                    <span>{orders.length} Orders</span>
                                    <span>•</span>
                                    <span>{transactions.length} Transactions</span>
                                </div>
                            </div>
                            <LuWallet className="absolute -bottom-4 -right-4 text-white opacity-10 size-32" />
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4">Quick Transfer</h3>
                            <div className="space-y-4">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => handleWalletAction('deposit')}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold transition-all shadow-md shadow-emerald-100"
                                    >
                                        Deposit
                                    </button>
                                    <button 
                                        onClick={() => handleWalletAction('withdraw')}
                                        className="bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold transition-all shadow-md shadow-slate-200"
                                    >
                                        Withdraw
                                    </button>
                                </div>
                                {error && <p className="text-red-500 text-xs font-medium bg-red-50 text-center py-2 rounded-lg">{error}</p>}
                                {success && <p className="text-emerald-600 text-xs font-medium bg-emerald-50 text-center py-2 rounded-lg">{success}</p>}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Activity Tabs */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Transactions Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><LuHistory /></div>
                                <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Activity</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Amount</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Balance After</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {transactions.slice(0, 5).map((tx) => (
                                                <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {tx.direction === 'CREDIT' ? 
                                                                <LuArrowDownLeft className="text-emerald-500 bg-emerald-50 rounded-full p-1 size-6" /> : 
                                                                <LuArrowUpRight className="text-red-500 bg-red-50 rounded-full p-1 size-6" />
                                                            }
                                                            <div>
                                                                <p className="font-bold text-slate-700 text-sm">{tx.type}</p>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{tx.direction}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={`px-6 py-4 font-bold text-sm ${tx.direction === 'CREDIT' ? 'text-emerald-600' : 'text-slate-700'}`}>
                                                        {tx.direction === 'CREDIT' ? '+' : '-'}₹{tx.amount}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-slate-500 text-sm">₹{tx.balanceAfter}</td>
                                                    <td className="px-6 py-4 text-slate-400 text-xs">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        {/* Orders Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><LuShoppingBag /></div>
                                <h3 className="text-xl font-bold text-slate-800">Recent Orders</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {orders.length === 0 ? (
                                    <div className="col-span-2 text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-medium">No orders found</div>
                                ) : orders.slice(0, 4).map((o) => (
                                    <div key={o._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="max-w-[150px]">
                                                <h4 className="font-bold text-slate-800 truncate">{o.book?.title || 'Unknown Book'}</h4>
                                                <p className="text-xs text-slate-400 truncate">{o.store?.name}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-widest">
                                                {o.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end border-t border-slate-50 pt-3">
                                            <p className="text-lg font-black text-slate-900">₹{o.pricePaid}</p>
                                            <p className="text-[10px] text-slate-400 font-medium italic">{new Date(o.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
}

export default UserHistory;