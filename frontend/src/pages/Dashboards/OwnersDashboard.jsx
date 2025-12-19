import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/userContext";
import OwnerNavbar from "./OwnerNavbar";
import "../../App.css";

export default function OwnersDashboard() {
  const { user, loading } = useContext(UserContext);

  const [store, setStore] = useState(null);
  const [storeLoading, setStoreLoading] = useState(true);

  useEffect(() => {
    // ⛔ wait until auth is resolved
    if (loading) return;

    const fetchStore = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5555/stores/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStore(res.data);
      } catch (error) {
        console.error("Failed to load store details", error);
      } finally {
        setStoreLoading(false);
      }
    };

    fetchStore();
  }, [loading]);

  return (
    <>
      <OwnerNavbar />

      <div
        className="owner-dashboard flex justify-center items-center flex-col"
        style={{ height: "552px" }}
      >
        {/* USER */}
        {loading ? (
          <h1 className="font-bold text-6xl">Loading user...</h1>
        ) : (
          <h1 className="font-bold text-6xl">
            Welcome, {user?.name}!
          </h1>
        )}

        {/* STORE */}
        {storeLoading ? (
          <h2 className="font-bold text-4xl mt-4">
            Loading store details...
          </h2>
        ) : store ? (
          <div className="mt-7 flex flex-col justify-center items-center">
            <h2 className="font-bold text-5xl mt-4 text-3xl font-bold  " style={{border:"1px solid white",color:"white",zIndex:"1", backgroundColor:"",padding:"10px", borderRadius:"2px"}}>
              {store.name}
            </h2 >
            <p className="text-2xl mt-5 font-semibold  text-white" style={{border:"1px solid white", backgroundColor:"",zIndex:"1", padding:"10px", borderRadius:"2px"}}>
              {store.location}
            </p>
          </div>
        ) : (
          <h2 className="font-bold text-4xl mt-4 text-red-500">
            No store found
          </h2>
        )}
      </div>
    </>
  );
}
