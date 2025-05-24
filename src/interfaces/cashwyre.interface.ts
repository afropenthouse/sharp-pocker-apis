export interface CashwyrePayoutEvent {
    eventData: {
      amount: number;
      transactionReference: string;
      fee: number;
      transactionDescription: string;
      destinationAccountNumber: string;
      sessionId: string;
      createdOn: string; // Use Date if parsed
      destinationAccountName: string;
      reference: string;
      destinationBankCode: string;
      completedOn: string; // Use Date if parsed
      narration: string;
      currency: string;
      destinationBankName: string;
      status: string;
    };
    eventType: string;
  }