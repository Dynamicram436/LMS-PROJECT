import React from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex bg-slate-50 min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 min-h-screen relative">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
