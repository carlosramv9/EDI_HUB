import { BaseEntity } from "../IBaseEntity";

export interface SkidManifestLabel extends BaseEntity {
    orderId?: number;
    partNumber?: string;
    doNumber?: string;
    partName?: string;
    supplierUse?: string;
    ecsNumber?: string;
    quantity?: number;
    quantityRack?: number;
    lineDeliveryCode?: string;
    kanban?: string;
    whLoc?: string;
    deliveryCode?: string;
    orderCode?: string;
    shipDate?: string;
    fitLoc?: string;
    purchaseOrderNumber?: string;
    mfgDate?: string;
    revision?: string;
    createdById?: number;
    createdBy?: string;
    updatedById?: number;
    updatedBy?: string;
}