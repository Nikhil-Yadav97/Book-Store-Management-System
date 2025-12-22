import React, {
  useContext,
  useState,
  useMemo,
  useEffect
} from "react";
import { UserContext } from "../../context/userContext";
import UserNavBar from "./UserNavBar";
import axiosInstance from "../../utlis/axiosinstance";

export default function Profile() {
  const { user, logout, updateUser } = useContext(UserContext);

  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [view, setView] = useState("profile"); // profile | orders | orderDetail | transactions
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  /* =========================
     LOAD STATS ON PAGE LOAD
  ========================= */
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const [ordersRes, txRes] = await Promise.all([
          axiosInstance.get("/users/me/orders"),
          axiosInstance.get("/users/me/transactions"),
        ]);

        setOrders(ordersRes.data.orders || []);
        setTransactions(txRes.data.transactions || []);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          return;
        }
        setError("Unable to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [logout]);

  /* =========================
     BUTTON HANDLERS
  ========================= */

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get("/users/me/orders");
      setOrders(res.data.orders || []);
      setView("orders");
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        return;
      }
      setError("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get("/users/me/transactions");
      setTransactions(res.data.transactions || []);
      setView("transactions");
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        return;
      }
      setError("Unable to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setView("orderDetail");
  };

  const backToList = () => {
    setSelectedOrder(null);
    setView("orders");
  };

  /* =========================
     DERIVED DATA
  ========================= */

  const amountSpent = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.pricePaid || 0), 0);
  }, [orders]);

  

  return (
    <>
      <UserNavBar />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto">

          {/* PROFILE HEADER */}
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700">
                {user?.role}
              </span>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <StatCard title="Total Orders" value={orders.length} />
            <StatCard title="Amount Spent" value={`₹${amountSpent.toFixed(2)}`} />
            <StatCard title="Transactions" value={transactions.length} />
          </div>

          {/* ACCOUNT DETAILS */}
          <div className="bg-white rounded-xl shadow p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Account Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <Detail label="Full Name" value={user?.name} />
              <Detail label="Email Address" value={user?.email} />
              <Detail label="Role" value={user?.role} />
              <Detail
                label="Joined On"
                value={user?.createdAt
                  ? new Date(user.createdAt).toDateString()
                  : "-"}
              />
            </div>

            {success && <p className="text-sm text-green-600 mt-3">{success}</p>}
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-4 mt-6">
            <ActionButton label="My Orders" onClick={loadOrders} />
            <ActionButton label="Transaction History" onClick={loadTransactions} />
            
            <ActionButton label="Logout" danger onClick={logout} />
          </div>

         

          {/* VIEWS */}
          <div className="mt-6">
            {loading && (
              <div className="bg-white rounded-xl shadow p-6 text-center">
                Loading...
              </div>
            )}

            {!loading && view === "orders" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h4 className="font-semibold mb-4">My Orders</h4>
                <OrdersList orders={orders} onView={openOrderDetail} />
              </div>
            )}

            {!loading && view === "orderDetail" && selectedOrder && (
              <div className="bg-white rounded-xl shadow p-6">
                <button
                  className="text-sm text-indigo-600 mb-4"
                  onClick={backToList}
                >
                  ← Back to Orders
                </button>
                <OrderDetail order={selectedOrder} />
              </div>
            )}

            {!loading && view === "transactions" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h4 className="font-semibold mb-4">Transaction History</h4>
                <TransactionsList transactions={transactions} />
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

/* =========================
   REUSABLE COMPONENTS
========================= */

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-6 text-center">
    <p className="text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold mt-2">{value}</h3>
  </div>
);

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const ActionButton = ({ label, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-lg font-medium transition ${
      danger
        ? "bg-red-500 text-white hover:bg-red-600"
        : "bg-indigo-600 text-white hover:bg-indigo-700"
    }`}
  >
    {label}
  </button>
);

/* OrdersList, OrderDetail, TransactionsList
   remain exactly the same as your existing code */


const OrdersList = ({ orders, onView }) => {
  if (!orders || orders.length === 0) return <div className="text-gray-500">No orders yet.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="p-2">Order ID</th>
            <th className="p-2">Book</th>
            <th className="p-2">Store</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-t">
              <td className="p-2 text-sm">{o._id}</td>
              <td className="p-2 text-sm">{o.book?.title || "-"}</td>
              <td className="p-2 text-sm">{o.store?.name || "-"}</td>
              <td className="p-2 text-sm">${(o.pricePaid || 0).toFixed(2)}</td>
              <td className="p-2 text-sm">{o.status}</td>
              <td className="p-2 text-sm">{new Date(o.createdAt).toLocaleString()}</td>
              <td className="p-2 text-sm"><button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={() => onView(o)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const OrderDetail = ({ order }) => {
  return (
    <div>
      <h5 className="text-xl font-semibold">Order Details</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
        <div>
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-medium">{order._id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium">{order.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Book</p>
          <p className="font-medium">{order.book?.title} — {order.book?.author}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Sold By</p>
          <p className="font-medium">{order.store?.name} — {order.store?.location}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Amount Paid</p>
          <p className="font-medium">${(order.pricePaid || 0).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Margin Earned</p>
          <p className="font-medium">${(order.marginEarned || 0).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Ordered On</p>
          <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

const TransactionsList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return <div className="text-gray-500">No transactions yet.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="p-2">Date</th>
            <th className="p-2">Type</th>
            <th className="p-2">Direction</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Balance After</th>
            <th className="p-2">Reference</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} className="border-t">
              <td className="p-2 text-sm">{new Date(t.createdAt).toLocaleString()}</td>
              <td className="p-2 text-sm">{t.type}</td>
              <td className="p-2 text-sm">{t.direction}</td>
              <td className="p-2 text-sm">${(t.amount || 0).toFixed(2)}</td>
              <td className="p-2 text-sm">${(t.balanceAfter || 0).toFixed(2)}</td>
              <td className="p-2 text-sm">{t.reference?.orderId || t.reference?.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
