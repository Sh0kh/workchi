import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Typography, Input } from "@material-tailwind/react";
import Regions from '../../Data/regions.json'
import districts from '../../Data/districts.json'

import axios from "../../../utils/axios";
import ReactLoading from "react-loading";
import { NavLink, useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function NotStartedOrders() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [size] = useState(10);
    const navigate = useNavigate();

    // Filter states
    const [showFilter, setShowFilter] = useState(false);
    const [phoneFilter, setPhoneFilter] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filteredDistricts, setFilteredDistricts] = useState([]);

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

    const categoryOptions = [
        { value: "cleaning", label: "Tozalash" },
        { value: "laundry", label: "Kir yuvish" },
        { value: "furniture", label: "Mebel" },
        { value: "plumbing", label: "Santexnika" },
        { value: "electrical", label: "Elektr ishlari" },
        { value: "tiling", label: "Kafel/Plitka" },
        { value: "hourly_workers", label: "Soatbay ishchilar" },
        { value: "other_service", label: "Boshqa xizmat" }
    ];

    const fetchNotStartedOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/order/getAll", {
                params: {
                    status: "NOT_STARTED",
                    page: 0,
                    size,
                },
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setData(response.data.data?.orders || []);
        } catch (error) {
            console.log(error);
            if (error?.code === 401) {
                navigate('/login')
                localStorage.clear()
            }
        } finally {
            setLoading(false);
        }
    };

    const getFilteredOrders = async () => {
        setLoading(true);
        try {
            let params = {
                page: 0,
                size,
            };

            if (phoneFilter.trim()) {
                params.phoneNumber = phoneFilter.trim();
            }

            if (selectedRegion) {
                params.regionId = selectedRegion;
            }

            if (selectedDistrict) {
                params.districtId = selectedDistrict;
            }

            if (selectedCategory) {
                params.category = selectedCategory;
            }

            const response = await axios.get("/order/getFilter", {
                params,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setData(response.data?.data || []);
        } catch (error) {
            console.log("Filterlashda xatolik:", error);
            if (error?.code === 401) {
                navigate('/login')
                localStorage.clear()
            }
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotStartedOrders();
    }, []);

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

    const handleApplyFilter = () => {
        getFilteredOrders();
    };

    const handleClearFilter = () => {
        setPhoneFilter("");
        setSelectedRegion("");
        setSelectedDistrict("");
        setSelectedCategory("");
        setFilteredDistricts([]);
        fetchNotStartedOrders();
    };

    const toggleFilter = () => {
        setShowFilter(!showFilter);
    };

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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

                        {/* Category Filter */}
                        <div>
                            <Typography variant="small" className="mb-2 text-gray-700 font-medium">
                                Kategoriya
                            </Typography>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-MainColor focus:border-MainColor transition duration-200 cursor-pointer hover:border-gray-400"
                            >
                                <option value="">Kategoriyani tanlang</option>
                                {categoryOptions.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
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

            {data.length === 0 && !loading ? (
                <div className="flex items-center justify-center h-64 mt-4">
                    <Card className="w-full p-8 text-center shadow-md">
                        <Typography color="gray" className="text-lg">
                            Boshlanmagan buyurtmalar mavjud emas
                        </Typography>
                    </Card>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 mt-[10px] pb-[50px]">
                    {data.map((item, index) => (
                        <Card
                            key={index}
                            className="shadow-lg border border-gray-200 bg-white p-4 hover:shadow-xl transition-shadow duration-200"
                        >
                            <div className="flex items-center gap-[30px] mb-[20px]">
                                <div className="flex items-center gap-[10px]">
                                    <h2 className="text-[20px] font-bold text-gray-800">{item?.title}</h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-[30px]">
                                <div className="flex items-center gap-[10px]">
                                    <span className="font-semibold text-gray-600">№ loti:</span>
                                    <span className="block px-[20px] text-[15px] py-[2px] bg-MainColor rounded-[8px] text-white font-medium">
                                        {item?.id}
                                    </span>
                                </div>
                                <div className="flex items-center gap-[10px]">
                                    <span className="font-semibold text-gray-600">Kategoriya:</span>
                                    <span className="font-medium text-gray-800">
                                        {categoryTranslations[item?.category] || item?.category}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-start gap-[20px] mt-[15px]">
                                <div className="w-[55%]">
                                    <p className="text-[18px] text-gray-700 leading-relaxed">
                                        {item?.description}
                                    </p>
                                </div>
                                <div className="h-[100px] w-[1px] bg-gray-300"></div>
                                <div className="flex items-center flex-col gap-[10px]">
                                    <div className="flex items-center gap-[5px]">
                                        <span className="text-[17px] font-medium text-gray-600">
                                            Mijoz telefon raqami:
                                        </span>
                                        <span className="block px-[5px] text-[15px] py-[8px] bg-MainColor rounded-[8px] text-white font-medium">
                                            {(item?.owner?.phoneNumber)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-[5px]">
                                        <span className="text-[17px] font-medium text-gray-600">
                                            Boshlangan vaqti:
                                        </span>
                                        <span className="block px-[5px] text-[15px] py-[8px] bg-MainColor rounded-[8px] text-white font-medium">
                                            {formatDateTime(item?.date)}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-[100px] w-[1px] bg-gray-300"></div>
                                <div className="w-auto">
                                    <NavLink to={`/ns/order/${item?.id}`} state={{ item }}>
                                        <button className="w-[140px] hover:bg-transparent text-white hover:text-MainColor border-[2px] border-MainColor duration-300 bg-MainColor px-[10px] py-[8px] rounded-[6px] block font-medium shadow-md hover:shadow-lg">
                                            Batafsil
                                        </button>
                                    </NavLink>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-[20px]">
                                <div className="flex items-center gap-[10px]">
                                    <span className="block px-[5px] text-[25px] py-[2px] bg-MainColor rounded-[8px] text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"></path></svg>
                                    </span>
                                    <span className="text-gray-700 font-medium">
                                        {item?.address}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}