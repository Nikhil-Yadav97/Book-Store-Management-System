import { useEffect, useState, useContext } from "react";
import axiosInstance from "../../utlis/axiosinstance";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext.jsx";
import OwnerNavbar from "./OwnerNavbar";

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

    /* ================= FETCH ALL TRANSACTIONS ================= */
    const loadTransactions = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");
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

    /* ================= DEPOSIT ================= */
    const depositMoney = async () => {
        if (!amount || Number(amount) <= 0) {
            setError("Enter a valid amount");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const res = await axiosInstance.post(`/owner/stores/${storeId}/deposit`, { amount: Number(amount) });

            setAmount("");
            setSuccess(res.data.message || "Deposit successful");
            await loadTransactions(); // refresh list
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                navigate("/login");
                return;
            }
            setError(err.response?.data?.message || "Deposit failed");
        } finally {
            setLoading(false);
        }
    };

    /* ================= WITHDRAW ================= */
    const withdrawMoney = async () => {
        if (!amount || Number(amount) <= 0) {
            setError("Enter a valid amount");
            return;
        }

        // confirm action
        const confirmed = window.confirm(`Confirm withdrawal of ₹${Number(amount)} from store?`);
        if (!confirmed) return;

        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const res = await axiosInstance.post(`/owner/stores/${storeId}/withdraw`, { amount: Number(amount) });

            setAmount("");
            setSuccess(res.data.message || "Withdrawal successful");
            await loadTransactions(); // refresh list
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                navigate("/login");
                return;
            }
            setError(err.response?.data?.message || "Withdraw failed");
        } finally {
            setLoading(false);
        }
    };

    /* ================= INITIAL LOAD & AUTH CHECK ================= */
    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));

    useEffect(() => {
        // wait for user context
        if (!user) return;

        // enforce owner role
        if (user.role !== "Owner") {
            navigate("/dashboard");
            return;
        }

        // basic validation of storeId param
        if (!isValidObjectId(storeId)) {
            setError("Invalid store selected");
            return;
        }

        // if user has a linked store, ensure they access their own store
        if (user.store && String(user.store) !== String(storeId)) {
            setError("Access denied: Not your store");
            return;
        }

        loadTransactions();
    }, [storeId, user]);

    return (
        <>
            <OwnerNavbar />
            <div style={{ maxWidth: "1000px", margin: "auto" }} className="">
                <h2 className="text-center text-2xl font-semibold mt-10 underline"> Store Transaction Dashboard</h2>

                {/* -------- BALANCE & ACTIONS -------- */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                    <div>
                        <h3 className="mt-10">Current Balance: ₹{storeBalance}</h3>
                        <p style={{ marginTop: 10, color: "#0f0f0fff" }}>Total transactions: {transactions.length}</p>
                    </div>

                    <div>
                        <button onClick={loadTransactions} disabled={loading} style={{ marginRight: 8, backgroundColor: "", height: "44px", width: "90px", border: "" }} className="text-white font-semibold rounded-sm bg-red-500 hover:bg-red-700">Refresh</button>
                    </div>
                </div>

                {/* -------- DEPOSIT / WITHDRAW -------- */}
                <div style={{ marginTop: 12, marginBottom: "20px", display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        style={{ height: "35px", backgroundColor: "#4eaac683", width: "250px" }}
                        className="rounded-sm text-center font-medium font-semibold"
                        onChange={(e) => {
                            setAmount(e.target.value);
                            setError("");
                            setSuccess("");
                        }}
                    />
                    <button onClick={depositMoney} style={{ backgroundColor: "#54dd0fff", height: "35px", width: "100px" }} className="font-semibold rounded-sm text-white" disabled={loading}>
                        Deposit
                    </button>
                    <button onClick={withdrawMoney} disabled={loading} style={{ backgroundColor: "#dd0f0fff", height: "35px", width: "100px" }} className="text-white font-semibold rounded-sm">
                        Withdraw
                    </button>
                </div>

                {error && (
                    <div>
                        <p style={{ color: "red" }}>{error}</p>
                        <button onClick={() => navigate('/dashboard')} style={{ marginTop: 8 }}>Go back</button>
                    </div>
                )}
                {success && <p style={{ color: "green" }}>{success}</p>}

                {/* -------- TRANSACTIONS -------- */}
                <h3 className="font-semibold text-2xl mb-7">All Transactions</h3>

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
                        <tbody className="bg-transparent">
                            {transactions.map((tx) => (
                                <tr
                                    key={tx._id}
                                    className="bg-[#e7f0f5ff] shadow-sm"
                                >
                                    <td className="px-4 py-3 rounded-l-md">
                                        {tx.type}
                                    </td>

                                    <td
                                        className="px-4 py-3 font-semibold"
                                        style={{
                                            color: tx.direction === "CREDIT" ? "green" : "red"
                                        }}
                                    >
                                        {tx.direction}
                                    </td>

                                    <td className="px-4 py-3">
                                        ₹{tx.amount}
                                    </td>

                                    <td className="px-4 py-3">
                                        ₹{tx.balanceAfter}
                                    </td>

                                    <td className="px-4 py-3 rounded-r-md">
                                        {new Date(tx.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}
            </div>
        </>
    );
}
