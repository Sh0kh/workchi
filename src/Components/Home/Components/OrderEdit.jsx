import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Button,
    Textarea,
    Select,
    Option
} from "@material-tailwind/react";
import { EditIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import axios from "../../../utils/axios";
import { useNavigate } from "react-router-dom";

const categoryTranslations = {
    cleaning: "Tozalash",
    laundry: "Kir yuvish",
    furniture: "Mebel ishlari",
    plumbing: "Santexnika",
    electrical: "Elektr ishlari",
    tiling: "Kafel yotqizish",
    hourly_workers: "Soatbay ishchilar",
    other_service: "Boshqa xizmat"
};

const statusTranslations = {
    NOT_STARTED: "Boshlanmagan",
    IN_PROGRESS: "Jarayonda",
    COMPLETED: "Tugallangan"
};

export default function OrderEdit({ orderData }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        date: "",
        workerCount: 0,
        status: "NOT_STARTED",
        active: false,
        isClosed: false,
        isSendNotification: false
    });
    const [isOpen, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Рефы для чекбоксов
    const activeRef = useRef(null);
    const isClosedRef = useRef(null);
    const isSendNotificationRef = useRef(null);

    // Инициализация данных формы при получении orderData
    useEffect(() => {
        if (orderData) {
            let formattedDate = "";
            if (orderData.date) {
                const dateObj = new Date(orderData.date);
                formattedDate = dateObj.toISOString().split("T")[0];
            }

            const initialFormData = {
                title: orderData.title || "",
                description: orderData.description || "",
                category: orderData.category || "",
                date: formattedDate,
                workerCount: Number(orderData.workerCount) || 0,
                status: orderData.status || "NOT_STARTED",
                active: Boolean(orderData.active),
                isClosed: Boolean(orderData.isClosed),
                isSendNotification: Boolean(orderData.isSendNotification)
            };

            setFormData(initialFormData);
        }
    }, [orderData]);

    // Обновляем рефы когда изменяется formData
    useEffect(() => {
        if (activeRef.current) activeRef.current.checked = formData.active;
        if (isClosedRef.current) isClosedRef.current.checked = formData.isClosed;
        if (isSendNotificationRef.current) isSendNotificationRef.current.checked = formData.isSendNotification;
    }, [formData.active, formData.isClosed, formData.isSendNotification]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);

        // Получаем актуальные значения из рефов для большей надежности
        const getCurrentValues = () => ({
            active: activeRef.current?.checked ?? formData.active,
            isClosed: isClosedRef.current?.checked ?? formData.isClosed,
            isSendNotification: isSendNotificationRef.current?.checked ?? formData.isSendNotification
        });

        const currentValues = getCurrentValues();

        try {
            const payload = {
                id: orderData?.id,
                title: formData.title,
                description: formData.description,
                category: formData.category,
                date: new Date(formData.date).toISOString(),
                workerCount: Number(formData.workerCount) || 0,
                isSendNotification: currentValues.isSendNotification,
                active: currentValues.active,
                isClosed: currentValues.isClosed,
                status: formData.status
            };

            await axios.put(`/order/api/update`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            Swal.fire({
                title: "Muvaffaqiyatli!",
                text: "Buyurtma muvaffaqiyatli yangilandi",
                icon: "success",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false
            });

            setOpen(false);
            navigate(-1);
        } catch (error) {
            console.error("Update error:", error);

            Swal.fire({
                title: "Xato!",
                text: error.response?.data?.message || "Xatolik yuz berdi.",
                icon: "error",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDialogClose = () => {
        setOpen(false);
        // Сброс формы к исходным данным при закрытии
        if (orderData) {
            let formattedDate = "";
            if (orderData.date) {
                const dateObj = new Date(orderData.date);
                formattedDate = dateObj.toISOString().split("T")[0];
            }

            setFormData({
                title: orderData.title || "",
                description: orderData.description || "",
                category: orderData.category || "",
                date: formattedDate,
                workerCount: Number(orderData.workerCount) || 0,
                status: orderData.status || "NOT_STARTED",
                active: Boolean(orderData.active),
                isClosed: Boolean(orderData.isClosed),
                isSendNotification: Boolean(orderData.isSendNotification)
            });
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

            <Dialog open={isOpen} handler={handleDialogClose} size="lg">
                <DialogHeader>Buyurtmani Tahrirlash</DialogHeader>

                <DialogBody className="overflow-y-auto max-h-[70vh] grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <Input
                            label="Sarlavha"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Textarea
                            label="Tavsif"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <Select
                        label="Kategoriya"
                        value={formData.category}
                        onChange={(val) => handleSelectChange("category", val)}
                    >
                        {Object.entries(categoryTranslations).map(([key, uzb]) => (
                            <Option key={key} value={key}>
                                {uzb}
                            </Option>
                        ))}
                    </Select>

                    <Input
                        label="Sana"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Ishchilar soni"
                        type="number"
                        name="workerCount"
                        value={formData.workerCount}
                        onChange={handleChange}
                        min="0"
                    />

                    <Select
                        label="Holati"
                        value={formData.status}
                        onChange={(val) => handleSelectChange("status", val)}
                    >
                        {Object.entries(statusTranslations).map(([key, uzb]) => (
                            <Option key={key} value={key}>
                                {uzb}
                            </Option>
                        ))}
                    </Select>

                    <div className="md:col-span-2 space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                ref={activeRef}
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Faol
                            </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                ref={isClosedRef}
                                type="checkbox"
                                name="isClosed"
                                checked={formData.isClosed}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Yopilgan
                            </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                ref={isSendNotificationRef}
                                type="checkbox"
                                name="isSendNotification"
                                checked={formData.isSendNotification}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Bildirishnoma yuborish
                            </span>
                        </label>
                    </div>
                </DialogBody>

                <DialogFooter className="space-x-2">
                    <Button
                        variant="text"
                        color="gray"
                        onClick={handleDialogClose}
                        disabled={loading}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        disabled={loading || !formData.title || !formData.date}
                        color="blue"
                        onClick={handleSubmit}
                    >
                        {loading ? "Yuklanmoqda..." : "Saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}