import { Tbl_cargo_invoicem } from '../../models/Tbl_cargo_invoicem';
export interface ReportState{ 

    pkid : string,    
    urlid : string,
    menuid : string;
    currentTab : string ;
    report_category: string;
    sdate: string;
    edate: string;
    mode : string;
    comp_type: string;
    sdata: string ;
    sort: string ;
    cust_id: string ;
    cust_name: string ;
    
    page_rows :number;
    page_count :number;
    page_current :number;
    page_rowcount :number;        
    records : Tbl_cargo_invoicem[];
}