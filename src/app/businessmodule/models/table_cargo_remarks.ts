export interface Table_Cargo_Remarks {
    pkid: string;
    ctr: string;
    source: string;
    remarks: string;
}

export interface vm_Table_Cargo_Remarks {
    mode: string;
    pkid: string;
    record: Table_Cargo_Remarks;
    userinfo: any;
    filter: any;
}
