import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Web3 from "web3";
import axios from "axios";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHomeAlt,
  faAngleRight,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Breadcrumbs from "../../components/breadcrumbs";
import ArePreview from "../../components/explore/art-preview";
import ArtGallery2 from "../../components/explore/art-gallery2";
import { useWeb3 } from "../../components/web3";
import LoaderDialog from "../../components/dialog/loader";
import {
  FacebookShareCount,
  HatenaShareCount,
  OKShareCount,
  PinterestShareCount,
  RedditShareCount,
  TumblrShareCount,
  VKShareCount,
} from "react-share";
export default function SingleNftItem() {
  const [showNft, setShowNft] = useState(true);
  const [uniqid, setuniqid] = useState("");
  const [uniqtoken, setuniqtoken] = useState("");
  // const web3Api = useWeb3();
  console.log("markeweeeeeet");
  const initialize = (token, id) => {
    if (token && id) {
      setuniqid(id);
      setuniqtoken(token);
    } else {
      const href = window.location.href;
      const arr = href.split("/");
      const arr2 = arr[4].split("?id=");
      arr2[1] ? setuniqid(arr2[1]) : "";
      arr2[0] ? setuniqtoken(arr2[0]) : "";
    }
    // LoadContracts();
  };
  useEffect(() => {
    initialize();
  }, []);
  const web3Api = useWeb3();
  console.log("iam in single nft", web3Api);
  const account = web3Api.account;
  const router = useRouter();
  const { itemId } = router.query;
  const { id } = router.query;
  const [validToViewSinglePost, setValidToViewSinglePost] = useState(false);

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

  //Load Contracts Function
  //Start Add Token
  const [tokenContract, setTokenContract] = useState(null);
  const [tokenBalance, setTokenBalnce] = useState("0");

  //Load Contracts Function
  const [nftContract, setNFtContract] = useState(null);
  const [marketContract, setMarketContract] = useState(null);
  const [nftAddress, setNFtAddress] = useState(null);
  const [marketAddress, setMarketAddress] = useState(null);
  const [singleItem, setSingleItem] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const LoadContracts = async () => {
      openLoaderModal();
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
      const TokenContractFile = await fetch("/abis/Token.json");
      const convertTokenContractFileToJson = await TokenContractFile.json();
      const tokenAbi = await convertTokenContractFileToJson.abi;
      const TokenMarketWorkObject =
        convertTokenContractFileToJson.networks[netWorkId];

      try {
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

          console.log(uniqtoken);
          console.log(uniqid);

          const tokenAddress = TokenMarketWorkObject.address;
          console.log("Token Adresss", tokenAddress);
          const deployedTokenContract = await new web3Api.web3.eth.Contract(
            tokenAbi,
            tokenAddress
          );
          setTokenContract(deployedTokenContract);
          console.log("account from index", account);

          try {
            if (Number(uniqtoken)) {
              const nftUrl = await deployedNftContract.methods
                .tokenURI(uniqtoken)
                .call();

              const item = await deployedMarketContract.methods
                .fetchSingleItem(uniqid)
                .call();

              console.log("Single item Data", item);

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

              let myItem = {
                price: priceToWei,
                itemId: item.id,
                tokenId: item.tokenId,
                owner: item.owner,
                seller: item.seller,
                oldOwner: item.oldOwner,
                creator: item.creator,
                oldSeller: item.oldSeller,
                sold: item.sold,

                oldPrice: item.oldPrice,
                image: replaceIPFsImageName,
                name: metaData.data.name,
                description: metaData.data.description,
                category: metaData.data.category,

                isResell: item.isResell,
              };

              setSingleItem(myItem);
              setIsLoading(false);
              closeLoaderModal();

              //Fetch all unsold items
              const data = await deployedMarketContract.methods
                .getAllUnsoldItems()
                .call();
              console.log("Data", data);
              const items = await Promise.all(
                data.map(async (item) => {
                  const nftUrl = await deployedNftContract.methods
                    .tokenURI(item.tokenId)
                    .call();
                  console.log(nftUrl);
                  console.log("item ", item);
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
                    name: metaData.data.name,
                    description: metaData.data.description,
                    category: metaData.data.category,

                    sold: item.sold,
                    isResell: item.isResell,
                    buttonTitle: "Buy Now",
                  };
                  console.log(item);

                  return myItem;
                })
              );

              const myCategoriyItems = items.filter(
                (item) => item.category == singleItem.category
              );

              setCategoryItems(myCategoriyItems);
              setIsLoading(false);

              closeLoaderModal();

              console.log("Item from Item", singleItem.owner);
              setValidToViewSinglePost(true);

              return myItem;
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          window.alert("You are at Wrong Netweok, Connect with Binance Please");
        }
      } catch (e) {
        console.log("error at fetch single nft", e);
      }
    };
    web3Api.web3 && LoadContracts();
  }, [uniqid, uniqtoken, web3Api.web3, isLoading]);

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

  const breadcrumbs = ["Explore", "NFT Artwork Details"];

  return (
    <>
      <Head>
        <title>Beautiful Artwork</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header current={-1}></Header>

      <div className="bg-[#050505] dark:bg-white">
        <div className="w-full 2xl:max-w-screen-2xl h-auto pt-[104px] m-auto">
          <div className="flex flex-col mx-8 sm:mx-10 lg:mx-[5vw] space-y-6 py-12">
            {/* custom breadcrubs */}
            <Breadcrumbs home="Home" breadcrumbs={breadcrumbs}></Breadcrumbs>

            <div className="flex flex-col space-y-12">
              {/* art details */}
              <ArePreview>
                {{ item: singleItem, buyFunction: buyNFT }}
              </ArePreview>

              <div className="flex flex-col items-start bg-[#1E1E1E] border-[1px] border-[#353840] dark:border-[#e5e8eb] dark:bg-white dark:border-gray-200 rounded-md">
                <div className="w-full  p-4">
                  <button
                    onClick={() => setShowNft(!showNft)}
                    className=" flex flex-row justify-between items-center w-full dark:text-black text-white font-bold"
                  >
                    <div className="flex flex-row justify-start items-center">
                      <FontAwesomeIcon
                        icon="fa-solid fa-list"
                        className="dark:text-black mr-2"
                      />
                      <span>Related {singleItem.category} Nfts</span>
                    </div>
                    {showNft ? (
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-up"
                        className="dark:text-black right-0"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-down"
                        className="dark:text-black right-0"
                      />
                    )}
                  </button>
                </div>
                {showNft ? (
                  <div className="flex flex-col items-start border-t-[1px] border-[#353840] dark:border-[#e5e8eb] p-6 dark:bg-[#fbfdff]">
                    {!isLoading ? (
                      <ArtGallery2
                        refresh={initialize}
                        galleries={categoryItems}
                        bgColor={"#353840"}
                      >
                        {{ buyFunction: buyNFT }}
                      </ArtGallery2>
                    ) : (
                      "Loading"
                    )}

                    
                  </div>
                ) : (
                  ""
                )}
                {
                  showNft ? (
                    <div className=" w-full flex flex-col items-start border-t-[1px] border-[#353840] dark:border-[#e5e8eb] p-6">
                <Link href="/categories">
                      <div className="w-full flex flex-row justify-center items-center">
                        <button className="rounded-xl bg-[#353840] text-white dark:bg-white dark:text-[#2081e2] dark:border-solid dark:border-2 dark:border-[#e5e8eb] text-xs sm:text-base px-6 sm:px-10 py-3.5 sm:py-4 font-semibold dark:border-gray-300">
                          See all
                        </button>
                      </div>
                    </Link>
                </div>
                  ) : ""
                }
                
                
              </div>

              {/* galleries */}
            </div>
          </div>
        </div>
        <LoaderDialog
          show={loaderOpen}
          openLoaderModal={openLoaderModal}
        ></LoaderDialog>
      </div>
      <Footer></Footer>
    </>
  );
}
