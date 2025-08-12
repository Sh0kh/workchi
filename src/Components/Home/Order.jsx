import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import NotStartedOrders from "./components/NotStartedOrders";
import InProgressOrders from "./components/InProgressOrders";
import CompletedOrders from "./components/CompletedOrders";

export default function Home() {
    const [activeTab, setActiveTab] = useState("not_started");

    const renderContent = () => {
        switch (activeTab) {
            case "not_started":
                return <NotStartedOrders />;
            case "in_progress":
                return <InProgressOrders />;
            case "completed":
                return <CompletedOrders />;
            default:
                return <NotStartedOrders />;
        }
    };

    return (
        <div className="">
            <div className="bg-[#1D262D] ">
                <div className="Container">
                    <div className="flex items-center  ">
                        <Button
                            onClick={() => setActiveTab("not_started")}
                            className={`py-[20px] rounded-none ${activeTab === "not_started" ? "bg-MainColor    " : ""}`}
                        >
                            Boshlanmagan
                        </Button>
                        <Button
                            onClick={() => setActiveTab("in_progress")}
                            className={`py-[20px] rounded-none ${activeTab === "in_progress" ? "bg-MainColor    " : ""}`}

                        >
                            Jarayondagi
                        </Button>
                        <Button
                            onClick={() => setActiveTab("completed")}
                            className={`py-[20px] rounded-none ${activeTab === "completed" ? "bg-MainColor    " : ""}`}
                        >
                            Tugallangan
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