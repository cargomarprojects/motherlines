import { Tbl_acc_ledger } from '../../models/Tbl_acc_ledger';
export interface ReportState {

    pkid: string,
    urlid: string,
    menuid: string;
    currentTab: string;

    tdate: string;
    comp_name: string;
    comp_code:string;

    page_rows: number;
    page_count: number;
    page_current: number;
    page_rowcount: number;
    records: Tbl_acc_ledger[];
}