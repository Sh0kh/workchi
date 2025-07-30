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

export default function OrderDelete({ orderId, refresh }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/order/api/delete?id=${orderId}`);
            refresh()
            handleOpen();
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
            <Button color="red" onClick={handleOpen}>
                O'chirish
            </Button>

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
