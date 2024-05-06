"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import useLocalStorage from "../Utils/Customhooks";
import { InfinitySpin } from "react-loader-spinner";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState<any>();
  const router = useRouter();
  const [userData, setUserData, clearUserData] = useLocalStorage(
    "userdata",
    null
  );
  const userInfo: any = userData;
  const token = userInfo?.data?.token;
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 10;
  const pageCount = Math.ceil(users.length / perPage);

  const handlePageClick = ({ selected }: { selected: any }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * perPage;
  const currentUsers = users.slice(offset, offset + perPage);

  useEffect(() => {
    const data: any = userData;
    data && setAdmin(data?.data);
    if (!data || data?.data?.userInfo?.role !== "admin") {
      router.push("/login");
    } else {
      setLoading(true);
      axios
        .get("https://multidevicebackend.onrender.com/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res: any) => {
          console.log(res.data);
          setUsers(res.data.reverse());
          setLoading(false);
        })
        .catch((error: any) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, []);

  const handleLogout = () => {
    clearUserData();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center absolute left-[45%] top-[35%]">
        <InfinitySpin width="400" color="black" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-black ">
        <div className="flex self-end mt-4 mr-48 my-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
        <div className="container mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="text-xs uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3 bg-gray-100">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-100">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-100">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user: any) => (
                  <tr key={user._id} className="border-b border-gray-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <ReactPaginate
              pageCount={pageCount}
              marginPagesDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName={"pagination flex justify-center"}
              pageLinkClassName={"px-4 py-2"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
