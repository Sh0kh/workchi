import React, { useEffect, useState } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import OrderEdit from "./components/OrderEdit";
import axios from "../../utils/axios";
import ReactLoading from "react-loading";

export default function OrderList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState("all");
  const [size] = useState(20);

  const formatDateTimeFromArray = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return "Noma'lum sana";
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    return `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year} ${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
  };

  const fetchOrders = async (type) => {
    setLoading(true);
    setActiveButton(type);
    try {
      let url = "";
      let params = { page: 0, size };

      switch (type) {
        case "unconfirmed":
          url = "/order/api/getAll";
          params = { ...params, isActive: false, isClosed: false };
          break;
        case "closed":
          url = "/order/api/getAll";
          params = { ...params, isActive: true, isClosed: true };
          break;
        case "progress":
          url = "/order/api/getProgressOrders";
          break;
        case "all":
        default:
          url = "/order/api/getAllOrders";
          break;
      }

      const response = await axios.get(url, { params });
      setData(response.data.content || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders("all");
  }, []);

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

      {/* Simple Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          onClick={() => fetchOrders("all")}
          className={`rounded-md ${activeButton === "all" ? "bg-blue-600" : "bg-gray-400"}`}
        >
          Hammasi
        </Button>
        <Button
          onClick={() => fetchOrders("unconfirmed")}
          className={`rounded-md ${activeButton === "unconfirmed" ? "bg-blue-600" : "bg-gray-400"}`}
        >
          Tasdiqlanmagan
        </Button>
        <Button
          onClick={() => fetchOrders("closed")}
          className={`rounded-md ${activeButton === "closed" ? "bg-blue-600" : "bg-gray-400"}`}
        >
          Yopilgan
        </Button>
        <Button
          onClick={() => fetchOrders("progress")}
          className={`rounded-md ${activeButton === "progress" ? "bg-blue-600" : "bg-gray-400"}`}
        >
          Jarayondagi
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 text-xl font-medium">
            Buyurtmalar mavjud emas
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data.map((order, index) => (
            <Card
              key={index}
              className="shadow-sm border border-gray-200 bg-white p-4"
            >
              <CardBody className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Typography variant="h5" className="font-bold text-black mb-2">
                      {order.category} - {order.orderServiceType}
                    </Typography>
                    <Typography className="text-gray-700">
                      <span className="font-semibold">ID:</span> {order.id}
                    </Typography>
                  </div>
                  <OrderEdit refresh={() => fetchOrders(activeButton)} orderData={order} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="space-y-2">
                    <Typography className="text-gray-700">
                      <span className="font-semibold">Izoh:</span> {order.orderComment || "Yo'q"}
                    </Typography>
                    <Typography className="text-gray-700">
                      <span className="font-semibold">Telefon:</span> {order.ownerPhone}
                    </Typography>
                    <Typography className="text-gray-700">
                      <span className="font-semibold">Buyurtma sanasi:</span> {formatDateTimeFromArray(order.orderDate)}
                    </Typography>
                    <Typography className="text-gray-700">
                      <span className="font-semibold">Hudud:</span> Viloyat ID {order.regionId}, Shahar ID {order.cityId}
                    </Typography>
                    <Typography className="text-gray-700">
                      <span className="font-semibold">Ishchilar soni:</span> {order.workerCount}
                    </Typography>
                  </div>

                  <div className="space-y-2">
                    <Typography className="text-gray-700">
                      <span className="font-semibold">Yaratilgan vaqti:</span> {formatDateTimeFromArray(order.createAt)}
                    </Typography>
                    <Typography className="text-gray-700">
                      <span className="font-semibold">Yangilangan vaqti:</span> {formatDateTimeFromArray(order.updateAt)}
                    </Typography>
                    <Typography className="text-gray-700">
                      <span className="font-semibold">Manzil:</span> {order.ownerFullAddress}
                    </Typography>
                    <Typography
                      className={`font-semibold ${order.orderStatus ? "text-green-600" : "text-red-500"
                        }`}
                    >
                      <span className="font-semibold text-gray-700">Holati:</span> {order.orderStatus ? "Tasdiqlangan" : "Tasdiqlanmagan"}
                    </Typography>
                    <Typography className="text-gray-700">
                      <span className="font-semibold">Yopilgan:</span> {order.isClosed ? "Ha" : "Yo'q"}
                    </Typography>
                  </div>
                </div>

                {/* Owner Information */}
                {order.owner && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <Typography variant="h6" className="font-semibold mb-2">
                      Egasi haqida ma'lumot:
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Typography className="text-gray-700">
                        <span className="font-semibold">ID:</span> {order.owner.id}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Telegram ID:</span> {order.owner.telegramId}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Telefon:</span> {order.owner.phoneNumber}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Viloyat ID:</span> {order.owner.regionId}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Shahar ID:</span> {order.owner.cityId}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Uy manzili:</span> {order.owner.homeAddress}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Yaratilgan vaqti:</span> {formatDateTimeFromArray(order.owner.createdAt)}
                      </Typography>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}