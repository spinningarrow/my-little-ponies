import { default as contract } from 'truffle-contract'
import { default as Web3 } from 'web3'

import metacoinArtifacts from '../../build/contracts/MetaCoin.json'

const MetaCoin = contract(metacoinArtifacts)

window.web3 = new Web3(new Web3.providers.HttpProvider('http://159.89.204.101:8545'))
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

      console.log('accounts', accs)
      resolve(accs[0])
    })
  })
}

export async function createPost (content) {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()
  const posted = await meta.createPost(content, { from: account })
  return posted.valueOf()
}

export async function getLatestPost () {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()
  const post = await meta.getLatestPost({ from: account })
  return {
    'timestamp': post.timestamp.valueOf(),
    'content': post.content.valueOf(),
    'numberOfPosts': post.numberOfPosts.valueOf()
  }
}

export async function getNumberOfPosts () {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()
  const num = await meta.getNumberOfPosts({ from: account })
  return num.valueOf()
}

export async function getPost (postId) {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()
  const post = await meta.getPost(postId, { from: account })
  return {
    'timestamp': post.timestamp.valueOf(),
    'content': post.content.valueOf()
  }
}

export async function refreshBalance () {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()
  const balance = await meta.getBalance.call(account, { from: account })
  return balance.valueOf()
}

export async function sendCoin (receiver, amount) {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()
  const sufficient = await meta.sendCoin(receiver, amount, { from: account })
  return sufficient.valueOf()
}
