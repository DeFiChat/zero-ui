import React, { Component } from "react";
//import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Box from '3box';
import "bootstrap/dist/css/bootstrap.min.css";

import Atlas from "../Atlas"
import Nav from "./storecomps/Nav";
import { BounceLoader } from "react-spinners";

import Home from "./pages/Home";
import AddApp from "./pages/AddApp";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";


import { SPACE_NAME, THREAD_NAME } from "./Constants";

export default class AppStore extends Component {

  state = {
    needToAWeb3Browser: false,
    box: {},
    space: {},
    thread: {},
    posts: []
  }
  async getAddressFromMetaMask() {
    if (typeof window.ethereum == "undefined") {
      this.setState({ needToAWeb3Browser: true });
    } else {
      window.ethereum.autoRefreshOnNetworkChange = false; //silences warning about no autofresh on network change
      const accounts = await window.ethereum.enable();
      this.setState({ accounts });
    }
  }
  //Dapp handles web3 and 3Box logins, and they run before component is mounted. (recommended)
  async componentDidMount() {
    await this.getAddressFromMetaMask();
    if (this.state.accounts) {

      const box = await Box.openBox(this.state.accounts[0], window.ethereum);
      const space = await box.openSpace(SPACE_NAME);  //bps-defi-store
      this.setState({ space, box });

      const thread = await space.joinThread(THREAD_NAME,
        {
          // firstModerator: moderatorsEthAddress,
          // members: false
          ghost: true,
          ghostBacklogLimit: 20 // optional and defaults to 50
        }
      );

      this.setState({ thread }, () => (this.getAppsThread()));
    }
  }

  async getAppsThread() {
    if (!this.state.thread) {
      console.error("apps thread not in react state");
      return;
    }
    const posts = await this.state.thread.getPosts();
    this.setState({ posts });

    await this.state.thread.onUpdate(async () => {
      const posts = await this.state.thread.getPosts();
      this.setState({ posts });
    });

  }



  render() {
    if (this.state.needToAWeb3Browser) {
      return <h1>Please install MetaMask</h1>
    }
    return (
      <Router>
        <div className="row">
          <div className="col-md-9">
            <Switch>
              <Route exact path="/">
                <Home
                  posts={this.state.posts}
                  space={this.state.space}
                  box={this.state.box}
                  getAppsThread={this.getAppsThread}
                  usersAddress={
                    this.state.accounts ? this.state.accounts[0] : null
                  }
                />
              </Route>
              <Route exact path="/groups">
                <Chat
                  box={this.state.box}
                  space={this.state.space}
                  accounts={this.state.accounts}
                  threeBoxProfile={this.state.threeBoxProfile}
                  thread={this.state.thread}
                />
              </Route>
              <Route exact path="/create">
                {this.state.accounts && (
                  <AddApp
                    accounts={this.state.accounts}
                    thread={this.state.thread}
                    box={this.state.box}
                    space={this.state.space}
                    threadMembers={this.state.threadMembers}
                    posts={this.state.posts}
                    threeBoxProfile={this.state.threeBoxProfile}
                    getAppsThread={this.getAppsThread.bind(this)}
                  />
                )}
                {!this.state.accounts && <h1>Login with MetaMask</h1>}
              </Route>
              <Route exact path="/profile">
                {this.state.space && (
                  <Profile
                    box={this.state.box}
                    space={this.state.space}
                    accounts={this.state.accounts}
                    threeBoxProfile={this.state.threeBoxProfile}
                  />
                )}
                {!this.state.space && (
                  <div style={{ width: "60px", margin: "auto" }}>
                    <BounceLoader color={"blue"} />
                  </div>
                )}
              </Route>
            </Switch>
          </div>
          <div className="col-md-3"><Nav /></div>
        </div>
      </Router>
    );
  }
}





