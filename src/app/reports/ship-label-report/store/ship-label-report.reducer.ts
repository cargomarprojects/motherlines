import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TBL_LABELM } from '../../models/tbl_label_report';
import { AppState } from '../../../reducer';

import * as myActions from './ship-label-report.actions';
import { ReportState } from './ship-label-report.models';
import { ɵangular_packages_platform_browser_dynamic_platform_browser_dynamic_a } from '@angular/platform-browser-dynamic';
import { isNgTemplate } from '@angular/compiler';

export interface AppState extends AppState {
    'ShipLabelReport': ReportState
}

export const initialState: ReportState = {
    pkid: '',
    urlid: '',
    menuid: '',
    currentTab: '',
    from_date: '',
    to_date: '',
    group: '',
    mbl_pkid: '',
    page_rows: 0,
    page_count: 0,
    page_current: 0,
    page_rowcount: 0,
    records: []
};

export function ShipLabelReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState[] {
    switch (action.type) {
        case myActions.ActionTypes.ADD:
            return [...state, action.payload];
        case myActions.ActionTypes.UPDATE:
            return [...state.filter(rec => rec.urlid != action.payload.id), action.payload.changes];
        case myActions.ActionTypes.DELETE:
            return [...state.filter(rec => rec.urlid != action.payload.id)];
        case myActions.ActionTypes.SELECTDESELECT: {
            var record = {...state.find(rec => rec.urlid == action.payload.id)};
            return [...state.filter(rec => rec.urlid != action.payload.id), record ];
        }
        case myActions.ActionTypes.SINGLESELECTDESELECT: {
            
        }        
        default:
            return state;
    }
}

export const getReducer = createFeatureSelector<ReportState[]>('ShipLabelReport');

export const getState = (urlid: string) => createSelector(
    getReducer,
    (state: ReportState[]) => state.find(rec => rec.urlid == urlid)
);





