import React, { Component } from 'react'
import { Grid, Header, Icon, Segment, Form, Button, Message } from 'semantic-ui-react'

import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import md5 from 'md5'

class Register extends Component {

  state = {
    login: '',
    email: '',
    password: '',
    passwordConfirm: '',
    errors: [],
    loading: false,
    usersRef: firebase.firestore().collection('users')
  }

  isFormEmpty = () => {
    return !this.state.login.length || !this.state.email.length || !this.state.password.length || !this.state.passwordConfirm.length
  }

  isPasswordValid = () => {
    if (this.state.password.length < 6 || this.state.passwordConfirm.length < 6) {
      return false
    } else if (this.state.password !== this.state.passwordConfirm) {
      return false
    } else {
      return true
    }
  }

  isFormValid = () => {
    let errors = []
    let error = {}

    if (this.isFormEmpty()) {
      error = { message: 'Заполнены не все поля' }
      this.setState({
        errors: errors.concat(error)
      })
      return false
    } else if (!this.isPasswordValid()) {
      error = { message: 'Длина пароля меньше 6 символов или введенные пароли не совпадают' }
      this.setState({
        errors: errors.concat(error)
      })
      return false
    } else {

      return true
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  createUser = createdUser => {
    return this.state.usersRef.doc(createdUser.user.uid).set({
      login: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    })
  }

  handleSubmit = event => {
    if (this.isFormValid()) {
      event.preventDefault()
      this.setState({ errors: [], loading: true })
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          console.log(user)
          user.user.updateProfile({
            displayName: this.state.login,
            photoURL: `http://gravatar.com/avatar/${md5(this.state.email)}?d=identicon`
          })
            .then(() => {
              this.createUser(user).then(() => {
                this.setState({ loading: false })
              })
            })
            .catch(error => {
              this.setState({
                errors: this.state.errors.concat(error),
                loading: false
              })
            })

        })
        .catch(error => {
          console.error(error)
          this.setState({ errors: this.state.errors.concat(error), loading: false })
        })
    }
  }

  renderErrors = () => {
    return this.state.errors.map((error, i) => <p key={i}>{error.message}</p>)
  }

  render() {
    const { login, email, password, passwordConfirm } = this.state

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Регистрация
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="login"
                icon="user"
                iconPosition="left"
                placeholder="Логин"
                onChange={this.handleChange}
                type="text"
                value={login}
              />
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                onChange={this.handleChange}
                type="email"
                value={email}
                className={this.state.errors.some(error => error.message.toLowerCase().includes('email')) ? 'error' : ''}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Пароль"
                onChange={this.handleChange}
                type="password"
                value={password}
                className={this.state.errors.some(error => error.message.toLowerCase().includes('пароля')) ? 'error' : ''}
              />
              <Form.Input
                fluid
                name="passwordConfirm"
                icon="repeat"
                iconPosition="left"
                placeholder="Пароль (повторно)"
                onChange={this.handleChange}
                type="password"
                value={passwordConfirm}
                className={this.state.errors.some(error => error.message.toLowerCase().includes('пароля')) ? 'error' : ''}
              />
              <Button
                disabled={this.state.loading}
                className={this.state.loading ? 'loading' : ''}
                fluid
                color="orange"
                size="large"
              >Регистрация</Button>
            </Segment>
          </Form>
          {this.state.errors.length > 0 && (
            <Message error>
              <h3>Ошибка</h3>
              {this.renderErrors()}
            </Message>
          )}
          <Message><Link to="/login">Уже есть аккаунт?</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register
