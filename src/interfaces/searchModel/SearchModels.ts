export type SearchModel = {
    id: string;
    orderColumn: string;
    orderDirection: string;
    page: number;
    pageSize: number;
}

export interface SMUsers extends SearchModel {
    userName: string;
}