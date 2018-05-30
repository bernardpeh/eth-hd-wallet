const { addHexPrefix } = require('ethereumjs-util');
const { fromExtendedKey } = require ('ethereumjs-wallet/hdkey');
const EthereumTx = require('ethereumjs-tx');
const Mnemonic = require('bitcore-mnemonic');

// See https://github.com/ethereum/EIPs/issues/85
const BIP44_PATH = `m/44'/60'/0'/0`

/**
 * Generate a 12-word mnemonic in English.
 * @return {[String]}
 */
generateMnemonic = function() {
  return new Mnemonic(Mnemonic.Words.ENGLISH).toString()
}

/**
 * Represents a wallet instance.
 */
class EthHdWallet {
  /**
   * Construct HD wallet instance from given mnemonic
   * @param  {String} mnemonic Mnemonic/seed string.
   * @return {EthHdWallet}
   */
  static fromMnemonic (mnemonic) {
    const { xprivkey } = new Mnemonic(mnemonic).toHDPrivateKey()

    return new EthHdWallet(xprivkey)
  }

  /**
   * @constructor
   * @param  {String} hdKey Extended HD private key
   */
  constructor (xPrivKey) {
    this._hdKey = fromExtendedKey(xPrivKey)
    this._root = this._hdKey.derivePath(BIP44_PATH)
    this._children = []
  }

  /**
   * Generate new addresses.
   * @param  {Number} num No. of new addresses to generate.
   * @return {[String]}
   */
  generateAddresses (num) {
    const newKeys = this._deriveNewKeys(num)

    return newKeys.map(k => k.address)
  }

  /**
   * Generate 1 new address.
   * @param  {Number} num nth new address to generate.
   * @return {[String]}
   */
  generateAddress (num) {
    const newKey = this._deriveNewKey(num)

    return newKey.map(k => k.address)
  }

  /**
   * Discard generated addresses.
   *
   * This is in effect the reverse of `generateAddresses()`.
   *
   * @param  {Number} num The number of addresses to remove from the end of the list of addresses.
   * @return {[String]} The discarded addresses
   */
  discardAddresses (num) {
    const discard = this._children.splice(-num)

    return discard.map(k => k.address)
  }

  /**
   * Get all addresses.
   * @return {[String]}
   */
  getAddresses () {
    return this._children.map(k => k.address)
  }

  /**
   * Get no. of addresses.
   * @return {Number}
   */
  getAddressCount () {
    return this._children.map(k => k.address).length
  }

  /**
   * Check whether given address is present in current list of generated addresses.
   * @param  {String}  addr
   * @return {Boolean}
   */
  hasAddress (addr) {
    addr = addHexPrefix(addr)

    return !!this._children.find(({ address }) => addr === address)
  }

  /**
   * Generate signed transaction for given parameters.
   *
   * @param  {String} from From ID
   * @param  {String} [to] If omitted then deploying a contract
   * @param  {Number} value Amount of wei to send
   * @param  {String} data Data
   * @param  {Number} gasLimit Total Gas to use
   * @param  {Number} gasPrice Gas price (wei per gas unit)
   * @param  {String} chainId Chain id
   *
   * @return {String} Raw transaction string.
   */
  sign ({ nonce, from, to, value, data, gasLimit, gasPrice, chainId }) {

    const tx = new EthereumTx({
      nonce, to, value, data, gasLimit, gasPrice, chainId
    })

    tx.sign(this._root.deriveChild(from).getWallet().getPrivateKey())

    return addHexPrefix(tx.serialize().toString('hex'))
  }

  /**
   * Derive new key pairs.
   *
   * This will increment the internal key index counter and add the
   * generated keypairs to the internal list.
   *
   * @param  {Number} num no. of new keypairs to generate
   * @return {[String]} Generated keypairs.
   */
  _deriveNewKeys (num) {
    let count = num

    while (0 <= --count) {
      const child = this._root.deriveChild(this._children.length).getWallet()

      this._children.push({
        wallet: child,
        address: addHexPrefix(child.getAddress().toString('hex'))
      })
    }

    return this._children.slice(-num)
  }

  /**
   * Derive 1 new key pair.
   *
   * @param  {Number} nth new keypair to generate
   * @return {[String]} Generated keypairs.
   */
  _deriveNewKey (num) {
    var child = this._root.deriveChild(num).getWallet()
    this._children.push({
      wallet: child,
      address: addHexPrefix(child.getAddress().toString('hex'))
    })
    return this._children
  }
}

module.exports = { generateMnemonic, EthHdWallet};