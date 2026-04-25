"use client";

import { Edit2, Plus, Info, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const user = {
        name: "Name",
        email: "[EMAIL_ADDRESS]"
    };

    return (
        <main className="min-h-screen bg-[#fcfcfc] py-12 px-6 sm:px-12 font-sans text-gray-900">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Page Title */}
                <h1 className="text-2xl font-bold mb-8">Profile</h1>

                {/* Basic Info Section */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-500 font-medium">Name</span>
                            <button className="p-1 hover:bg-gray-50 rounded-full transition-colors">
                                <Edit2 className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        <p className="text-base font-semibold">{user.name}</p>
                    </div>

                    <div>
                        <span className="text-sm text-gray-500 font-medium block mb-1">Email</span>
                        <p className="text-base font-semibold">{user.email}</p>
                    </div>
                </div>

                {/* Addresses Section */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Addresses</h2>
                        <button className="flex items-center gap-1.5 text-sm font-bold hover:opacity-70 transition-opacity">
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>

                    <div className="bg-[#f8f8f8] rounded-xl p-4 flex items-center gap-3 text-gray-500 text-sm">
                        <Info className="w-4 h-4" />
                        <span>No addresses added</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-8 pt-4">
                    <button className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
                        Sign out
                    </button>
                    <button className="text-sm text-gray-400 hover:text-gray-900 transition-colors font-medium">
                        Sign out of all devices
                    </button>
                </div>

            </div>
        </main>
    );
}
