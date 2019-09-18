# Ether Flipper
Smart contract for honest lotteries with a transparent selection of random winners

- [White Papper (Eng)](#)
- [White Papper (Rus)](https://docs.google.com/document/d/1D0AhhxBUbztEDEorN_ol2-Gbk1wSesnEPdI40t8jg_w/edit#heading=h.qnot4uqa9209)

## Deploy contract
1. `npm install -g truffle`
2. Rename `truffle-config.example.js` to `truffle-config.js`
3. Add your 12 word mnemonic of ERC20 wallet to line 4 (const mnemonic). First address in wallet will be contract owner.
4. Use existing or create new network configuration.
5. Run in terminal `truffle migrate --network {your_network}`

## Run client app (development)
1. Go to client app folder `cd client`
2. Install npm dependencies `npm run install`
3. Run the app `npm start` and this will open `http://localhost:3000` in your browser.
