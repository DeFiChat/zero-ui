import React, { Component } from "react";
import Box from '3box';
import "bootstrap/dist/css/bootstrap.min.css";
import ProfilePicture from './ProfilePicture';
import { Tabs } from 'antd';

let DUMMY_DATA = []
const { TabPane } = Tabs

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
            threadList: {
                Timeswap: '',
                Uniswap: '',
            },
            currentThread: ''
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.setupThread = this.setupThread.bind(this);
        this.updateThreadPosts = this.updateThreadPosts.bind(this);
        this.changeThread = this.changeThread.bind(this);

        this.handleLogin();

    }

    componentDidMount() {
        const { box } = this.state;
        // this.handleLogin();
    }

    handleLogin = async () => {
        const addresses = await window.ethereum.enable();
        const myAddress = addresses[0];

        const myProfile = await Box.getProfile(myAddress);

        const box = await Box.openBox(myAddress, window.ethereum, { ghostPinbot: "/dns4/zerouipinbot-peer.herokuapp.com/wss/p2p/QmXABkxnUaosVvvmXYmV24tbhCUFLLV2od9iiXcTkhwyQM" })
        await box.syncDone

        const chatSpace = await box.openSpace('ghostchat')
        const myDid = chatSpace.DID;

        await this.setState({ box, myDid, myProfile, myAddress });
        await this.setState({ chatSpace: chatSpace })

        this.setupThread();
    }

    sendMessage = async (text) => {
        await this.state.currentThread.post(text);
    }

    setupThread = async () => {
        let space = this.state.chatSpace;
        const thread1 = await space.joinThread('Timeswap', {
            ghost: true,
            ghostBacklogLimit: 20 // optional and defaults to 50
        })
        const thread2 = await space.joinThread('Uniswap', {
            ghost: true,
            ghostBacklogLimit: 20 // optional and defaults to 50
        })
        await this.setState({ currentThread: thread1 });
        await this.setState({ threadList: { ...this.state.threadList, Timeswap: thread1 } });
        await this.setState({ threadList: { ...this.state.threadList, Uniswap: thread2 } });
        thread1.onUpdate(() => this.updateThreadPosts());
        thread2.onUpdate(() => this.updateThreadPosts());

        this.updateThreadPosts();
    }
    updateThreadPosts = async () => {
        let threadData = []
        let threadName = document.getElementsByClassName('thread-tab')[0].getElementsByClassName('ant-tabs-tab-active')[0].textContent;
        await this.setState({ currentThread: this.state.threadList[threadName] });

        const posts = await this.state.currentThread.getPosts();
        threadData.push(...posts)
        await this.setState({ messages: threadData });
        console.log('thread Data is: ', threadData)
        console.log('now ready')
    }
    changeThread = async () => {
        let threadData = []
        let threadName = document.getElementsByClassName('thread-tab')[0].getElementsByClassName('ant-tabs-tab-active')[0].textContent;
        if (threadName == 'Timeswap') {
            threadName = 'Uniswap'
        } else {
            threadName = 'Timeswap'
        }
        await this.setState({ currentThread: this.state.threadList[threadName] });
        try {
            const posts = await this.state.currentThread.getPosts();
            threadData.push(...posts)
            await this.setState({ messages: threadData });
        } catch (e) {
            console.log('catched error e675765: ', e);
        }
    }
    render() {
        const {
            chatSpace,
            topicList,
            myProfile,
            myAddress,
            myDid,
        } = this.state;

        return (
            <div className="GhostChat">
                <div>
                    {/* <Title /> */}
                    <div>
                        <ThreadTabsComponent
                            changeThread={this.changeThread} />
                    </div>
                    <div>
                        <MessageList messages={this.state.messages} chatSpace={this.state.chatSpace} />
                    </div>
                    <br />
                    <div>
                        <SendMessageForm
                            sendMessage={this.sendMessage} />
                    </div>
                </div>

            </div>
        )
    }
}

class MessageList extends React.Component {

    render() {
        return (
            <ul style={{ listStyleType: "none" }} className="message-list">
                {this.props.messages.map((message, index) => {
                    return (
                        <li key={message.postId} className="message">
                            <div>
                                <ProfilePicture did={message.author} />
                            </div>
                            <div>
                                <p style={{ fontSize: "20px", marginLeft: "7%" }}>{message.message}</p>
                            </div>
                            <br />
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
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                Uniswap
                            </span>
                        }
                        key="2"
                    >
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
