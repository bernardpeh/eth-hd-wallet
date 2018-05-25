mnemonic = 'veteran vehicle super three prefer fringe summer trouble peace gallery movie slogan';

const { generateMnemonic, EthHdWallet } = require('./eth-hd-wallet.js')

const wallet = EthHdWallet.fromMnemonic(mnemonic)

console.log(wallet.generateAddress(process.argv[2]));
/*
wallet.generateAddresses(process.argv[2]).forEach((v,k) => {
  if (k == process.argv[2] - 1) {
    console.log("key is "+k+" and val is "+v)
  }

})
*/
