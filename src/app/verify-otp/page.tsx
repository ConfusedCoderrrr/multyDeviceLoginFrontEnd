"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const VerifyOtpPage: React.FC = () => {
  const [otp, setOtp] = useState("");

  const email = localStorage.getItem("tempEmail");
  const password = localStorage.getItem("tempPassword");
  const hashedOtp = localStorage.getItem("otp");
  const role = localStorage.getItem("tempRole");
  const router = useRouter();

  const verifyOtp = async () => {
    axios
      .post("https://multidevicebackend.onrender.com/api/verify-user-otp", {
        userOtp: otp,
        hashedOtp,
      })
      .then(() => {
        axios
          .post("https://multidevicebackend.onrender.com/api/register", {
            email,
            password,
            role,
          })
          .then((res) => {
            router.push("/login");
            localStorage.removeItem("tempEmail");
            localStorage.removeItem("tempPassword");
            localStorage.removeItem("tempRole");
            localStorage.removeItem("otp");
          })
          .catch((error: any) => {
            alert(`some error accured ${error.response.data}`);
          });
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
        <h3 className="text-xl mb-4 text-center">{email}</h3>
        <input
          type="text"
          className="block w-[100%] px-4 py-2 rounded border border-gray-300 mb-4"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={verifyOtp}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
