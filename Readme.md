Here is a website used to connect to smart contract and display NFTs, Treasury Balance, Individual Balance, and Carbon Tons.

First it connects to Polygon and ensures one has Metamask.>Gives an Alert if you don't have web3 wallet. > Then it will switch to Polygon > If it doesn't have Polygon, it will add the parameters for Polygon

Once logged into Polygon, the site will query the DCA V2 NFT contract and the staked Klima Treasury Balance. It will also query how much Staked Klima and DCA V2 NFTs is in the Treasury. Then, the site will display this on the FrontEnd for users.

After someone logs into site with their Web3 Wallet, it will store their public address into localstorage for easy login. The login button will disappear and the Logout button will appear. The site will then query your balance of DCA V2 NFTs. Klima aims to be backed by CO2 tons, each Klima is considered a carbon ton. The site then calculates one's Carbon Offset and the individual's amounts. 

The NFTs metadata is queried, then it pulls the IPFS image locations. The site then converts this into https:// address for display on any browser. It is then pulled into a template that displays name, image and wraps it in Opensea anchor to the NFT. THe images on snaped in horizontially and has scroll overflow. 

The Logout button resets all the information and NFTs on the frontend, and removes the localstore address.

Also, the site has multiple backgrounds and color schemes. There are 6 backgrounds from Desert to Forest. The background is selected from your NFT balance. # Digital-Charity-Art-NFT-Website
