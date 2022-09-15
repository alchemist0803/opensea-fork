import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-regular-svg-icons";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Breadcrumbs from "../../components/breadcrumbs";
import { useRouter } from "next/router";
import ArtGallery2 from "../../components/explore/art-gallery2";
import ArtGallery3 from "../../components/explore/art-gallery3";
import { useWeb3 } from "../../components/web3";
import Web3 from "web3";
import truncateEthAddress from "truncate-eth-address";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip } from "@mui/material";

import axios from "axios";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileAsViewer() {
  const web3Api = useWeb3();
  console.log(web3Api);
  const router = useRouter();
  const { creator } = router.query;
  console.log("we are profle as view");
  console.log(creator);

  //Create LoadAccounts Function
  const account = creator;

  const [noProvider, setNoProvider] = useState(true);

  //Create LoadAccounts Function
  const [accountBalance, setAccountBalance] = useState(0);

  const [isLoading, setIsLoading] = useState(true);


  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  //Load Contracts Function
  const [nftContract, setNFtContract] = useState(null);
  const [marketContract, setMarketContract] = useState(null);
  const [nftAddress, setNFtAddress] = useState(null);
  const [marketAddress, setMarketAddress] = useState(null);
  const [unsoldItems, setUnsoldItems] = useState([]);

  const [tokenContract, setTokenContract] = useState(null);
  const [tokenBalance, setTokenBalnce] = useState("0");
  const [creatorCommissionValueInwei, setCreatorCommissionValueInwei] =
    useState(null);

  //Load Contracts Function
  const [creathedItems, setcreathedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

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

        if (account) {
          const data = await deployedMarketContract.methods
            .getMyItemCreated()
            .call({ from: account });
          const items = await Promise.all(
            data.map(async (item) => {
              const nftUrl = await deployedNftContract.methods
                .tokenURI(item.tokenId)
                .call();
              console.log(nftUrl);
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

              let classChange;

              if (item.sold || item.soldFirstTime) {
                classChange = "Sold";
              } else {
                classChange = "Created";
              }

              //TODO: fix this object
              let myItem = {
                ClassChange: classChange,
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
                category: classChange,

                isResell: item.isResell,
                soldFirstTime: item.soldFirstTime,
              };

              return myItem;
            })
          );

          const mySoldItems = items.filter(
            (item) => item.sold || item.isResell
          );
          setSoldItems(mySoldItems)
          setcreathedItems(items);
        }
      } else {
        window.alert("You are at Wrong Netweok, Connect with Cronos Please");
      }
    };
    setIsLoading(false);
    web3Api.web3 && LoadContracts();
  }, [account]);

  //   setIsLoading(false)

  const [isCopied, setIsCopied] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [current, setCurrent] = useState(0);

  const breadcrumbs = ["My Profile"];
  const btnCategories = ["Created", "Sold"];

  const [data, setData] = useState(creathedItems);
  const [category, setCategory] = useState("Created");

  function onCopyText() {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }

  useEffect(() => {
    const filteredData = creathedItems.filter((d) => d.category === category);

    if (category === "Created") {
      setData(creathedItems);
    } else {
      setData(filteredData);
    }
  }, [creathedItems, category]);

  return (
    <>
      <Head>
        <title>Account Address</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header current={-1}></Header>

      <div className="bg-[#202225] dark:bg-white">
        <div className="w-full 2xl:max-w-screen-2xl h-auto pt-[104px] m-auto">
          <div className="flex flex-col mx-8 sm:mx-10 lg:mx-[5vw] space-y-6 py-12">
            {/* custom breadcrubs */}
            <Breadcrumbs home="Home" breadcrumbs={breadcrumbs}></Breadcrumbs>

            <div className="border border-[#787984]"></div>

            <div className="flex flex-col space-y-6">
              <div className="relative h-[200px] rounded-md bg-gradient-to-b from-[#FFCC33] to-[#FFCC33]">
                <div className="absolute left-20 bottom-10 -translate-x-1/2 translate-y-1/2 w-[128px] h-[128px] rounded-full bg-[#202225] dark:bg-white"></div>
                <div className="absolute left-20 bottom-10 -translate-x-1/2 translate-y-1/2 w-[112px] h-[112px] rounded-full bg-gradient-to-b from-[#FFCC33] to-[#FFCC33]"></div>
              </div>

              <div className="flex flex-row pt-2">
                <div className="flex-none w-[35px]"></div>
                <div className="relative flex-grow flex flex-col items-start space-y-2 text-white dark:text-gray-800">
                  <h1 className="text-2xl font-bold">Account</h1>
                  <button className="group flex flex-row justify-start items-center" onClick={() => setShowAddress(!showAddress)}>
                    <img
                      className="w-4 h-4 mr-1 brightness-200 dark:brightness-100"
                      src="https://static.opensea.io/general/ETH.svg"
                    ></img>
                    <span className="group-hover:opacity-60">
                      account address
                    </span>
                    <FontAwesomeIcon
                        icon="fa-solid fa-angle-down"
                        className="dark:text-black ml-1 mt-1 w-3 h-3 group-hover:opacity-60"
                    />
                  </button>

                  {
                    showAddress ? 
                    <ul className=" absolute left-0 top-16 px-4 py-2 bg-[#303339] rounded-md w-[230px] cursor-pointer flex flex-col items-start justify-center">
                    <Tooltip
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            fontSize: "15px",
                          },
                        },
                      }}
                      open={open}
                      onClose={handleClose}
                      onOpen={handleOpen}
                      title={isCopied ? "Copied" : "Copy"}
                    >
                      <li className="flex flex-row justify-between items-center">
                        <img
                          className="w-6 h-6 mr-3 brightness-200 dark:brightness-100"
                          src="https://static.opensea.io/general/ETH.svg"
                        ></img>
                        <span className="mr-8">
                          {truncateEthAddress(account)}
                        </span>
                        <CopyToClipboard text={account} onCopy={onCopyText}>
                          <FontAwesomeIcon icon="fa-regular fa-clone" />
                        </CopyToClipboard>
                      </li>
                    </Tooltip>
                  </ul>: ""
                  }

                  {/* <div className="flex flex-row space-y-2 border-b border-[#e5e8eb80]">
                    <ul className="flex flex-row space-y-2 md:w-auto overflow-auto md:space-y-0">
                    {btnCategories.map((item, index) => (
                                        <li key={"btn-category" + index.toString()} className={classNames(index === current ? 'dark:text-black border-b-2 dark:border-black' : ' dark:border-gray-400 dark:bg-white dark:text-gray-800', 'text-[16px] font-semibold mr-2 text-[#7a7979] min-w-max px-4 py-1.5 cursor-pointer')} onClick={() => {setCurrent(index)
                                            setCategory(item)
                                        }}>{item}</li>
                                    ))}
                    </ul>
                  </div> */}

                  {/* categories */}
                </div>

                <div className="flex-none flex flex-col items-center space-y-1">
                  <div className="w-16 h-12 rounded-xl bg-white dark:bg-gray-800 text-lg text-center py-[10px]">
                    <p className="dark:text-white">{creathedItems.length}</p>
                  </div>
                  <div className="text-white dark:text-gray-800 text-xs">
                    NFT Count
                  </div>
                </div>
              </div>
              <ul className="flex flex-row w-full justify-start border-b border-[#e5e8eb80]">
                {btnCategories.map((item, index) => (
                  <li
                    key={"btn-category" + index.toString()}
                    className={classNames(
                      index === current
                        ? "dark:text-black border-b-2 dark:border-black"
                        : " dark:border-gray-400 dark:bg-white dark:text-gray-800",
                      "text-[16px] font-semibold mr-2 text-[#7a7979] min-w-max px-4 py-1.5 cursor-pointer"
                    )}
                    onClick={() => {
                      setCurrent(index);
                      setCategory(item);
                    }}
                  >
                    <div className="w-full flex flex-row justify-between items-center">
                        <span>{item}</span>
                        {
                            item === "Created" ? 
                            (<span className="ml-3">{creathedItems.length}</span>) : ""
                        }
                    </div>
                  </li>
                ))}
              </ul>

              {/* galleries */}
              {!data.length ? (
                <a className="flex-none text-center text-[#A2A6D0] hover:text-white dark:text-gray-800 dark:hover:text-gray-600">
                  NO NFTs At This Category
                </a>
              ) : (
                <ArtGallery3 galleries={data}></ArtGallery3>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
