import axios from "axios";
import { useEffect, useState } from "react";
import {
    Card,
    Typography,
    Button,
    Input,
} from "@material-tailwind/react";
import ReactLoading from "react-loading";
import Regions from '../../Data/regions.json'
import districts from '../../Data/districts.json'

import { FaUser, FaTelegramPlane, FaPhone, FaMapMarkerAlt, FaHome, FaCalendarAlt, FaUserTie, FaChevronDown, FaChevronUp } from "react-icons/fa";
import DeleteUser from "./DeleteUser";
import { DollarSign } from "lucide-react";

export default function Worker() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filter states
    const [showFilter, setShowFilter] = useState(false);
    const [phoneFilter, setPhoneFilter] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [filteredDistricts, setFilteredDistricts] = useState([]);

    const size = 10;

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

    // Get region name by ID
    const getRegionName = (id) => {
        const region = Regions.find(r => r.id.toString() === id);
        return region ? region.name_uz : "";
    };

    // Get district name by ID
    const getDistrictName = (id) => {
        const district = filteredDistricts.find(d => d.id.toString() === id);
        return district ? district.name_uz : "";
    };

    const getAllUser = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/worker/getAll?page=${page}&size=${size}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = response.data?.data;
            setUsers(Array.isArray(data) ? data : []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error("Ishchilarni olishda xatolik:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredUsers = async () => {
        setLoading(true);
        try {
            let queryParams = `page=${page}&size=${size}`;

            if (phoneFilter.trim()) {
                queryParams += `&phoneNumber=${encodeURIComponent(phoneFilter.trim())}`;
            }

            if (selectedRegion) {
                queryParams += `&regionId=${selectedRegion}`;
            }

            if (selectedDistrict) {
                queryParams += `&districtId=${selectedDistrict}`;
            }

            const response = await axios.get(`/worker/getFilter?${queryParams}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = response.data?.data    ;
            setUsers(Array.isArray(data) ? data : []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error("Filterlashda xatolik:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleString("uz-UZ", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    useEffect(() => {
        getAllUser();
    }, [page]);

    useEffect(() => {
        if (selectedRegion) {
            const regionDistricts = districts.filter(district => district.region_id == selectedRegion);
            setFilteredDistricts(regionDistricts);
            setSelectedDistrict("");
        } else {
            setFilteredDistricts([]);
            setSelectedDistrict("");
        }
    }, [selectedRegion]);

    const handlePrevPage = () => {
        if (page > 0) setPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) setPage(prev => prev + 1);
    };

    const handleApplyFilter = () => {
        setPage(0);
        getFilteredUsers();
    };

    const handleClearFilter = () => {
        setPhoneFilter("");
        setSelectedRegion("");
        setSelectedDistrict("");
        setFilteredDistricts([]);
        setPage(0);
        getAllUser();
    };

    const toggleFilter = () => {
        setShowFilter(!showFilter);
    };

    if (loading) {
        return (
            <div className="min-h-screen p-4 flex items-center justify-center">
                <ReactLoading type="spinningBubbles" color="black" height={100} width={100} />
            </div>
        );
    }

    return (
        <>
            <div className="bg-MainColor py-[10px] mt-[20px] px-[30px] rounded-[6px] flex items-center justify-between">
                <div></div>
                <Button onClick={toggleFilter} className="flex items-center gap-2 bg-white text-MainColor hover:bg-gray-50">
                    Filter
                    {showFilter ? <FaChevronUp /> : <FaChevronDown />}
                </Button>
            </div>

            {/* Filter Accordion */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilter ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <Card className="mt-4 p-6 shadow-lg border border-gray-200">
                    <Typography variant="h6" className="mb-4 text-gray-800 font-semibold">
                        Qidiruv filterlari
                    </Typography>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Phone Filter */}
                        <div>
                            <Typography variant="small" className="mb-2 text-gray-700 font-medium">
                                Telefon raqami
                            </Typography>
                            <Input
                                type="text"
                                placeholder="Telefon raqamini kiriting"
                                value={phoneFilter}
                                onChange={(e) => setPhoneFilter(e.target.value)}
                                className="!border-gray-300 focus:!border-MainColor"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                        </div>

                        {/* Region Filter */}
                        <div>
                            <Typography variant="small" className="mb-2 text-gray-700 font-medium">
                                Viloyat
                            </Typography>
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-MainColor focus:border-MainColor transition duration-200 cursor-pointer hover:border-gray-400"
                            >
                                <option value="">Viloyatni tanlang</option>
                                {Regions.map((region) => (
                                    <option key={region.id} value={region.id.toString()}>
                                        {region.name_uz}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* District Filter */}
                        <div>
                            <Typography variant="small" className="mb-2 text-gray-700 font-medium">
                                Tuman/Shahar
                            </Typography>
                            <select
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                disabled={!selectedRegion}
                                className={`w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-MainColor focus:border-MainColor transition duration-200 cursor-pointer hover:border-gray-400 ${!selectedRegion ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                                    }`}
                            >
                                <option value="">Tuman/Shaharni tanlang</option>
                                {filteredDistricts.map((district) => (
                                    <option key={district.id} value={district.id.toString()}>
                                        {district.name_uz}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="outlined"
                            onClick={handleClearFilter}
                            className="border-gray-400 text-gray-700 hover:bg-gray-50 px-6 py-2"
                        >
                            Tozalash
                        </Button>
                        <Button
                            onClick={handleApplyFilter}
                            className="bg-MainColor hover:bg-MainColor/90 px-6 py-2 shadow-md"
                        >
                            Qidirish
                        </Button>
                    </div>
                </Card>
            </div>

            <div className="Container">;
                <div className="flex items-center gap-[20px] flex-col mt-[30px]">
                    {users.length > 0 ? (
                        users.map((item, index) => (
                            <Card
                                key={index}
                                className="shadow-lg border w-full border-gray-200 bg-white p-6 rounded-xl hover:shadow-xl transition-shadow duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800">
                                        <FaUserTie className="text-MainColor" /> Ishchi ma'lumotlari
                                    </h2>
                                    <DeleteUser userId={item?.id} refresh={getAllUser} userType={`worker`} />
                                </div>

                                <div className="flex flex-col gap-3 text-gray-800">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-600">ID:</span>
                                        <span className="font-medium">{item?.id}</span>
                                    </div>
                                    {item?.fullName && (
                                        <div className="flex items-center gap-2">
                                            <FaUser className="text-sky-500" />
                                            <span className="font-semibold text-gray-600">Ismi:</span>
                                            <span className="font-medium">{item?.fullName}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <FaTelegramPlane className="text-sky-500" />
                                        <span className="font-semibold text-gray-600">Telegram ID:</span>
                                        <span className="font-medium">{item?.telegramId}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaPhone className="text-green-500" />
                                        <span className="font-semibold text-gray-600">Telefon:</span>
                                        <span className="font-medium">{item?.phoneNumber}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <FaMapMarkerAlt className="text-red-500 mt-1" />
                                        <span className="font-semibold text-gray-600">Hudud:</span>
                                        <span className="font-medium">
                                            {item?.workCities?.join(", ")}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <FaUser className="text-red-500 mt-1" />
                                        <span className="font-semibold text-gray-600">Ishchini ishi:</span>
                                        <span className="font-medium">
                                            {item?.services_category
                                                ?.map((cat) => categoryTranslations[cat] || cat) // переводим если есть
                                                .join(", ")}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaHome className="text-orange-500" />
                                        <span className="font-semibold text-gray-600">Uy manzili:</span>
                                        <span className="font-medium">{item?.homeAddress}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="text-green-500" />
                                        <span className="font-semibold text-gray-600">Balans:</span>
                                        <span className="font-medium">
                                            {item?.balance?.toLocaleString("ru-RU")} so‘m
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-purple-500" />
                                        <span className="font-semibold text-gray-600">Ro'yxatdan o'tgan:</span>
                                        <span className="font-medium">{formatDate(item?.createdAt)}</span>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="w-full p-8 text-center shadow-md">
                            <Typography color="gray" className="text-lg">
                                Ishchilar topilmadi.
                            </Typography>
                        </Card>
                    )}
                </div>

                <div className="flex justify-center items-center gap-4 mt-8 mb-8">
                    <Button
                        onClick={handlePrevPage}
                        disabled={page === 0}
                        className="bg-MainColor hover:bg-MainColor/90 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2"
                    >
                        Orqaga
                    </Button>
                    <span className="px-4 py-2 bg-gray-100 rounded-md font-medium text-gray-700">
                        {page + 1} / {totalPages}
                    </span>
                    <Button
                        onClick={handleNextPage}
                        disabled={page >= totalPages - 1}
                        className="bg-MainColor hover:bg-MainColor/90 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2"
                    >
                        Keyingi
                    </Button>
                </div>
            </div>
        </>
    )
}