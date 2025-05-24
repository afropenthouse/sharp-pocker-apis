import { TRANSACTION_DESCRIPTION } from "@prisma/client";
import { IUserDetail } from "./user.interface";
export interface WebhookData {
  id: number // 5044062,
  txRef: string; // 'sMUCqVubXHxDwN',
  flwRef: string; // '2940313924901713912565365',
  orderRef: string; //'URF_1713912565031_6927035',
  paymentPlan: null,
  paymentPage: null,
  createdAt: string; //'2024-04-23T22:49:32.000Z',
  amount: number; // 1500,
  charged_amount: number; // 1500,
  status: string; // 'successful',
  IP: string; // '52.209.154.143',
  currency: string; // 'NGN',
  appfee: number; // 21,
  merchantfee: number; // 0,
  merchantbearsfee: number; //1,
  customer: {
    id: number; // 2395220,
    phone: string; // '08012345678',
    fullName: string; // 'undefined undefined',
    customertoken: null // null,
    email: string; // 'onotaizee@gmail.com',
    createdAt: string; // '2024-04-21T18:34:35.000Z',
    updatedAt: string; //'2024-04-21T18:34:35.000Z',
    deletedAt: null // null,
    AccountId: number; // 1116557
  },
  entity: {
    account_number: string; // '1234567890',
    first_name: string; // 'DOE',
    last_name: string; // 'JOHN',
    createdAt: string; // '2024-04-23T22:49:32.000Z'
  },
  transfer:{
    id: number;
    account_number: string;
    bank_code: string;
    fullname: string;
    date_created: string; // ISO string date
    currency: string;
    debit_currency: string;
    amount: number;
    fee: number;
    status: 'FAILED' | 'PENDING' | 'SUCCESS'; // based on possible values of status
    reference: string;
    meta: any; // or you could define a specific type for meta if needed
    narration: string;
    approver: string | null;
    complete_message: string;
    requires_approval: 0 | 1;
    is_approved: 0 | 1;
    bank_name: string;
  };
  'event.type': string; // 'BANK_TRANSFER_TRANSACTION'
}

export interface WebhookDataProd {
  event: 'charge.completed',
  data: {
    id: number,
    tx_ref: string,
    reference: string
    flw_ref: string,
    device_fingerprint: string,
    amount: 30,
    currency: 'NGN',
    charged_amount: number,
    app_fee: number,
    merchant_fee: number,
    processor_response: string,
    auth_model:string,
    ip: string,
    narration:string,
    status: string,
    payment_type: string,
    created_at: string,
    account_id: 683269,
    customer: {
      id: 994192822,
      name: string,
      phone_number: string,
      email: string,
      created_at: string
    }
  },
  'event.type': 'BANK_TRANSFER_TRANSACTION' | "Transfer"
}


export interface ICardDetails {
    first_6digits: string;
    last_4digits: string;
    issuer: string;
    country: string;
    type: string;
    token: string;
    expiry: string;
  }

  
export interface IFlwTransactionVerificationData {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    ip: string;
    narration: string;
    status: string;
    payment_type: string;
    created_at: string; // DateTime in ISO format
    account_id: number;
    card?: ICardDetails;
    plan: number;
    amount_settled: number;
    customer: CustomerDetails;
  }

interface CustomerDetails {
    id: number;
    name: string;
    phone_number: string;
    email: string;
    created_at: string; // DateTime in ISO format
}
  
export interface IFlwTransactionResponse {
    status: string;
    message: string;
    data: IFlwTransactionVerificationData;
}
  
export interface IPaymentInformation{
    user:IUserDetail
    tx_ref:string
    amount:number
    currency: string,
    product: TRANSACTION_DESCRIPTION,
    productId:string
    redirectUrl: string  | null
    description: string  | null
} 

export interface IFlwVirtualAccountCreationResponse {
  status: string;
  message: string;
  data: {
    response_code: string;
    response_message: string;
    flw_ref: string;
    order_ref: string;
    account_number: string;
    account_status: string;
    frequency: number;
    bank_name: string;
    created_at: number;
    expiry_date: string;
    note: string;
    amount: string;
  };
}

export interface IFlwTransferResponse {
  status: string;
  message: string;
  data: {
    id: number;
    account_number: string;
    bank_code: string;
    full_name: string;
    created_at: string;  // ISO string format for the date
    currency: string;
    debit_currency: string;
    amount: number;
    fee: number;
    status: string;
    reference: string;
    meta: any | null;  // Replace `any` with a more specific type if meta has a defined structure
    narration: string;
    complete_message: string;
    requires_approval: number;
    is_approved: number;
    bank_name: string;
  };
}
