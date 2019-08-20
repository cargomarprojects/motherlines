import { Action } from '@ngrx/store';
import { TBL_LABELM} from '../../models/tbl_label_report'
import { ReportState } from './ship-label-report.models';

export enum ActionTypes {
  ADD = '[Ship-Label-Report] Add Report',
  UPDATE = '[Ship-Label-Report] Update Report',
  DELETE = '[Ship-Label-Report] Delete Report',
  SELECTDESELECT = '[Ship-Label-Report] SelectDeselect Report',
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

export class SelectDeselect implements Action {
  readonly type = ActionTypes.SELECTDESELECT;
  constructor(public payload : { id: string, selectyn :boolean }){ }
}

export type Actions = Add | Update | Delete | SelectDeselect;
