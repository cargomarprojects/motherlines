import { Tbl_cargo_imp_container } from './tbl_cargo_imp_housem';

export interface Tbl_cargo_imp_pickup {
    pick_parentid:string;
    pick_truk_code: string;
    pick_truk_name: string;
    pick_truk_id: string;
    pick_truk_attn: string;
    pick_truk_tel: string;
    pick_truk_fax: string;
    pick_truk_cc: string;
    pick_pickup: string;
    pick_addr1: string;
    pick_addr2: string;
    pick_addr3: string;
    pick_date: string;
    pick_time: string;
    pick_attn: string;
    pick_tel: string;
    pick_from_code: string;
    pick_from_id: string;
    pick_fromname: string;
    pick_fromaddr1: string;
    pick_fromaddr2: string;
    pick_fromaddr3: string;
    pick_fromaddr4: string;
    pick_to_code: string;
    pick_to_id: string;
    pick_toname: string;
    pick_toaddr1: string;
    pick_toaddr2: string;
    pick_toaddr3: string;
    pick_toaddr4: string;
    pick_desc1: string;
    pick_tot_piece1: number;
    pick_uom1: string;
    pick_wt1: number;
    pick_cbm_cft1: number;
    pick_desc2: string;
    pick_tot_piece2: number;
    pick_uom2: string;
    pick_wt2: number;
    pick_cbm_cft2: number;
    pick_desc3: string;
    pick_tot_piece3: number;
    pick_uom3: string;
    pick_wt3: number;
    pick_cbm_cft3: number;
    pick_desc4: string;
    pick_tot_piece4: number;
    pick_uom4: string;
    pick_wt4: number;
    pick_cbm_cft4: number;
    pick_remark_1: string;
    pick_remark_2: string;
    pick_remark_3: string;
    pick_remark_4: string;
    pick_danger_goods: string;
    pick_terms_ship: string;
    pick_freight: string;
    pick_export_doc: string;

    IS_EXW: boolean;
    IS_FOB: boolean;
    IS_FCA: boolean;
    IS_CPU: boolean;
    IS_DDU: boolean;
    IS_FRT_OTH: boolean;
    IS_Commercial: boolean;
    IS_CopyLC: boolean;
    IS_Certificate: boolean;
    IS_PktList: boolean;
    IS_ExDeclaration: boolean;
    IS_Export_OTH: boolean;

    freightothers: string;
    exportothers: string;
    pick_orderno: string;
    pick_order_date: string;
    pick_is_delivery_sent: boolean;
    pick_delivery_date: string;
    pick_vessel: string;
    pick_voyage: string;
}

export interface vm_tbl_cargo_imp_pickup {
    mode: string;
    record: Tbl_cargo_imp_pickup;
    pkid: string;
    userinfo: any;
    filter: any;
}