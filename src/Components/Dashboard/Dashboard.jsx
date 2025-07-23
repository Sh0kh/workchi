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

  const formatDateFromArray = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return "Noma'lum sana";
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year}`;
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
          url = "/order/api/getAll";
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
              className="shadow-sm border border-gray-200 bg-white"
            >
              <CardBody className="space-y-2">
                <div className="flex justify-between items-center">
                  <Typography variant="h6" className="font-bold text-black">
                    {order.category} - {order.orderServiceType}
                  </Typography>
                  <OrderEdit refresh={() => fetchOrders(activeButton)} orderData={order} />
                </div>

                <Typography className="text-gray-700 text-sm">
                  <span className="font-medium">Izoh:</span> {order.orderComment || "Yo'q"}
                </Typography>

                <Typography className="text-gray-700 text-sm">
                  <span className="font-medium">Tel:</span> {order.ownerPhone}
                </Typography>

                <Typography className="text-gray-700 text-sm">
                  <span className="font-medium">Sana:</span> {formatDateFromArray(order.orderDate)}
                </Typography>

                <Typography className="text-gray-700 text-sm">
                  <span className="font-medium">Manzil:</span> {order.ownerFullAddress}
                </Typography>

                <Typography
                  className={`text-sm font-medium ${order.orderStatus ? "text-green-600" : "text-red-500"
                    }`}
                >
                  {order.orderStatus ? "Tasdiqlangan" : "Tasdiqlanmagan"}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}