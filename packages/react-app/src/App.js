import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { Row, Col, Input, Button, Spin, Tabs } from 'antd';
import {
  CodeOutlined, SearchOutlined, SwapOutlined, LineChartOutlined, SolutionOutlined, MessageOutlined, ProfileOutlined

} from '@ant-design/icons';
import { Transactor } from "./helpers"
import { useExchangePrice, useGasPrice, useContractLoader, useContractReader } from "./hooks"
import { Header, Account, Provider, Faucet, Ramp, Address, Contract, } from "./components"
import Bond from "./components/Bond"
//import MenuButton from "./components/MenuButton"
import AppStore from "./components/dappstore/AppStore"
import GhostChat from "./components/GhostChat"

const { TextArea } = Input;
const { BufferList } = require('bl')

const { TabPane } = Tabs

const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const getFromIPFS = async hashToGet => {
  for await (const file of ipfs.get(hashToGet)) {
    console.log(file.path)
    if (!file.content) continue;
    const content = new BufferList()
    for await (const chunk of file.content) {
      content.append(chunk)
    }
    console.log(content)
    return content
  }
}

const addToIPFS = async fileToUpload => {
  for await (const result of ipfs.add(fileToUpload)) {
    return result
  }
}

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet", "2717afb6bf164045b5d5468031b93f87")
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : "http://localhost:8545")

function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)
  const gasPrice = useGasPrice("fast")

  const tx = Transactor(injectedProvider, gasPrice)

  const readContracts = useContractLoader(localProvider);
  const writeContracts = useContractLoader(injectedProvider);

  const myAttestation = useContractReader(readContracts, "Attestor", "attestations", [address], 1777);

  const [data, setData] = useState()
  const [sending, setSending] = useState()
  const [loading, setLoading] = useState()
  const [ipfsHash, setIpfsHash] = useState()
  const [ipfsContents, setIpfsContents] = useState()
  const [attestationContents, setAttestationContents] = useState()

  const asyncGetFile = async () => {
    let result = await getFromIPFS(ipfsHash)
    setIpfsContents(result.toString())
  }

  useEffect(() => {
    if (ipfsHash) asyncGetFile()
  }, [ipfsHash])

  let ipfsDisplay = ""
  if (ipfsHash) {
    if (!ipfsContents) {
      ipfsDisplay = (
        <Spin />
      )
    } else {
      ipfsDisplay = (
        <pre style={{ margin: 8, padding: 8, border: "1px solid #dddddd", backgroundColor: "#ededed" }}>
          {ipfsContents}
        </pre>
      )
    }
  }

  const asyncGetAttestation = async () => {
    let result = await getFromIPFS(myAttestation)
    setAttestationContents(result.toString())
  }

  useEffect(() => {
    if (myAttestation) asyncGetAttestation()
  }, [myAttestation])


  let attestationDisplay = ""
  if (myAttestation) {
    if (!attestationContents) {
      attestationDisplay = (
        <Spin />
      )
    } else {
      attestationDisplay = (
        <div>
          <Address value={address} /> attests to:
          <pre style={{ margin: 8, padding: 8, border: "1px solid #dddddd", backgroundColor: "#ededed" }}>
            {attestationContents}
          </pre>
        </div>

      )
    }
  }

  let state = {
    collapsed: false,
  }

  const toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  return (
    <div className="App">
      <Header />
      <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          setAddress={setAddress}
          localProvider={localProvider}
          injectedProvider={injectedProvider}
          setInjectedProvider={setInjectedProvider}
          mainnetProvider={mainnetProvider}
          price={price}
        />
      </div>
      <Tabs className="bar-tab" defaultActiveKey="3" style={{}}>
        <TabPane
          tab={
            <span>
              <ProfileOutlined style={{ fontSize: '30px' }} />
            </span>
          }
          key="1"
        >
          <AppStore />
        </TabPane>
        <TabPane
          tab={
            <span>
              <CodeOutlined style={{ fontSize: '30px' }} />
            </span>
          }
          key="2"
        >
          <div>
            <iframe width="420" height="315"
              src="https://www.youtube.com/embed/DTxE9KV3YrE">
            </iframe>
          </div>
          <div style={{ position: 'fixed', textAlign: 'right', left: 80, top: 120, padding: 10, margin: 10 }}>
            <Row align="middle" gutter={4}>
              <Col span={10}>
                <Provider name={"mainnet"} provider={mainnetProvider} />
              </Col>
            </Row>
            <Row align="middle" gutter={4}>
              <Col span={6}>
                <Provider name={"local"} provider={localProvider} />
              </Col>
            </Row>
            <Row align="middle" gutter={4}>
              <Col span={8}>
                <Provider name={"injected"} provider={injectedProvider} />
              </Col>
            </Row>
          </div>
          <div style={{ position: 'fixed', textAlign: 'left', left: 0, bottom: 20, padding: 10 }}>
            <Row align="middle" gutter={4}>
              <Col span={9}>
                <Ramp
                  price={price}
                  address={address}
                />
              </Col>
              <Col span={15}>
                <Faucet
                  localProvider={localProvider}
                  price={price}
                />
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <MessageOutlined style={{ fontSize: '30px' }} />
            </span>
          }
          key="3"
        >
          {/* <div className="threadName"> */}
          {/* <Carousel effect="fade">
              <div>
                <h3>Bitcoin</h3>
              </div>
              <div>
                <h3>Ethereum</h3>
              </div>
              <div>
                <h3>Filecoin</h3>
              </div>
              <div>
                <h3>Timeswap</h3>
              </div>
            </Carousel> */}
          {/* <Tabs className="thread-tab" defaultActiveKey="1">
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
            </Tabs> */}
          {/* </div> */}
          <div className="chat-box">
            {/* <Uniform /> */}
            {/* <Chatter/>
            <Chatter>
              <Chatter>                
                <Chatter/>              
              </Chatter>
            </Chatter>
            <Chatter/> */}
            <GhostChat />
          </div>
        </TabPane>
        {/* <TabPane
          tab={
            <span>
              <LineChartOutlined  style={{ fontSize: '30px' }}/>
            </span>
          }
          key="4"
        >
          <div className="main-frame">
            <div style={{ padding: 32, textAlign: "left" }}>
              Content URL: <Input value="" onChange={(e) => {
              }} />
              <Button disbaled="false" style={{ margin: 8 }} size="large" shape="round" type="primary" >
                Claim
              </Button>
              <Bond />
            </div>
            <div className="" style={{ padding: 32, textAlign: "left" }}>
              Add Data Store:
              <TextArea rows={10} value={data} onChange={(e) => {
                setData(e.target.value)
              }} />
              <Button style={{ margin: 8 }} loading={sending} size="large" shape="round" type="primary" onClick={async () => {
                console.log("UPLOADING...")
                setSending(true)
                setIpfsHash()
                setIpfsContents()
                const result = await addToIPFS(data)
                if (result && result.path) {
                  setIpfsHash(result.path)
                }
                setSending(false)
                console.log("RESULT:", result)
              }}>Upload to IPFS</Button>
            </div>
            <div style={{ padding: 32, textAlign: "left" }}>
              IPFS Hash: <Input value={ipfsHash} onChange={(e) => {
                setIpfsHash(e.target.value)
              }} />
              {ipfsDisplay}

              <Button disabled={!ipfsHash} style={{ margin: 8 }} size="large" shape="round" type="primary" onClick={async () => {
                tx(writeContracts["Attestor"].attest(ipfsHash))
              }}>Attest on Ethereum</Button>
            </div>

            <div style={{ padding: 32, textAlign: "left" }}>
              {attestationDisplay}
            </div>
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <SwapOutlined  style={{ fontSize: '30px' }}/>
            </span>
          }
          key="5"
        >
          {<div style={{ padding: 64, textAlign: "right" }}>
            <Contract
              name={"Attestor"}
              provider={injectedProvider}
              address={address}
            />
          </div>}
        </TabPane> */}
      </Tabs>
    </div>
  );
}

export default App;
