require('dotenv').config()

const VestingTeam = artifacts.require('VestingTeam')
const UFragments = artifacts.require('UFragments')
const BN = require('bn.js')

module.exports = async function (deployer, _network, address) {  
  const [owner] = address
  const start = Math.floor(new Date().getTime() / 1000)
  const yearSeconds = 31536000 
  const lockSeconds = yearSeconds * 2
  // 1 month
  const clif = 2628000
  await deployer.deploy(VestingTeam, owner, start, clif, lockSeconds, false)
  const UFragmentsContract = await UFragments.deployed()
  const VestingTeamContract = await VestingTeam.deployed()
  const decimals = await UFragmentsContract.decimals()
  const amount = new BN(132000).mul(new BN(10).pow(new BN(decimals))).toString()
  await UFragmentsContract.transfer(VestingTeamContract.address, amount)
  console.log(`Transfered to vesting team ${amount} locked contract`)
}