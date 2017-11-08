import { default as contract } from 'truffle-contract'
import { default as Web3 } from 'web3'

import metacoinArtifacts from '../../build/contracts/MetaCoin.json'

const MetaCoin = contract(metacoinArtifacts)

window.web3 = new Web3(new Web3.providers.HttpProvider('http://159.89.204.101:8545'))
// window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const web3 = window.web3

MetaCoin.setProvider(web3.currentProvider)

window.MC = MetaCoin;

export function getAccount () {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accs) => {
      if (err !== null) {
        reject(new Error(`Error fetching accounts: ${JSON.stringify(err)}`))
        return
      }

      if (accs.length === 0) {
        reject(new Error('No accounts found'))
        return
      }

      console.log('accounts', accs)
      resolve(accs[0])
    })
  })
}

export async function postQuestion (content) {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()
  const posted = await meta.postQuestion(content, { from: account })
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

export async function getAllPosts () {
  const postCount = await getNumberOfPosts()
  const postPromises = Array(+postCount).fill().map((value, index) => getPost(index + 1))
  return Promise.all(postPromises)
}

export async function getPost (postId) {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()
  const post = await meta.getPost(postId, { from: account })
  const likes = await meta.getLikes(postId, { from: account })
  return {
    id: postId,
    content: post,
    likes,
    timestamp: 1510064570379
  }
}

export async function getPosts () {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()
  const posts = []

  const num = await meta.getNumberOfPosts({ from: account })
  for (let i = 1; i <= num; ++i) {
    const content = await meta.getPost(i, { from: account })
    posts.push({
      id: i,
      content
    })
  }

  return posts.valueOf()
}

export async function refreshBalance () {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()
  const credited = await meta.isUserCredited({ from: account })
  if (!credited) {
    await meta.creditForFirstTime({ from: account })
  }

  const balance = await meta.getBalance(account, { from: account })
  return balance.valueOf()
}

export async function sendCoin (receiver, amount) {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()

  const sufficient = await meta.sendCoin(receiver, amount, { from: account })
  return sufficient.valueOf()
}

export async function likePost (postId) {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()
  const sufficient = await meta.likePost(postId, { from: account })
  return sufficient.valueOf()
}

export async function getLikes(postId) {
  const account = await getAccount()
  const meta = await MetaCoin.deployed()
  const likes = await meta.getLikes(postId, { from: account })
  return likes.valueOf()
}

