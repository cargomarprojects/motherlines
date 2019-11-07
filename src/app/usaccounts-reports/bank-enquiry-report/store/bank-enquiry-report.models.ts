import { Tbl_Acc_Payment } from '../../models/Tbl_Acc_Payment';
export interface ReportState {

    pkid: string,
    urlid: string,
    menuid: string;
    currentTab: string;
    bank_id: string;

    sdate: string;
    edate: string;
    mode: string;
    comp_type: string;
    comp_code:string;

    filename: string;
    filetype: string;
    filedisplayname: string;

     
    page_rows: number;
    page_count: number;
    page_current: number;
    page_rowcount: number;
    records: Tbl_Acc_Payment[];
}