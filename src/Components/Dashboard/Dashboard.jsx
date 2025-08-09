import React, { useEffect, useState } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import OrderEdit from "./components/OrderEdit";
import axios from "../../utils/axios";
import ReactLoading from "react-loading";
import OrderDelete from "./components/OrderDelete";

export default function OrderList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState("not_started");
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

  console.log(activeButton)

  const fetchOrders = async (type) => {
    setLoading(true);
    setActiveButton(type);

    try {
      let url = "/order/api/getAll";
      let params = { page: 0, size };

      switch (type) {
        case "not_started":
          params.status = "NOT_STARTED";
          break;
        case "in_progress":
          params.status = "IN_PROGRESS";
          break;
        case "completed":
          params.status = "COMPLETED";
          break;
        case "a":
        default:
          // Для всех не добавляем статус
          break;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      setData(response.data.content || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchOrders("not_started");
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

      {/* Updated Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          onClick={() => fetchOrders("not_started")}
          className={`rounded-md ${activeButton === "not_started" ? "bg-blue-600" : "bg-gray-400"}`}
        >
          Boshlanmagan
        </Button>
        <Button
          onClick={() => fetchOrders("in_progress")}
          className={`rounded-md ${activeButton === "in_progress" ? "bg-blue-600" : "bg-gray-400"}`}
        >
          Jarayondagi
        </Button>
        <Button
          onClick={() => fetchOrders("completed")}
          className={`rounded-md ${activeButton === "completed" ? "bg-blue-600" : "bg-gray-400"}`}
        >
          Tugallangan
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
          {data.map((item, index) => (
            <Card
              key={index}
              className="shadow-sm border border-gray-200 bg-white p-4"
            >
              <CardBody className="space-y-3">
                {/* Показываем всю информацию для всех типов */}

                {/* Worker Information - если есть */}
                {item.worker && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <Typography variant="h6" className="font-semibold mb-2">
                      Ishchi haqida ma'lumot:
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Typography className="text-gray-700">
                        <span className="font-semibold">ID:</span> {item.worker.id || "Noma'lum"}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Telegram ID:</span> {item.worker.telegramId || "Noma'lum"}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">To'liq ismi:</span> {item.worker.fullName || "Noma'lum"}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Telefon raqami:</span> {item.worker.phoneNumber || "Noma'lum"}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Hudud:</span> {item.worker.region || "Belgilanmagan"}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Ish shaharlari:</span> {item.worker.workCities || "Belgilanmagan"}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Hudud ID:</span> {item.worker.regionId || "Noma'lum"}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Shaharlar ID:</span> {item.worker.citiesId || "Noma'lum"}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Xizmat kategoriyasi:</span> {item.worker.services_category || "Belgilanmagan"}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Balans:</span> {item.worker.balance || "0"}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Ishchilar soni:</span> {item.worker.workerCount || "Noma'lum"}
                      </Typography>
                      <Typography className="text-gray-700">
                        <span className="font-semibold">Yaratilgan vaqti:</span> {formatDateTimeFromArray(item.worker.createdAt) || "Noma'lum"}
                      </Typography>
                    </div>
                  </div>
                )}

                {/* Order Information - если есть через orders объект */}
                {item.orders ? (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <Typography variant="h5" className="font-bold text-black mb-2">
                          {item.orders.category} - {item.orders.orderServiceType}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">ID:</span> {item.orders.id}
                        </Typography>
                      </div>
                      <div className="flex items-center space-x-2">
                        <OrderEdit refresh={() => fetchOrders(activeButton)} orderData={item.orders} />
                        <OrderDelete orderId={item.orders.id} refresh={() => fetchOrders(activeButton)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="space-y-2">
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Izoh:</span> {item.orders.orderComment || "Yo'q"}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Telefon:</span> {item.orders.ownerPhone}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Buyurtma sanasi:</span> {formatDateTimeFromArray(item.orders.orderDate)}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Hudud:</span> Viloyat ID {item.orders.regionId}, Shahar ID {item.orders.cityId}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Ishchilar soni:</span> {item.orders.workerCount}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Egasi ID:</span> {item.orders.ownerId}
                        </Typography>
                      </div>

                      <div className="space-y-2">
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Yaratilgan vaqti:</span> {formatDateTimeFromArray(item.orders.createAt)}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Yangilangan vaqti:</span> {formatDateTimeFromArray(item.orders.updateAt)}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Manzil:</span> {item.orders.ownerFullAddress}
                        </Typography>
                        <Typography
                          className={`font-semibold ${item.orders.orderStatus ? "text-green-600" : "text-red-500"
                            }`}
                        >
                          <span className="font-semibold text-gray-700">Holati:</span> {item.orders.orderStatus ? "Tasdiqlangan" : "Tasdiqlanmagan"}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Yopilgan:</span> {item.orders.isClosed ? "Ha" : "Yo'q"}
                        </Typography>
                      </div>
                    </div>

                    {/* Owner Information для orders */}
                    {item.orders.owner && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <Typography variant="h6" className="font-semibold mb-2">
                          Egasi haqida ma'lumot:
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Typography className="text-gray-700">
                            <span className="font-semibold">ID:</span> {item.orders.owner.id}
                          </Typography>
                          <Typography className="text-gray-700">
                            <span className="font-semibold">Telegram ID:</span> {item.orders.owner.telegramId}
                          </Typography>
                          <Typography className="text-gray-700">
                            <span className="font-semibold">Telefon:</span> {item.orders.owner.phoneNumber}
                          </Typography>
                          <Typography className="text-gray-700">
                            <span className="font-semibold">Viloyat ID:</span> {item.orders.owner.regionId}
                          </Typography>
                          <Typography className="text-gray-700">
                            <span className="font-semibold">Shahar ID:</span> {item.orders.owner.cityId}
                          </Typography>
                          <Typography className="text-gray-700">
                            <span className="font-semibold">Uy manzili:</span> {item.orders.owner.homeAddress}
                          </Typography>
                          <Typography className="text-gray-700">
                            <span className="font-semibold">Yaratilgan vaqti:</span> {formatDateTimeFromArray(item.orders.owner.createdAt)}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Если данные приходят как прямой объект заказа (без orders) */
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <Typography variant="h5" className="font-bold text-black mb-2">
                          {item.category} - {item.orderServiceType}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">ID:</span> {item.id}
                        </Typography>
                      </div>
                      <div className="flex items-center space-x-2">
                        <OrderEdit refresh={() => fetchOrders(activeButton)} orderData={item} />
                        <OrderDelete orderId={item.id} refresh={() => fetchOrders(activeButton)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="space-y-2">
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Izoh:</span> {item.orderComment || "Yo'q"}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Telefon:</span> {item.ownerPhone}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Buyurtma sanasi:</span> {formatDateTimeFromArray(item.orderDate)}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Hudud:</span> Viloyat ID {item.regionId}, Shahar ID {item.cityId}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Ishchilar soni:</span> {item.workerCount}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Egasi ID:</span> {item.ownerId}
                        </Typography>
                      </div>

                      <div className="space-y-2">
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Yaratilgan vaqti:</span> {formatDateTimeFromArray(item.createAt)}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Yangilangan vaqti:</span> {formatDateTimeFromArray(item.updateAt)}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Manzil:</span> {item.ownerFullAddress}
                        </Typography>
                        <Typography
                          className={`font-semibold ${item.orderStatus ? "text-green-600" : "text-red-500"
                            }`}
                        >
                          <span className="font-semibold text-gray-700">Holati:</span> {item.orderStatus ? "Tasdiqlangan" : "Tasdiqlanmagan"}
                        </Typography>
                        <Typography className="text-gray-700">
                          <span className="font-semibold">Yopilgan:</span> {item.isClosed ? "Ha" : "Yo'q"}
                        </Typography>
                      </div>
                    </div>

                    {/* Owner Information для прямого объекта */}
                    {item.owner && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <Typography variant="h6" className="font-semibold mb-2">
                          Egasi haqida ma'lumot:
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Typography className="text-gray-700">
                            <span className="font-semibold">ID:</span> {item.owner.id}
                          </Typography>
                          <Typography className="text-gray-700">
                            <span className="font-semibold">Telegram ID:</span> {item.owner.telegramId}
                          </Typography>
                          <Typography className="text-gray-700">
                            <span className="font-semibold">Telefon:</span> {item.owner.phoneNumber}
                          </Typography>
                          <Typography className="text-gray-700">
                            <span className="font-semibold">Viloyat ID:</span> {item.owner.regionId}
                          </Typography>
                          <Typography className="text-gray-700">
                            <span className="font-semibold">Shahar ID:</span> {item.owner.cityId}
                          </Typography>
                          <Typography className="text-gray-700">
                            <span className="font-semibold">Uy manzili:</span> {item.owner.homeAddress}
                          </Typography>
                          <Typography className="text-gray-700">
                            <span className="font-semibold">Yaratilgan vaqti:</span> {formatDateTimeFromArray(item.owner.createdAt)}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}