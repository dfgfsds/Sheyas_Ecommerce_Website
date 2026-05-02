import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Sheyas',
    description: 'Privacy Policy for Sheyas Ecommerce Website',
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full font-sans text-gray-800">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center uppercase tracking-widest text-black">
                    Privacy Policy
                </h1>

                <div className="space-y-10 text-base md:text-lg leading-relaxed text-gray-700">
                    <section className="text-center pb-6 border-b border-gray-100">
                        <p className="font-medium italic text-gray-600">
                            At Sheyas, we value your privacy and are committed to protecting your personal information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            1. Information We Collect
                        </h2>
                        <p>
                            We may collect personal details such as your name, email address, phone number, shipping address, and payment details when you place an order or contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            2. How We Use Your Information
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 marker:text-gray-400">
                            <li>To process and deliver your orders</li>
                            <li>To communicate with you regarding your purchase</li>
                            <li>To improve our products and services</li>
                            <li>To send updates or promotional offers (if opted in)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            3. Data Protection
                        </h2>
                        <p>
                            We implement appropriate security measures to protect your personal data from unauthorized access or disclosure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            4. Sharing Information
                        </h2>
                        <p>
                            We do not sell or rent your personal information. Your data may only be shared with trusted partners (such as delivery services) to fulfill your order.
                        </p>
                    </section>

                    <section className="pt-6 border-t border-gray-100">
                        <h2 className="text-xl font-semibold mb-6 uppercase tracking-wider text-black">
                            5. Contact Us
                        </h2>
                        <p className="mb-6">
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>
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