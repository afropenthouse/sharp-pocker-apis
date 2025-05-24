export function generateWalletRef(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
  
    while (id.length < 14) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const char = characters.charAt(randomIndex);
  
      if (!id.includes(char)) {
        id += char;
      }
    }
    return id
}