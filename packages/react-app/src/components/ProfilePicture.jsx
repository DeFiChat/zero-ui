import React, { Component } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import '../styles/index.scss';
import Box from '3box';
import ProfileHover from 'profile-hover';

class ProfilePicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicture: null,
      ethereumAddress: '',
      profileName: '',
      blockie: '',
    }
  }

  async componentDidMount() {
    let ethereumAddress;
    let profilePicture;
    let profileName;

    if (this.props.did) { // profiles via listModerator or listMember
      // console.log('DID3 is: ', this.props.did)
      const getConfig = await Box.getConfig(this.props.did);
      // console.log('getConfig is: ', getConfig);
      ethereumAddress = getConfig.links[getConfig.links.length - 1].address;
      // const doc = await resolver.resolve(this.props.did);
      const profile = await Box.getProfile(ethereumAddress);
      // console.log('profile is: ', profile)
      profileName = profile.name;
      profilePicture = profile.image;
      // ethereumAddress = doc.publicKey[2].ethereumAddress;
    } else { // my profile from login
      const { myAddress, myProfilePicture, myName } = this.props;
      profileName = myName;
      profilePicture = myProfilePicture;
      ethereumAddress = myAddress;
    }
    // console.log('ethereumAddress for blockie is: ',ethereumAddress )
    const blockie = makeBlockie(ethereumAddress);
    this.setState({ profilePicture, ethereumAddress, profileName, blockie });
  }

  render() {
    const {
      isTile,
      isUseHovers,
      isModerator,
      isOwner,
    } = this.props;
    const { profilePicture, profileName, blockie, ethereumAddress } = this.state;
    const image = !!profilePicture ? `https://ipfs.infura.io/ipfs/${profilePicture[0].contentUrl['/']}` : blockie;

    return (
      <React.Fragment>
        {
          isUseHovers ? (
            <ProfileHover noTheme address={ethereumAddress} orientation="left">
              <ProfileTile
                image={image}
                isTile={isTile}
                profileName={profileName}
                isModerator={isModerator}
                isOwner={isOwner}
                address={ethereumAddress}
              />
            </ProfileHover>
          ) : (
              <ProfileHover noTheme address={ethereumAddress} orientation="left">
                <ProfileTile
                  image={image}
                  isTile={isTile}
                  profileName={profileName}
                  isModerator={isModerator}
                  isOwner={isOwner}
                  address={ethereumAddress}
                />
              </ProfileHover>
            )
        }
      </React.Fragment>
    )
  }
}

export default ProfilePicture;

const ProfileTile = ({ image, isTile, profileName, isModerator, isOwner, address }) => (
  <div className="profileTile">
    <div className="profileTile_info">
      <a href={`https://3box.io/${address}`} className="profileTile_info_link" target="_blank" rel="noopener noreferrer">
        {image ? (
          <img
            src={image}
            className="profileTile_info_image profileTile_info_image-transparent"
            alt="profile"
          />
        ) : <div className="profileTile_info_image" />}

        {isTile && (
          <p>{profileName}</p>
        )}
      </a>
    </div>

    {isOwner && <p className="profileTile_creator">Creator</p>}
    {isModerator && <p className="profileTile_moderator">Mod</p>}
  </div>
);
