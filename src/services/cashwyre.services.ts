import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';  



interface AccountLookupRequest {
    appId: string;
    requestId: string;
    accountNumber: string;
    bankCode: string;
    country: string;
  }

  interface PayoutRequest {
    BusinessCode: string;
    BankCode: string;
    AccountName: string;
    AccountNumber: string;
    Currency: string;
    Narration: string;
    Reference: string;
    Amount: number;
    ThirdPartyIdentifier: string | null;
    PercentageDiscount: number | null;
    AppId: string;
    RequestId: string;
  }
  




export const getBankCodes = async () => {
  const reqUrl = "https://businessapi.cashwyre.com/api/v1.0/CountryBank/getCountryBanks";
  
  // Generating a unique requestId using uuid
  const requestId = uuidv4(); 

 
  const data = {
    appId: process.env.CASHWYREAPPID,           
    requestId: requestId,                
    country: "NG",                       
    businessCode: process.env.CASHWYREBUSINESSCODE, 
    accountType: ""  
  };

  try {
    const response = await axios.post(reqUrl, data); // Sending POST request with data
    return response.data; // Returning the response data
  } catch (err) {
    console.error("Error fetching bank codes:", err);
    return null; // Return null in case of error
  }
};





export const accountLookup = async (
  accountNumber: string,
  bankCode: string,
) => {
  const reqUrl = "https://businessapi.cashwyre.com/api/v1.0/account/accountlookup"; 
  
  
  const requestId = uuidv4(); 


  const data: AccountLookupRequest = {
    appId: "C4B20241209000012", 
    requestId: requestId,                
    accountNumber: accountNumber,        
    bankCode: bankCode,                  
    country: "NG"                      
  };

  try {
    const response = await axios.post(reqUrl, data);
    return response.data; 
  } catch (err) {
    console.error("Error performing account lookup:", err);
    return null; 
  }
};




export const initiatePayout = async (
  bankCode: string,
  accountName: string,
  accountNumber: string,
  amount: number,
  tx_ref: string
) => {
  const reqUrl = "https://businessapi.cashwyre.com/api/v1.0/Payout/initiate"; // The initiate payout endpoint
  
  // Generating a unique RequestId using uuid
  const requestId = uuidv4();

  // The data to be sent in the POST request
  const data: PayoutRequest = {
    BusinessCode: process.env.CASHWYREBUSINESSCODE as string, 
    BankCode: bankCode,                               
    AccountName: accountName,                        
    AccountNumber: accountNumber,                    
    Currency: "NGN",                                 
    Narration: "withdraw",                            
    Reference: tx_ref,                              
    Amount: amount,                                   
    ThirdPartyIdentifier: null,                      
    PercentageDiscount: null,                         
    AppId: process.env.CASHWYREAPPID as string,              
    RequestId: requestId                              
  };

  try {
    const response = await axios.post(reqUrl, data,  {
      headers: {
        Authorization: `Bearer ${process.env.CASHWYREPUBLICKEY}`
      }
    });
    return response.data; 
  } catch (err) {
    console.error("Error initiating payout:", err);
    return null;
  }
};


export const getElectricityOptions = async () => {
  const reqUrl = "https://businessapi.cashwyre.com/api/v1.0/Electricity/getElectricityInfo";
  
  // Generating a unique requestId using uuid
  const requestId = uuidv4(); 

 
  const data = {
    appId: process.env.CASHWYREAPPID,           
    requestId: requestId,                
    country: "NG",                       
    businessCode: process.env.CASHWYREBUSINESSCODE, 
    accountType: ""  
  };

  try {
    const response = await axios.post(reqUrl, data); // Sending POST request with data
    return response.data; // Returning the response data
  } catch (err) {
    console.error("Error fetching bank codes:", err);
    return null; // Return null in case of error
  }
};


export const getCableOptions = async () => {
  const reqUrl = "https://businessapi.cashwyre.com/api/v1.0/CableTV/getCableTVInfo";
  
  // Generating a unique requestId using uuid
  const requestId = uuidv4(); 

 
  const data = {
    appId: process.env.CASHWYREAPPID,           
    requestId: requestId,             
    businessCode: process.env.CASHWYREBUSINESSCODE, 
  };

  try {
    const response = await axios.post(reqUrl, data); // Sending POST request with data
    return response.data; // Returning the response data
  } catch (err) {
    console.error("Error fetching bank codes:", err);
    return null; // Return null in case of error
  }
};


  export const getAirtimeOptions   = async () => {
  const reqUrl = "https://businessapi.cashwyre.com/api/v1.0/Airtime/getAirtimeInfo";
  
  // Generating a unique requestId using uuid
  const requestId = uuidv4(); 

 
  const data = {
    appId: process.env.CASHWYREAPPID,           
    requestId: requestId,                
    country: "NG",                       
    businessCode: process.env.CASHWYREBUSINESSCODE, 
    accountType: ""  
  };

  try {
    const response = await axios.post(reqUrl, data); // Sending POST request with data
    return response.data; // Returning the response data
  } catch (err) {
    console.error("Error fetching bank codes:", err);
    return null; // Return null in case of error
  }
};


  export const getDataOptions = async () => {
  const reqUrl = "https://businessapi.cashwyre.com/api/v1.0/DataPurchase/getDataInfo";
  

  const requestId = uuidv4(); 

 
  const data = {
    appId: process.env.CASHWYREAPPID,           
    requestId: requestId,                
    country: "NG",                       
    businessCode: process.env.CASHWYREBUSINESSCODE, 
    accountType: ""  
  };

  try {
    const response = await axios.post(reqUrl, data); // Sending POST request with data
    return response.data; // Returning the response data
  } catch (err) {
    console.error("Error fetching bank codes:", err);
    return null; // Return null in case of error
  }
};

export const initiateCashwyrePayout = async (
  bankCode: string,
  accountName: string,
  accountNumber: string,
  amount: number,
  tx_ref: string
) => {
  const reqUrl = "https://businessapi.cashwyre.com/api/v1.0/Payout/initiate"; // The initiate payout endpoint
  
  // Generating a unique RequestId using uuid
  const requestId = uuidv4();

  // The data to be sent in the POST request
  const data: PayoutRequest = {
    BusinessCode: process.env.CASHWYREBUSINESSCODE as string, 
    BankCode: bankCode,                               
    AccountName: accountName,                        
    AccountNumber: accountNumber,                    
    Currency: "NGN",                                 
    Narration: "withdraw",                            
    Reference: tx_ref,                              
    Amount: amount,                                   
    ThirdPartyIdentifier: null,                      
    PercentageDiscount: null,                         
    AppId: process.env.CASHWYREAPPID as string,              
    RequestId: requestId                              
  };

  try {
    const response = await axios.post(reqUrl, data,  {
      headers: {
        Authorization: `Bearer ${process.env.CASHWYREPUBLICKEY}`
      }
    });
    return response.data; 
  } catch (err) {
    console.error("Error initiating payout:", err);
    return null;
  }
};