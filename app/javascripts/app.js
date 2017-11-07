import '../stylesheets/app.css'

import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import { Component } from 'react'
import ReactDOM from 'react-dom'
import { default as h } from 'react-hyperscript'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { default as jsonQuestions } from './questions.json'
import moment from 'moment'

import * as api from './api'
window.api = api

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
      if (err !== null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.')
        return
      }

      accounts = accs
      account = accounts[0]
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
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
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  }
}

const pluralise = (stem, count) => count === 1 ? stem : `${stem}s`

class App extends Component {
  constructor (props) {
    super(props)

    const { jsonQuestions } = this.props

    const profile = {
      username: 'sahil',
      coins: 20974,
      walletId: '0xf25186b5081ff5ce73482ad761db0eb0d25sahil'
    }

    const mappedQuestions = jsonQuestions.map(question => {
      const updatedQuestion = Object.assign({}, question)
      updatedQuestion.isCurrentUserQuestion = question.origin === profile.walletId
      return updatedQuestion
    })

    this.state = { profile, questions: mappedQuestions }
  }

  componentDidMount () {
    api.refreshBalance().then(balance => {
      const { profile } = this.state

      const updatedProfile = Object.assign({}, profile)
      updatedProfile.coins = balance
      this.setState({ profile: updatedProfile })
    })
  }

  render () {
    const { profile, questions } = this.state

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
}

const Header = ({ profile }) => {
  const { username, coins } = profile
  return h('header.site-header', [
    h(Link, { to: '/', className: 'site-logo' }, 'CreditOverflow'),
    h('.profile', [
      h('span', `Welcome, ${username}!`),
      h('span', `You have ${coins} coins.`)
    ])
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
      !hasAcceptedAnswer && answerCount ? h('span.no-accepted-answer', 'no answers accepted') : null,
      isCurrentUserQuestion && h('span.current-user-question', 'asked by you!')
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
    h('label', { htmlFor: 'answer-textarea' }, 'Help by adding your own answer to this question:'),
    h('textarea', { id: 'answer-textarea' }),
    h('button.submit-button', 'Submit')
  ])
}

ReactDOM.render(h(App, { jsonQuestions }), document.querySelector('#app'))
