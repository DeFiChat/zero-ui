import React, { Component } from "react";
import Box from '3box';
import "bootstrap/dist/css/bootstrap.min.css";
// import ProfileHover from 'profile-hover';
import ProfilePicture from './ProfilePicture';
import { Tabs } from 'antd';

let DUMMY_DATA = []
const { TabPane } = Tabs

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
            threadList: {
                Timeswap: '',
                Uniswap: '',
            },
            // disableLogin: false,
            currentThread: ''
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.setupThread = this.setupThread.bind(this);
        this.updateThreadPosts = this.updateThreadPosts.bind(this);
        this.changeThread = this.changeThread.bind(this);
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
        console.log('sendMessage function current thread is: ', this.state.currentThread)
        await this.state.currentThread.post(text);
    }

    setupThread = async () => {
        console.log('chatspace is: ', this.state.chatSpace);
        let space = this.state.chatSpace;
        console.log('current tab is: ', document.getElementsByClassName('thread-tab')[0].getElementsByClassName('ant-tabs-tab-active')[0].textContent)
        const thread1 = await space.joinThread('Timeswap', {
            ghost: true,
            ghostBacklogLimit: 20 // optional and defaults to 50
        })
        const thread2 = await space.joinThread('Uniswap', {
            ghost: true,
            ghostBacklogLimit: 20 // optional and defaults to 50
        })
        console.log('setupThread thread1 is:', thread1);
        console.log('setupThread thread2 is:', thread2);
        await this.setState({ currentThread: thread1 });
        await this.setState({ threadList: { ...this.state.threadList, Timeswap: thread1 } });
        await this.setState({ threadList: { ...this.state.threadList, Uniswap: thread2 } });
        thread1.onUpdate(() => this.updateThreadPosts());
        thread2.onUpdate(() => this.updateThreadPosts());

        // now get all current posts
        this.updateThreadPosts();
    }
    updateThreadPosts = async () => {
        console.log('entered updateThreadPosts function')

        let threadData = []
        let threadName = document.getElementsByClassName('thread-tab')[0].getElementsByClassName('ant-tabs-tab-active')[0].textContent;
        await this.setState({ currentThread: this.state.threadList[threadName] });

        console.log('threadName is: ', threadName, ' & current thread is: ', this.state.currentThread)
        const posts = await this.state.currentThread.getPosts();
        console.log('posts in current topic: ', posts)
        threadData.push(...posts)
        console.log('threadData is: ', threadData);
        this.setState({ messages: threadData });
    }
    changeThread = async () => {
        console.log('entered changeThread function')

        let threadData = []
        let threadName = document.getElementsByClassName('thread-tab')[0].getElementsByClassName('ant-tabs-tab-active')[0].textContent;
        if (threadName == 'Timeswap') {
            threadName = 'Uniswap'
        } else {
            threadName = 'Timeswap'
        }
        await this.setState({ currentThread: this.state.threadList[threadName] });
        // this.setState({ threadList: { ...this.state.threadList, Timeswap: thread1 } });
        console.log('threadName is: ', threadName, ' & current thread is: ', this.state.currentThread)
        const posts = await this.state.currentThread.getPosts();
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
                    {/* <Title /> */}
                    <ThreadTabsComponent
                        changeThread={this.changeThread} />
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
                                <ProfilePicture did={message.author} />
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

// function Title() {
//     return <p className="title">My awesome chat app</p>
// }

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

class ThreadTabsComponent extends React.Component {
    render() {
        return (
            <div className="threadName">
                <Tabs className="thread-tab" defaultActiveKey="1" onChange={this.props.changeThread}>
                    <TabPane
                        tab={
                            <span>
                                Timeswap
                            </span>
                        }
                        key="1"
                    >
                        Screen 1
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                Uniswap
                            </span>
                        }
                        key="2"
                    >
                        Screen 2
                    </TabPane>
                </Tabs>
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
