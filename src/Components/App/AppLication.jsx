import axios from "axios";
import { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Input,
    Button
} from "@material-tailwind/react";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";

export default function AppLication() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const formatNumber = (value) => {
        if (!value) return "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const cleanNumber = (value) => {
        return Number(value.toString().replace(/\s/g, ""));
    };

    const GetApp = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`/application/info`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const d = response.data.data;

            setData({
                ...d,
                bonusPrice: formatNumber(d.bonusPrice),
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const Edit = async () => {
        setSaving(true);

        try {
            await axios.put(
                `/application/update`,
                {
                    ...data,
                    bonusPrice: cleanNumber(data.bonusPrice),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            Swal.fire({
                title: "Muvaffaqiyatli saqlandi!",
                icon: "success",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false,
                customClass: { popup: "custom-z-index" }
            });

        } catch (error) {
            console.log(error);

            Swal.fire({
                title: "Xatolik!",
                text: error.response?.data?.message || "Muammo yuz berdi.",
                icon: "error",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false,
                customClass: { popup: "custom-z-index" }
            });

        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        GetApp();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
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
        <>
            <div className="bg-[#1D262D] h-[60px]">
                <div className="Container flex items-center">
                </div>
            </div>

            <div className="flex justify-center items-center w-full min-h-[70vh] p-4">
                <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-100">
                    <CardBody className="space-y-6">

                        <Typography variant="h5" className="font-semibold text-gray-800">
                            Ariza haqida ma'lumot
                        </Typography>

                        {/* BONUS PRICE INPUT */}
                        <div className="space-y-2">
                            <Typography className="text-gray-700 font-medium">
                                Bonus miqdori:
                            </Typography>

                            <Input
                                type="text"
                                value={data.bonusPrice}
                                onChange={(e) => {
                                    const raw = cleanNumber(e.target.value);
                                    setData((prev) => ({
                                        ...prev,
                                        bonusPrice: formatNumber(raw),
                                    }));
                                }}
                                className="!border-gray-300 focus:!border-gray-900"
                            />
                        </div>

                        <Button
                            onClick={Edit}
                            className="w-full bg-MainColor"
                            disabled={saving}
                        >
                            {saving ? "Saqlanmoqda..." : "Saqlash"}
                        </Button>

                    </CardBody>
                </Card>
            </div>
        </>
    );
}
