// To create private/public key pair => use model called Elliptic
// elliptic is model note that contains classes and methods that enable elliptic curve based cryptography
// elliptic cryptography is an advanced mathematical subject. 
// But essentially, it centers around the idea that it is computationally infeasible and impossible expensive
// to guess the answer to a randomly generated elliptic curve.
const EC = require('elliptic').ec;
// ec is stands for efficient cryptography
// p is stands for prime and 256 is stands for 256 bits
const ec = new EC('secp256k1');
// the crucial step is to use prime number to generate the curve 
// with the sepc256k1 => the prime number is 256 bits
module.exports = { ec };