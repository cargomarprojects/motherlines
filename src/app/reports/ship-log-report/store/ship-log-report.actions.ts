import { Action } from '@ngrx/store';
import { Tbl_cargo_general} from '../../../other/models/tbl_cargo_general'
import { ReportState } from './ship-log-report.models';

export enum ActionTypes {
  ADD = '[Ship-Log-Report] Add Report',
  UPDATE = '[Ship-Log-Report] Update Report',
  DELETE = '[Ship-Log-Report] Delete Report',
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
