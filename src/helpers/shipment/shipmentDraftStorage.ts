import { IAsnHeader } from '@/interfaces/asn/IAsnHeader'
import { IOrder } from '@/interfaces/orders/IOrder'

const STORAGE_KEY = 'asn_shipment_draft'
const MAX_DAYS_OLD = 7

export interface DraftData {
    formData: IAsnHeader
    selectedOrders: IOrder[]
    timestamp: number
}

/**
 * Guarda un borrador del envío en localStorage
 */
export const saveShipmentDraft = (formData: IAsnHeader, selectedOrders: IOrder[]): void => {
    try {
        const draft: DraftData = {
            formData,
            selectedOrders,
            timestamp: Date.now()
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch (error) {
        console.error('Error saving draft:', error)
    }
}

/**
 * Carga un borrador del envío desde localStorage
 * Retorna null si no existe o es muy antiguo (>7 días)
 */
export const loadShipmentDraft = (): DraftData | null => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return null
        
        const draft: DraftData = JSON.parse(stored)
        
        // Verificar que el borrador no sea muy antiguo
        const daysSince = (Date.now() - draft.timestamp) / (1000 * 60 * 60 * 24)
        if (daysSince > MAX_DAYS_OLD) {
            clearShipmentDraft()
            return null
        }
        
        return draft
    } catch (error) {
        console.error('Error loading draft:', error)
        clearShipmentDraft()
        return null
    }
}

/**
 * Limpia el borrador del localStorage
 */
export const clearShipmentDraft = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
        console.error('Error clearing draft:', error)
    }
}

