import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberships: null
    };

    if (props.user) {
      this.state.user_id = props.user.id;
    }

    this._handleChange = this._handleChange.bind(this);

    const fetchMemberships = () => {
      axios.get(`http://localhost:3000/users/${ this.state.user_id }.json`).then( ( results ) => {
        const memberships = results.data.memberships
        // console.log( memberships );
        this.setState({
          memberships: memberships
        });
        setTimeout( fetchMemberships, 500);
        console.log(this.state.memberships );
      });
    }
    fetchMemberships();
  }

  _handleChange() {
    axios.get(`http://localhost:3000/users/${ this.state.user_id }.json`).then( ( results ) => {
      const memberships = results.data.memberships;
      this.setState({
        memberships: memberships
      });
    });
  }

  render() {
    if ( this.state.memberships === null ) {
      return '';
    }
    return (
      <div className="control">
        <h1>CONTROLLER</h1>
        <Collapsible title="Memberships">
          <Memberships user_id={ this.state.user_id } onChange={ this._handleChange } memberships={ this.state.memberships } />
        </Collapsible>
        <h2>Projects</h2>
        <div>
          <Projects user_id={ this.state.user_id } onChange={ this._handleChange } memberships={ this.state.memberships } />
        </div>
      </div>
    )
  }
}

class Memberships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: props.user_id,
      memberships: props.memberships
    };
  }

  render() {
    return (
      <div>
        {this.state.memberships.map( (m) => {
          if ( m.invitation === false ) {
            return (
              <Invitation membership={ m } onSubmit={ this.props.onSubmit }/>
            )
          }
        })}
      </div>
    );
  }
}

class Invitation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      membership_id: this.props.membership.id,
      status: false
    };

    this._acceptInvite = this._acceptInvite.bind(this);
    this._declineInvite = this._declineInvite.bind(this);
  }

  _acceptInvite() {
    const acceptedInvitation = {
      invitation: true,
    }

    axios.put(`http://localhost:3000/memberships/${ this.state.membership_id }.json`, acceptedInvitation).then(
    (result) => {
      this.props.onSubmit();
    })
  }

  _declineInvite() {
    axios.delete(`http://localhost:3000/memberships/${ this.state.membership_id }.json`).then( (result) => {
        this.props.onSubmit();
    })
  }

  render() {
    return (
      <div className="invitation">
        <p>{ this.props.membership.project.name }</p>
        <p>{ this.props.membership.project.description }</p>
        <button onClick={ this._acceptInvite }>Accept</button>
        <button onClick={ this._declineInvite }>Decline</button>
      </div>
    )
  }
}

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: props.memberships
    };
  }

  render() {
    return (
      <div>
        {this.state.projects.map( (p) => {
          if ( p.invitation === true ) {
            return (
              <div>
                <Link to={{
                  pathname: "/dashboard",
                  state:{ project: p.project }
                }}>{ p.project.name }</Link>
              </div>
            )
          }
        })}
      </div>
    )
  }
}

class Collapsible extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          open: false
      }
      this.togglePanel = this.togglePanel.bind(this);
  }

  togglePanel(e){
      this.setState({open: !this.state.open})
  }

  componentDidUpdate() {
      // this.props.onToggle(this.props.index);
  }

  render() {
    return (<div>
      <div onClick={(e)=>this.togglePanel(e)} className='header'>
          {this.props.title}</div>
      {this.state.open ? (
          <div className='content'>
              {this.props.children}
          </div>
          ) : null}
    </div>);
  }
}

export default Control;
