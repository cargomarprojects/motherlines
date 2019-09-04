import { PageQuery } from '../../shared/models/pageQuery';

export interface Tbl_Cargo_Journals_Master {
    cjm_pkid: string;
    cjm_customer_id: string;
    cjm_customer_code: string;
    cjm_customer_name: string;
    cjm_user_id: string;
    cjm_user_name: string;
    cjm_salesman_name: string;
    cjm_city: string;
    cjm_state: string;
    cjm_pincode: string;
    rec_memo: string;
    rec_files_attached: string;
    rec_created_by: string;
    rec_created_date: string;
}

export interface vm_Tbl_Cargo_Journals_Master {
    mode: string;
    pkid: string;
    record: Tbl_Cargo_Journals_Master;
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
}

export interface SalesJournalModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Cargo_Journals_Master[]
}