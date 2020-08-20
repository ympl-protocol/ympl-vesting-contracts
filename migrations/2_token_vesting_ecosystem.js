require('dotenv').config()

const VestingEco = artifacts.require('VestingEco')
const UFragments = artifacts.require('UFragments')
const BN = require('bn.js')

module.exports = async function (deployer, _network, address) {  
  const [owner] = address
  const start = Math.floor(new Date().getTime() / 1000)
  const monthSeconds = 2628000
  // 20 months => 5% per month
  const lockSeconds = monthSeconds * 20
  await deployer.deploy(VestingEco, owner, start, 0, lockSeconds, false)
  const UFragmentsContract = await UFragments.deployed()
  const VestingEcoContract = await VestingEco.deployed()
  const decimals = await UFragmentsContract.decimals()
  // vest 80 % of ecosystem tokens
  const amount = new BN(220000 * 80 / 100).mul(new BN(10).pow(new BN(decimals))).toString()
  await UFragmentsContract.transfer(VestingEcoContract.address, amount)
  console.log(`Transfered to vesting eco ${amount} locked contract`)
}