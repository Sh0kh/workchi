import { useLocation } from "react-router-dom";
import { Edit, Trash2, MapPin, Calendar, Clock, Phone, Home, Users, BadgeDollarSign } from "lucide-react";
import OrderDelete from "../Home/Components/OrderDelete";
import OrderEdit from "../Home/Components/OrderEdit";

export default function OrderInfo() {
    const location = useLocation();
    const { item } = location.state || {};

    console.log(item)

    if (!item) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Ma'lumot topilmadi</h2>
                    <p className="text-gray-600">Buyurtma haqida ma'lumot mavjud emas</p>
                </div>
            </div>
        );
    }

    // Функция для форматирования массива в дату
    // Универсальное форматирование — поддерживает и массив, и строку даты
    const formatDateTime = (dateInput) => {
        if (!dateInput) return "Noma'lum sana";

        let dateObj;

        if (Array.isArray(dateInput)) {
            // Массив → переводим в нормальную дату
            const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
            dateObj = new Date(year, month - 1, day, hour, minute, second);
        } else if (typeof dateInput === "string") {
            // Строка → создаём дату
            dateObj = new Date(dateInput);
        } else {
            return "Noma'lum sana";
        }

        // Берём именно локальное время, а не UTC
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();
        const hour = String(dateObj.getHours()).padStart(2, "0");
        const minute = String(dateObj.getMinutes()).padStart(2, "0");
        const second = String(dateObj.getSeconds()).padStart(2, "0");

        return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
    };


    const handleEdit = () => {
        console.log("Tahrirlash tugmasi bosildi");
        // Bu yerda tahrirlash funksiyasini qo'shing
    };
    const categoryTranslations = {
        cleaning: "Tozalash",
        laundry: "Kir yuvish",
        furniture: "Mebel",
        plumbing: "Santexnika",
        electrical: "Elektr ishlari",
        tiling: "Kafel/Plitka",
        hourly_workers: "Soatbay ishchilar",
        other_service: "Boshqa xizmat"
    };


    const handleDelete = () => {
        if (window.confirm("Haqiqatan ham bu buyurtmani o'chirmoqchimisiz?")) {
            console.log("O'chirish tugmasi bosildi");
            // Bu yerda o'chirish funksiyasini qo'shing
        }
    };

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase();
        if (statusLower === 'active' || statusLower === 'faol') return 'bg-green-100 text-green-800';
        if (statusLower === 'pending' || statusLower === 'kutilmoqda') return 'bg-yellow-100 text-yellow-800';
        if (statusLower === 'completed' || statusLower === 'tugallangan') return 'bg-blue-100 text-blue-800';
        if (statusLower === 'cancelled' || statusLower === 'bekor qilingan') return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br mt-[30px]">
            <div className="Container">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-MainColor to-MainColor px-6 py-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
                        <p className="text-white text-lg ">{item.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                        <OrderEdit orderData={item} />
                        <OrderDelete orderId={item?.id} />

                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Buyurtma ma'lumotlari */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                            Buyurtma ma'lumotlari
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-600">Manzil</p>
                                    <p className="text-gray-800 font-medium">{item.address}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-5 h-5 bg-purple-100 rounded text-purple-600 text-xs flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                                    K
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Kategoriya</p>
                                    <p className="text-gray-800 font-medium">   {categoryTranslations[item?.category] || item?.category}
                                    </p>

                                </div>
                            </div>

                            <div className="flex items-start">
                                <Calendar className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-600">Yaratilgan</p>
                                    <p className="text-gray-800 font-medium">{formatDateTime(item.createAt)}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Users className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-600">Ishchilar soni</p>
                                    <p className="text-gray-800 font-medium">{item.workerCount} kishi</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-5 h-5 bg-green-100 rounded text-green-600 text-xs flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                                    S
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Holat</p>
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}
                                    >
                                        {item.status === "NOT_STARTED"
                                            ? "Boshlanmagan"
                                            : item.status === "IN_PROGRESS"
                                                ? "Jarayonda"
                                                : item.status === "COMPLETED"
                                                    ? "Tugallangan"
                                                    : item.status}
                                    </span>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mijoz ma'lumotlari va vaqtlar */}
                    <div className="space-y-6">
                        {/* Mijoz ma'lumotlari */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Phone className="w-5 h-5 mr-2 text-green-600" />
                                Mijoz ma'lumotlari
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <Phone className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-600">Telefon raqami</p>
                                        <p className="text-gray-800 font-medium">{item.owner?.phoneNumber || "—"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Home className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-600">Uy manzili</p>
                                        <p className="text-gray-800 font-medium">{item.owner?.homeAddress || "—"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vaqt ma'lumotlari */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                                Vaqt ma'lumotlari
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <Clock className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-600"> Buyurtma sanasi</p>
                                        <p className="text-gray-800 font-medium">{formatDateTime(item.date)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {item?.worker && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 mt-[20px] p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-orange-600" />
                            Ishchi haqida ma'lumot
                        </h2>
                        <div className="flex items-start mb-[10px]">
                            <Users className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-600">Toliq Ismi</p>
                                <p className="text-gray-800 font-medium">{item.worker?.fullName || "—"}</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Phone className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-600">Telefon raqami</p>
                                <p className="text-gray-800 font-medium">{item.worker?.phoneNumber || "—"}</p>
                            </div>
                        </div>
                        <div className="flex items-start mt-[10px]">
                            <BadgeDollarSign className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-600">Balansi</p>
                                <p className="text-gray-800 font-medium">{item.worker?.balance || "—"} so`m</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}