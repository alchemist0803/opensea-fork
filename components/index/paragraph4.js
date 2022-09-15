import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ArtGallery2 from "../explore/art-gallery2";
import axios from "axios";
import Web3 from "web3";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWeb3 } from "../web3";
import LoaderDialog from "../../components/dialog/loader";
import ArtGallery8 from "../explore/art-gallery8";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Paragraph4() {
  const web3Api = useWeb3();
  console.log("Web3 At Home", web3Api);
  const account = web3Api.account;
  const router = useRouter();
  const [noProvider, setNoProvider] = useState(false);

  let [priceOpen, setPriceOpen] = useState(false);
  let [loaderOpen, setLoaderOpen] = useState(false);
  let [successOpen, setSuccessOpen] = useState(false);

  function closePriceModal() {
    setPriceOpen(false);
  }

  function openPriceModal() {
    setPriceOpen(true);
  }

  function closeLoaderModal() {
    setLoaderOpen(false);
  }

  function openLoaderModal() {
    setLoaderOpen(true);
  }

  function closeSuccessModal() {
    setSuccessOpen(false);
  }

  function openSuccessModal() {
    setSuccessOpen(true);
  }

  //Create LoadAccounts Function
  const [accountBalance, setAccountBalance] = useState(0);

  //Start Add Token
  const [tokenContract, setTokenContract] = useState(null);
  const [tokenBalance, setTokenBalnce] = useState("0");

  //Load Contracts Function
  const [nftContract, setNFtContract] = useState(null);
  const [marketContract, setMarketContract] = useState(null);
  const [nftAddress, setNFtAddress] = useState(null);
  const [marketAddress, setMarketAddress] = useState(null);
  const [unsoldItems, setUnsoldItems] = useState([]);

  const indexOfunsold = unsoldItems.length;

  const firstOne = unsoldItems[indexOfunsold - 1];
  const seconsOne = unsoldItems[indexOfunsold - 2];
  const thirdOne = unsoldItems[indexOfunsold - 3];
  const fourthOne = unsoldItems[indexOfunsold - 4];
  const fivthOne = unsoldItems[indexOfunsold - 5];

  useEffect(() => {
    const LoadContracts = async () => {
      //Paths of Json File
      const nftContratFile = await fetch("/abis/NFT.json");
      const marketContractFile = await fetch("/abis/NFTMarketPlace.json");
      //Convert all to json
      const convertNftContratFileToJson = await nftContratFile.json();
      const convertMarketContractFileToJson = await marketContractFile.json();
      //Get The ABI
      const markrtAbi = convertMarketContractFileToJson.abi;
      const nFTAbi = convertNftContratFileToJson.abi;

      const netWorkId = await web3Api.web3.eth.net.getId();

      const nftNetWorkObject = convertNftContratFileToJson.networks[netWorkId];
      const nftMarketWorkObject =
        convertMarketContractFileToJson.networks[netWorkId];

      //Get Token Contract
      //Get Token Contract
      const TokenContractFile = await fetch("/abis/Token.json");
      const convertTokenContractFileToJson = await TokenContractFile.json();
      const tokenAbi = await convertTokenContractFileToJson.abi;

      const TokenMarketWorkObject =
        convertTokenContractFileToJson.networks[netWorkId];

      if (nftMarketWorkObject && nftMarketWorkObject) {
        const nftAddress = nftNetWorkObject.address;
        setNFtAddress(nftAddress);
        const marketAddress = nftMarketWorkObject.address;
        setMarketAddress(marketAddress);

        const deployedNftContract = await new web3Api.web3.eth.Contract(
          nFTAbi,
          nftAddress
        );
        setNFtContract(deployedNftContract);
        const deployedMarketContract = await new web3Api.web3.eth.Contract(
          markrtAbi,
          marketAddress
        );
        setMarketContract(deployedMarketContract);
        const tokenAddress = TokenMarketWorkObject.address;
        console.log("Token Adresss", tokenAddress);
        const deployedTokenContract = await new web3Api.web3.eth.Contract(
          tokenAbi,
          tokenAddress
        );
        setTokenContract(deployedTokenContract);
        console.log("account from index", account);

        if (account) {
          const myBalance = await web3Api.web3.eth.getBalance(account);
          const convertBalance = await web3Api.web3.utils.fromWei(
            myBalance,
            "ether"
          );
          setAccountBalance(convertBalance);
        }

        //Fetch all unsold items
        const data = await deployedMarketContract.methods
          .getAllUnsoldItems()
          .call();
        console.log(data);
        const items = await Promise.all(
          data.map(async (item) => {
            const nftUrl = await deployedNftContract.methods
              .tokenURI(item.tokenId)
              .call();
            console.log("Image URl", nftUrl);
            console.log(item);
            const priceToWei = Web3.utils.fromWei(
              item.price.toString(),
              "ether"
            );

            //START FIX OLD IMAGE

            const replaceIPFsName = nftUrl
              .toString()
              .replace("ipfs.infura.io", "mrbebo.infura-ipfs.io");
            console.log("replaceIPFsName", replaceIPFsName);
            const metaData = await axios.get(replaceIPFsName);

            const oldImageUrl = metaData.data.image;
            const replaceIPFsImageName = oldImageUrl
              .toString()
              .replace("ipfs.infura.io", "mrbebo.infura-ipfs.io");

            console.log("metaData.data.image", metaData.data.image);
            console.log("metaData.data.image", replaceIPFsImageName);

            //TODO: fix this object
            let myItem = {
              price: priceToWei,
              itemId: item.id,
              tokenId: item.tokenId,
              owner: item.owner,
              seller: item.seller,
              oldOwner: item.oldOwner,
              creator: item.creator,
              oldSeller: item.oldSeller,

              oldPrice: item.oldPrice,
              image: replaceIPFsImageName,
              //End FIX OLD IMAGE

              name: metaData.data.name,
              description: metaData.data.description,
              category: metaData.data.category,

              isResell: item.isResell,
              buttonTitle: "BUY NOW",
            };
            console.log(item);

            return myItem;
          })
        );

        setUnsoldItems(items);
      } else {
        console.log("You are at Wrong Netweok, Connect with Polygon Please");
      }
    };
    web3Api.web3 && account && LoadContracts();
  }, [web3Api.web3, account]);

  //Create nft Buy Function
  //Create nft Buy Function
  const buyNFT = async (nftItem) => {
    console.log("********");
    console.log(account);
    console.log(nftAddress);
    console.log("nftItem.price", nftItem.price);

    const convertIdtoInt = Number(nftItem.itemId);

    const priceFromWei = Web3.utils.toWei(nftItem.price.toString(), "ether");
    ////

    console.log("nftItem.price", priceFromWei);
    openLoaderModal();

    try {
      if (account && tokenContract) {
        openLoaderModal();

        let sellerMoney = Number(nftItem.price);

        const sellerMoneypriceToWei = Web3.utils.toWei(
          sellerMoney.toString(),
          "ether"
        );

        const sendNftPriceToSeller = await tokenContract.methods
          .transfer(nftItem.seller, sellerMoneypriceToWei)
          .send({ from: account });

        const convertIdtoInt = Number(nftItem.itemId);

        if (sendNftPriceToSeller) {
          //Transfare token
          const result = await marketContract.methods
            .buyNFt(nftAddress, convertIdtoInt)
            .send({ from: account });
          closeLoaderModal();

          router.push("/market/nft-purchased");
        } else {
          console.log("cannot comlete buy because you dont send money");
        }
      } else {
        console.log("Error at Buy Function");
        closeLoaderModal();
      }
    } catch (e) {
      console.log("Error catch of buy ", e);
      closeLoaderModal();
    }
  };

  const [data, setData] = useState(unsoldItems);
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    const filteredData = unsoldItems.filter((d) => d.category === category);

    if (category === "ALL") {
      setData(unsoldItems);
    } else {
      setData(filteredData);
    }
  }, [unsoldItems, category]);

  const [current, setCurrent] = useState(0);

  const btnCategories = [
    "ALL",
    "ART",
    "COLLECTIBLES",
    "PHOTOGRAPHY",
    "SPORT",
    "TRADING CARDS",
    "UTILITY",
    "VIRTUAL WORLDS",
  ];

  return (
    <div className="w-full h-auto">
      <div className="relative grid grid-cols-1 gap-8 m-8 sm:m-16 lg:m-[12vw]">
        {/* categories */}
        <div className="flex flex-col space-y-12">
          <div className=" w-full flex flex-row justify-center text-[#04111D] text-[24px] font-bold">
            Browse by category
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0">
              <ArtGallery8 categories={btnCategories}></ArtGallery8>
          </div>
        </div>

        {/* galleries
        {!data.length ? (
          <a className="flex-none text-center text-[#A2A6D0] hover:text-white dark:text-gray-800 dark:hover:text-gray-600">
            NO NFTs At This Category
          </a>
        ) : (
          <ArtGallery2 galleries={data}>{{ buyFunction: buyNFT }}</ArtGallery2>
        )} */}
        <LoaderDialog
          show={loaderOpen}
          openLoaderModal={openLoaderModal}
        ></LoaderDialog>
      </div>
    </div>
  );
}
