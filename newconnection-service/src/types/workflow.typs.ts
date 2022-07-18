/* export interface History {
  cableTV: string;
  fixedLine: string;
}

export default class ConnectionWorkflow {
  history: History;
  financeApproval: string;
  activationStatus: string;
  constructor(
    history: History,
    financeApproval: string,
    activationStatus: string
  ) {
    this.history = history;
    this.financeApproval = financeApproval;
    this.activationStatus = activationStatus;
  }

  public historyStatus(): boolean {
    return Object.values(this.history).every((value) => value === 'success');
  }
}
 */
interface History {
  cableTV: string;
  fixedLine: string;
}

interface ConnectionWorkflow {
  history: History;
  financeApproval: string;
  activationStatus: string;
}

export class NewConnection implements ConnectionWorkflow {
  get history(): History {
    return this.workflow.history;
  }
  get financeApproval(): string {
    return this.workflow.financeApproval;
  }
  set financeApproval(value: string) {
    this.workflow.financeApproval = value;
  }
  get activationStatus(): string {
    return this.workflow.activationStatus;
  }
  set activationStatus(value: string) {
    this.workflow.activationStatus = value;
  }

  constructor(private workflow: ConnectionWorkflow) {}
  public historyStatus(): boolean {
    return Object.values(this.history).every((value) => value === 'success');
  }
}
