import { PageQuery } from '../../shared/models/pageQuery';
export interface Tbl_Cargo_Payrolldet {
    cpd_pkid: string;
    cpd_emp_id: string;
    cpd_emp_name: string;
    cpd_mbl_id: string;
    cpd_payroll_date: string;
    A1: number;
    A2: number;
    A3: number;
    A4: number;
    A5: number;
    A6: number;
    A7: number;
    A8: number;
    A9: number;
    A10: number;
    A11: number;
    A12: number;
    A13: number;
    A14: number;
    A15: number;

    D1: number;
    D2: number;
    D3: number;
    D4: number;
    D5: number;
    D6: number;
    D7: number;
    D8: number;
    D9: number;
    D10: number;
    D11: number;
    D12: number;
    D13: number;
    D14: number;
    D15: number;

    ATOT: number;
    DTOT: number;
    NET: number;
}

export interface vm_Tbl_Cargo_Payrolldet {
    pkid: string;
    mode: string;
    record: Tbl_Cargo_Payrolldet;
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    mbl_refno:string;
    todate: string;
    mblid: string;
}

export interface PayrolldetModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Cargo_Payrolldet[]
}
