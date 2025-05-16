import axiosInstance from "../axiosConfig";
import { BaseService } from "../BaseService";
import { IOrder } from "@/interfaces/orders/IOrder";

class OrdersApi extends BaseService<IOrder> {
    constructor() {
        super('orders');
    }

    async UploadSchedules(files: File[]) {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('file', file);
        });
        return this.post({
            endpoint: 'upload',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    async downloadASN() {
        return axiosInstance.get(this.buildUrl('generate/asn'), { responseType: 'blob' });
    }
}

export const ordersApi = new OrdersApi();
export type OrdersApiType = OrdersApi;
export default ordersApi;