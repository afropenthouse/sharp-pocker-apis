import axios,{AxiosResponse, AxiosError} from "axios"


// Intercepting all axios request and adding secret key to headers if it exists
const onRequest=(config:any):any=>{
    const {method,url} = config


    config.headers["Authorization"] = process.env.FLW_SECRET
    
    return config
}
const onResponse = (response:AxiosResponse):AxiosResponse=>{

  return response
}

const onErrorResponse = (error:AxiosError|Error):Promise<AxiosError>=>{
  if (axios.isAxiosError(error)){
    const {status} = error.response as AxiosResponse ?? {}
  }
  return Promise.reject(error)
}


const baseURL ="https://api.flutterwave.com/v3"
const flwRequest = axios.create({
  baseURL,

  headers:{
    "Content-Type":"application/json"
  }
})
flwRequest.interceptors.request.use(onRequest,onErrorResponse)
flwRequest.interceptors.response.use(onResponse,onErrorResponse)


export default flwRequest 
