import { AxiosResponse } from "axios";
import axiosInstance from "../axiosConfig";
import { BaseService, BaseServiceParams } from "../BaseService";
import { IAsnHeader } from "@/interfaces/asn/IAsnHeader";

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

    uploadMultiShipping = async ({formData}: {formData: IAsnHeader}): Promise<void> => {
        const response = await axiosInstance.post(this.buildUrl('Multi'), formData);
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        // return response;
    }

    sendMultiShipping = async ({headers}: {headers: IAsnHeader[]}): Promise<void> => {
        const requestData = {
            headers: headers
        };
        const response = await axiosInstance.post(this.buildUrl('Generate/Multi'), requestData);
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        // return response;
    }
}

const apiASN = new ASNApi();
export default ASNApi;
export { apiASN };
