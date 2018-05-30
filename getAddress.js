// mnemonic = 'veteran vehicle super three prefer fringe summer trouble peace gallery movie slogan';

const { generateMnemonic, EthHdWallet } = require('./eth-hd-wallet.js')

if (process.argv.length != 4) {
  console.log('command: node script.js [nth acct] [mnemonic password]')
  process.exit()
}

userId = process.argv[2]
mnemonic = process.argv[3]

const wallet = EthHdWallet.fromMnemonic(mnemonic)

console.log(wallet.generateAddress(userId))
/*
wallet.generateAddresses(process.argv[2]).forEach((v,k) => {
  if (k == process.argv[2] - 1) {
    console.log("key is "+k+" and val is "+v)
  }

})
*/
