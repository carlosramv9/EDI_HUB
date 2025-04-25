import { BaseService } from "../BaseService";
import { IOrder } from "@/interfaces/orders/IOrder";

class OrdersApi extends BaseService<IOrder> {
    constructor() {
        super('orders');
    }

}

export const ordersApi = new OrdersApi();
export type OrdersApiType = OrdersApi;
export default ordersApi;