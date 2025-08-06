export interface SearchModel {
    id: string;
    orderColumn: string;
    orderDirection: string;
    page: number;
    pageSize: number;
}

export interface SMUsers extends SearchModel {
    userName: string;
}

export interface SMOrders extends SearchModel {
    search?: string;
    startDate?: string;
    endDate?: string;
}


