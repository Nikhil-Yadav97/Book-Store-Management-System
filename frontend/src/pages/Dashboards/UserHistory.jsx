import React, { useContext, useEffect, useState } from 'react'
import UserNavBar from './UserNavBar'
import axiosInstance from '../../utlis/axiosinstance'
import { UserContext } from '../../context/userContext.jsx'
import { GrTransaction } from 'react-icons/gr'

function UserHistory() {
    const { user, logout } = useContext(UserContext);
    const [transactions, setTransactions] = useState([]);
    const [orders, setOrders] = useState([]);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadTransactions = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axiosInstance.get('/users/me/transactions');
            setTransactions(res.data.transactions || []);
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                return;
            }
            setError(err.response?.data?.message || "Unable to load transactions");
        } finally {
            setLoading(false);
        }
    };

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axiosInstance.get('/users/me/orders');
            setOrders(res.data.orders || []);
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                return;
            }
            setError(err.response?.data?.message || "Unable to load orders");
        } finally {
            setLoading(false);
        }
    };

    const depositMoney = async () => {
        if (!amount || Number(amount) <= 0) {
            setError("Enter a valid amount");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const res = await axiosInstance.post('/users/me/deposit', { amount: Number(amount) });
            setAmount("");
            setSuccess(res.data.message || 'Deposit successful');

            // update context user balance
            const newBal = res.data.userBalance;
            const evt = new CustomEvent('userBalanceUpdated', { detail: { balance: newBal } });
            window.dispatchEvent(evt);

            // refresh transactions
            await loadTransactions();
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                return;
            }
            setError(err.response?.data?.message || 'Deposit failed');
        } finally {
            setLoading(false);
        }
    };

    const withdrawMoney = async () => {
        if (!amount || Number(amount) <= 0) {
            setError("Enter a valid amount");
            return;
        }

        const confirmed = window.confirm(`Confirm withdrawal of ₹${Number(amount)} from your account?`);
        if (!confirmed) return;

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const res = await axiosInstance.post('/users/me/withdraw', { amount: Number(amount) });
            setAmount("");
            setSuccess(res.data.message || 'Withdraw successful');

            // update context user balance
            const newBal = res.data.userBalance;
            const evt = new CustomEvent('userBalanceUpdated', { detail: { balance: newBal } });
            window.dispatchEvent(evt);

            // refresh transactions
            await loadTransactions();
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                return;
            }
            setError(err.response?.data?.message || 'Withdraw failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
        loadOrders();
    }, []);

    return (
        <>
            <UserNavBar />
            <div style={{ maxWidth: 1000, margin: 'auto', padding: 20 }}>
                <h2 className="text-center text-2xl font-semibold mt-6 underline">User History & Wallet</h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <div>
                        <h3>Current Balance: ₹{user?.balance ?? 0}</h3>
                        <p style={{ marginTop: 8 }}>Total Transactions: {transactions.length}</p>
                        <p style={{ marginTop: 6 }}>Total Orders: {orders.length}</p>
                    </div>

                    <div>
                        <button onClick={() => { loadTransactions(); loadOrders(); }} disabled={loading} className="text-white font-semibold rounded-sm bg-red-500 hover:bg-red-700 px-4 py-2">Refresh</button>
                    </div>
                </div>

                {/* deposit / withdraw */}
                <div style={{ marginTop: 12, marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        style={{ height: 35, backgroundColor: '#bfeaf7', width: 220 }}
                        className="rounded-sm text-center font-medium font-semibold"
                        onChange={(e) => { setAmount(e.target.value); setError(''); setSuccess(''); }}
                    />
                    <button onClick={depositMoney} className="font-semibold rounded-sm text-white bg-green-500 px-3 py-2" disabled={loading}>Deposit</button>
                    <button onClick={withdrawMoney} className="text-white font-semibold rounded-sm bg-red-500 px-3 py-2" disabled={loading}>Withdraw</button>
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}

                {/* Transactions table */}
                <h3 className="font-semibold text-2xl mb-4 mt-8">Your Transactions</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : transactions.length === 0 ? (
                    <p>No transactions found</p>
                ) : (
                    <table border="1" width="100%" cellPadding="8">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Direction</th>
                                <th>Amount</th>
                                <th>Balance After</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx._id} className="bg-[#e7f0f5ff] shadow-sm">
                                    <td className="px-4 py-3">{tx.type}</td>
                                    <td className="px-4 py-3" style={{ color: tx.direction === 'CREDIT' ? 'green' : 'red' }}><GrTransaction /> {tx.direction}</td>
                                    <td className="px-4 py-3">₹{tx.amount}</td>
                                    <td className="px-4 py-3">₹{tx.balanceAfter}</td>
                                    <td className="px-4 py-3">{new Date(tx.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Orders table */}
                <h3 className="font-semibold text-2xl mb-4 mt-8">Your Orders</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : orders.length === 0 ? (
                    <p>No orders found</p>
                ) : (
                    <table border="1" width="100%" cellPadding="8">
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Store</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o._id} className="bg-white shadow-sm">
                                    <td>{o.book?.title || '—'}</td>
                                    <td>{o.store?.name || '—'}</td>
                                    <td>₹{o.pricePaid}</td>
                                    
                                    <td>{o.status}</td>
                                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
}

export default UserHistory