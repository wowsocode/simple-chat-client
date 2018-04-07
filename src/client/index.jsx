import React from 'react'
import ReactDOM from 'react-dom'
import Chat from './chat'

class App extends React.Component {
    render () {
        return (
            <div className="pure-g">
                <div className="pure-u-1-2">
                    <Chat />
                </div>
                <div className="pure-u-1-2 border">
                    <Chat />
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))