import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tbl_acc_ledger } from '../../models/Tbl_acc_ledger';
import { AppState } from '../../../reducer';

import * as myActions from './gen-ledger-report.actions';
import { ReportState } from './gen-ledger-report.models';

export interface AppState extends AppState {
    'GenLedgerReport': ReportState
}

export const initialState: ReportState = {
    pkid: '',
    urlid: '',
    menuid: '',
    currentTab: '',
    bank_id: '',
    bank_name: '',
    fdate: '',
    edate: '',
    comp_name: '',
    comp_code:'',
    filename: '',
    filetype: '',
    filedisplayname: '',
    page_rows: 0,
    page_count: 0,
    page_current: 0,
    page_rowcount: 0,
    records: []
};

export function GenLedgerReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState[] {
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

export const getReducer = createFeatureSelector<ReportState[]>('GenLedgerReport');

export const getState = (urlid: string) => createSelector(
    getReducer,
    (state: ReportState[]) => state.find(rec => rec.urlid == urlid)
);



