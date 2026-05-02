import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | Sheyas',
    description: 'Terms of Service for Sheyas Ecommerce Website',
};

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full font-sans text-gray-800">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center uppercase tracking-widest text-black">
                    Terms of Service
                </h1>

                <div className="space-y-10 text-base md:text-lg leading-relaxed text-gray-700">
                    <section className="text-center pb-6 border-b border-gray-100">
                        <p className="font-medium italic text-gray-600">
                            By using our website, you agree to the following terms:
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            1. General
                        </h2>
                        <p>
                            Sheyas offers fashion products including Eid Collection and Abayas. By accessing our website, you agree to comply with these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            2. Orders & Payments
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 marker:text-gray-400">
                            <li>All orders are subject to availability</li>
                            <li>Prices are subject to change without notice</li>
                            <li>Payments must be completed before order processing</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            3. Product Information
                        </h2>
                        <p>
                            We strive to display accurate product details, but slight variations in color or design may occur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            4. User Responsibilities
                        </h2>
                        <p>
                            You agree not to misuse the website or engage in any fraudulent activity.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            5. Limitation of Liability
                        </h2>
                        <p>
                            Sheyas is not liable for any indirect or incidental damages arising from the use of our products or website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            6. Changes to Terms
                        </h2>
                        <p>
                            We reserve the right to update these terms at any time without prior notice.
                        </p>
                    </section>

                    <section className="pt-6 border-t border-gray-100">
                        <h2 className="text-xl font-semibold mb-6 uppercase tracking-wider text-black">
                            7. Contact Information
                        </h2>
                        <ul className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <li className="flex items-start">
                                <span className="mr-3 text-xl">📧</span>
                                <a href="mailto:sheyas.co@gmail.com" className="hover:text-black hover:underline transition-colors mt-0.5">
                                    sheyas.co@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 text-xl">📞</span>
                                <a href="tel:9385956032" className="hover:text-black hover:underline transition-colors mt-0.5">
                                    9385956032
                                </a>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 text-xl">📍</span>
                                <span className="mt-0.5">
                                    Fine Center, 30/2A, East St,<br />
                                    Anna Nagar, Madurai,<br />
                                    Tamil Nadu 625020
                                </span>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
}