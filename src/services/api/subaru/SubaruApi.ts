import { AxiosResponse } from "axios";
import axiosInstance from "../axiosConfig";
import { BaseService, BaseServiceParams } from "../BaseService";

class SubaruApi extends BaseService<Record<any, any>> {
    constructor() {
        super('Subaru');
    }

    downloadLabel = async ({ endpoint = '', data }: BaseServiceParams & { data: any }): Promise<AxiosResponse<Blob>> => {
        const response = await axiosInstance.post(this.buildUrl(endpoint), data, { responseType: 'blob' });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response;
    }

    downloadLabelByOrderId = async ({ endpoint = '', orderId }: BaseServiceParams & { orderId: number }): Promise<AxiosResponse<Blob>> => {
        const response = await axiosInstance.get(this.buildUrl(endpoint, orderId), { responseType: 'blob' });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response;
    }
}

const apiSubaru = new SubaruApi();
export default SubaruApi;
export { apiSubaru };
