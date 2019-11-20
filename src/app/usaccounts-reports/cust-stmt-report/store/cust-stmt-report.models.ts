import { Tbl_OS_REPORT } from '../../models/Tbl_OS_Report';
export interface ReportState {

    pkid: string,
    urlid: string,
    menuid: string;
    currentTab: string;
    cust_id: string;
    cust_name: string;
    adate: string;
    ddate: string;
    comp_name: string;
    comp_code:string;

    filename: string;
    filetype: string;
    filedisplayname: string;

    page_rows: number;
    page_count: number;
    page_current: number;
    page_rowcount: number;
    records: Tbl_OS_REPORT[];
}