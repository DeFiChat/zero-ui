import React from 'react';
import { Comment, Avatar } from 'antd';

const Chatter = ({ children }) => (
  <Comment
    actions={[<span key="comment-nested-reply-to">Challenge</span>]}
    author={<a>Vitalik Buterin</a>}
    avatar={
      <Avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt="Vitalik Buterin"
      />
    }
    content={
      <p>
        A <b>smart contract</b> is a mechanism involving digital assets and two or more parties, where some or all of the parties put assets in, and assets are automatically redistributed among those parties according to a formula based on certain data that is not known at the time the contract is initiated.
      </p>
    }
  >
    {children}
  </Comment>
);

export default Chatter