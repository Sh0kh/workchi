import axios from "axios";
import { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Button,
    Select,
    Option,
} from "@material-tailwind/react";
import ReactLoading from "react-loading";
import DeleteUser from "./Components/DeleteUser";
import EditUser from "./Components/EditUser";

export default function User() {
    const [userType, setUserType] = useState("worker");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const size = 10;

    const getAllUser = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/${userType}/getAll?page=${page}&size=${size}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });

            const data = response.data;
            setUsers(Array.isArray(data.content) ? data.content : []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error("Foydalanuvchilarni olishda xatolik:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllUser();
    }, [userType, page]);

    const handlePrevPage = () => {
        if (page > 0) setPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) setPage(prev => prev + 1);
    };

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
        <div className="p-6 mt-[80px]">
            {/* Фильтр по типу пользователя */}
            <div className="mb-6 w-60">
                <Select
                    label="Foydalanuvchi turini tanlang"
                    value={userType}
                    onChange={(val) => {
                        setPage(0);
                        setUserType(val);
                    }}
                >
                    <Option value="worker">Ishchi</Option>
                    <Option value="customer">Mijoz</Option>
                </Select>
            </div>

            {/* Карточки пользователей */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <Card
                            key={user.id}
                            className="shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-down"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <CardBody>
                                <Typography variant="h5" color="blue-gray" className="mb-2">
                                    {user.fullName || user.username}
                                </Typography>
                                <Typography className="text-sm text-gray-600">
                                    📱 Tel: {user.phoneNumber || user.user_phone_number}
                                </Typography>
                                <Typography className="text-sm text-gray-600">
                                    📍 Manzil: {user.region || user.fullAddress}
                                </Typography>
                                {user.language && (
                                    <Typography className="text-sm text-gray-600">
                                        🗣️ Til: {user.language.toUpperCase()}
                                    </Typography>
                                )}
                                <Typography className="text-sm text-gray-600">
                                    👤 Turi: {userType === "worker" ? "Ishchi" : "Mijoz"}
                                </Typography>
                                <Typography className="text-sm text-gray-600">
                                    📅 Yar.t.: {new Date(...user.createdAt).toLocaleString("uz-UZ")}
                                </Typography>

                                <div className="mt-4 flex gap-2">
                                    <EditUser userType={userType} user={user} refresh={getAllUser} />
                                    <DeleteUser userType={userType} userId={user?.id} refresh={getAllUser} />
                                </div>
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <Typography color="gray" className="col-span-full text-center">
                        Foydalanuvchilar topilmadi.
                    </Typography>
                )}
            </div>

            {/* Пагинация */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <Button onClick={handlePrevPage} disabled={page === 0}>
                    Orqaga
                </Button>
                <span>
                    {page + 1} / {totalPages}
                </span>
                <Button onClick={handleNextPage} disabled={page >= totalPages - 1}>
                    Keyingi
                </Button>
            </div>
        </div>
    );
}
