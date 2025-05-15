import { PalletMasterLabel } from "@/interfaces/labels/IPalletMaster";
import { BaseService } from "../BaseService";

class PalletMasterApi extends BaseService<PalletMasterLabel> {
    constructor() {
        super('PalletMaster');
    }
}

export const palletMasterApi = new PalletMasterApi();
export default PalletMasterApi;
