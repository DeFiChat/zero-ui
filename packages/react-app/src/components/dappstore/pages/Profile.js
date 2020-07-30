import React, { Component } from "react";
import EditProfile from "3box-profile-edit-react";
import ChatBox from '3box-chatbox-react/lib/index.js';
import { Card } from 'antd';
import { SPACE_NAME, THREAD_NAME } from "../Constants";
import { Smile } from "../../../smile.png";

export default class Profile extends Component {
  state = {
    hideEdit : false
  }
  render() {
    return (
      <div className="container centered">      
        <div style={{margin : '30px auto', paddingLeft: '60px'}}>
          {!this.state.hideEdit && <EditProfile
            className="centered"
            box={this.props.box}
            space={this.props.space}
            currentUserAddr={this.props.accounts[0]}
            currentUser3BoxProfile={this.props.threeBoxProfile}
            redirectFn={()=>(this.setState({hideEdit : true}))}
          />}
          {this.state.hideEdit && (
            <div className="centered" style={{margin : 'auto'}}>
              <h2>{this.props.threeBoxProfile.name}</h2>
              <img alt="profile logo" src={this.props.threeBoxProfile.image.contentUrl['/']} />
              <p>{this.props.threeBoxProfile.description}</p>
              <p>{this.props.threeBoxProfile.emoji}</p>
              <button onClick={()=>(this.setState({hideEdit : false}))}>edit</button>

            </div>
          )}
        </div>
          <ChatBox
            spaceName={SPACE_NAME}  
            threadName={THREAD_NAME}
            box={this.props.box}
            currentUserAddr="0x343712AbA29A21c9eB50Cc98D556028485146913"

            //optional fields
            mute={true}
            popupChat
            showEmoji
            colorTheme="#181F21"
            currentUser3BoxProfile={this.props.threeBoxProfile}
            //userProfileURL={address => `https://3box.io/${address}`}
            //spaceOpts={}
            //threadOpts={}
            agentProfile={{
                chatName:"CHAT",
                imageUrl:{Smile},
                height:"30"
                } 
            }
          />        
      </div>
    );
  }
}