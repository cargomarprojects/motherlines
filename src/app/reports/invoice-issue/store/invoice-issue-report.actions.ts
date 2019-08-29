import { Action } from '@ngrx/store';
import { TBL_MBL_REPORT} from '../../models/tbl_mbl_report'
import { ReportState } from './invoice-issue-report.models';

export enum ActionTypes {
  ADD = '[Invoice-Issue-Report] Add Report',
  UPDATE = '[Invoice-Issue-Report] Update Report',
  DELETE = '[Invoice-Issue-Report] Delete Report',
}

export class Add implements Action {
  readonly type = ActionTypes.ADD;
  constructor(public payload : ReportState) { }
}

export class Update implements Action {
  readonly type = ActionTypes.UPDATE;
  constructor(public payload : { id: string, changes : ReportState }){ }
}

export class Delete implements Action {
  readonly type = ActionTypes.DELETE;
  constructor(public payload : { id: string}) { }
}

export type Actions = Add | Update | Delete;
