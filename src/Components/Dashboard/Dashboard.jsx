import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import OrderEdit from "./components/OrderEdit";
import axios from "../../utils/axios";
import ReactLoading from "react-loading";

export default function OrderList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [showProgressOrders, setShowProgressOrders] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [isLast, setIsLast] = useState(false);
  const [isFirst, setIsFirst] = useState(true);

  const formatDateFromArray = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return "Noma'lum sana";
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year}`;
  };

  const getAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/order/api/getAll`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        params: {
          page,
          size,
          isActive,
          isClosed,
        },
      });

      setData(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setIsLast(response.data.last);
      setIsFirst(response.data.first);
      setShowProgressOrders(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/order/api/getProgressOrders`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        params: {
          page,
          size,
        },
      });

      setData(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setIsLast(response.data.last);
      setIsFirst(response.data.first);
      setShowProgressOrders(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showProgressOrders) {
      getProgressOrders();
    } else {
      getAllOrders();
    }
  }, [page, size, isActive, isClosed, showProgressOrders]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <ReactLoading
          type="spinningBubbles"
          color="black"
          height={100}
          width={100}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[80px] p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Buyurtmalar Ro'yxati
      </h1>

      {/* Progress Orders Button */}
      <div className="flex justify-center mb-6">
        <Button
          onClick={getProgressOrders}
          className={`mr-4 ${showProgressOrders ? 'bg-blue-600' : 'bg-gray-600'}`}
        >
          Jarayondagi buyurtmalar
        </Button>
        <Button
          onClick={getAllOrders}
          className={`${!showProgressOrders ? 'bg-blue-600' : 'bg-gray-600'}`}
        >
          Barcha buyurtmalar
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 py-[20px] px-[20px] shadow-md border">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="max-w-52 w-full">
            <Select
              label="Faol holati"
              value={String(isActive)}
              onChange={(val) => setIsActive(val === "true")}
              disabled={showProgressOrders}
            >
              <Option value="true">Faol</Option>
              <Option value="false">Nofaol</Option>
            </Select>
          </div>
          <div className="max-w-52 w-full">
            <Select
              label="Yopilgan"
              value={String(isClosed)}
              onChange={(val) => setIsClosed(val === "true")}
              disabled={showProgressOrders}
            >
              <Option value="true">Yopilgan</Option>
              <Option value="false">Ochiq</Option>
            </Select>
          </div>
          <div className="max-w-52 w-full">
            <Select
              label="Hajm"
              value={String(size)}
              onChange={(val) => setSize(Number(val))}
            >
              <Option value="5">5</Option>
              <Option value="10">10</Option>
              <Option value="20">20</Option>
              <Option value="50">50</Option>
            </Select>
          </div>
        </div>
      </Card>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 text-xl font-medium">
            Buyurtmalar mavjud emas
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {data.map((order, index) => (
              <Card
                key={index}
                className="shadow-md border border-gray-300 bg-white"
              >
                <CardBody className="space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <Typography variant="h6" className="font-bold text-black">
                      {order.category} - {order.orderServiceType}
                    </Typography>
                    <OrderEdit refresh={getAllOrders} orderData={order} />
                  </div>

                  <Typography className="text-gray-700">
                    <span className="font-medium">Izoh:</span>{" "}
                    {order.orderComment || "Yo'q"}
                  </Typography>

                  <Typography className="text-gray-700">
                    <span className="font-medium">Ish beruvchining telefon raqami:</span>{" "}
                    {order.ownerPhone}
                  </Typography>

                  <Typography className="text-gray-700">
                    <span className="font-medium">Buyurtma sanasi:</span>{" "}
                    {formatDateFromArray(order.orderDate)}
                  </Typography>

                  <Typography className="text-gray-700">
                    <span className="font-medium">Hudud:</span> Viloyat ID{" "}
                    {order.regionId}, Shahar ID {order.cityId}
                  </Typography>

                  <Typography className="text-gray-700">
                    <span className="font-medium">Egasining ID raqami:</span>{" "}
                    {order.ownerId}
                  </Typography>

                  <Typography className="text-gray-700">
                    <span className="font-medium">Manzil:</span>{" "}
                    {order.ownerFullAddress}
                  </Typography>

                  <Typography
                    className={`font-semibold ${order.orderStatus
                      ? "text-green-600"
                      : "text-red-500"
                      }`}
                  >
                    {order.orderStatus ? "Tasdiqlangan" : "Tasdiqlanmagan"}
                  </Typography>

                  <Typography className="text-xs text-gray-400">
                    Yaratilgan vaqti:{" "}
                    {order.createAt ? (
                      new Date(
                        order.createAt[0],                // year
                        order.createAt[1] - 1,            // month (0-based)
                        order.createAt[2],                // day
                        order.createAt[3],                // hour
                        order.createAt[4],                // minute
                        order.createAt[5],                // second,
                        Math.floor(order.createAt[6] / 1000000) // convert nanoseconds to milliseconds
                      ).toLocaleString()
                    ) : (
                      "Yaratilgan sana yo'q"
                    )}
                  </Typography>

                  <Typography className="text-xs text-gray-400">
                    O`zgartirilgan vaqti:{" "}
                    {order.updateAt ? (
                      new Date(
                        order.updateAt[0],                // year
                        order.updateAt[1] - 1,            // month (0-based)
                        order.updateAt[2],                // day
                        order.updateAt[3],                // hour
                        order.updateAt[4],                // minute
                        order.updateAt[5],                // second,
                        Math.floor(order.updateAt[6] / 1000000) // convert nanoseconds to milliseconds
                      ).toLocaleString()
                    ) : (
                      "Yaratilgan sana yo'q"
                    )}
                  </Typography>

                </CardBody>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <Button
              variant="outlined"
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={isFirst}
            >
              Orqaga
            </Button>
            <Typography variant="h6">
              Sahifa: {page + 1} / {totalPages}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setPage((prev) => (isLast ? prev : prev + 1))}
              disabled={isLast}
            >
              Keyingi
            </Button>
          </div>
        </>
      )}
    </div>
  );
}