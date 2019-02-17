import React, { Component } from 'react';
import getWeb3 from './utils/getWeb3';
import RandaoContract from './contracts/Randao.json';

class Randao extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      accounts: null,
      contract: null,

      // Block chain info
      networkInfo: {
        height: 0
      }
    }
  }

  async componentDidMount() {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RandaoContract.networks[networkId];
      const contract = new web3.eth.Contract(
        RandaoContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // await contract.methods.newCampaign(540, web3.utils.toHex(1*10**18), 50, 30).send({
      //   from: accounts[0],
      //   value: 1000000000000000000
      // });

      this.setState({ web3, accounts, contract });

      // Initial data
      this.loadNetworkInfo();
      this.subscribeNewBlocks();
      this.loadCampaigns();
    } catch (e) {
      console.error(e);
    }
  }

  async loadNetworkInfo() {
    const { web3 } = this.state;
    const currentHeight = await web3.eth.getBlockNumber()
    this.setState(prevState => {
      return {
        networkInfo: {
          ...prevState.networkInfo,
          height: currentHeight
        }
      }
    });
  }

  async loadCampaigns() {
    const { contract } = this.state;

    try {
      const compaignsNumber = await contract.methods.numCampaigns().call();
      for(let i = 0; i < compaignsNumber; i++) {
        const data = await contract.methods.campaigns(i).call();
        console.log(data)
      }
    } catch (e) {
      console.error(e);
    }
  }

  subscribeNewBlocks() {
    const { web3 } = this.state;
    web3.eth
      .subscribe('newBlockHeaders', (error, result) => {
        if (!error) {
          console.log(result);
          return;
        }
        console.error(error);
      })
      .on('data', blockHeader => {
        this.setState(prevState => {
          return {
            networkInfo: {
              ...prevState.networkInfo,
              height: blockHeader.number
            }
          }
        })
      })
      .on('error', console.error);
  }

  render() {
    return (
      <main>
        <header>
          <h1>Tokens Flipper</h1>
          <h3>Current height: {JSON.stringify(this.state.networkInfo.height)}</h3>
        </header>
      </main>
    );
  }
}

export default Randao;