export interface Tbl_cargo_imp_desc {
    parentid: string;
    parent_type: string;
    cargo_ctr: number;
    cargo_marks: string;
    cargo_packages: string;
    cargo_description: string;
}

export interface vm_tbl_cargo_imp_desc {
    mode: string;
    record: Tbl_cargo_imp_desc;
    pkid:string;
    userinfo: any;
    filter: any;
}