const Zcash = require('zcash')
const bitcoin = require('bitcoinjs-lib-zcash')
const keys = require('./key.js')
const bs58 = require('bs58')
var typeforce = require('typeforce')

const rpc = new Zcash({
	username: "test",
	password: "test",
	//port: "18332" // bitcoin testnet
	 port: "18232" // zcash testnet
})

console.log(rpc)

var btcPrivKey = "cNfkLSR4gPmkLfVmzykK8jeV8cGqu65ULkG7N9jB1eTGa8VfMA9g" // testnet private key, do not expose real keys
var zecPrivKey = "cS2RkckSNna9JbVy9iwjLmeanRT5nwqasHZP5htnQh6gjWC1WMhS" // testnet private key, do not expose real keys

rpc.getbalance().then(info => {
  console.log(info)
}).catch(err => {
	console.log(err)
})

console.log("new random key")
var keyPair = bitcoin.ECPair.makeRandom()
console.log(keyPair.toWIF())
console.log(keyPair.getAddress())

console.log("imported from WIF")

// var network = { 
//   messagePrefix: '\u0018Bitcoin Signed Message:\n',
//   bech32: 'bc',
//   bip32: { public: 76067358, private: 76066276 },
//   pubKeyHash: 0,
//   scriptHash: 5,
//   wif: 111
// }
var testnet = bitcoin.networks.testnet
var zcashnet = bitcoin.networks.zcash

console.log("btc testnet addy")
keyPair = bitcoin.ECPair.fromWIF(btcPrivKey, testnet)
var address = keyPair.getAddress()
console.log(address)
console.log(keyPair.getPublicKeyBuffer())
// console.log("zec testnet addy")
// keyPair = bitcoin.ECPair.fromWIF(zecPrivKey, zcashnet)
// var address = keyPair.getAddress()
// console.log(address)

// getPublicKeyBuffer

// build a tx
// var tx = new bitcoin.TransactionBuilder(zcashnet)
// var txId = "cbbcc47c6cfd01e6cee4554136ad8dd5962bee93868e92b09bcd6d67c7d6a9fa"
// tx.addInput(txId, 0)
// tx.addOutput("tmDMpCT9uL2MfZCTN5M2T59BaP5nsLZCU6U", 4200000)
// tx.sign(0, keyPair)
// console.log(tx.build().toHex())

// build a tx
var tx = new bitcoin.TransactionBuilder(testnet)
//var txId = "b25938df2da01941fc178fbdbb5748973bc21d2ef172331938eb6314f9ef9eb5"
var txId = '8eadf8af826421eadc0857372047412b687ca6d28a80535dc463d1c15ed0cb31'
tx.addInput(txId, 1)
//tx.addOutput("moJzzzukH8iR9jW4b3QsQ4Ezme8fucMj3M", 298996578)
//tx.addOutput("myGfe4ykB4Hg9BfFwkQ35BS5k1uyDdG3k3", 294787578)

var addrHash = bitcoin.address.fromBase58Check('moJzzzukH8iR9jW4b3QsQ4Ezme8fucMj3M').hash

// var script = bitcoin.script.compile(
//     [
//         bitcoin.opcodes.OP_DUP,
//         bitcoin.opcodes.OP_HASH160,
//         addrHash,
//         bitcoin.opcodes.OP_EQUALVERIFY,
//         bitcoin.opcodes.OP_CHECKSIG
//     ])

var commitment = "03d58daab37238604b3e57d4a8bdcffa401dc497a9c1aa4f08ffac81616c22b6"
var commitBuf = new Buffer(commitment, 'hex')
console.log("commit buffer")
console.log(commitBuf)

var script = bitcoin.script.compile(
    [
        bitcoin.opcodes.OP_IF,
        bitcoin.opcodes.OP_SHA256,
        commitBuf,
        bitcoin.opcodes.OP_EQUALVERIFY,
        bitcoin.opcodes.OP_DUP,
        bitcoin.opcodes.OP_HASH160,
        addrHash,
        bitcoin.opcodes.OP_ELSE,
        //4200000,
        bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
        bitcoin.opcodes.OP_DROP,
        bitcoin.opcodes.OP_DUP,
        bitcoin.opcodes.OP_HASH160,
        addrHash,
        bitcoin.opcodes.END_IF,
        bitcoin.opcodes.OP_EQUALVERIFY,
        bitcoin.opcodes.OP_CHECKSIG
    ])

var decompiled = bitcoin.script.decompile(script)
console.log('---------')
console.log(decompiled)
console.log(script)
console.log('---------')
var p2sh = 'a914c5f7d5ec0d98a4f6abffa9c1ca454ce89638591e87'
var buf = new Buffer(p2sh, 'hex')
var p2shCompile = bitcoin.script.compile(buf)
console.log(bitcoin.script.decompile(p2shCompile))
console.log('---------')
tx.addOutput(script, 1000)
tx.sign(0, keyPair)
console.log(tx.build().toHex())