const RandaoFlipper = artifacts.require("./RandaoFlipper.sol");

contract("RandaoFlipper", accounts => {
  it("test", async () => {

    console.log(accounts)

    const randaoFlipperInstance = await RandaoFlipper.deployed();

    // Set value of 89
    const pNum = 10;
    const wNum = 3;
    const duration = 10;

    await randaoFlipperInstance.createConfiguration(pNum, wNum, duration);

    const configurationsNumber = await randaoFlipperInstance.ConfigurationsCounter.call();
    console.log(configurationsNumber)

    // const configuration = await randaoFlipperInstance.GameConfigurations(0);

    const value = 100000000000000;
    await randaoFlipperInstance.createGame(
      0, '0x04570d79d94e82ca503415e37f71238f27d1d655f58d9f58a3726d20dafe6d05',
      { from: accounts[0], value }
    );

    const game1 = await randaoFlipperInstance.getGame(0);
    console.log(game1.deposit.toString())

    for(let i = 0; i < pNum; i++) {
      const account = accounts[i + 1];
      if(account) {
        const hash = await randaoFlipperInstance.encode(Math.floor(Math.random() * 3242352352), account);
        await randaoFlipperInstance.commitNumber(0, hash, { from: account, value });
      }
    }

    const gameUp = await randaoFlipperInstance.getGame(0);
    console.log(gameUp)

    // Get stored value
    // const storedData = await randaoFlipperInstance.get.call();
    //
    // assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
