import { StatusSend } from "@/types/enums/StatusSend";

export interface IASNProcessed {
    id?: number;
    advanceShippingNoticeId?: number;
    dateProcessed?: string;
    typeSend?: number;
    asnNumber?: string;
    originalAsn?: string | number | null;
    statusSend?: StatusSend;
    stringASN?: string;
    createdById?: number;
    status?: boolean;
    typeSendName?: string;
    createdBy?: string;
    orderNumber?: string;
    scacCode?: string;
    carrier?: string;
    billOfLanding?: string;
    packingList?: string;
    carrierRef?: string;
    partNumber?: string;
    engChange?: string;
    quantity?: number;
    partUnit?: string;
    devOrderNumber?: string;
    lineCount?: number;
    createdAt?: string;
    updatedAt?: string;
    orderId?: number;
}
