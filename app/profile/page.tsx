"use client";

import { useState, useEffect } from "react";
import { Edit2, Plus, Info, LogOut, MapPin, X, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useVendor } from "@/context/VendorContext";
import { updateUserAPi } from "@/api-endpoints/authendication";
import { getAddressApi, postAddressCreateApi, updateAddressApi, deleteAddressApi } from "@/api-endpoints/CartsApi";

export default function ProfilePage() {
    const { user, setUser } = useUser();
    const { vendorId } = useVendor();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form states
    const [profileName, setProfileName] = useState("");
    const [addressForm, setAddressForm] = useState({
        full_name: "",
        contact_number: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        address_type: "Home", // Default value
        is_default: false
    });

    useEffect(() => {
        if (user) {
            setProfileName(user.data?.name || user.name || "");
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        if (!user) return;
        const userId = user.data?.id || user.id;
        try {
            const res = await getAddressApi(`user/${userId}/vendor/${vendorId}`);
            setAddresses(res.data || []);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const userId = user.data?.id || user.id;
        try {
            const res = await updateUserAPi(`${userId}`, { name: profileName });
            if (res) {
                // Update local user state
                setUser({ ...user, name: profileName, data: { ...user.data, name: profileName } });
                setIsEditProfileModalOpen(false);
                alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (addressForm.contact_number.length !== 10 || !/^\d{10}$/.test(addressForm.contact_number)) {
            alert("Contact number must be exactly 10 digits.");
            return;
        }

        setIsLoading(true);
        const userId = user.data?.id || user.id;
        
        const payload = {
            ...addressForm,
            address_line1: addressForm.address_line_1,
            address_line2: addressForm.address_line_2,
            postal_code: addressForm.pincode,
            mobile: addressForm.contact_number,
            created_by: user.data?.name || user.name || "User",
            user: userId,
            vendor: vendorId
        };

        try {
            if (editingAddress) {
                await updateAddressApi(`${editingAddress.id}/`, payload);
                alert("Address updated successfully!");
            } else {
                await postAddressCreateApi("", payload);
                alert("Address added successfully!");
            }
            setIsAddressModalOpen(false);
            setEditingAddress(null);
            fetchAddresses();
        } catch (error: any) {
            console.error("Error saving address:", error);
            alert(error?.response?.data?.error || "Failed to save address.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAddress = async (id: number) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            await deleteAddressApi(`${id}/`, {});
            fetchAddresses();
            alert("Address deleted successfully!");
        } catch (error) {
            console.error("Error deleting address:", error);
            alert("Failed to delete address.");
        }
    };

    const openAddressModal = (address: any = null) => {
        if (address) {
            setEditingAddress(address);
            setAddressForm({
                full_name: address.full_name || "",
                contact_number: address.contact_number || "",
                address_line_1: address.address_line_1 || "",
                address_line_2: address.address_line_2 || "",
                city: address.city || "",
                state: address.state || "",
                pincode: address.pincode || address.postal_code || "",
                landmark: address.landmark || "",
                address_type: address.address_type || "Home",
                is_default: address.is_default || false
            });
        } else {
            setEditingAddress(null);
            setAddressForm({
                full_name: "",
                contact_number: "",
                address_line_1: "",
                address_line_2: "",
                city: "",
                state: "",
                pincode: "",
                landmark: "",
                address_type: "Home",
                is_default: false
            });
        }
        setIsAddressModalOpen(true);
    };

    const handleSignOut = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("cartId");
        window.location.href = "/login";
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
                <div className="text-center">
                    <h2 className="text-xl font-medium mb-4">Please login to view your profile</h2>
                    <Link href="/login" className="px-6 py-2 bg-black text-white rounded-full font-bold">Login</Link>
                </div>
            </div>
        );
    }

    const userData = user.data || user;

    return (
        <main className="min-h-screen bg-[#fcfcfc] py-12 px-6 sm:px-12 font-sans text-gray-900">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Page Title */}
                <h1 className="text-3xl font-serif italic mb-10 text-[#000000]">My Account</h1>

                {/* Basic Info Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-400">Basic Information</h2>
                        <button 
                            onClick={() => setIsEditProfileModalOpen(true)}
                            className="p-2 hover:bg-gray-50 rounded-full transition-colors text-black"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold block mb-2">Full Name</span>
                            <p className="text-lg font-bold">{userData.name}</p>
                        </div>

                        <div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold block mb-2">Email Address</span>
                            <p className="text-lg font-bold">{userData.email}</p>
                        </div>
                        
                        {userData.contact_number && (
                            <div>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold block mb-2">Mobile Number</span>
                                <p className="text-lg font-bold">+91 {userData.contact_number}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Addresses Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-400">Saved Addresses</h2>
                        <button 
                            onClick={() => openAddressModal()}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold hover:opacity-80 transition-all shadow-md"
                        >
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </div>

                    {addresses.length === 0 ? (
                        <div className="bg-[#f8f8f8] rounded-2xl p-10 flex flex-col items-center gap-4 text-gray-400 text-center">
                            <MapPin className="w-8 h-8 opacity-20" />
                            <p className="text-sm italic font-medium">You haven&apos;t added any addresses yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {addresses.map((addr) => (
                                <div key={addr.id} className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-black/5 transition-all duration-300">
                                    {addr.is_default && (
                                        <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                            <CheckCircle2 className="w-3 h-3" /> Default
                                        </div>
                                    )}
                                    <div className="space-y-3">
                                        <p className="font-bold text-base">{addr.full_name}</p>
                                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                            {addr.address_line_1}, {addr.address_line_2 && `${addr.address_line_2}, `}
                                            {addr.city}, {addr.state} - {addr.pincode}
                                        </p>
                                        <p className="text-xs font-bold text-black">Phone: {addr.contact_number}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => openAddressModal(addr)}
                                            className="text-xs font-bold text-gray-400 hover:text-black transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteAddress(addr.id)}
                                            className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-8 pt-10">
                    <button 
                        onClick={handleSignOut}
                        className="px-10 py-4 bg-black text-white rounded-full text-sm font-bold shadow-xl hover:opacity-90 transition-all flex items-center gap-3 uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4" /> Sign out
                    </button>
                    <button className="text-xs text-gray-400 hover:text-red-500 transition-colors font-bold uppercase tracking-widest">
                        Delete Account
                    </button>
                </div>

                {/* Edit Profile Modal */}
                {isEditProfileModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2rem] w-full max-w-md p-8 sm:p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                            <button 
                                onClick={() => setIsEditProfileModalOpen(false)}
                                className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <h3 className="text-2xl font-serif italic mb-8">Edit Profile</h3>
                            
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Full Name</label>
                                    <input 
                                        type="text"
                                        value={profileName}
                                        onChange={(e) => setProfileName(e.target.value)}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                        required
                                    />
                                </div>
                                
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-black text-white py-4 rounded-full font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                                >
                                    {isLoading ? "Updating..." : "Save Changes"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Address Modal */}
                {isAddressModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white rounded-[2rem] w-full max-w-xl p-8 sm:p-10 shadow-2xl relative my-8 animate-in fade-in zoom-in duration-300">
                            <button 
                                onClick={() => setIsAddressModalOpen(false)}
                                className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <h3 className="text-2xl font-serif italic mb-8">{editingAddress ? "Edit Address" : "Add New Address"}</h3>
                            
                            <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Full Name</label>
                                    <input 
                                        type="text"
                                        value={addressForm.full_name}
                                        onChange={(e) => setAddressForm({...addressForm, full_name: e.target.value})}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Contact Number</label>
                                    <input 
                                        type="tel"
                                        value={addressForm.contact_number}
                                        onChange={(e) => setAddressForm({...addressForm, contact_number: e.target.value})}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Address Line 1</label>
                                    <input 
                                        type="text"
                                        value={addressForm.address_line_1}
                                        onChange={(e) => setAddressForm({...addressForm, address_line_1: e.target.value})}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Address Line 2 (Optional)</label>
                                    <input 
                                        type="text"
                                        value={addressForm.address_line_2}
                                        onChange={(e) => setAddressForm({...addressForm, address_line_2: e.target.value})}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">City</label>
                                    <input 
                                        type="text"
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">State</label>
                                    <input 
                                        type="text"
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Pincode</label>
                                    <input 
                                        type="text"
                                        value={addressForm.pincode}
                                        onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Landmark (Optional)</label>
                                    <input 
                                        type="text"
                                        value={addressForm.landmark}
                                        onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Address Type</label>
                                    <div className="flex gap-4">
                                        {["Home", "Office"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setAddressForm({...addressForm, address_type: type})}
                                                className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                                                    addressForm.address_type === type 
                                                    ? "bg-black text-white border-black" 
                                                    : "bg-gray-50 text-gray-500 border-transparent hover:border-gray-200"
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2 flex items-center gap-3 px-1 mt-2">
                                    <input 
                                        type="checkbox"
                                        id="is_default"
                                        checked={addressForm.is_default}
                                        onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})}
                                        className="w-5 h-5 accent-black rounded border-gray-300 focus:ring-black"
                                    />
                                    <label htmlFor="is_default" className="text-sm font-bold text-gray-700">Set as default address</label>
                                </div>
                                
                                <div className="md:col-span-2 pt-4">
                                    <button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-black text-white py-4 rounded-full font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                                    >
                                        {isLoading ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
