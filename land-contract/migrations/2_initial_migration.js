const landNFT = artifacts.require("LandNFT");

module.exports = function (deployer) {
  deployer.deploy(landNFT);
};