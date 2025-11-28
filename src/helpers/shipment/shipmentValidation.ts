import { IAsnHeader } from '@/interfaces/asn/IAsnHeader'
import dayjs from 'dayjs'

export interface ValidationErrors {
    [key: string]: string
}

type TranslationFunction = (key: string, params?: Record<string, any>) => string

/**
 * Valida el formulario de envío y retorna los errores encontrados
 */
export const validateShipmentForm = (
    formData: IAsnHeader | null,
    t: TranslationFunction
): ValidationErrors => {
    const errors: ValidationErrors = {}

    if (!formData) {
        return errors
    }

    // Validar campos del header
    if (!formData.scacCode || formData.scacCode.trim() === '') {
        errors.scacCode = t('errorScacCodeRequired') || 'El código SCAC es requerido y no puede estar vacío'
    }

    if (!formData.carrier || formData.carrier.trim() === '') {
        errors.carrier = t('errorCarrierRequired') || 'El transportista es requerido y no puede estar vacío'
    }

    if (!formData.shipDate) {
        errors.shipDate = t('errorShipDateRequired') || 'La fecha de envío es requerida'
    } else {
        // Validar que la fecha no sea en el pasado
        const shipDate = dayjs(formData.shipDate)
        if (shipDate.isBefore(dayjs(), 'day')) {
            errors.shipDate = t('errorShipDatePast') || 'La fecha de envío no puede ser en el pasado'
        }
    }

    // Validar detalles de órdenes
    formData.details?.forEach((detail, index) => {
        if (!detail.partNumber || detail.partNumber.trim() === '') {
            errors[`detail_${index}_partNumber`] = 
                t('errorPartNumberRequired')?.replace('{index}', (index + 1).toString()) || 
                `El número de parte es requerido para la orden #${index + 1}`
        }

        if (!detail.quantity || detail.quantity <= 0) {
            errors[`detail_${index}_quantity`] = 
                t('errorQuantityInvalid')?.replace('{index}', (index + 1).toString()) || 
                `La cantidad debe ser mayor a 0 para la orden #${index + 1}`
        }

        if (detail.quantity && detail.quantity > 999999) {
            errors[`detail_${index}_quantity`] = 
                t('errorQuantityTooLarge')?.replace('{index}', (index + 1).toString()) || 
                `La cantidad no puede ser mayor a 999,999 para la orden #${index + 1}`
        }
    })

    return errors
}

/**
 * Hace scroll al primer campo con error y le da focus
 */
export const scrollToFirstError = (errors: ValidationErrors): void => {
    if (Object.keys(errors).length === 0) return

    const firstErrorKey = Object.keys(errors)[0]
    const errorElement = document.querySelector(`[data-error-field="${firstErrorKey}"]`)
    
    if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const input = errorElement.querySelector('input')
        if (input) {
            setTimeout(() => input.focus(), 300)
        }
    }
}

