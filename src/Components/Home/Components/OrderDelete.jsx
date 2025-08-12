import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
} from "@material-tailwind/react";
import Swal from "sweetalert2";

import { useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrderDelete({ orderId }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()

    const handleOpen = () => setOpen(!open);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/order/api/delete?id=${orderId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            handleOpen();
            navigate(-1)
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
        } catch (error) {
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
        }
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
                <Trash2 className="w-4 h-4 mr-2" />
                O'chirish
            </button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Rostdan ham o'chirmoqchimisiz?</DialogHeader>
                <DialogBody>
                    Ushbu buyurtma o'chirilgandan so'ng uni tiklab bo'lmaydi.
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="gray" onClick={handleOpen}>
                        <span>Bekor qilish</span>
                    </Button>
                    <Button color="red" onClick={handleDelete} className="ml-2">
                        <span>O'chirish</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
