//import ChatBox from '3box-chatbox-react';
import ChatBox from '3box-chatbox-react/lib/index.js';
import React, { Component } from "react";
import { Card } from 'antd';
import { SPACE_NAME, THREAD_NAME } from "../Constants";
import { Smile } from "../../../smile.png";
import Atlas from "../../Atlas";

export default class Chat extends Component {
  state = {
  }
  render() {
    return (
      <div className="container">
        <div style={{margin : 'auto'}}>
          <Atlas/>        
          <h1 style={{textAlign : "center"}}><Card title="Open Debate..."/></h1>          
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
      </div>
    );
  }
}

// import ChatBox from '3box-chatbox-react';

// const MyComponent = ({ handleLogin, box, ethereum, myAddress, currentUser3BoxProfile, adminEthAddr }) => (
//     <ChatBox 
//         // required
//         spaceName="mySpaceName"
//         threadName="myThreadName"


//         // Required props for context A) & B)
//         box={box}
//         currentUserAddr={myAddress}

//         // Required prop for context B)
//         loginFunction={handleLogin}

//         // Required prop for context C)
//         ethereum={ethereum}

//         // optional
//         mute={false}
//         popupChat
//         showEmoji
//         colorTheme="#181F21"
//         currentUser3BoxProfile={currentUser3BoxProfile}
//         userProfileURL={address => `https://mywebsite.com/user/${address}`}
//         spaceOpts={}
//         threadOpts={}
//         agentProfile={
//             chatName: "3Box",
//             imageUrl: "https://imgur.com/RXJO8FD"
//         }
//     />
// );

// import ChatBox from '3box-chatbox-react';
// import React from "react";
// import { SPACE_NAME, THREAD_NAME } from "../Constants";

// const Chat = ({  box, space, accounts, threeBoxProfile,  thread }) => {
//     return (
//         <React.Fragment>
//             <div>Welcome to Chat box</div>
//             <ChatBox 
//                 // required
//                 spaceName={SPACE_NAME}  
//                 threadName={THREAD_NAME}

//                 // Required props for context A) & B)
//                 box={box}
//                 //address={accounts[0]}
//                 address="0x343712AbA29A21c9eB50Cc98D556028485146913"
//                 // optional
//                 mute={false}
//                 popupChat
//                 showEmoji
//                 colorTheme="#181F21"
//                 currentUser3BoxProfile={threeBoxProfile}
//                 userProfileURL={address => `https://mywebsite.com/user/${address}`}
//                 // spaceOpts={space}
//                 // threadOpts={thread}
//                 // agentProfile={{
//                 //     chatName:"3Box",
//                 //     imageUrl:"https://imgur.com/RXJO8FD"
//                 //     } 
//                 // }
//             />
//             <div>Bye bye chat box</div>
//         </React.Fragment>
        
        
        
//     );
// }

// export default Chat;

//Auth 3Box
// const box = await Box.openBox('0x12345...abcde', ethereumProvider)
// await box.syncDone

//auth space
// const space = await box.openSpace('myApp')
// await space.syncDone

// const box = await Box.create(window.ethereum)
// const spaces = [ 'space1', 'space2', 'space3']
// await box.auth(spaces, { address })
// await box.openSpace('space1')

//Claims can be used to attest to other users or as a sign-in token to 
//server based infrastructure. Sign a JWT claim
//const jwt = await box._3id.signJWT({ my: 'claim' })

//verify claim
//const decodedClaim = await Box.idUtils.verifyClaim(jwt)

//set/get value in public profile
//await box.public.set('name', 'oed')
//await box.public.get('name', 'oed')

//set data in 3Box space
// await space.public.set('favorite-nft', '0x123...')
// const favorite = await space.public.get('favorite-nft')

//create thread
//const thread = await space.joinThread('myThread')
//await thread.addMember(<ethereum-address or 3id>)

// const posts = await thread.getPosts()
// console.log(posts)

// // you can also specify a number of posts you want
// const posts = await thread.getPosts({ limit: 20 })
// console.log(posts)

//thread.onUpdate(myCallbackFunction)