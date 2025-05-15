import { ManifestLabel } from "@/interfaces/labels/IManifest";
import { BaseService } from "../BaseService";

class ManifestApi extends BaseService<ManifestLabel> {
    constructor() {
        super('Manifest');
    }
}

export const manifestApi = new ManifestApi();
export default ManifestApi;
