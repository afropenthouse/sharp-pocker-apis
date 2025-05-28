"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionRef = generateTransactionRef;
exports.isRefWalletRef = isRefWalletRef;
function generateTransactionRef(length) {
    var stringLength = length || 14;
    var id = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijlmnopqrstuvwxyz';
    while (id.length < stringLength) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        var char = characters.charAt(randomIndex);
        if (!id.includes(char)) {
            id += char;
        }
    }
    return id;
}
//verifies a ref is a generated wallet ref by checking if it has 
//14 characters and only contains valid characters 
//and all characters are unique
function isRefWalletRef(input) {
    var validCharacters = /^[A-Z0-9]+$/;
    // Check if input has exactly 14 characters and only contains valid characters
    if (input.length !== 14 || !validCharacters.test(input)) {
        return false;
    }
    // Check if all characters are unique
    var uniqueChars = new Set(input);
    return uniqueChars.size === 14;
}
