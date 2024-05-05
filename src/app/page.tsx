"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaDesktop, FaMobile, FaQuestion } from "react-icons/fa";
import { InfinitySpin } from "react-loader-spinner";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const user: any = localStorage.getItem("userdata");
  const userInfo = JSON.parse(user);
  const [deviceFlag, setDeviceFlag] = useState(false);
  const [isCurrentDevice, setIsCurrentDevice] = useState(false);
  const currentDeviceToken = localStorage.getItem("currentDeviceToken");

  const token = userInfo?.data?.token;

  useEffect(() => {
    setLoading(true);
    if (!user) {
      router.push("/login");
    } else {
      if (token) {
        axios
          .get("http://172.17.0.1:5000/api/login-history", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log(response.data.devices); // Access the devices array from the response
            setDeviceFlag(true);
            setDevices(response.data.devices); // Set the devices state with the devices array
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching login history:", error);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  const handleLogout = () => {
    // /devices/glootu;
    axios
      .delete("http://172.17.0.1:5000/api/devices/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        localStorage.removeItem("userdata");
        router.push("/login");
      })
      .catch((error) => {
        console.error("Error fetching login history:", error);
        setLoading(false);
      });
  };

  const handleLogoutDevice = async (deviceId: any) => {
    const isCurrentDevice: any = devices.find(
      (device: any) => device._id === deviceId
    );

    console.log(isCurrentDevice?.currentDeviceToken === currentDeviceToken);
    setLoading(true);

    try {
      // Send a request to your backend API to logout the device
      await axios
        .delete(`http://172.17.0.1:5000/api/devices/${deviceId}/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setIsCurrentDevice(
            isCurrentDevice?.currentDeviceToken === currentDeviceToken
          );
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });

      // If the request is successful, update the devices state to reflect the change
      setDevices(devices.filter((device: any) => device._id !== deviceId));
    } catch (error) {
      console.error("Error logging out device:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deviceFlag && devices.length === 0) {
      router.push("/login");
    }
    if (isCurrentDevice) {
      localStorage.removeItem("userdata");
      router.push("login");
    }
  }, [devices, isCurrentDevice]);

  if (loading) {
    return (
      <div className="flex justify-center items-center absolute left-[45%] top-[35%]">
        <InfinitySpin width="400" color="black" />
      </div>
    );
  }

  function convertTimestampToString(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-50 text-black ">
        <div className="container mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="text-xs uppercase">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-100"
                    style={{ width: "20%" }}
                  >
                    Logged At
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-100"
                    style={{ width: "20%" }}
                  >
                    Browser
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3"
                    style={{ width: "20%" }}
                  >
                    Operating System
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-100"
                    style={{ width: "20%" }}
                  >
                    Device Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3"
                    style={{ width: "20%" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device: any) => (
                  <tr key={device._id} className="border-b border-gray-200">
                    <td className="px-6 py-4 font-medium whitespace-nowrap bg-gray-100">
                      <div className="ml-[15%] box-border">
                        {convertTimestampToString(device.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap bg-gray-100">
                      <div className="ml-[38%]">{device.browser}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="ml-[30%]">{device.os}</div>
                    </td>
                    <td className="px-6 py-4 bg-gray-100">
                      {device.device === "desktop" ? (
                        <div className="flex align-middle items-center ml-[35%]">
                          <FaDesktop />
                          &nbsp; &nbsp;
                          {device.device}
                        </div>
                      ) : device.device === "smartphone" ? (
                        <div className="flex align-middle items-center ml-[35%]">
                          <FaMobile />
                          &nbsp; &nbsp;
                          {device.device}
                        </div>
                      ) : (
                        <div className="flex align-middle items-center ml-[35%]">
                          <FaQuestion />
                          &nbsp; &nbsp;
                          {device.device}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="ml-[38%]">
                        <button
                          onClick={() => handleLogoutDevice(device._id)}
                          disabled={loading}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Logout
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout All Devices
            </button>
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  );
}
