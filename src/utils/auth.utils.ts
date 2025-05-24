import bcrypt from "bcrypt";

export function generateOTP(): string {
    const otpLength = 4;
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
}

export async function bcryptHash(password:string){
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password,salt)
    return hashed
}

export async function  bcryptCompare({password,hashedPassword}:{password:string,hashedPassword:string | null}){
    const isValid =  await bcrypt.compare(password,hashedPassword || "")
    return isValid
}
  
export function stringifyError(error: any): string {
    if (error instanceof Error) {
      const errorObj: { [key: string]: any } = {
        message: error.message,
        name: error.name,
        stack: error.stack,
      };
  
      if ('cause' in error) {
        errorObj.cause = (error as any).cause;
      }
  
      return JSON.stringify(errorObj, null, 2); // pretty-print with 2 spaces indentation
    }
  
    // Fallback for non-Error objects
    return JSON.stringify(error, null, 2);
  }
  