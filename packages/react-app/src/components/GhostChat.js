import React, { Component } from "react";
import Box from '3box';
import "bootstrap/dist/css/bootstrap.min.css";

let DUMMY_DATA = []


// const browserHistory = window.History.createBrowserHistory();

export default class GhostChat extends React.Component {
    constructor() {
        super()
        this.state = {
            messages: DUMMY_DATA,
            box: null,
            chatSpace: {},
            myAddress: '',
            myDid: '',
            myProfile: {},
            // isAppReady: false,
            topicList: ['topic1', 'topic2'],
            // disableLogin: false,
            currentThread: ''
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.setupThread = this.setupThread.bind(this);
        this.updateThreadPosts = this.updateThreadPosts.bind(this);
    }

    componentDidMount() {
        const { box } = this.state;
        // const { history } = this.props;

        // if you haven't openedBox, return to login
        // if (!box) history.push('/');
        // this.setState({ isAppReady: true });
        this.handleLogin();
    }

    handleLogin = async () => {
        console.log('goes into handleLogin function')
        // const { history } = this.props;
        const addresses = await window.ethereum.enable();
        const myAddress = addresses[0];
        // this.setState({ disableLogin: true });

        const myProfile = await Box.getProfile(myAddress);

        const box = await Box.openBox(myAddress, window.ethereum, { ghostPinbot: "/dns4/defi-chat-peer.herokuapp.com/wss//ip4/127.0.0.1/tcp/31314/ws" })
        console.log('box is: ', box);
        await box.syncDone

        const chatSpace = await box.openSpace('ghostchat')
        const myDid = chatSpace.DID;

        this.setState({ box, myDid, myProfile, myAddress });
        this.setState({ chatSpace: chatSpace })

        console.log('setup thread1')
        this.setupThread();
        console.log('setup thread2')

        // history.push('/chat');
    }

    sendMessage = async (text) => {
        // DUMMY_DATA.push({ senderId: "newMessage", text: text });
        // this.setState({ messages: DUMMY_DATA })
        await this.state.currentThread.post(text);
    }

    setupThread = async () => {
        console.log('chatspace is: ', this.state.chatSpace);
        let space = this.state.chatSpace;
        const thread = await space.joinThread('topic1', {
            ghost: true,
            ghostBacklogLimit: 20 // optional and defaults to 50
        })
        console.log('thread is:', thread);
        this.setState({ currentThread: thread });
        thread.onUpdate(() => this.updateThreadPosts());

        // now get all current posts
        this.updateThreadPosts();
    }
    updateThreadPosts = async () => {
        console.log('entered updateThreadPosts function')
        let threadData = []
        // Step 3 - get posts in thread
        const posts = await this.state.currentThread.getPosts();
        console.log('posts in current topic: ', posts)
        threadData.push(...posts)
        console.log('threadData is: ', threadData);
        this.setState({ messages: threadData });
    }
    render() {
        const {
            // isAppReady,
            chatSpace,
            topicList,
            myProfile,
            myAddress,
            myDid,
            // disableLogin
        } = this.state;

        return (
            <div className="GhostChat">
                <div>
                    <Title />
                    <MessageList messages={this.state.messages} chatSpace={this.state.chatSpace} />
                    <SendMessageForm
                        sendMessage={this.sendMessage} />
                </div>
                            
            </div>
        )
    }
}

class MessageList extends React.Component {

    render() {
        return (
            <ul className="message-list">
                {this.props.messages.map((message, index) => {
                    return (
                        <li key={message.postId} className="message">
                            <div>
                                {message.author}
                            </div>
                            <div>
                                {message.message}
                            </div>
                        </li>
                    )
                })}
            </ul>
        )
    }
}

class SendMessageForm extends React.Component {
    constructor() {
        super()
        this.state = {
            message: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        this.setState({
            message: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.sendMessage(this.state.message)
        this.setState({
            message: ''
        })
    }

    render() {
        return (
            <form
                onSubmit={this.handleSubmit}
                className="send-message-form">
                <input
                    onChange={this.handleChange}
                    value={this.state.message}
                    placeholder="Type your message and hit ENTER"
                    type="text" />
            </form>
        )
    }
}

function Title() {
    return <p className="title">My awesome chat app</p>
}

class LoginComponent extends React.Component {
    render() {
        return (
            <div>
                <h1>Ghost Chat App</h1>
                <button onClick={this.props.handleLogin}>
                    Get Started
                </button>
            </div>
        )
    }
}

// const Root = () => (
//     <Router history={browserHistory}>
//         <Route path="/" component={App} />
//     </Router>
// )

// ReactDOM.render(<Root />, document.getElementById('root'));
