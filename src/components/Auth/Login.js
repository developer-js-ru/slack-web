import React, { Component } from 'react'
import { Grid, Header, Icon, Segment, Form, Button, Message } from 'semantic-ui-react'

import { Link } from 'react-router-dom'
import firebase from '../../firebase'

class Login extends Component {

  state = {
    email: '',
    password: '',
    errors: [],
    loading: false
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  isFormValid = () => {
    return this.state.email && this.state.password
  }

  handleSubmit = event => {
    event.preventDefault()
    if (this.isFormValid()) {
      this.setState({
        errors: [],
        loading: true
      })
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          console.log(user)
          this.setState({ loading: false })
        })
        .catch(error => {
          console.log(error)
          this.setState({
            errors: this.state.errors.concat(error),
            loading: false
          })
        })
    }
  }

  renderErrors = () => {
    return this.state.errors.map((error, i) => <p key={i}>{error.message}</p>)
  }

  render() {
    const { email, password } = this.state

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Авторизация
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
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
              <Button
                disabled={this.state.loading}
                className={this.state.loading ? 'loading' : ''}
                fluid
                color="violet"
                size="large"
              >Войти</Button>
            </Segment>
          </Form>
          {this.state.errors.length > 0 && (
            <Message error>
              <h3>Ошибка</h3>
              {this.renderErrors()}
            </Message>
          )}
          <Message><Link to="/register">Еще нет аккаунта?</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login
