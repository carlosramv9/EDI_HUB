import { BaseEntity } from "../IBaseEntity";

export interface ManifestLabel extends BaseEntity {
    orderId?: number;
    partNumber?: string;
    doNumber?: string;
    partName?: string;
    supplierUse?: string;
    ecsNumber?: string;
    quantity?: number;
    quantityRack?: number;
    boxQuantity?: number;
    shipDate?: string;
    shipTime?: string;
    lineDeliveryCode?: string;
    kanban?: string;
    whLoc?: string;
    deliveryCode?: string;
    orderCode?: string;
    fitLoc?: string;
    purchaseOrderNumber?: string;
    snp?: string;
    mfgDate?: string;
    createdById?: number;
    createdBy?: string;
    updatedById?: number;
    updatedBy?: string;
    pickupRoute?: string;
    transferRoute?: string;
    mainRoute?: string;
    datePickupRoute?: string;
    dateTransferRoute?: string;
    dateMainRoute?: string;
}