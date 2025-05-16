import { PackagingRequirementLabel } from "@/interfaces/labels/IPackagingRequirement";
import { BaseService } from "../BaseService";

class PackagingRequirementsApi extends BaseService<PackagingRequirementLabel> {
    constructor() {
        super('PackagingRequirements');
    }
}

export const packagingRequirementsApi = new PackagingRequirementsApi();
export default PackagingRequirementsApi;
