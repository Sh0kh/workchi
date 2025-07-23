import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Button,
    Textarea,
} from "@material-tailwind/react";
import { EditIcon } from "lucide-react";
import { useState, useEffect } from "react";
import region from "../Data/regions.json";
import districts from "../Data/districts.json";
import Swal from "sweetalert2";
import axios from "../../../utils/axios";

export default function OrderEdit({ orderData, refresh }) {
    const [formData, setFormData] = useState({
        ...orderData,
        order_date: ""
    });
    const [isOpen, setOpen] = useState(false);
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Инициализация данных при монтировании и при изменении orderData
    useEffect(() => {
        // Конвертация даты из массива в YYYY-MM-DD
        if (Array.isArray(orderData.orderDate)) {
            const [year, month, day] = orderData.orderDate;
            const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // Фильтрация городов для выбранного региона
            const initialDistricts = orderData.regionId
                ? districts.filter(d => d.region_id === Number(orderData.regionId))
                : [];

            setFormData(prev => ({
                ...prev,
                ...orderData,
                order_date: formattedDate
            }));

            setFilteredDistricts(initialDistricts);
        }
    }, [orderData]);

    // Обновление списка городов при изменении региона
    useEffect(() => {
        if (formData.regionId) {
            const filtered = districts.filter(
                (district) => district.region_id === Number(formData.regionId)
            );
            setFilteredDistricts(filtered);

            // Если текущий город не принадлежит выбранному региону, сбрасываем его
            if (formData.cityId) {
                const cityExists = filtered.some(d => d.id === Number(formData.cityId));
                if (!cityExists) {
                    setFormData(prev => ({ ...prev, cityId: "" }));
                }
            }
        } else {
            setFilteredDistricts([]);
            setFormData(prev => ({ ...prev, cityId: "" }));
        }
    }, [formData.regionId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.put('/order/api/update', formData)
            Swal.fire({
                title: "Muvaffaqiyatli!",
                icon: "success",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    popup: 'custom-z-index'
                }
            });

            refresh()
            setOpen(false)
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "Xato!",
                text: error.response?.data?.message || "Xatolik yuz berdi.",
                icon: "error",
                toast: true,
                position: "top-end",
                timer: 3000,
                customClass: {
                    popup: 'custom-z-index'
                },
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                size="sm"
                color="blue"
                className="flex items-center gap-1 normal-case text-sm"
                onClick={() => setOpen(true)}
            >
                <EditIcon className="w-4 h-4" />
                Tahrirlash
            </Button>
            <Dialog open={isOpen} handler={() => setOpen(false)} size="lg">
                <DialogHeader>Buyurtmani Tahrirlash</DialogHeader>
                <DialogBody className="overflow-y-auto max-h-[70vh] grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Xizmat turi"
                        name="orderServiceType"
                        value={formData.orderServiceType || ""}
                        onChange={handleChange}
                    />
                    <Input
                        label="Kategoriya"
                        name="category"
                        value={formData.category || ""}
                        onChange={handleChange}
                    />

                    {/* Viloyat */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Viloyat
                        </label>
                        <select
                            name="regionId"
                            value={formData.regionId || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Tanlang --</option>
                            {region.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name_uz}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Shahar / Tuman */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Shahar / Tuman
                        </label>
                        <select
                            name="cityId"
                            value={formData.cityId || ""}
                            onChange={handleChange}
                            disabled={!formData.regionId}
                            className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none ${!formData.regionId
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "focus:ring-2 focus:ring-blue-500"
                                }`}
                        >
                            <option value="">-- Tanlang --</option>
                            {filteredDistricts.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name_uz}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Buyurtma sanasi"
                        type="date"
                        name="order_date"
                        value={formData.order_date || ""}
                        onChange={handleChange}
                    />

                    <Input
                        label="Ish beruvchining telefon raqami"
                        name="ownerPhone"
                        type="text"
                        onChange={handleChange}
                        value={formData.ownerPhone || ""}
                    />

                    <Textarea
                        label="To'liq manzil"
                        name="ownerFullAddress"
                        value={formData.ownerFullAddress || ""}
                        onChange={handleChange}
                    />

                    <Textarea
                        label="Izoh"
                        name="orderComment"
                        value={formData.orderComment || ""}
                        onChange={handleChange}
                    />

                    <label className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            name="orderStatus"
                            checked={formData.orderStatus || false}
                            onChange={handleChange}
                        />
                        <span className="text-sm">Tasdiqlangan</span>
                    </label>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="gray" onClick={() => setOpen(false)}>
                        Bekor qilish
                    </Button>
                    <Button
                        disabled={loading}

                        color="blue" onClick={handleSubmit}>
                        {loading ? "Yuklanmoqda..." : "Saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}