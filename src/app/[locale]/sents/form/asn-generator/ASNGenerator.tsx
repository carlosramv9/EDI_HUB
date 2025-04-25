'use client'

import React from 'react'
import MainLayout from '@/components/layouts/MainLayout'

const inputClasses = "px-4 py-2.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 text-sm"
const labelClasses = "text-sm font-medium text-gray-700 mb-1.5"

const ASNGenerator = () => {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">856 EDI File</h2>
                
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Primera columna */}
                        <div className="space-y-5">
                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Control Number
                                </label>
                                <input
                                    type="number"
                                    className={inputClasses}
                                    defaultValue="0"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Shipment Identification Code (ASN)
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    defaultValue="361010416"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Carrier Identification Code(SCAC)
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Carrier Identification Code(SCAC)"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Carrier
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Carrier"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Bill of Lading
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Bill of Lading"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Packing List
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Packing List"
                                />
                            </div>
                        </div>

                        {/* Segunda columna */}
                        <div className="space-y-5">
                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Carrier's Reference Number (PRO/Invoice)
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Carrier's Reference Number"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Part Number
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Part Number"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Engineering Change Level
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Engineering Change Level"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Number of Units Shipped
                                </label>
                                <input
                                    type="number"
                                    className={inputClasses}
                                    placeholder="Number of Units Shipped"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Part Unit
                                </label>
                                <input
                                    type="text"
                                    className={`${inputClasses} bg-gray-50`}
                                    defaultValue="EA"
                                    readOnly
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Delivery Order Number
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Delivery Order Number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Line Count */}
                    <div className="mt-4">
                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Line Count
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Line Count"
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2.5 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
                        >
                            Generar Archivo EDI
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    )
}

export default ASNGenerator