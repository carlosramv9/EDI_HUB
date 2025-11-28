type TranslationFunction = (key: string, params?: Record<string, any>) => string

/**
 * Extrae un mensaje de error detallado y amigable desde un error de la API
 */
export const getShipmentErrorMessage = (error: any, t: TranslationFunction): string => {
    if (!error) {
        return t('errorUnknown') || 'Ocurrió un error desconocido'
    }

    // Error de respuesta HTTP
    if (error.response) {
        const status = error.response.status
        const data = error.response.data

        // Mensajes específicos por código de estado
        switch (status) {
            case 400:
                return data?.message || data?.error || t('errorBadRequest') || 
                    'Solicitud inválida. Por favor, verifique los datos ingresados.'
            case 401:
                return t('errorUnauthorized') || 
                    'No tiene autorización para realizar esta acción. Por favor, inicie sesión nuevamente.'
            case 403:
                return t('errorForbidden') || 
                    'No tiene permisos para realizar esta acción.'
            case 404:
                return t('errorNotFound') || 
                    'El recurso solicitado no fue encontrado.'
            case 409:
                return data?.message || t('errorConflict') || 
                    'Conflicto: El envío ya existe o hay un problema con los datos.'
            case 422:
                return data?.message || data?.errors?.[0] || t('errorValidation') || 
                    'Error de validación. Por favor, verifique los datos ingresados.'
            case 500:
                return t('errorServer') || 
                    'Error del servidor. Por favor, intente nuevamente más tarde.'
            case 503:
                return t('errorServiceUnavailable') || 
                    'El servicio no está disponible temporalmente. Por favor, intente más tarde.'
            default:
                return data?.message || data?.error || 
                    t('errorHttp', { status }) || 
                    `Error HTTP ${status}. Por favor, contacte al administrador.`
        }
    }

    // Error de red
    if (error.request) {
        return t('errorNetwork') || 
            'Error de conexión. Por favor, verifique su conexión a internet e intente nuevamente.'
    }

    // Error de mensaje
    if (error.message) {
        return error.message
    }

    return t('errorUnknown') || 'Ocurrió un error desconocido. Por favor, intente nuevamente.'
}

/**
 * Genera el HTML para mostrar detalles de error en SweetAlert
 */
export const getErrorDetailsHtml = (error: any, errorMessage: string): string => {
    const hasDetails = error?.response?.data?.details
    
    if (!hasDetails) {
        return `<p class="mb-2">${errorMessage}</p>`
    }

    const detailsHtml = Object.entries(error.response.data.details)
        .map(([key, value]: [string, any]) => {
            const valueStr = Array.isArray(value) ? value.join(', ') : String(value)
            return `<li>${key}: ${valueStr}</li>`
        })
        .join('')

    return `
        <div class="text-left">
            <p class="mb-2">${errorMessage}</p>
            <div class="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
                <strong>Detalles:</strong>
                <ul class="list-disc list-inside mt-1">
                    ${detailsHtml}
                </ul>
            </div>
        </div>
    `
}

