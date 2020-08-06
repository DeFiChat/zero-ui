
import React, { Component } from "react";
import { Card } from 'antd';
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
        </div>
      </div>
    );
  }
}

