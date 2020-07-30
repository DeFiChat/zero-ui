import React from 'react';
import { Tabs, Radio } from 'antd';
import Uniform from "./components/Uniform"
import AppStore from "./dappstore/AppStore"

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
      <div claasName="guilds">
          <Uniform />        
          <div className="main-frame">
            <div style={{padding:32,textAlign: "left"}}>
              Content Link: <Input value="" onChange={(e)=>{
              }} />
              <Button disbaled="false" style={{margin:8}} size="large" shape="round" type="primary" >
                Claim
              </Button>
              <Bond />
            </div>           
            <div className="" style={{padding:32,textAlign: "left"}}>              
               Add Data Store:
              <TextArea rows={10} value={data} onChange={(e)=>{
                setData(e.target.value)
              }} />
              <Button style={{margin:8}} loading={sending} size="large" shape="round" type="primary" onClick={async()=>{
                console.log("UPLOADING...")
                setSending(true)
                setIpfsHash()
                setIpfsContents()
                const result = await addToIPFS(data)
                if(result && result.path) {
                  setIpfsHash(result.path)
                }
                setSending(false)
                console.log("RESULT:",result)
              }}>Upload to IPFS</Button>
            </div>
            <div style={{padding:32,textAlign: "left"}}>
              IPFS Hash: <Input value={ipfsHash} onChange={(e)=>{
                setIpfsHash(e.target.value)
              }} />
              {ipfsDisplay}

              <Button disabled={!ipfsHash} style={{margin:8}} size="large" shape="round" type="primary" onClick={async()=>{
                tx( writeContracts["Attestor"].attest(ipfsHash) )
              }}>Attest on Ethereum</Button>
            </div>

            <div style={{padding:32,textAlign: "left"}}>
              {attestationDisplay}
            </div>
          </div> 
      </div>
    );
  }
}
export default SlidingTabsDemo