import '../stylesheets/app.css'

import { Component } from 'react'
import ReactDOM from 'react-dom'
import { default as h } from 'react-hyperscript'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import moment from 'moment'

import * as api from './api'
window.api = api

const pluralise = (stem, count) => count === 1 ? stem : `${stem}s`

class App extends Component {
  constructor (props) {
    super(props)

    // const { jsonQuestions } = this.props

    const profile = {
      username: 'sahil',
      coins: 0,
      walletId: ''
    }

    // const mappedQuestions = jsonQuestions.map(question => {
    //   const updatedQuestion = Object.assign({}, question)
    //   updatedQuestion.isCurrentUserQuestion = question.origin === profile.walletId
    //   return updatedQuestion
    // })

    this.state = { profile, questions: [], isLoading: false }

    this.handleSendCoinsFormSubmit = this.handleSendCoinsFormSubmit.bind(this)
    this.handlePostFormSubmit = this.handlePostFormSubmit.bind(this)
  }

  mapQuestions () {
    const { questions, profile: { walletId } } = this.state
    const mappedQuestions = questions.map(question => {
      const updatedQuestion = Object.assign({}, question)
      updatedQuestion.isCurrentUserQuestion = question.origin === walletId
      return updatedQuestion
    })

    this.setState({ questions: mappedQuestions })
  }

  updatePosts () {
    this.setState({ isLoading: true })
    return api.getAllPosts().then(posts => {
      this.setState({ questions: posts, isLoading: false })
    }).catch(() => {
      this.setState({ isLoading: false })
    })
  }

  updateAccount () {
    this.setState({ isLoading: true })
    return api.getAccount().then(account => {
      const { profile } = this.state
      const updatedProfile = Object.assign({}, profile)
      updatedProfile.walletId = account
      this.setState({ profile: updatedProfile, isLoading: false })

      return account
    }).catch(() => {
      this.setState({ isLoading: false })
    })
  }

  updateBalance () {
    this.setState({ isLoading: true })
    api.refreshBalance().then(balance => {
      const { profile } = this.state
      const updatedProfile = Object.assign({}, profile)
      updatedProfile.coins = balance
      this.setState({ profile: updatedProfile, isLoading: false })
    }).catch(() => {
      this.setState({ isLoading: false })
    })
  }

  componentDidMount () {
    this.updateAccount()
    this.updateBalance()
    this.updatePosts()
  }

  handleSendCoinsFormSubmit (event) {
    this.setState({ isLoading: true })
    const form = event.target
    const { wallet, amount } = form.elements

    api.sendCoin(wallet.value, amount.value)
      .then(() => this.updateBalance())
      .catch(() => this.setState({ isLoading: false }))
  }

  handlePostFormSubmit (event) {
    event.preventDefault()

    this.setState({ isLoading: true })
    const form = event.target
    const textarea = form.elements['answer-textarea']

    api.postQuestion(textarea.value)
      .then(() => {
        this.updatePosts()
        textarea.value = ''
      })
      .catch(() => this.setState({ loading: false }))
  }

  render () {
    const { profile, questions, isLoading } = this.state

    return h('.app', [
      h(Router, [
        h('div', [
          h(Header, { profile, isLoading, handleSendCoinsFormSubmit: this.handleSendCoinsFormSubmit }),
          h(Route, {
            path: '/',
            exact: true,
            render: () => h(QuestionList, { questions, handlePostFormSubmit: this.handlePostFormSubmit })
          })
          // h(Route, {
          //   path: '/questions/:id',
          //   render: ({ match }) =>
          //     h(QuestionView, { question: questions.find(({ id }) => id === match.params.id) })
          // })
        ])
      ])
    ])
  }
}

const Spinner = () => {
  return h('.spinner', [
    h('.rect1'),
    h('.rect2'),
    h('.rect3'),
    h('.rect4'),
    h('.rect5')
  ])
}

const Header = ({ profile, isLoading, handleSendCoinsFormSubmit }) => {
  const { username, coins } = profile
  return h('header.site-header', [
    h(Link, { to: '/', className: 'site-logo' }, 'CreditOverflow'),
    isLoading && h(Spinner),
    h('.profile', [
      h('span', `Welcome!`),
      h('span', `You have ${coins} coins.`),
      h('a.send-coins-link', { href: '#' }, 'Send some coins.'),
      h(SendCoinsForm, { handleSubmit: handleSendCoinsFormSubmit })
    ])
  ])
}

const SendCoinsForm = ({ handleSubmit }) => {
  return h('form.send-coins-form', { onSubmit: handleSubmit }, [
    h('input#wallet', { placeholder: 'Wallet ID', required: true }),
    h('input#amount', { placeholder: 'Amount', type: 'number', required: true }),
    h('button', 'Submit')
  ])
}

const QuestionList = ({ questions, handlePostFormSubmit }) => {
  return h('.question-box', [
    h('.question-list', questions.map(question =>
      h(Question, {
        question,
        hideDetails: true
      }))),
    h(PostForm, { handleSubmit: handlePostFormSubmit })
  ])
}

// const QuestionView = ({ question }) => {
//   const { answers } = question
//
//   return h('.question-view', [
//     h(Question, { question }),
//     h(Answers, {
//       answers,
//       canAcceptAnswers: question.isCurrentUserQuestion && !question.answers.find(answer => answer.accepted)
//     }),
//     h(AnswerForm)
//   ])
// }

const Question = ({ question }) => {
  const { id, content, timestamp } = question
  const likeCount = 4

  return h('.question', [
    h(Link, { to: `/questions/${id}` }, [
      h('.question-title', content)
    ]),
    h('footer', [
      h('time', moment(timestamp).fromNow()),
      h('span.like-count', `❤ ${likeCount}`)
    ])
  ])
}

// const Answers = ({ answers, canAcceptAnswers }) => {
//   return h('.answers', answers.map(answer => h(Answer, { answer, canAcceptAnswers })))
// }
//
// const Answer = ({ answer, canAcceptAnswers }) => {
//   const { text, timestamp, accepted } = answer
//
//   return h('.answer', { className: accepted ? 'accepted' : '' }, [
//     h('.answer-text', text),
//     h('footer', [
//       h('time', moment(timestamp).fromNow()),
//       canAcceptAnswers && h('a', { href: '#' }, 'accept')
//     ])
//   ])
// }

const PostForm = ({ handleSubmit }) => {
  return h('form.answer-form', { onSubmit: handleSubmit }, [
    h('input#answer-textarea', { required: true }),
    h('button.submit-button', 'Add Post')
  ])
}

ReactDOM.render(h(App), document.querySelector('#app'))
