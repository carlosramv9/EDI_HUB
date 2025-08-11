export interface IASNProcessed {
    id?: number;
    advanceShippingNoticeId?: number;
    dateProcessed?: string;
    typeSend?: number;
    asnNumber?: string;
    originalAsn?: string | null;
    statusSend?: number;
    stringASN?: string;
    createdById?: number;
    status?: boolean;
    typeSendName?: string;
    createdBy?: string;
    orderNumber?: string;
    createdAt?: string;
    updatedAt?: string;
}
