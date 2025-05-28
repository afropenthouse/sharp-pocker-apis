"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWalletRef = generateWalletRef;
function generateWalletRef() {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var id = '';
    while (id.length < 14) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        var char = characters.charAt(randomIndex);
        if (!id.includes(char)) {
            id += char;
        }
    }
    return id;
}
