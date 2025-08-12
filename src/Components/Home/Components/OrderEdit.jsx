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
import { useState, useEffect } from "react";
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
        ...orderData,
        date: ""
    });
    const [isOpen, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (orderData?.date) {
            const dateObj = new Date(orderData.date);
            const formattedDate = dateObj.toISOString().split("T")[0];
            setFormData(prev => ({
                ...prev,
                ...orderData,
                date: formattedDate
            }));
        }
    }, [orderData]);

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
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                date: new Date(formData.date).toISOString(),
                workerCount: Number(formData.workerCount) || 0,
                isSendNotification: !!formData.isSendNotification,
                active: !!formData.active,
                isClosed: !!formData.isClosed,
                status: formData.status
            };

            await axios.put(`/order/api/update`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            Swal.fire({
                title: "Muvaffaqiyatli!",
                icon: "success",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false
            });
            navigate(-1)
            setOpen(false);
        } catch (error) {
            console.log(error);
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
                        label="Sarlavha"
                        name="title"
                        value={formData.title || ""}
                        onChange={handleChange}
                    />
                    <Textarea
                        label="Tavsif"
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                    />
                    <Select
                        label="Kategoriya"
                        value={formData.category || ""}
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
                        value={formData.date || ""}
                        onChange={handleChange}
                    />
                    <Input
                        label="Ishchilar soni"
                        type="number"
                        name="workerCount"
                        value={formData.workerCount || 0}
                        onChange={handleChange}
                    />
                    <Select
                        label="Holati"
                        value={formData.status || ""}
                        onChange={(val) => handleSelectChange("status", val)}
                    >
                        {Object.entries(statusTranslations).map(([key, uzb]) => (
                            <Option key={key} value={key}>
                                {uzb}
                            </Option>
                        ))}
                    </Select>

                    <label className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            name="isSendNotification"
                            checked={!!formData.isSendNotification}
                            onChange={handleChange}
                        />
                        <span>Bildirishnoma yuborilsin</span>
                    </label>
                    <label className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            name="active"
                            checked={!!formData.active}
                            onChange={handleChange}
                        />
                        <span>Faol</span>
                    </label>
                    <label className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            name="isClosed"
                            checked={!!formData.isClosed}
                            onChange={handleChange}
                        />
                        <span>Yopilgan</span>
                    </label>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="gray" onClick={() => setOpen(false)}>
                        Bekor qilish
                    </Button>
                    <Button disabled={loading} color="blue" onClick={handleSubmit}>
                        {loading ? "Yuklanmoqda..." : "Saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
