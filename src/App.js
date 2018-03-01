import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  componentDidMount = async() => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }
  
  onSubmit = async(event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Waiting for transaction to be verified...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'Successfully entered the lottery' });
  }

  onClick = async() => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Picking a Winner!!' });
    
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    
    this.setState({ message: 'A winner has been picked!' })
  }

  render() {

    return <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>
          There are currently <strong>
            {this.state.players.length}
          </strong> people entered competing to win <strong>
            {web3.utils.fromWei(this.state.balance, "ether")}
          </strong> ether!
        </p>
        <hr />

        <form onSubmit={this.onSubmit} action="">
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input value={this.state.value} onChange={event => this.setState(
                  { value: event.target.value }
                )} />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <div>
          <h4>Transaction Status: {this.state.message}</h4>
        </div>

        <hr />
            <h4>Ready to pick a winner?</h4>
            <button onClick={this.onClick}> Pick a winner! </button>
        <hr />
      </div>;
  }
}

export default App;
