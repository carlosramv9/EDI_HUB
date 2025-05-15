import { BaseEntity } from "../IBaseEntity";

export interface PalletMasterLabel extends BaseEntity {
    orderId?: number;
    asnNumber?: string;
    supplierCode?: string;
    shipDate?: string;
    routeNumber?: string;
    dockCode?: string;
    destination?: string;
    deliveryOrder?: string;
    partNumber?: string;
    kanban?: string;
    quantity?: number;
    quantityRack?: number;
    totalPalletsFrom?: string;
    totalPalletsTo?: string;
    partName?: string;
    doNumber?: string;
    ecsNumber?: string;
    orderCode?: string;
    fitLoc?: string;
    whLoc?: string;
    createdById?: number;
    createdBy?: string;
    updatedById?: number;
    updatedBy?: string;
}