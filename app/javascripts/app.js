// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import ReactDOM from 'react-dom'
import { default as h } from 'react-hyperscript'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { default as questions } from './questions.json'
import moment from 'moment'

// Import our contract artifacts and turn them into usable abstractions.
import metacoinArtifacts from '../../build/contracts/MetaCoin.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const MetaCoin = contract(metacoinArtifacts)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

window.App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.')
        return
      }

      accounts = accs
      account = accounts[0]

      self.refreshBalance()
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  refreshBalance: function () {
    const self = this

    let meta
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.getBalance.call(account, { from: account })
    }).then(function (value) {
      const balanceElement = document.getElementById('balance')
      balanceElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting balance; see log.')
    })
  },

  sendCoin: function () {
    const self = this

    const amount = parseInt(document.getElementById('amount').value)
    const receiver = document.getElementById('receiver').value

    this.setStatus('Initiating transaction... (please wait)')

    let meta
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.sendCoin(receiver, amount, { from: account })
    }).then(function () {
      self.setStatus('Transaction complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  }
}

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn('Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask')
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn('No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8101'))
  }

  const loginForm = document.querySelector('#login')

  loginForm.addEventListener('submit', event => {
    event.preventDefault()

    const { username, password } = event.target.elements

    // TODO do a proper login
    if (username.value !== 'alice') {
      alert('Please enter a valid username. (hint: alice)')
      return
    }

    try {
      web3.personal.unlockAccount(account, password.value)
    } catch (e) {
      alert(e)
    }
  })

  window.App.start()
  ReactDOM.render(h(App, { data }), document.querySelector('#app'))
})

const pluralise = (stem, count) => count === 1 ? stem : `${stem}s`

const profile = {
  username: 'sahil',
  coins: 20974,
  walletId: '0xf25186b5081ff5ce73482ad761db0eb0d25sahil'
}

const mappedQuestions = questions.map(question => {
  const updatedQuestion = Object.assign({}, question)
  updatedQuestion.isCurrentUserQuestion = question.origin === profile.walletId
  return updatedQuestion
})

const data = {
  profile,
  questions: mappedQuestions
}

const App = ({ data }) => {
  const { profile, questions } = data

  return h('.app', [
    h(Router, [
      h('div', [
        h(Header, { profile }),
        h(Route, {
          path: '/',
          exact: true,
          render: () => h(QuestionList, { questions })
        }),
        h(Route, {
          path: '/questions/:id',
          render: ({ match }) =>
            h(QuestionView, { question: questions.find(({ id }) => id === match.params.id) })
        })
      ])
    ])
  ])
}

const Header = ({ profile }) => {
  const { username, coins } = profile
  return h('header.site-header', [
    h(Link, { to: '/' }, 'SiteLogo'),
    h('div', `Welcome, ${username}!`),
    h('div', `You have ${coins} coins.`)
  ])
}

const QuestionList = ({ questions }) => {
  return h('.question-list', questions.map(question =>
    h(Question, {
      question,
      hideDetails: true
    })))
}

const QuestionView = ({ question }) => {
  const { answers } = question

  return h('.question-view', [
    h(Question, { question }),
    h(Answers, {
      answers,
      canAcceptAnswers: question.isCurrentUserQuestion && !question.answers.find(answer => answer.accepted)
    }),
    h(AnswerForm)
  ])
}

const Question = ({ question, hideDetails }) => {
  const { id, title, text, timestamp, isCurrentUserQuestion } = question
  const answerCount = question.answers.length
  const hasAcceptedAnswer = !!question.answers.find(answer => answer.accepted)

  const details = [
    h('p.question-description', text)
  ]

  return h('.question', [
    h(Link, { to: `/questions/${id}` }, [
      h('.question-title', title)
    ]),
    ...(hideDetails ? [] : details),
    h('footer', [
      h('time', moment(timestamp).fromNow()),
      h('span', `${answerCount} ${pluralise('answer', answerCount)}`),
      hasAcceptedAnswer && h('span.icon-tick'),
      isCurrentUserQuestion && h('span.current-user-question', 'you asked this question')
    ])
  ])
}

const Answers = ({ answers, canAcceptAnswers }) => {
  return h('.answers', answers.map(answer => h(Answer, { answer, canAcceptAnswers })))
}

const Answer = ({ answer, canAcceptAnswers }) => {
  const { text, timestamp, accepted } = answer

  return h('.answer', { className: accepted ? 'accepted' : '' }, [
    h('.answer-text', text),
    h('footer', [
      h('time', moment(timestamp).fromNow()),
      canAcceptAnswers && h('a', { href: '#' }, 'accept')
    ])
  ])
}

const AnswerForm = () => {
  return h('form.answer-form', [
    h('textarea'),
    h('button.submit-button', 'Submit')
  ])
}
