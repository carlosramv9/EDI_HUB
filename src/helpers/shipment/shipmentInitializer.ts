import { IAsnHeader } from '@/interfaces/asn/IAsnHeader'
import { IAdvanceShippingNotice } from '@/interfaces/asn/IAdvanceShippingNotice'
import { IOrder } from '@/interfaces/orders/IOrder'

/**
 * Inicializa un ASN Header con datos de las órdenes seleccionadas
 */
export const initializeAsnHeaderFromOrders = (orders: IOrder[]): IAsnHeader => {
    if (orders.length === 0) {
        return {
            quantity: 0,
            details: []
        }
    }

    const firstOrder = orders[0]
    
    return {
        shipDate: firstOrder.shipDate,
        quantity: orders.reduce((sum, order) => sum + (order.quantity || 0), 0),
        details: orders.map(order => ({
            orderId: order.id,
            partNumber: order.partNumber,
            quantity: order.quantity,
            devOrderNumber: order.orderNumber,
            engChange: order.ecs,
            shipDate: order.shipDate,
            partUnit: 'EA'
        } as IAdvanceShippingNotice))
    }
}

