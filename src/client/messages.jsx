import React from 'react'
import classnames from 'classnames'

export class Messages extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    componentDidUpdate() {
        this.refs[this.props.id].scrollIntoView({ behavior: 'instant', block: 'end' })
    }

    render() {
        return (
            <div className="pure-g message-container">
                {this.props.messages.map(m => {
                    let msgClass = classnames(
                        'pure-u-1-1',
                        {
                            sent: m.id === this.props.id,
                            recd: m.id !== this.props.id
                        }
                    )
                    return <div className={msgClass}>
                        <div className="animated fadeIn">
                            {m.content}
                            <div className="clear"/>
                            <span>{m.author} @ {m.timeStr}</span>
                        </div>
                    </div>
                })}

                {this.props.isTyping && 
                    <div className="pure-u-1-1 recd">
                        <div className="">
                            <img src="/img/load.gif" />
                        </div>
                    </div>
                }
                <div ref={this.props.id} />
            </div>
        )
    }   
}