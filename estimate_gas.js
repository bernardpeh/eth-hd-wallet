// this is a test mnemonic
// mnemonic = 'veteran vehicle super three prefer fringe summer trouble peace gallery movie slogan';

// this script tries to estimate the amount of gas required to send some token to another person
// without knowing the abi of the token contract

const { generateMnemonic, EthHdWallet } = require('./eth-hd-wallet.js')
const Web3 = require('web3')
web3 = new Web3()
// truffle develop
web3.setProvider(new web3.providers.HttpProvider('https://localhost:7545'))

const wallet = EthHdWallet.fromMnemonic(mnemonic)
let from_address = wallet.generateAddress(0)[0]
// send token to
let to_address = '0x1f2f59321bd869fa5cd0041640e398c2ea9a679d'
let transfer_val = 0.02

let function_signature = web3.sha3('transfer(address,uint256)').substring(0,10)
let address_param = '0'.repeat(24)+to_address.substring(2)
let transfer_value_param = web3.toHex(web3.toBigNumber(transfer_val*Math.pow(10, 18)).toNumber())
let transfer_value_prefix = '0'.repeat((66 - transfer_value_param.length))

let transfer_data = function_signature + address_param + transfer_value_prefix + transfer_value_param.substring(2)

var result = web3.eth.estimateGas({
  from: from_address,
  // token contract address
  to: "0xed340df3c339ab60418bfb7a4557f18cfc2118dd", 
  data: transfer_data,
});

console.log(result)