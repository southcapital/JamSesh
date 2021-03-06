import React from 'react';
import Validation from 'react-validation';
import firebase from 'firebase';

class PrivateChat extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.updateMessage = this.updateMessage.bind(this)
    this.submitMessage = this.submitMessage.bind(this)
    this.state = {
      message: '',
      messages: [],
      users: []
    }
  }

  componentDidMount() {
    console.log('confirmerooni')
    firebase.database().ref('messager/').on('value', (snapshot) => {

      const currentMessages = snapshot.val()

      if (currentMessages != null) {
        this.setState({
          messages: currentMessages
        })
      }
    })
    firebase.database().ref('logged/').on('value', (snapshot) => {
      console.log(snapshot.val(), 'testerooni')
      const currentUsers = snapshot.val()

      if (currentUsers != null) {
        this.setState({
          users: currentUsers
        })
      }
    })
  }

  updateMessage(event) {
    // console.log(`updateMessage: ${event.target.value}`)
    this.setState({
      message: event.target.value
    })
  }

  add(event) {
         if(event.keyCode === 13){
           this.submitMessage(event);
         }
  }

  submitMessage(event){
    console.log(`submitMessage: ${this.state.message}`)
    let curUser = '';

    firebase.auth().currentUser ? curUser = firebase.auth().currentUser.displayName : curUser = 'guest'

    const nextMessage = {
      id: this.state.messages.length,
      user: curUser,
      text: this.state.message
    }

    firebase.database().ref('messager/' + nextMessage.id).set(nextMessage)

    this.state.message = ''
    // let list = Object.assign([], this.state.messages)
    // list.push(nextMessage)
    // this.setState({
    //   messages: list
    // })
  }

  render () {

    const loggedIn = [];
    for(var key in this.state.users){
      loggedIn.push(key);
    }

    const loggedUsers = loggedIn.map(user => {
      console.log(user, 'user key in map?!')
      console.log(user, 'username in map?!')
      return (
        <div key={user}><strong>{user}</strong></div>
      )
    })

    const currentMessage = this.state.messages.map((message, i) => {
      const messageStyle = {
        padding: 5,
        borderRadius: 10,
        margin: "auto"
      }

      i % 2 === 0 ? messageStyle.backgroundColor = "MintCream" : messageStyle.backgroundColor = "Gainsboro"

      return (
        <div style={messageStyle} key={message.id}><strong>{message.user}</strong>: {message.text}</div>
      )
    });
    return (
      <div style={chatStyles.chat}>
      <div>
        <div style={chatStyles.messages} >
          {currentMessage.slice(-40)}
        </div>
        <div style={chatStyles.logged}>Who's Logged In? <br/> {loggedUsers}</div>
        <div style={chatStyles.input} id="chat-input">
        <input onChange={this.updateMessage} onKeyDown={this.add.bind(this)} type="text" placeholder="Sexy Placeholder" value={this.state.message}/>
        <button onClick={this.submitMessage}>Send</button>
        </div>
      </div>
    </div>
    )
  }
}

const chatStyles = {
  messages: {
    padding: 8,
    backgroundColor: "#F0F8FF",
    fontFamily: "Arial, Helvetica, sans-serif",
    width: "60%",
    height: 300,
    borderRadius: 10,
    display: "inline-block",
    overflow: 'auto'
  },
  input: {
    padding: 15,
    borderRadius: 10
  },
  chat: {
    bottomPadding: 30,
    topPadding: 10
  },
  logged: {
    borderWidth: 1,
    borderStyle: "solid",
    verticalAlign: "top",
    padding: 5,
    marginLeft: 10,
    backgroundColor: "LightBlue",
    borderRadius: 10,
    width: "30%",
    display: "inline-block",
    float: "top"
  }
}





export default PrivateChat;
