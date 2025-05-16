import { SkidManifestLabel } from "@/interfaces/labels/ISkidManifest";
import { BaseService } from "../BaseService";

class SkidManifestApi extends BaseService<SkidManifestLabel> {
    constructor() {
        super('SkidManifest');
    }
}

export const skidManifestApi = new SkidManifestApi();
export default SkidManifestApi;
