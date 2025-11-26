import { BaseService } from "../BaseService";
import { IAsnHeader } from "@/interfaces/asn/IAsnHeader";

class AsnHeaderApi extends BaseService<IAsnHeader> {
    constructor() {
        super('AsnHeader');
    }
}

export const asnHeaderApi = new AsnHeaderApi();
export default AsnHeaderApi;

