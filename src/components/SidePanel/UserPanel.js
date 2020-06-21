import React, { Component } from 'react'
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react'

import firebase from '../../firebase'
import { connect } from 'react-redux'

class UserPanel extends Component {

  dropdownOptions = () => [
    {
      key: 'user',
      text: <span>Вы вошли как <strong>{this.props.currentUser.displayName}</strong></span>,
      disabled: true
    },
    {
      key: 'avatar',
      text: <span>Сменить аватар</span>
    },
    {
      key: 'signout',
      text: <span onClick={this.handleSignout}>Выйти</span>
    }
  ]

  handleSignout = () => {
    firebase.auth().signOut()
      .then(() => {
        console.log('signout')
      })
  }

  render() {
    const user = this.props.currentUser

    return (
      <Grid style={{ background: "#4c3c4c", marginBottom: "1.2em" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>DevChat</Header.Content>
            </Header>
          </Grid.Row>

          <Header style={{ padding: "0.25em" }} as="h4" inverted>
            <Dropdown trigger={
              <span>
                <Image src={user.photoURL} spaced="right" avatar />
                {user.displayName}
              </span>
            } options={this.dropdownOptions()} />
          </Header>
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.user.currentUser
  }
}

export default connect(mapStateToProps)(UserPanel)
