import { AxiosResponse } from "axios";
import axiosInstance from "../axiosConfig";
import { BaseService, BaseServiceParams } from "../BaseService";

class ASNApi extends BaseService<Record<any, any>> {
    constructor() {
        super('AdvanceShippingNotice');
    }

    downloadASN = async ({ endpoint = '', data }: BaseServiceParams & { data: any }): Promise<AxiosResponse<Blob>> => {
        const response = await axiosInstance.post(this.buildUrl(endpoint), data, { responseType: 'blob' });
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response;
    }
}

const apiASN = new ASNApi();
export default ASNApi;
export { apiASN };
