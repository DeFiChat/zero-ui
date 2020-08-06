import React, { Component } from "react";
// import ProfileHover from "profile-hover";
// import { BounceLoader } from "react-spinners";
// import ModalDialogue from "../storecomps/ModalDialogue";
// import ChatBox from '3box-chatbox-react/lib/index.js';
// import { Card } from 'antd';
// import { SPACE_NAME, THREAD_NAME } from "../Constants";
// import { Smile } from "../../../smile.png";

// class AppCard extends Component {
//   render() {
//     return (
//       <>
//         <div className="col-sm-4">
//           <div style={{ padding: "20px" }}>
//             <h5>
//               {this.props.post.message.name ? this.props.post.message.name : "unknown"}
//             </h5>
//             <img alt="app logo"
//               style={{ height: "10vw" }}
//               src={
//                 this.props.post.message.appImage
//                   ? this.props.post.message.appImage
//                   : "https://via.placeholder.com/200"
//               }
//               onError={ev =>
//                 (ev.target.src =
//                   "http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png")
//               }
//             />
//             <p>{this.props.post.message.description}</p>
//             {this.props.post.message.url && (
//               <p>
//                 <a href={this.props.post.message.url} target="_blank" rel="noopener noreferrer">
//                   website
//               </a>
//               </p>
//             )}
//             {this.props.post.message.account && (
//               <div style={{ marginBottom: "10px" }}>
//                 <p>Submitted by</p>
//                 <ProfileHover
//                   address={this.props.post.message.account}
//                   style={{ width: "100%" }}
//                   showName={true}
//                 />
//               </div>
//             )}
//             <ModalDialogue
//               app={this.props.post.message}
//               threeBox={this.props.threeBox}
//               space={this.props.space}
//               box={this.props.box}
//               usersAddress={this.props.usersAddress}
//             />
//           </div>
//         </div>
//         {(this.props.i + 1) % 3 === 0 && <div className="w-100"></div>}
//       </>)
//   }

// }

export default class Home extends Component {
  render() {
    return (
      <div className="container" style={{ textAlign: "center" }}>
        <h2 className="brand-font" style={{ fontSize: "3rem" }}>
          3Box
        </h2>
        <p>Decentralized Identity</p>
        <h2 className="brand-font" style={{ fontSize: "3rem" }}>
          wFILE
        </h2>
        <p>Wrapped FIL on Ethereum</p>
        <h2 className="brand-font" style={{ fontSize: "3rem" }}>
          TimeSwap
        </h2>
        <p>Automated Bonding Protocol</p>
        <h2 className="brand-font" style={{ fontSize: "3rem" }}>
          Zero Chat
        </h2>
        <p>Yield Farming Chat Rooms</p>
      </div>
    );
  }
}