
export function generateTransactionRef(length?:number){
    const stringLength = length || 14
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijlmnopqrstuvwxyz';
    while (id.length < stringLength) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const char = characters.charAt(randomIndex);
    
      if (!id.includes(char)) {
        id += char;
      }
    } 
    return id
}

//verifies a ref is a generated wallet ref by checking if it has 
//14 characters and only contains valid characters 
//and all characters are unique
export function isRefWalletRef(input: string): boolean {
  const validCharacters = /^[A-Z0-9]+$/;

  // Check if input has exactly 14 characters and only contains valid characters
  if (input.length !== 14 || !validCharacters.test(input)) {
    return false;
  }

  // Check if all characters are unique
  const uniqueChars = new Set(input);
  return uniqueChars.size === 14;
}