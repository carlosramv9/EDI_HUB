import { ProductionPartLabel } from "@/interfaces/labels/IProductionParts";
import { BaseService } from "../BaseService";

class ProductionPartApi extends BaseService<ProductionPartLabel> {
    constructor() {
        super('ProductionPart');
    }
}

export const productionPartApi = new ProductionPartApi();
export default ProductionPartApi;
