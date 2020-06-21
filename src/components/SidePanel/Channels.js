import React, { Component, Fragment } from 'react'
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setCurrentChannel } from '../../store/actions'

import firebase from '../../firebase'

class Channels extends Component {

  state = {
    channels: [],
    activeChannel: '',
    channelName: '',
    channelDescription: '',
    firstLoaded: true,
    modal: false
  }

  componentDidMount() {
    this.addListeners()
  }

  addListeners = () => {
    const addedChannels = []
    firebase.firestore().collection('channels')
      .onSnapshot(snapshot => {
        snapshot.docs.forEach(doc => {
          addedChannels.push({ id: doc.id, ...doc.data() })
          this.setState({ channels: addedChannels }, () => this.setCurrentFirstChannel())
        })
      })
  }

  setCurrentFirstChannel = () => {
    if (this.state.firstLoaded && this.state.channels.length > 0) {
      const firstChannel = this.state.channels[0]
      this.setState({ activeChannel: firstChannel.id })
      this.props.setCurrentChannel(firstChannel)
      this.setState({ firstLoaded: false })
    }
  }

  closeModal = () => this.setState({ modal: false })

  openModal = () => this.setState({ modal: true })

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  isFormValid = () => this.state.channelName && this.state.channelDescription

  handleSubmit = (event) => {
    const { user } = this.props

    event.preventDefault()

    if (this.isFormValid()) {
      firebase.firestore().collection('channels')
        .add({
          ownerId: user.uid,
          name: this.state.channelName,
          description: this.state.channelDescription,
          created: {
            name: user.displayName,
            avatar: user.photoURL
          }
        })
        .then(() => {
          console.log('channel created')
          this.setState({
            channelName: '',
            channelDescription: '',
            modal: false
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  changeCurrentChannel = channel => {
    this.setState({ activeChannel: channel.id })
    this.props.setCurrentChannel(channel)
  }

  renderChannels = () => {
    return this.state.channels.length > 0 && this.state.channels.map(channel => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        onClick={() => this.changeCurrentChannel(channel)}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ))
  }

  render() {
    const { channels, modal } = this.state

    return (
      <Fragment>
        <Menu.Menu style={{ paddingBottom: "2em" }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" />
            Каналы
          </span>{' '}
          ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.renderChannels()}
        </Menu.Menu>

        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Создание канала</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input
                  fluid
                  label="Название канала"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label="Описание канала"
                  name="channelDescription"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Создать
          </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Отмена
          </Button>
          </Modal.Actions>
        </Modal>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
    currentChannel: state.channel.currentChannel
  }
}

export default connect(mapStateToProps, { setCurrentChannel })(Channels)
