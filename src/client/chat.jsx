import React from 'react'
import io from 'socket.io-client'
import Utils from './utils'
import esc from 'escape-string-regexp'

import { Messages } from './messages'

export class Chat extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            messages: [],
            username: '',
            content: '',
            id: '',
            isTyping: false,
            modalIsOpen: true
        }

        this.props.socket = io('localhost:1337')

        this.props.socket.on('RECEIVE_MESSAGE', (data) => {
            this.addMessage(data)
        })

        this.props.socket.on('RECEIVE_TYPING', (data) => {
            this.receiveTyping(data)
        })

        this.sendMessage = this.sendMessage.bind(this)
        this.addMessage = this.addMessage.bind(this)
        this.eg = this.eg.bind(this)
        this.isTyping = Utils.debounce(this.isTyping.bind(this), 100)
        this.doneTyping = Utils.debounce(this.doneTyping.bind(this), 1000)
    }

    sendMessage() {
        this.props.socket.emit('SEND_MESSAGE', {
            author: this.state.username,
            id: this.props.socket.id,
            content: this.state.content
        })
        this.setState({content: ''})
    }

    setUsername(val) {
        if (val.length > 0) {
            this.setState({username: esc(val)})
        }
        return false
    }

    addMessage(data) {
        this.setState({messages: [...this.state.messages, data]})
    }

    receiveTyping(data) {
        this.setState({isTyping: data.isTyping})
    }

    isTyping() {
        Utils.debounce(this.eg(true), 500)
    }

    doneTyping() {
        this.eg(false)
    }

    eg(val) {
        this.props.socket.emit('IS_TYPING', {
            author: this.state.username,
            isTyping: val
        })
    }

    render() {
        return (
            <div className="chat-container">
            {this.state.username.length == 0 ? 
                <div className="chat-container"> 
                    <div className="username-container">
                        <input type="text" className="pure-u-1-3" 
                            placeholder="What is your username?"
                            autoFocus
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    this.setUsername(e.target.value)
                                }
                            }}
                        />
                        <div className="clear" />
                    </div>
                </div>
                :
                <div> 
                    <Messages messages={this.state.messages} id={this.props.socket.id} isTyping={this.state.isTyping} />

                    <div className="input-container">
                        <input type="text" placeholder="Message" className="pure-u-21-24" 
                            autoFocus
                            value={this.state.content} 
                            onChange={e => {this.setState({content: e.target.value})}}
                            onKeyPress={e => {
                                if (e.key === 'Enter' && this.state.content.length > 0) {
                                    this.sendMessage()
                                }
                            }}
                            onInput={this.isTyping}
                            onKeyUp={this.doneTyping}
                        />
                        <button onClick={this.sendMessage} className="pure-button pure-button-primary pure-u-3-24">Send</button>
                    </div>
                </div>
            }
            </div>
        )
    }
}

export default Chat