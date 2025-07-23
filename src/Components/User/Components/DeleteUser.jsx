import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";


export default function DeleteUser({ userId, refresh, userType }) {
    const [open, setOpen] = useState(false);


    const handleOpen = () => setOpen(!open);

    const handleConfirmDelete = async () => {
        try {
            const response = await axios.delete(`/${userType}/delete?id=${userId}`)
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
        }
    };

    return (
        <>
            {/* Кнопка удаления */}
            <Button size="sm" color="red" onClick={handleOpen}>
                O‘chirish
            </Button>

            {/* Модальное окно подтверждения */}
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Rostdan ham o‘chirmoqchimisiz?</DialogHeader>
                <DialogBody>
                    Ushbu foydalanuvchini o‘chirish amalini bekor qilib bo‘lmaydi.
                    Davom etishni istaysizmi?
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="gray" onClick={handleOpen} className="mr-2">
                        Bekor qilish
                    </Button>
                    <Button color="red" onClick={handleConfirmDelete}>
                        Ha, o‘chirilsin
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
