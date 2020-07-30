import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Radio } from 'antd';
import { BounceLoader } from "react-spinners";
import AppStore from "./dappstore/AppStore";
import Home from "./dappstore/pages/Home";
import AddApp from "./dappstore/pages/AddApp";
import Profile from "./dappstore/pages/Profile";
import Chat from "./dappstore/pages/Chat";

const TabPane = Tabs.TabPane;

class SlidingTabsDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'top',
    };
  }
  handleModeChange = (e) => {
    const mode = e.target.value;
    this.setState({ mode });
  }
  render() {
    const { mode } = this.state;
    return (
      <div claasName="rand">
        <Radio.Group onChange={this.handleModeChange} value={mode} style={{ marginBottom: 8 }}>
          <Radio.Button value="top">MAIN</Radio.Button>
          <Radio.Button value="left">CHART</Radio.Button>          
          
        </Radio.Group>
        <Tabs
          defaultActiveKey="1"
          tabPosition={mode}
          style={{ height: 220, marginTop: 30 }}
        >
          <TabPane tab="ABI" key="1">
            <Link className="nav-link" to="/profile">
              ACCOUNT #
            </Link>          
            {this.state.space && (
              <Profile
                box={this.state.box}
                space={this.state.space}
                accounts={this.state.accounts}
                threeBoxProfile={this.state.threeBoxProfile}
              />
            )}
            {!this.state.space && (
              <div style={{ width: "30px", margin: "auto" }}>
                <BounceLoader color={"green"} />
              </div>
            )}
          </TabPane>
          <TabPane tab="BTC" key="2">BITCOIN</TabPane>
          <TabPane tab="DEFI" key="3">OPEN FINANCE</TabPane>          
          <TabPane tab="ETH" key="4">ETHEREUM 2.0</TabPane>
          <TabPane tab="FIL" key="5">FILECOIN</TabPane>
          <TabPane tab="AAVE" key="6">FLASH LOANS</TabPane>
          <TabPane tab="BAL" key="7">BALANCER POOLS</TabPane>
          <TabPane tab="CRV" key="8">CURVE FINANCE</TabPane>
          <TabPane tab="DAI" key="9">MAKER DAO</TabPane>
          <TabPane tab="XUSD" key="10">USD ASSETS</TabPane>
          <TabPane tab="YFI" key="11">Y EARN</TabPane>
          <TabPane tab="ZTC" key="12">ZERO TOKEN</TabPane>
        </Tabs>
      </div>
    );
  }
}
export default SlidingTabsDemo