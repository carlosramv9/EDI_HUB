'use client'

import React from 'react'
import MainLayout from '@/components/layouts/MainLayout'

const inputClasses = "px-4 py-2.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 text-sm"
const labelClasses = "text-sm font-medium text-gray-700 mb-1.5"

const PalletMasterForm = () => {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Pallet Master Label</h2>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Primera columna */}
                        <div className="space-y-5">
                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    ASN Number
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="ASN Number"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Supplier Code
                                </label>
                                <input
                                    type="text"
                                    className={`${inputClasses} bg-gray-50`}
                                    defaultValue="A361-01"
                                    readOnly
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Ship Date
                                </label>
                                <input
                                    type="date"
                                    className={inputClasses}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Route Number
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Route Number"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Dock Code
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Dock Code"
                                />
                            </div>
                        </div>

                        {/* Segunda columna */}
                        <div className="space-y-5">
                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Destination
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Destination"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Delivery Order
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Delivery Order"
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
                                    Kanban
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Kanban"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    className={inputClasses}
                                    placeholder="Quantity"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Total Pallets Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Total Pallets From
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="from"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Total Pallets To
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="to"
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                        >
                            Guardar Etiqueta
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2.5 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
                        >
                            Imprimir Etiqueta
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    )
}

export default PalletMasterForm