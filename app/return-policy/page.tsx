import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Return Policy | Sheyas',
    description: 'Return Policy for Sheyas Ecommerce Website',
};

export default function ReturnPolicyPage() {
    return (
        <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full font-sans text-gray-800">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center uppercase tracking-widest text-black">
                    Return Policy
                </h1>

                <div className="space-y-10 text-base md:text-lg leading-relaxed text-gray-700">
                    <section className="text-center pb-6 border-b border-gray-100">
                        <p className="font-medium italic text-gray-600">
                            We want you to be satisfied with your purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            1. Eligibility for Returns
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 marker:text-gray-400">
                            <li>Returns are accepted within 7 days of delivery</li>
                            <li>Items must be unused, unworn, and in original packaging</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            2. Non-Returnable Items
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 marker:text-gray-400">
                            <li>Used or damaged products</li>
                            <li>Items purchased during clearance or sale (unless defective)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            3. Return Process
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 marker:text-gray-400">
                            <li>Contact us via email or phone</li>
                            <li>Provide order details and reason for return</li>
                            <li>Our team will guide you through the process</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider text-black">
                            4. Refunds
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 marker:text-gray-400">
                            <li>Refunds will be processed after inspection</li>
                            <li>It may take 5–7 business days to reflect in your account</li>
                        </ul>
                    </section>

                    <section className="pt-6 border-t border-gray-100">
                        <h2 className="text-xl font-semibold mb-6 uppercase tracking-wider text-black">
                            5. Contact Us
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
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
}