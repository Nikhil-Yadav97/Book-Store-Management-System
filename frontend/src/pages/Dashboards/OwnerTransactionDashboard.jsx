import { useEffect, useState, useContext } from "react";
import axiosInstance from "../../utlis/axiosinstance";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext.jsx";
import OwnerNavbar from "./OwnerNavbar";
import { GrTransaction } from "react-icons/gr";
import { TbMoneybag, TbArrowUpRight, TbArrowDownLeft, TbRefresh } from "react-icons/tb";

export default function OwnerTransactionDashboard() {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useContext(UserContext);

    const [transactions, setTransactions] = useState([]);
    const [storeBalance, setStoreBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadTransactions = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axiosInstance.get(`/owner/stores/${storeId}/transactions`);
            setTransactions(res.data.transactions);
            setStoreBalance(res.data.storeBalance);
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                navigate("/login");
                return;
            }
            setError(err.response?.data?.message || "Unable to load transactions");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (type) => {
        if (!amount || Number(amount) <= 0) {
            setError("Enter a valid amount");
            return;
        }
        if (type === 'withdraw') {
            const confirmed = window.confirm(`Confirm withdrawal of ₹${Number(amount)}?`);
            if (!confirmed) return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const endpoint = `/owner/stores/${storeId}/${type}`;
            const res = await axiosInstance.post(endpoint, { amount: Number(amount) });
            setAmount("");
            setSuccess(res.data.message || `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful`);
            await loadTransactions();
        } catch (err) {
            setError(err.response?.data?.message || "Transaction failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        if (user.role !== "Owner") { navigate("/dashboard"); return; }
        loadTransactions();
    }, [storeId, user]);

    return (
        <div className="min-h-screen bg-slate-50">
            <OwnerNavbar />
            <div className="max-w-6xl mx-auto p-6">
                
                {/* Header Section */}
                <div className="flex justify-between items-end mb-10 mt-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">Financial Ledger</h1>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] mt-2">Store Cashflow & Transactions</p>
                    </div>
                    <button 
                        onClick={loadTransactions} 
                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-900 rounded-xl font-black text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                        <TbRefresh className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    
                    {/* Balance Card */}
                    <div className="lg:col-span-1 bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <TbMoneybag className="absolute -right-4 -bottom-4 text-9xl opacity-10" />
                        <p className="text-xs font-bold uppercase tracking-widest opacity-60">Current Store Balance</p>
                        <h2 className="text-5xl font-black mt-2">₹{storeBalance.toLocaleString()}</h2>
                        <div className="mt-6 flex gap-4 text-sm font-medium">
                            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/20">
                                {transactions.length} total entries
                            </span>
                        </div>
                    </div>

                    {/* Quick Action Boundary */}
                    <div className="lg:col-span-2 bg-white border border-slate-300 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Cash Adjustment</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">₹</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:bg-white outline-none transition-all font-black text-xl"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => handleAction('deposit')} disabled={loading} className="px-6 py-4 bg-green-500 text-white font-black rounded-2xl shadow-lg shadow-green-100 hover:bg-green-600 active:scale-95 transition-all flex items-center gap-2">
                                    <TbArrowDownLeft className="text-xl" /> Deposit
                                </button>
                                <button onClick={() => handleAction('withdraw')} disabled={loading} className="px-6 py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-100 hover:bg-red-600 active:scale-95 transition-all flex items-center gap-2">
                                    <TbArrowUpRight className="text-xl" /> Withdraw
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-red-600 font-bold text-xs mt-3 ml-1">⚠️ {error}</p>}
                        {success && <p className="text-green-600 font-bold text-xs mt-3 ml-1">✓ {success}</p>}
                    </div>
                </div>

                {/* Transaction Table Boundary */}
                <div className="bg-white border border-slate-300 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-900">Recent Activity</h3>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time sync</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Type</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Direction</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Amount</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Post-Balance</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-900 font-black text-[10px] uppercase border border-slate-200">
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={`flex items-center gap-2 font-black text-xs ${tx.direction === "CREDIT" ? "text-green-600" : "text-red-600"}`}>
                                                {tx.direction === "CREDIT" ? <TbArrowDownLeft className="text-lg" /> : <TbArrowUpRight className="text-lg" />}
                                                {tx.direction}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-slate-900">
                                            ₹{tx.amount.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-5 text-right font-bold text-slate-500">
                                            ₹{tx.balanceAfter.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-5 text-slate-400 text-xs font-medium">
                                            {new Date(tx.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}