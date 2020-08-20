require('dotenv').config()

const VestingCommunity = artifacts.require('VestingCommunity')
const UFragments = artifacts.require('UFragments')
const BN = require('bn.js')

module.exports = async function (deployer, _network, address) {  
  const [owner] = address
  const start = Math.floor(new Date().getTime() / 1000)
  const lockSeconds = yearSeconds * 2
  await deployer.deploy(VestingCommunity, owner, start, 0, lockSeconds, false)
  const UFragmentsContract = await UFragments.deployed()
  const VestingCommunityContract = await VestingCommunity.deployed()
  const decimals = await UFragmentsContract.decimals()
  // vest 80 % of community tokens
  const amount = new BN(176500 * 80 / 100).mul(new BN(10).pow(new BN(decimals))).toString()
  await UFragmentsContract.transfer(VestingCommunityContract.address, amount)
  console.log(`Transfered to vesting community ${amount} locked contract`)
}