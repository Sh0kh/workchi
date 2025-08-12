import { useEffect, useState } from "react";
import {
    Button,
} from "@material-tailwind/react";
import Worker from "./Components/Worker";
import Customer from "./Components/Customer";

export default function User() {
    const [userType, setUserType] = useState("worker");




    const renderContent = () => {
        switch (userType) {
            case "worker":
                return <Worker />;
            case "customer":
                return <Customer />;
        }
    };


    return (
        <div>
            <div className="bg-[#1D262D]">
                <div className="Container">
                    <div className="flex items-center">
                        <Button
                            onClick={() => { setUserType("worker"); }}
                            className={`py-[20px] rounded-none ${userType === "worker" ? "bg-MainColor" : ""}`}
                        >
                            Ishchi
                        </Button>
                        <Button
                            onClick={() => { setUserType("customer"); }}
                            className={`py-[20px] rounded-none ${userType === "customer" ? "bg-MainColor" : ""}`}
                        >
                            Mijoz
                        </Button>
                    </div>
                </div>
            </div>
            <div className="Container">
                {renderContent()}
            </div>

        </div>
    );
}
