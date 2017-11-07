import { default as contract } from 'truffle-contract'

import metacoinArtifacts from '../../build/contracts/MetaCoin.json'

const MetaCoin = contract(metacoinArtifacts)

const web3 = window.web3

MetaCoin.setProvider(web3.currentProvider)

export function getAccount () {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts(function (err, accs) {
      if (err !== null) {
        alert('There was an error fetching your accounts.')
        reject('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.')
        reject('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.')
        return
      }

      resolve(accs[0])
    })
  })
}

export async function refreshBalance () {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()
  const balance = await meta.getBalance.call(account, { from: account })
  return balance.valueOf()
}
