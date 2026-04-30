"use client";

import { useState, useEffect } from "react";
import { Edit2, Plus, Info, LogOut, MapPin, X, Trash2, CheckCircle2, Home, Briefcase, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useVendor } from "@/context/VendorContext";
import { updateUserAPi, patchUserSelectAddressAPi } from "@/api-endpoints/authendication";
import { getAddressApi, postAddressCreateApi, updateAddressApi, deleteAddressApi } from "@/api-endpoints/CartsApi";
import { useToast } from "@/context/ToastContext";
import { safeErrorLog } from "@/utils/error-handler";
import { handleApiError } from "@/utils/error-utils";

export default function ProfilePage() {
    const { user, setUser, logout } = useUser();
    const { vendorId } = useVendor();
    const { showToast } = useToast();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any>(null);
    const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [profileContact, setProfileContact] = useState("");
    const [addressForm, setAddressForm] = useState({
        customer_name: "",
        contact_number: "",
        email_address: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        landmark: "",
        address_type: "Home",
        selected_address: false
    });

    useEffect(() => {
        if (user) {
            const data = user.data || user;
            setProfileName(data.name || data.first_name || "");
            setProfileEmail(data.email || "");
            setProfileContact(data.contact_number || "");
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        if (!user) return;
        const userId = user.data?.id || user.id;
        try {
            const res = await getAddressApi(`user/${userId}`);
            setAddresses(res.data || []);
        } catch (error) {
            safeErrorLog("Error fetching addresses", error);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const userId = user.data?.id || user.id;
        try {
            const res = await updateUserAPi(`/${userId}`, {
                contact_number: profileContact,
                email: profileEmail,
                name: profileName,
                role: 3,
                updated_by: profileName,
                vendor: vendorId
            });
            if (res) {
                // Update local user state
                setUser({
                    ...user,
                    name: profileName,
                    email: profileEmail,
                    contact_number: profileContact,
                    data: {
                        ...user.data,
                        name: profileName,
                        email: profileEmail,
                        contact_number: profileContact
                    }
                });
                setIsEditProfileModalOpen(false);
                showToast("Profile updated successfully!", "success");
            }
        } catch (error) {
            safeErrorLog("Error updating profile", error);
            showToast(handleApiError(error), "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        const phoneRegex = /^[0-9]{10}$/;
        const pinRegex = /^[0-9]{6}$/;

        if (!addressForm.customer_name) {
            showToast("Customer Name is required", "error");
            return;
        }
        if (!addressForm.contact_number) {
            showToast("Contact Number is required", "error");
            return;
        }
        if (!phoneRegex.test(addressForm.contact_number)) {
            showToast("Phone number must be exactly 10 digits", "error");
            return;
        }
        if (!addressForm.email_address) {
            showToast("Email Address is required", "error");
            return;
        }
        if (!addressForm.address_line1) {
            showToast("Address Line 1 is required", "error");
            return;
        }
        if (!addressForm.city) {
            showToast("City is required", "error");
            return;
        }
        if (!addressForm.state) {
            showToast("State is required", "error");
            return;
        }
        if (!addressForm.postal_code) {
            showToast("Pincode is required", "error");
            return;
        }
        if (!pinRegex.test(addressForm.postal_code)) {
            showToast("Pincode must be exactly 6 digits", "error");
            return;
        }

        setIsLoading(true);
        const userId = user.data?.id || user.id;
        const userData = user.data || user;

        const payload = {
            ...addressForm,
            user: userId,
            vendor: vendorId,
            created_by: editingAddress ? editingAddress.created_by : (userData.name || userData.first_name || "User"),
            updated_by: userData.name || userData.first_name || "User"
        };

        try {
            if (editingAddress) {
                await updateAddressApi(`${editingAddress.id}/`, payload);
                showToast("Address updated successfully!", "success");
            } else {
                await postAddressCreateApi("", payload);
                showToast("Address added successfully!", "success");
            }
            fetchAddresses();
            setIsAddressModalOpen(false);
            setEditingAddress(null);
            // Reset form
            setAddressForm({
                customer_name: "",
                contact_number: "",
                email_address: "",
                address_line1: "",
                address_line2: "",
                city: "",
                state: "",
                postal_code: "",
                landmark: "",
                address_type: "Home",
                selected_address: false
            });
        } catch (error) {
            safeErrorLog("Error saving address", error);
            showToast(handleApiError(error), "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAddress = (id: number) => {
        setAddressToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteAddress = async () => {
        if (!addressToDelete) return;
        const userData = user.data || user;
        setIsLoading(true);
        try {
            await deleteAddressApi(`${addressToDelete}/`, {
                deleted_by: userData.name || userData.first_name || "User"
            });
            showToast("Address removed successfully!", "success");
            fetchAddresses();
            setIsDeleteModalOpen(false);
        } catch (error) {
            safeErrorLog("Error deleting address", error);
            showToast(handleApiError(error), "error");
        } finally {
            setIsLoading(false);
            setAddressToDelete(null);
        }
    };

    const handleSetDefault = async (address: any) => {
        setIsLoading(true);
        const userId = user.data?.id || user.id;
        const userData = user.data || user;
        try {
            await patchUserSelectAddressAPi(`user/${userId}/address/${address.id}`, {
                updated_by: userData.name || userData.first_name || "User"
            });
            showToast("Active address updated successfully!", "success");
            fetchAddresses();
        } catch (error) {
            safeErrorLog("Error setting active address", error);
            showToast(handleApiError(error), "error");
        } finally {
            setIsLoading(false);
        }
    };

    const openAddressModal = (address: any = null) => {
        if (address) {
            setEditingAddress(address);
            setAddressForm({
                customer_name: address.customer_name || "",
                contact_number: address.contact_number || "",
                email_address: address.email_address || "",
                address_line1: address.address_line1 || "",
                address_line2: address.address_line2 || "",
                city: address.city || "",
                state: address.state || "",
                postal_code: address.postal_code || "",
                landmark: address.landmark || "",
                address_type: address.address_type || "Home",
                selected_address: address.selected_address || false
            });
        } else {
            setEditingAddress(null);
            setAddressForm({
                customer_name: "",
                contact_number: "",
                email_address: "",
                address_line1: "",
                address_line2: "",
                city: "",
                state: "",
                postal_code: "",
                landmark: "",
                address_type: "Home",
                selected_address: false
            });
        }
        setIsAddressModalOpen(true);
    };

    const handleSignOut = () => {
        logout();
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
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-3xl font-serif italic text-[#000000]">My Account</h1>
                    <button
                        onClick={handleSignOut}
                        className="px-8 py-4 bg-black text-white rounded-full text-xs font-bold shadow-xl hover:opacity-90 transition-all flex items-center gap-3 uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>

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
                                <p className="text-lg font-bold">{userData.contact_number}</p>
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
                                <div
                                    key={addr.id}
                                    className={`group relative bg-white border rounded-[1.5rem] p-6 flex flex-col h-full transition-all duration-300 ${addr.selected_address
                                        ? 'border-black ring-1 ring-black shadow-md translate-y-[-2px]'
                                        : 'border-gray-300 shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-gray-50 border border-gray-100 rounded-lg">
                                                {addr.address_type === "Office" ? (
                                                    <Briefcase className="w-3.5 h-3.5 text-black" />
                                                ) : addr.address_type === "Home" ? (
                                                    <Home className="w-3.5 h-3.5 text-black" />
                                                ) : (
                                                    <MapPin className="w-3.5 h-3.5 text-black" />
                                                )}
                                            </div>
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-black/40">
                                                {addr.address_type || "Address"}
                                            </span>
                                        </div>
                                        {addr.selected_address && (
                                            <div className="text-[9px] font-bold uppercase tracking-widest text-white bg-black px-3 py-1.5 rounded-lg shadow-sm">
                                                Active
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <p className="font-bold text-base text-black mb-1">{addr.customer_name}</p>
                                            <div className="text-[13px] font-bold text-black/70 space-y-0.5 leading-tight">
                                                <p>{addr.contact_number}</p>
                                                {addr.email_address && <p className="truncate">{addr.email_address}</p>}
                                            </div>
                                        </div>

                                        <div className="text-[13px] font-medium text-gray-500 leading-snug">
                                            <p>{addr.address_line1}</p>
                                            {addr.address_line2 && <p>{addr.address_line2}</p>}
                                            <p>{addr.city}, {addr.state} - {addr.postal_code}</p>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">{addr.country || 'India'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openAddressModal(addr)}
                                                className="px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:border-black hover:text-black transition-all flex items-center gap-1.5"
                                            >
                                                <Edit2 className="w-3 h-3" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(addr.id)}
                                                className="px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:border-red-200 hover:text-red-500 transition-all flex items-center gap-1.5"
                                            >
                                                <Trash2 className="w-3 h-3" /> Remove
                                            </button>
                                        </div>

                                        {!addr.selected_address && (
                                            <button
                                                onClick={() => handleSetDefault(addr)}
                                                disabled={isLoading}
                                                className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-wider text-black/60 hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                ) : null}
                                                {isLoading ? "Activating..." : "Set Active"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={profileEmail}
                                        onChange={(e) => setProfileEmail(e.target.value)}
                                        disabled={!!(user?.data?.email || user?.email)}
                                        className={`w-full border border-transparent rounded-2xl py-4 px-6 outline-none font-bold text-sm transition-all ${!!(user?.data?.email || user?.email) ? "bg-gray-50 text-black cursor-not-allowed" : "bg-gray-50 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5"}`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={profileContact}
                                        onChange={(e) => setProfileContact(e.target.value)}
                                        disabled={!!(user?.data?.contact_number || user?.contact_number)}
                                        className={`w-full border border-transparent rounded-2xl py-4 px-6 outline-none font-bold text-sm transition-all ${!!(user?.data?.contact_number || user?.contact_number) ? "bg-gray-50 text-black cursor-not-allowed" : "bg-gray-50 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5"}`}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-black text-white py-4 rounded-full font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Address Modal */}
                {isAddressModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2rem] w-full max-w-2xl p-8 sm:p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto hide-scrollbar">
                            <button
                                onClick={() => setIsAddressModalOpen(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-black"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-10">
                                <h3 className="text-2xl font-serif italic mb-2">{editingAddress ? "Edit Address" : "Add New Address"}</h3>
                                <p className="text-sm text-gray-400 font-medium">Please provide accurate information for reliable delivery.</p>
                            </div>

                            <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Address Type</label>
                                    <div className="flex gap-4">
                                        {["Home", "Office", "Other"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setAddressForm({ ...addressForm, address_type: type })}
                                                className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all border ${addressForm.address_type === type ? "bg-black text-white border-black" : "bg-gray-50 text-gray-400 border-transparent hover:border-gray-200"}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={addressForm.customer_name}
                                        onChange={(e) => setAddressForm({ ...addressForm, customer_name: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 sm:py-3.5 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Contact Number</label>
                                    <input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={addressForm.contact_number}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setAddressForm({ ...addressForm, contact_number: val });
                                        }}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 sm:py-3.5 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={addressForm.email_address}
                                        onChange={(e) => setAddressForm({ ...addressForm, email_address: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 sm:py-3.5 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Address Line 1</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your address line 1"
                                        value={addressForm.address_line1}
                                        onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 sm:py-3.5 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Address Line 2 (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your address line 2"
                                        value={addressForm.address_line2}
                                        onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 sm:py-3.5 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">City</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your city"
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 sm:py-3.5 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">State</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your state"
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 sm:py-3.5 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Pincode</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your pincode"
                                        value={addressForm.postal_code}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setAddressForm({ ...addressForm, postal_code: val });
                                        }}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 sm:py-3.5 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1 text-gray-400">Landmark (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Enter landmark"
                                        value={addressForm.landmark}
                                        onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 sm:py-3.5 px-6 focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none font-bold text-sm transition-all"
                                    />
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

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                    <Trash2 className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-serif italic mb-2">Delete Address</h3>
                                <p className="text-sm text-gray-500 mb-8 font-medium">
                                    Are you sure you want to delete this address? This action cannot be undone.
                                </p>
                                <div className="flex flex-col w-full gap-3">
                                    <button
                                        onClick={confirmDeleteAddress}
                                        disabled={isLoading}
                                        className="w-full bg-black text-white py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {isLoading ? "Deleting..." : "Delete Address"}
                                    </button>
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        disabled={isLoading}
                                        className="w-full bg-white text-gray-400 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:text-black transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
