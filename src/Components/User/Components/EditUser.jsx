import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option,
    Textarea,
    Chip,
} from "@material-tailwind/react";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import regions from "../../Dashboard/Data/regions.json";
import districts from "../../Dashboard/Data/districts.json";

export default function EditUser({ user, refresh, userType }) {
    const [open, setOpen] = useState(false);
    const [selectedDistricts, setSelectedDistricts] = useState([]);
    const [filteredDistricts, setFilteredDistricts] = useState([]);

    const [formData, setFormData] = useState({
        id: user.id,
        username: user.fullName || user.username || "",
        user_phone_number: user.phoneNumber || user.user_phone_number || "",
        ...(userType === 'customer' ? {
            regionAndCityAddress: user.regionAndCityAddress || "",
            homeAddress: user.homeAddress || "",
            addressComment: user.addressComment || "",
        } : {}),
        ...(userType === 'worker' ? {
            regionId: user.regionId || "",
            citiesId: user.citiesId || [],
            workerCount: user.workerCount || 1,
            services_category: user.services_category || [],
            balance: user.balance || 0,
        } : {}),
        language: user.language || "uz",
        user_type: user.user_type || userType || "worker",
    });

    useEffect(() => {
        if (userType === 'worker' && formData.regionId) {
            const filtered = districts.filter(d => d.region_id === Number(formData.regionId));
            setFilteredDistricts(filtered);

            // Initialize selected districts if citiesId exists
            if (user.citiesId && user.citiesId.length > 0) {
                const initialDistricts = filtered.filter(d =>
                    user.citiesId.includes(d.id)
                );
                setSelectedDistricts(initialDistricts);
            }
        }
    }, [formData.regionId, userType]);

    const handleOpen = () => setOpen(!open);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDistrictSelect = (district) => {
        if (userType === 'worker') {
            const isSelected = selectedDistricts.some(d => d.id === district.id);
            let updatedDistricts;

            if (isSelected) {
                updatedDistricts = selectedDistricts.filter(d => d.id !== district.id);
            } else {
                updatedDistricts = [...selectedDistricts, district];
            }

            setSelectedDistricts(updatedDistricts);
            setFormData(prev => ({
                ...prev,
                citiesId: updatedDistricts.map(d => d.id),
            }));
        }
    };

    const handleSave = async () => {
        try {
            let payload;

            if (userType === 'worker') {
                payload = {
                    id: formData.id,
                    fullName: formData.username,
                    phoneNumber: formData.user_phone_number,
                    regionId: Number(formData.regionId),
                    citiesId: formData.citiesId,
                    services_category: Array.isArray(formData.services_category)
                        ? formData.services_category
                        : [formData.services_category],
                    balance: Number(formData.balance),
                    workerCount: Number(formData.workerCount),
                    language: formData.language,
                    user_type: formData.user_type
                };
            } else {
                payload = formData;
            }

            await axios.put(`/${userType}/update`, payload);
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

            refresh?.();
            handleOpen();
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
            console.error(error);
        }
    };

    return (
        <>
            <Button size="sm" color="blue" onClick={handleOpen}>
                Tahrirlash
            </Button>

            <Dialog open={open} handler={handleOpen} size="lg">
                <DialogHeader>Foydalanuvchini tahrirlash</DialogHeader>
                <DialogBody className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                    <Input
                        label="F.I.Sh"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <Input
                        label="Telefon raqami"
                        name="user_phone_number"
                        value={formData.user_phone_number}
                        onChange={handleChange}
                    />

                    {userType === 'customer' ? (
                        <>
                            <Input
                                label="Viloyat va tuman manzili"
                                name="regionAndCityAddress"
                                value={formData.regionAndCityAddress}
                                onChange={handleChange}
                                className="col-span-2"
                            />
                            <Input
                                label="Uy manzili"
                                name="homeAddress"
                                value={formData.homeAddress}
                                onChange={handleChange}
                                className="col-span-2"
                            />
                            <Textarea
                                label="Manzil haqida izoh"
                                name="addressComment"
                                value={formData.addressComment}
                                onChange={handleChange}
                                className="col-span-2"
                            />
                        </>
                    ) : (
                        <>
                            {/* Viloyat for worker */}
                            <div className="col-span-2">
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Viloyat
                                </label>
                                <select
                                    name="regionId"
                                    value={formData.regionId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Tanlang --</option>
                                    {regions.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name_uz}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tumanlar for worker */}
                            {formData.regionId && (
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Ish joylashgan shahar/tumanlar
                                    </label>
                                    <div className="border border-gray-300 rounded-md p-2 min-h-12">
                                        {selectedDistricts.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedDistricts.map(district => (
                                                    <Chip
                                                        key={district.id}
                                                        value={district.name_uz}
                                                        onClose={() => handleDistrictSelect(district)}
                                                        className="bg-blue-500 text-white"
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-sm">Tuman tanlanmagan</p>
                                        )}
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {filteredDistricts.map(district => (
                                            <Button
                                                key={district.id}
                                                size="sm"
                                                variant={selectedDistricts.some(d => d.id === district.id) ? "filled" : "outlined"}
                                                color="blue"
                                                onClick={() => handleDistrictSelect(district)}
                                                className="text-xs"
                                            >
                                                {district.name_uz}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <Input
                                label="Ishchilar soni"
                                name="workerCount"
                                type="number"
                                value={formData.workerCount}
                                onChange={handleChange}
                            />
                            <Input
                                label="Balans"
                                name="balance"
                                type="number"
                                value={formData.balance}
                                onChange={handleChange}
                            />
                            <div className="col-span-2">
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Xizmat turlari
                                </label>
                                <Input
                                    name="services_category"
                                    value={Array.isArray(formData.services_category)
                                        ? formData.services_category.join(', ')
                                        : formData.services_category}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        services_category: e.target.value.split(',').map(item => item.trim())
                                    }))}
                                    placeholder="Xizmat turlarini vergul bilan ajrating"
                                />
                            </div>
                        </>
                    )}

                    <Select
                        label="Til"
                        value={formData.language}
                        onChange={(val) => setFormData(prev => ({ ...prev, language: val }))}
                    >
                        <Option value="uz">Uzbek</Option>
                        <Option value="ru">Russian</Option>
                    </Select>

                </DialogBody>

                <DialogFooter>
                    <Button variant="text" color="gray" onClick={handleOpen} className="mr-2">
                        Bekor qilish
                    </Button>
                    <Button color="blue" onClick={handleSave}>
                        Saqlash
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}