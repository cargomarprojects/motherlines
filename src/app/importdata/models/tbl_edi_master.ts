import { PageQuery } from '../../shared/models/pageQuery';

export interface Tbl_edi_master {
    masterid: string;
    headerid: string;
    messagesender: string;
    messagenumber: string;
    messagedate: string;
    refno: string;
    ref_date: string;
    xml_ref_date: string;
    mbl_pkid: string;
    mbl_branch_code: string;
    mblno: string;
    mbl_refno: string;
    house_nos: string;
    agent_code: string;
    agent_name: string;
    carrier_code: string;
    carrier_name: string;
    pol_code: string;
    pol_name: string;
    pol_etd: string;
    xml_pol_etd: string;
    pod_code: string;
    pod_name: string;
    pod_eta: string;
    xml_pod_eta: string;

    place_delivery: string;
    delivery_date: string;
    xml_delivery_date: string;
    freight_status: string;
    cntr_type: string;
    origin_country_name: string;
    selected: string;
    rec_updated: string;
    updated_status: string;

    shipment_term: string;
    vessel: string;
    voyage: string;

    consignee_name: string;
    mshipper_name: string;
    agent_branch: string;

    selected_b: boolean;
}

export interface vm_tbl_edi_master {
    mode: string;
    record: Tbl_edi_master;
    userinfo: any;
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    sender: string;
    chkpending:boolean;
    chkcompleted:boolean;
    chkdeleted:boolean;
    linkType:string;
}

export interface ShipDataPageModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_edi_master[]
}
