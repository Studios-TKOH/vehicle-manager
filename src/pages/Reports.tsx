import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Inbox, Receipt, Package, Truck, Users, FileText, BarChart3 } from "lucide-react";
import { REPORTES_DISPONIBLES } from "../constants/reports/reportsData";

const iconMap: Record<string, React.ElementType> = {
    receipt: Receipt,
    package: Package,
    truck: Truck,
    users: Users
};

export const Reports = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const items = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return REPORTES_DISPONIBLES;
        return REPORTES_DISPONIBLES.filter(
            (it) =>
                it.titulo.toLowerCase().includes(q) ||
                it.descripcion.toLowerCase().includes(q)
        );
    }, [query]);

    return (
        <div className="flex flex-col bg-white shadow-sm border border-gray-200 rounded-lg w-full h-full min-h-[85vh]">
            <div className="flex justify-between items-center bg-gray-50/60 px-6 py-5 border-b">
                
                <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-blue-100 p-2 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-blue-600" strokeWidth={2} />
                    </div>
                    <h2 className="m-0 font-semibold text-gray-800 text-2xl">Reportes</h2>
                </div>

                
            </div>

            <div className="flex-1 bg-gray-50/30 px-6 py-6 w-full overflow-y-auto">
                <div className="gap-5 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((item, idx) => {
                        const handleClick = () => navigate(`/reports/${item.id}`);
                        const IconComponent = iconMap[item.icono] || FileText;

                        return (
                            <button
                                key={idx}
                                onClick={handleClick}
                                className="group flex flex-col justify-center items-center bg-white shadow-sm hover:shadow-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 w-full h-40 text-left transition"
                            >
                                <div className="flex justify-center items-center bg-orange-50 mb-3 rounded-full ring-1 ring-orange-100 group-hover:ring-orange-200 w-14 h-14 transition-all">
                                    <IconComponent size={28} className="text-orange-500" strokeWidth={1.5} />
                                </div>

                                <div className="px-4 text-center">
                                    <div className="font-semibold text-gray-800 text-base">
                                        {item.titulo}
                                    </div>
                                    <div className="mt-0.5 text-gray-500 text-sm leading-snug">
                                        {item.descripcion}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {items.length === 0 && (
                    <div className="flex flex-col justify-center items-center mt-12 text-gray-500">
                        <Inbox size={48} className="mb-3 text-gray-300" />
                        <p>No se encontraron reportes para “{query}”.</p>
                    </div>
                )}
            </div>
        </div>
    );
};