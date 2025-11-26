import { IAdvanceShippingNotice } from "./IAdvanceShippingNotice";

export interface IAsnHeader {
    id?: number;
    status?: boolean;
    createdAt?: string;
    updatedAt?: string;
    controlNumber?: string;
    scacCode?: string;
    carrier?: string;
    billOfLanding?: string;
    packingList?: string;
    carrierRef?: string;
    quantity?: number;
    shipDate?: string;
    shipDateString?: string;
    routerNumber?: string;
    authorizationNumber?: string;
    controlId?: number;
    purposeCode?: number;
    createdById?: number;
    details?: IAdvanceShippingNotice[];
}