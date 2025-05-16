'use client'

import MainLayout from '@/components/layouts/MainLayout'
import React from 'react'

const inputClasses = "px-4 py-2.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 text-sm"
const labelClasses = "text-sm font-medium text-gray-700 mb-1.5"

const SkidManifestForm = () => {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Skid Manifest Label</h2>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Primera columna */}
                        <div className="space-y-5">
                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Date / order code
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Date / order code"
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
                                    Shop Code
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Shop Code"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Route/Run #
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Route/Run #"
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
                        </div>

                        {/* Segunda columna */}
                        <div className="space-y-5">
                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Ship Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    className={inputClasses}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Delivery Cycle
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Delivery Cycle"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Consumption Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    className={inputClasses}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={labelClasses}>
                                    Delivery Code
                                </label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Delivery Code"
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
                        </div>
                    </div>

                    {/* Skid Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Skid From
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Skid from"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Skid To
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Skid to"
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

export default SkidManifestForm