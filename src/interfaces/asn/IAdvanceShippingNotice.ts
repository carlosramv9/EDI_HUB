interface IAdvanceShippingNotice {
    id?: number;
    orderId?: number;
    controlNumber?: string;
    shipment?: string;
    scacCode?: string;
    carrier?: string;
    billOfLanding?: string;
    packingList?: string;
    carrierRef?: string;
    routerNumber?: string;
    authorizationNumber?: string;
    partNumber?: string;
    engChange?: string;
    quantity?: number;
    partUnit?: string;
    devOrderNumber?: string;
}