import React, {Component} from 'react';
import AppForm from '../storecomps/AppForm';
import { BounceLoader } from 'react-spinners';
import ChatBox from '3box-chatbox-react/lib/index.js';
import { Card } from 'antd';
import { SPACE_NAME, THREAD_NAME } from "../Constants";
import { Smile } from "../../../smile.png";

export default class AddApp extends Component {
  state = {
    thread: null
  };

  savePost = async formData => {
      formData.account = this.props.accounts[0];
      await this.props.thread.post(formData);
      this.props.getAppsThread();
  };

  render() {
    return (
      <div className="container">
        {!this.props.thread && (
          <div style={{ width: "100px", margin: "auto" }}>
            <BounceLoader color={"blue"} />
          </div>
        )}
        {this.props.thread && <AppForm savePost={this.savePost} />}
      </div>
    );
  }
  
}

