// mnemonic = 'veteran vehicle super three prefer fringe summer trouble peace gallery movie slogan';

const { generateMnemonic, EthHdWallet } = require('./eth-hd-wallet.js')

if (process.argv.length != 4) {
  console.log('command: node script.js [nth acct] [mnemonic password]')
  process.exit()
}

const Web3 = require('web3')

web3 = new Web3()
// truffle develop
web3.setProvider(new web3.providers.HttpProvider('http://localhost:9545'))

userId = process.argv[2]
mnemonic = process.argv[3]

const wallet = EthHdWallet.fromMnemonic(mnemonic)

// sending from address 1 to 2
const rawTx = wallet.sign({
  from: userId,
  to: '0x3db9bad2da382438d510223747be587e4c72056f',
  value: 70000000000000000,
  nonce: 0x0,
  gasPrice: 50000000000,
  gasLimit: 21000,
  chainId: 1
})

console.log( rawTx )

web3.eth.sendRawTransaction(rawTx, (err) => {
  console.log(err)
})

