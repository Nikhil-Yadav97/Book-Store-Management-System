import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center my-10">
      <div className="relative w-16 h-16">
        
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-40"
          style={{ backgroundColor: "#3bb8c3ff" }}
        />

        
        <div
          className="absolute inset-2 rounded-full animate-spin"
          style={{
            border: "4px solid #3bb8c3ff",
            borderTopColor: "transparent"
          }}
        />
      </div>
    </div>
  );
};

export default Spinner;
