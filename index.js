//Digital Ocean V2 NFT ABI
import DigitalOceanABI from "./digital_ocean_token.js"
//Staked Klima Token ABI
import sklimaABI from "./sklima_token.js"

//Connect to Web3
window.ethereum ?
  ethereum.request({method: "eth_requestAccounts"}).then((accounts) => {
    console.log(accounts[0])
  }).catch((err) => console.log(err))
: alert("Please install MetaMask") 
try {
  //Switch to Polygon
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: "0x89"}],
    });
    console.log("You have switched to the right network")
  
} catch (switchError) {
  
  // The network has not been added to MetaMask
  if (switchError.code === 4902) {
    try {
      // Add Polygon to Network List
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
            {
              chainId: '0x89', 
              chainName:'Polygon',
              rpcUrls:['https://polygon-rpc.com'],                   
              blockExplorerUrls:['https://polygonscan.com/'],  
              nativeCurrency: { 
                name: 'Polygon',
                symbol:'MATIC',   
                decimals: 18
              }     
            }
          ],
        });
    } catch (err) {
       console.log(err);
    }
   console.log("Please add the Polygon network to MetaMask")
  }
  alert("Cannot switch to the network")
  
} 
//**********Load Treasury Information********************
//Digital Ocean V2 Contract
const contract = new window.web3.eth.Contract(DigitalOceanABI, "0xa324545BBab91696F394812cF6514e42e666B942")
//Staked Klima Contract
const contract1 = new window.web3.eth.Contract(sklimaABI, "0xb0C22d8D350C67420f06F48936654f567C73E8C8")
//Treasury Staked Klima Holdings
const sklimaHolding = await contract1.methods.balanceOf("0xe4676b9f786535597f1a3890f9362e7499f5dee0").call()
//Treasury Digital Ocean V2 NFT Holdings
const treasuryBalance = await contract.methods.balanceOf("0xe4676b9f786535597f1a3890f9362e7499f5dee0").call()
//NFTs Burned
const burnBalance = await contract.methods.balanceOf("0x000000000000000000000000000000000000dead").call()
//Total Minted V2 NFTs
const totalSupply = await contract.methods.totalSupply().call()
//Backed NFTs minus Treasury Holdings and Burned Supplies
const backed = totalSupply - treasuryBalance - burnBalance
//Klima Price
var klimaprice;
let url ='https://api.coingecko.com/api/v3/simple/price?ids=klima-dao&vs_currencies=usd';
let response = await fetch(url);
let answer = await response.json()
klimaprice = answer["klima-dao"]["usd"];
//FrontEnd Treasury Totals
document.getElementById("treasuryOwned").innerHTML = treasuryBalance;
document.getElementById("burned").innerHTML = burnBalance;
document.getElementById("sklimaTreasury").innerHTML =  (web3.utils.fromWei(sklimaHolding, 'gwei') * 1).toFixed(2);
document.getElementById("price").innerHTML =  '$' + (web3.utils.fromWei(sklimaHolding, 'gwei')  * klimaprice).toFixed(2);
document.getElementById("total").innerHTML = backed;
document.getElementById("perNFT").innerHTML = ((web3.utils.fromWei(sklimaHolding, 'gwei') / backed).toFixed(2));
document.getElementById("price1").innerHTML =  '$' + ((web3.utils.fromWei(sklimaHolding, 'gwei') / backed)  * klimaprice).toFixed(2);
//FrontEnd Individual Balance with AutoSave and Login
const digitaloceanBalance = await contract.methods.balanceOf(window.userAddress).call()
document.getElementById("yourBalance").innerHTML = digitaloceanBalance;
document.getElementById("yourSklima").innerHTML = ((web3.utils.fromWei(sklimaHolding, 'gwei') / backed) * digitaloceanBalance).toFixed(2);
document.getElementById("price2").innerHTML =  '$' + ((web3.utils.fromWei(sklimaHolding, 'gwei') / backed) * digitaloceanBalance * klimaprice).toFixed(2);
//Carbon Grams to Tons
const carbongrams = (((web3.utils.fromWei(sklimaHolding, 'gwei') / (backed)).toFixed(2)) * digitaloceanBalance) * 1000000;
document.getElementById("gas").innerHTML = (carbongrams / 8887).toFixed(2);
document.getElementById("acres").innerHTML = (carbongrams / 200000000).toFixed(2);
document.getElementById("cars").innerHTML = (carbongrams / 4640000).toFixed(2);
document.getElementById("nfts").innerHTML = ""
for (let i = 0; i < digitaloceanBalance; i++) {
    const tokenId = await contract.methods.tokenOfOwnerByIndex(window.userAddress, i).call()
    let tokenMetadataURI = await contract.methods.tokenURI(tokenId).call()
    if (tokenMetadataURI.startsWith("ipfs://")) {
        tokenMetadataURI = `https://ipfs.io/ipfs/${tokenMetadataURI.split("ipfs://")[1]}`
    }
    console.log(tokenMetadataURI)
    const tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json())
    const DigitalOceanTokenElement = document.getElementById("nft_template").content.cloneNode(true)
    DigitalOceanTokenElement.querySelector("h1").innerText = tokenMetadata["name"]
    DigitalOceanTokenElement.querySelector("a").href = `https://opensea.io/assets/matic/0xa324545bbab91696f394812cf6514e42e666b942/${tokenId}`
    if (tokenMetadata["image"].startsWith("ipfs://")) {
        tokenMetadata["image"] = `https://ipfs.io/ipfs/${tokenMetadata["image"].split("ipfs://")[1]}`
    }
    DigitalOceanTokenElement.querySelector("img").src = tokenMetadata["image"]
    DigitalOceanTokenElement.querySelector("img").alt = tokenMetadata["name"]
    document.getElementById("nfts").append(DigitalOceanTokenElement)
}
//Background and Color Selector
switch(digitaloceanBalance){
  case "NaN":
    document.body.style.backgroundImage = "url('./images/1a.jpg')";
    document.documentElement.style.setProperty('--var1', '#ff7a01');
    document.documentElement.style.setProperty('--var2', '#296197');
    break;
  case "0":
    document.body.style.backgroundImage = "url('./images/1a.jpg')";
    document.documentElement.style.setProperty('--var1', '#ff7a01');
    document.documentElement.style.setProperty('--var2', '#296197');
    break;
  case "1":
    document.body.style.backgroundImage = "url('./images/2a.jpg')";
    document.documentElement.style.setProperty('--var1', '#d49400');
    document.documentElement.style.setProperty('--var2', '#621F7E');
    break;
  case "2":
    document.body.style.backgroundImage = "url('./images/3a.jpg')";
    document.documentElement.style.setProperty('--var1', '#93a978');
    document.documentElement.style.setProperty('--var2', '#B46660');
    break;
  case "3":
    document.body.style.backgroundImage = "url('./images/4a.jpg')";
    document.documentElement.style.setProperty('--var1', '#93a978');
    document.documentElement.style.setProperty('--var2', '#B46660');
    break;
  case "4":
    document.body.style.backgroundImage = "url('./images/5a.jpg')";
    document.documentElement.style.setProperty('--var1', '#86b06e');
    document.documentElement.style.setProperty('--var2', '#C15E5A');
    break;
  default:
    document.body.style.backgroundImage = "url('./images/6a.jpg')";
    document.documentElement.style.setProperty('--var1', '#70B95D');
    document.documentElement.style.setProperty('--var2', '#D14E4D');
}

//Login Button to refresh frontend
document.getElementById("login").addEventListener("click", () => { 
  location.reload();
})
