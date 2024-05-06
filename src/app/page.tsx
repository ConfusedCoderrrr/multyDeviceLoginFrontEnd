"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { InfinitySpin } from "react-loader-spinner";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const user: any =
    typeof window !== "undefined" ? localStorage.getItem("userdata") : null;

  const userInfo = JSON.parse(user);
  const [deviceFlag, setDeviceFlag] = useState(false);
  const [isCurrentDevice, setIsCurrentDevice] = useState(false);
  const currentDeviceToken =
    typeof window !== "undefined"
      ? localStorage.getItem("currentDeviceToken")
      : null;

  const token = userInfo?.data?.token;

  useEffect(() => {
    setLoading(true);
    if (!user) {
      router.push("/login");
    } else {
      if (token) {
        axios
          .get("https://multidevicebackend.onrender.com/api/login-history", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log(response.data.devices);
            setDeviceFlag(true);
            setDevices(response.data.devices);
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
    axios
      .delete("https://multidevicebackend.onrender.com/api/devices/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        if (typeof window !== "undefined") {
          localStorage.removeItem("userdata");
        }
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
      await axios
        .delete(
          `https://multidevicebackend.onrender.com/api/devices/${deviceId}/logout`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setIsCurrentDevice(
            isCurrentDevice?.currentDeviceToken === currentDeviceToken
          );
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
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
      if (typeof window !== "undefined") {
        localStorage.removeItem("userdata");
      }
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
                          <svg
                            width="20px"
                            height="20px"
                            viewBox="0 0 20 20"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>desktop [#232]</title>
                            <desc>Created with Sketch.</desc>
                            <defs></defs>
                            <g
                              id="Page-1"
                              stroke="none"
                              stroke-width="1"
                              fill="none"
                              fill-rule="evenodd"
                            >
                              <g
                                id="Dribbble-Light-Preview"
                                transform="translate(-100.000000, -7159.000000)"
                                fill="#000000"
                              >
                                <g
                                  id="icons"
                                  transform="translate(56.000000, 160.000000)"
                                >
                                  <path
                                    d="M62.0006998,7012 C62.0006998,7012.552 61.5528565,7013 61.0010496,7013 L47.0059479,7013 C46.4541411,7013 46.0062978,7012.552 46.0062978,7012 L46.0062978,7002 C46.0062978,7001.448 46.4541411,7001 47.0059479,7001 L61.0010496,7001 C61.5528565,7001 62.0006998,7001.448 62.0006998,7002 L62.0006998,7012 Z M61.9907033,6999 L45.9963013,6999 L45.9923027,6999 C44.888689,6999 44,6999.915 44,7001.02 L44.0069976,7001.04 L44.0069976,7013.04 L44,7013.02 C44,7014.125 44.888689,7015 45.9923027,7015 L45.9963013,7015 L51.9902034,7015 C52.5430099,7015 53.0038487,7015.468 53.0038487,7016.02 L53.0038487,7016.01 C53.0038487,7016.562 52.5430099,7017 51.9902034,7017 L48.9912531,7017 C48.4394462,7017 48.005598,7017.468 48.005598,7018.02 L48.005598,7018.01 C48.005598,7018.562 48.4394462,7019 48.9912531,7019 L58.9877543,7019 C59.5405608,7019 60.0013995,7018.572 60.0013995,7018.02 L60.0013995,7018.01 C60.0013995,7017.458 59.5405608,7017 58.9877543,7017 L55.9888039,7017 C55.4369971,7017 55.0031489,7016.572 55.0031489,7016.02 L55.0031489,7016.01 C55.0031489,7015.458 55.4369971,7015 55.9888039,7015 L61.9907033,7015 L61.9977008,7015.02 C63.0993152,7015.02 64,7014.146 64,7013.043 L64,7013.04 L64,7001.04 L64,7001.037 C64,6999.934 63.0993152,6999.02 61.9977008,6999.02 L61.9907033,6999 Z"
                                    id="desktop-[#232]"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                          &nbsp; &nbsp;
                          {device.device}
                        </div>
                      ) : device.device === "smartphone" ? (
                        <div className="flex align-middle items-center ml-[35%]">
                          <svg
                            width="25px"
                            height="25px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 18H12.01M9.2 21H14.8C15.9201 21 16.4802 21 16.908 20.782C17.2843 20.5903 17.5903 20.2843 17.782 19.908C18 19.4802 18 18.9201 18 17.8V6.2C18 5.0799 18 4.51984 17.782 4.09202C17.5903 3.71569 17.2843 3.40973 16.908 3.21799C16.4802 3 15.9201 3 14.8 3H9.2C8.0799 3 7.51984 3 7.09202 3.21799C6.71569 3.40973 6.40973 3.71569 6.21799 4.09202C6 4.51984 6 5.07989 6 6.2V17.8C6 18.9201 6 19.4802 6.21799 19.908C6.40973 20.2843 6.71569 20.5903 7.09202 20.782C7.51984 21 8.07989 21 9.2 21Z"
                              stroke="#000000"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          &nbsp; &nbsp;
                          {device.device}
                        </div>
                      ) : (
                        <div className="flex align-middle items-center ml-[35%]">
                          <svg
                            width="30px"
                            height="30px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 19H12.01M8.21704 7.69689C8.75753 6.12753 10.2471 5 12 5C14.2091 5 16 6.79086 16 9C16 10.6565 14.9931 12.0778 13.558 12.6852C12.8172 12.9988 12.4468 13.1556 12.3172 13.2767C12.1629 13.4209 12.1336 13.4651 12.061 13.6634C12 13.8299 12 14.0866 12 14.6L12 16"
                              stroke="#000000"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
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
