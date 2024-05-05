"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InfinitySpin } from "react-loader-spinner";

const VerifyPage = () => {
  const [otp, setOtp] = useState("");
  const [userData, setUserData] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("userdata");
    setUserData(JSON.parse(data!).data);
  }, []);

  const handleVerify = () => {
    setIsLoading(true);
    const userInfo = {
      secret: userData.userInfo.secret.base32,
      token: otp,
    };
    axios
      .post("https://multidevicebackend.onrender.com/api/verify-otp", {
        userInfo,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status !== 200) {
          toast.error("Invalid OTP");
        } else {
          if (userData.userInfo.role !== "admin") {
            router.push("/");
          } else {
            router.push("/admin");
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        toast.error("Error occurred while verifying OTP");
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center absolute left-[45%] top-[35%]">
        <InfinitySpin width="400" color="black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Identity By Scanning The Code In Google Authenticator
            App
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center">
            <QRCode
              value={userData?.userInfo?.secret?.otpauth_url}
              size={256}
              className="mb-4"
            />
          </div>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                autoComplete="one-time-code"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleVerify}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
