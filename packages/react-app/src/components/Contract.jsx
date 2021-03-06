import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { Card, Row, Col, Input, Divider } from "antd";
import { useContractLoader } from "../hooks";
import Account from "./Account";

const tryToDisplay = thing => {
  if (thing && thing.toNumber) {
    try {
      return thing.toNumber();
    } catch (e) {
      return ethers.utils.formatUnits(thing, "ether");
    }
  }
  return JSON.stringify(thing);
};

export default function Contract(props) {
  const contracts = useContractLoader(props.provider);
  const contract = contracts ? contracts[props.name] : "";
  const address = contract ? contract.address : "";

  const [display, setDisplay] = useState(<div>Loading...</div>);

  const [form, setForm] = useState({});
  const [values, setValues] = useState({});

  const { show } = props;
  useEffect(() => {
    const loadDisplay = async () => {
      // console.log("CONTRACT",contract)
      if (contract) {
        const nextDisplay = [];
        const displayed = {};
        for (const f in contract.interface.functions) {
          const fn = contract.interface.functions[f];
          // console.log("FUNCTION",fn.name,fn)

          if (show && show.indexOf(fn.name) < 0) {
            // do nothing
          } else if (!displayed[fn.name] && fn.type === "call" && fn.inputs.length === 0) {
            // console.log("PUSHING",fn.name)
            displayed[fn.name] = true;
            nextDisplay.push(
              <div>
                <Row>
                  <Col
                    span={8}
                    style={{
                      textAlign: "right",
                      opacity: 0.333,
                      paddingRight: 6,
                      fontSize: 24,
                    }}
                  >
                    {fn.name}
                  </Col>
                  <Col span={16}>
                    <h2>{tryToDisplay(await contract[fn.name]())}</h2>
                  </Col>
                </Row>
                <Divider />
              </div>,
            );
          } else if (!displayed[fn.name] && (fn.type === "call" || fn.type === "transaction")) {
            console.log("RENDERING", fn);
            // console.log("CALL WITH ARGS",fn.name,fn)
            displayed[fn.name] = true;
            const inputs = [];
            for (const i in fn.inputs) {
              const input = fn.inputs[i];
              inputs.push(
                <div style={{ margin: 2 }}>
                  <Input
                    size="large"
                    placeholder={input.name}
                    value={form[fn.name + input.name + i]}
                    onChange={e => {
                      const formUpdate = { ...form };
                      formUpdate[fn.name + input.name + i] = e.target.value;
                      setForm(formUpdate);
                      if (props.formUpdate) {
                        props.formUpdate(formUpdate);
                      }
                    }}
                  />
                </div>,
              );
            }

            // console.log("VALUE OF ",fn.name, "IS",values[fn.name])

            let buttonIcon = "📡";
            let afterForm = "";

            if (fn.type != "call") {
              if (fn.payable) {
                buttonIcon = "💸";
                afterForm = (
                  <Input
                    placeholder="transaction value"
                    onChange={e => {
                      console.log("CHANGE");
                      const newValues = { ...values };
                      newValues["valueOf" + fn.name] = e.target.value;
                      console.log("SETTING:", newValues);
                      setValues(newValues);
                    }}
                    value={values["valueOf" + fn.name]}
                    addonAfter={
                      <div>
                        <Row>
                          <Col span={16}>
                            <div
                              type="dashed"
                              onClick={async () => {
                                console.log("CLICK");

                                const newValues = { ...values };
                                newValues["valueOf" + fn.name] =
                                  "" + parseFloat(newValues["valueOf" + fn.name]) * 10 ** 18;
                                console.log("SETTING:", newValues);
                                setValues(newValues);
                              }}
                            >
                              ✳️
                            </div>
                          </Col>
                          <Col span={16}>
                            <div
                              type="dashed"
                              onClick={async () => {
                                console.log("CLICK");

                                const newValues = { ...values };
                                const bigNumber = ethers.utils.bigNumberify(newValues["valueOf" + fn.name]);
                                newValues["valueOf" + fn.name] = bigNumber.toHexString();
                                console.log("SETTING:", newValues);
                                setValues(newValues);
                              }}
                            >
                              #️⃣
                            </div>
                          </Col>
                        </Row>
                      </div>
                    }
                  />
                );
              } else {
                buttonIcon = "💸";
              }
            }

            inputs.push(
              <div style={{ cursor: "pointer", margin: 2 }}>
                {afterForm}
                <Input
                  onChange={e => {
                    console.log("CHANGE");
                    const newValues = { ...values };
                    newValues[fn.name] = e.target.value;
                    console.log("SETTING:", newValues);
                    setValues(newValues);
                  }}
                  defaultValue=""
                  value={values[fn.name]}
                  addonAfter={
                    <div
                      type="default"
                      onClick={async () => {
                        console.log("CLICK");
                        const args = [];
                        // eslint-disable-next-line guard-for-in
                        // eslint-disable-next-line no-restricted-syntax
                        for (const i in fn.inputs) {
                          const input = fn.inputs[i];
                          args.push(form[fn.name + input.name + i]);
                        }
                        console.log("args", args);

                        let overrides = {};
                        if (values["valueOf" + fn.name]) {
                          overrides = {
                            value: values["valueOf" + fn.name], // ethers.utils.parseEther()
                          };
                        }

                        // console.log("Running with extras",extras)
                        const result = tryToDisplay(await contract[fn.name](...args, overrides));

                        const newValues = { ...values };
                        newValues[fn.name] = result;
                        console.log("SETTING:", newValues);
                        setValues(newValues);
                      }}
                    >
                      {buttonIcon}
                    </div>
                  }
                />
              </div>,
            );

            nextDisplay.push(
              <div>
                <Row>
                  <Col
                    span={8}
                    style={{
                      textAlign: "right",
                      opacity: 0.333,
                      paddingRight: 6,
                      fontSize: 24,
                    }}
                  >
                    {fn.name}
                  </Col>
                  <Col span={16}>{inputs}</Col>
                </Row>
                <Divider />
              </div>,
            );
          } else if (!displayed[fn.name]) {
            console.log("UNKNOWN FUNCTION", fn);
          }
        }
        setDisplay(nextDisplay);
      }
    };
    loadDisplay();
  }, [contract, values, form, show]);

  return (
    <Card
      title={
        <div style={{ float: "right", color: "black" }}>
          *Authorized
          <div style={{ float: "left" }}>
            <Account
              address={address}
              localProvider={props.provider}
              injectedProvider={props.provider}
              mainnetProvider={props.provider}
              readContracts={contracts}
              price={props.price}
            />
            {props.account}
          </div>
        </div>
      }
      size="large"
      style={{ width: 550, marginTop: 0 }}
      loading={display && display.length <= 0}
    >
      {display}
    </Card>
  );
}
