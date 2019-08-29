import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tbl_cargo_general} from '../../../other/models/tbl_cargo_general'
import { AppState } from '../../../reducer';

import * as myActions from './ship-log-report.actions';
import { ReportState } from './ship-log-report.models';

export interface AppState extends AppState {
    'ShipmentLogReport': ReportState
}

export const initialState: ReportState = {
    pkid: '',
    urlid: '',
    menuid: '',
    currentTab: '',

    report_category: '',
    sdate: '',
    edate: '',
    comp_type: '',
    report_type: '',
    topnum: 10,
    toporder: '',
    radio_exp: '',
    report_amt_caption: '',
    group_by_parent: false,
    reportformat: '',
    filename: '',
    filetype: '',
    filedisplayname: '',

    page_rows: 0,
    page_count: 0,
    page_current: 0,
    page_rowcount: 0,
    records: []
};

export function ShipmentLogReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState[] {
    switch (action.type) {
        case myActions.ActionTypes.ADD:
            return [...state, action.payload];
        case myActions.ActionTypes.UPDATE:
            return [...state.filter(rec => rec.urlid != action.payload.id), action.payload.changes];
        case myActions.ActionTypes.DELETE:
            return [...state.filter(rec => rec.urlid != action.payload.id)];
        default:
            return state;
    }
}

export const getReducer = createFeatureSelector<ReportState[]>('ShipmentLogReport');

export const getState = (urlid: string) => createSelector(
    getReducer,
    (state: ReportState[]) => state.find(rec => rec.urlid == urlid)
);



