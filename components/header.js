import Link from "next/link";
import { Fragment, useState, useContext, useRef, useEffect } from "react";
import { Disclosure, Menu, Transition, Switch } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { faClone } from "@fortawesome/free-regular-svg-icons";
import {
  faMoon,
  faShoppingBag,
  faDollar,
  faCircleUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../pages/_app";
import Web3Provider from "./web3";
import Web3 from "web3";
import { useWeb3 } from "./web3";
import detectEthereumProvider from "@metamask/detect-provider";
import SuccessDialog from "./dialog/success";
import SearchBar from "material-ui-search-bar";
import SideBar from "./explore/sideBar";
import { Drawer } from "@material-ui/core";
// import SearchComponent from 'react-material-ui-searchbar'

// themeMode : true : dark, false : light
export default function Header(props) {
  const [currentPage, setCurrentPage] = useState(props.current);
  const { themeMode, toggleThemeMode } = useContext(ThemeContext);

  const headers = [
    { name: "Explore", href: "/explore " },
    { name: "Categories", href: "/categories" },
    { name: "Create", href: "/create-nft" },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const web3Api = useWeb3();
  console.log(web3Api);

  //Craete function to listen the change in account changed and network changes

  //Create LoadAccounts Function
  const account = web3Api.account;
  const [accountBalance, setAccountBalance] = useState(0);
  const [tokenContract, setTokenContract] = useState(null);
  const [tokenBalance, setTokenBalnce] = useState("0");

  useEffect(async () => {
    //Get Token Contract
    const TokenContractFile = await fetch("/abis/Token.json");
    const convertTokenContractFileToJson = await TokenContractFile.json();
    const tokenAbi = await convertTokenContractFileToJson.abi;
    const loadBalance = async () => {
      if (account) {
        const netWorkId = await web3Api.web3.eth.net.getId();
        const TokenMarketWorkObject =
          convertTokenContractFileToJson.networks[netWorkId];

        const tokenAddress = TokenMarketWorkObject.address;
        console.log("Token Adresss", tokenAddress);
        const deployedTokenContract = await new web3Api.web3.eth.Contract(
          tokenAbi,
          tokenAddress
        );
        setTokenContract(deployedTokenContract);
        console.log("account from index", account);

        const myBalance = await web3Api.web3.eth.getBalance(account);
        const convertBalance = await web3Api.web3.utils.fromWei(
          myBalance,
          "ether"
        );

        setAccountBalance(convertBalance);
        //Start Add Token

        const getTokenBalance = await deployedTokenContract.methods
          .balanceOf(account)
          .call();
        const tokenPriceToWei = Web3.utils.fromWei(getTokenBalance, "ether");
        setTokenBalnce(tokenPriceToWei.toString());
        console.log("my balnce Token  is ", tokenPriceToWei);
        console.log(tokenPriceToWei);
      }
    };

    web3Api && account && loadBalance();
  }, [web3Api.web3, account]);
  //Connect Metamask Wallet
  const connectMetamask = async () => {
    const currentProvider = await detectEthereumProvider();
    console.log("WE ARE IN META MASK CONNECT");
    if (currentProvider) {
      // let web3InstanceCopy = new Web3(currentProvider);
      // setWeb3Instance(web3InstanceCopy);
      if (!window.ethereum.selectedAddress) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      }
      await window.ethereum.enable();
      let currentAddress = window.ethereum.selectedAddress;
      console.log(currentAddress);
      account = currentAddress;
      const web3 = new Web3(currentProvider);
      let amount = await web3.eth.getBalance(currentAddress);
      amount = web3.utils.fromWei(web3.utils.toBN(amount), "ether");
    } else {
      console.log("Please install MetaMask!");
    }
  };
  let [successOpen, setSuccessOpen] = useState(false);
  let [loaderOpen, setLoaderOpen] = useState(false);
  const [showSide, setShowSide] = useState(false);

  const toggleSide = () => {
    setShowSide(!showSide);
  };

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

  useEffect(() => {
    if (account) {
      closeSuccessModal();
    } else {
      openSuccessModal();
    }
  }, [account]);

  return (
    <Disclosure
      as="nav"
      className=" z-[9999] fixed w-full h-[72px] transition-all bg-[#202225] border-b-[1px] border-[#5c5c5e] dark:bg-white dark:border-b dark:border-gray-200"
    >
      {({ open }) => (
        <div className="w-full 2xl:max-w-screen-2xl h-full mx-auto">
          <div className="mx-auto px-6 h-full">
            <div className="relative flex items-center justify-between h-full">
              <div className="absolute inset-y-0 right-0 flex items-center md:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-white dark:text-gray-800 focus:ring-neutral-400 focus:ring-2 focus:ring-inset">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-8 w-8" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-8 w-8" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* <div className=" absolute inset-y-0 right-16 flex items-center cursor-pointer sm:hidden">
                    <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className="w-[22px] h-[22px] dark:text-[#000] text-[#fff]" />
                </div> */}

              <div className="flex-1 flex items-center lg:items-stretch lg:justify-start h-full">
                <div className="flex-none self-center">
                  <Link href="/">
                    <a>
                      <img
                        src={
                          "/assets/png/logo-" +
                          (themeMode ? "dark" : "light") +
                          ".png"
                        }
                        alt="Logo"
                        className="h-16 w-auto"
                      ></img>
                    </a>
                  </Link>
                </div>
                <Drawer open={showSide} anchor="right" onClose={toggleSide}>
                  <SideBar />
                </Drawer>
                {/* <div className="hidden sm:block sm:flex-1 sm:justify-center sm:items-center sm:p-3 sm:mr-12 lg:mr-0">
                  <SearchBar
                    value=""
                    placeholder="Search items, collections, and accounts"
                    className="rounded-lg dark:bg-[#fff] shadow-none bg-[#202225] border-2 text-[#fff] placeholder-white dark:border-[#8a939b] border-[#4c505c] hover:border-[#717882]"
                  />
                </div> */}

                <div className="hidden md:block md:ml-4 flex-1 h-full">
                  <div className="flex lg:space-x-1 xl:space-x-4 h-full">
                    <div className="flex-grow"></div>
                    {/* <div className='flex flex-row justify-center items-center w-[100%]'>
                                        <SearchBar 
                                            value='' 
                                            placeholder='Search items, collections, and accounts' 
                                            className='rounded-lg'
                                        />
                                    </div> */}
                    {/* <SearchComponent /> */}
                    {headers.map((item, index) => (
                      <div
                        key={item.name}
                        className={classNames(
                          "flex items-center ",
                          index === currentPage
                            ? " text-white dark:text-gray-800"
                            : "text-gray-200 dark:text-gray-600",
                          "hover:text-gray-400 dark:hover:text-gray-400 font-bold"
                        )}
                      >
                        {/* <FontAwesomeIcon icon={faDollar}></FontAwesomeIcon> */}
                        <Link href={item.href}>
                          <a
                            className="block px-3 py-2 rounded-md text-[16px] font-semibold"
                            aria-current={
                              index === currentPage ? "page" : undefined
                            }
                            onClick={() => setCurrentPage(index)}
                          >
                            {item.name}
                          </a>
                        </Link>
                      </div>
                    ))}

                    {/* <div className="flex-grow"></div> */}

                    {/* dark or light mode */}
                    <div className="relative grid place-items-center">
                      <Switch
                        checked={themeMode}
                        onChange={toggleThemeMode}
                        className={classNames(
                          themeMode ? "bg-white" : "bg-[#8B8DA1]",
                          "transition duration-150 ease-out relative inline-flex items-center h-6 rounded-full w-12"
                        )}
                      >
                        <div className="absolute left-0 w-1/2 text-[#dbdbdb]">
                          <FontAwesomeIcon icon={faMoon}></FontAwesomeIcon>
                        </div>
                        <span
                          className={classNames(
                            themeMode
                              ? "bg-[#8B8DA1] translate-x-6"
                              : "bg-white translate-x-0",
                            "inline-block w-6 h-6 transform rounded-full transition duration-300"
                          )}
                        />
                      </Switch>
                    </div>

                    {/* <div className='border-r-2 border-[#787984] my-9'>&nbsp;</div> */}

                    {/* account address */}
                    {account ? (
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <Menu.Button className="flex flex-row justify-center items-center w-full h-[100%] px-0 py-2 text-sm font-medium">
                          <div className="flex flex-row space-x-4 px-4">
                            <FontAwesomeIcon
                              icon="fa-regular fa-circle-user"
                              className="w-[27px] h-[27px] text-[#fff] dark:text-[#000]"
                            />
                            {/* <div className="flex w-8 h-8 rounded-full bg-gradient-to-b from-[#FFCC33] to-[#FFA25F]"></div> */}

                            {/* <div className='flex flex-col '>
                                                        <p className='flex-1 text-white dark:text-gray-800 text-sm font-bold '> {account}</p>
                                                        <p className='text-[#7D82B2] dark:text-gray-800 text-xs text-left'>{accountBalance} ETH</p>
                                                        <p className='text-[#7D82B2] dark:text-gray-800 text-xs text-left'>{tokenBalance} Coodes Erc20</p>

                                                    </div> */}
                          </div>
                        </Menu.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 w-80 mt-4 p-8 origin-top-right bg-[#1E1E1E] dark:bg-white divide-y divide-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="flex flex-col space-y-6">
                              <Link href="/account/myProfile">
                                <a>
                                  <Menu.Item>
                                    <div className="flex flex-row space-x-3">
                                      <div className="">
                                        <img src="/assets/svg/brand-metamask.svg"></img>
                                      </div>
                                      <div className="flex-1 flex flex-col">
                                        <p className="flex-1 text-white dark:text-gray-800 text-sm font-bold">
                                          {" "}
                                          Balances{" "}
                                        </p>
                                        <p className="text-[#7D82B2] text-xs text-left">
                                          {accountBalance} ETH
                                        </p>
                                        <p className="text-[#7D82B2] dark:text-gray-800 text-xs text-left">
                                          {tokenBalance} Coodes Erc20
                                        </p>
                                      </div>
                                      <div className="grid place-items-center w-[22px] h-[22px] bg-[#FFCC33] text-[#FAD804] text-xs font-bold rounded-sm">
                                        <FontAwesomeIcon
                                          icon={faCircleUser}
                                        ></FontAwesomeIcon>
                                      </div>
                                    </div>
                                  </Menu.Item>
                                </a>
                              </Link>

                              <div className="border border-[#787984]"></div>

                              <Link href="/market/nft-purchased">
                                <a>
                                  <Menu.Item>
                                    <div className="flex flex-row items-center space-x-4 text-white dark:text-gray-800">
                                      <div className="text-center text-2xl w-6">
                                        <FontAwesomeIcon
                                          icon={faShoppingBag}
                                        ></FontAwesomeIcon>
                                      </div>
                                      <div className="flex-1  text-sm">
                                        NFT Purchased
                                      </div>
                                    </div>
                                  </Menu.Item>
                                </a>
                              </Link>

                              <div className="border border-[#787984]"></div>

                              <Link href="/market/nft-resell">
                                <a>
                                  <Menu.Item>
                                    <div className="flex flex-row items-center space-x-4 text-white dark:text-gray-800">
                                      <div className="text-center text-2xl w-6">
                                        <FontAwesomeIcon
                                          icon={faDollar}
                                        ></FontAwesomeIcon>
                                      </div>
                                      <div className="flex-1 text-sm">
                                        NFT Resell
                                      </div>
                                    </div>
                                  </Menu.Item>
                                </a>
                              </Link>

                              <div className="border border-[#FFFFFF]"></div>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    ) : (
                      <button
                        className="rounded-md bg-gradient-to-b  m-6 from-[#FFBD4A] to-[#FFBD4A] text-black text-base  sm:px-2 shadow-lg"
                        onClick={connectMetamask}
                      >
                        Connect Wallet
                      </button>
                    )}

                    <div className="flex flex-row justify-center items-center h-[100%]">
                        <AccountBalanceWalletOutlinedIcon 
                            onClick={toggleSide} 
                            className="w-[32px] h-[32px] text-[#fff] cursor-pointer dark:text-[#000]"
                        />
                      {/* <FontAwesomeIcon
                        onClick={toggleSide}
                        icon="fa-solid fa-wallet"
                        className="w-[27px] h-[27px] text-[#fff] cursor-pointer dark:text-[#000]"
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button*/}

          <Disclosure.Panel className="lg:hidden bg-[#1E1E1E] dark:bg-white">
            <div className="flex flex-col just space-y-4 p-4">
              {headers.map((item, index) => (
                <div className="flex flex-row">
                  <div className="flex flex-row justify-center items-center">
                    <FontAwesomeIcon icon="fa-thin fa-compass"></FontAwesomeIcon>
                  </div>
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      "flex-1",
                      index === currentPage
                        ? "text-gray-200 dark:text-gray-800"
                        : "text-gray-400 dark:text-gray-600",
                      "hover:text-gray-400 dark:hover:text-gray-400 font-semibold block px-3 py-2 rounded-md text-base"
                    )}
                    aria-current={index === currentPage ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                </div>
              ))}

              {/* dark or light mode */}
              <div className="flex-1 relative grid px-3 py-2">
                <Switch
                  checked={themeMode}
                  onChange={toggleThemeMode}
                  className={classNames(
                    themeMode ? "bg-white" : "bg-[#8B8DA1]",
                    "transition duration-150 ease-out relative inline-flex items-center h-6 rounded-full w-12"
                  )}
                >
                  <div className="absolute left-0 w-1/2 text-[#dbdbdb]">
                    <FontAwesomeIcon icon={faMoon}></FontAwesomeIcon>
                  </div>
                  <span
                    className={classNames(
                      themeMode
                        ? "bg-[#8B8DA1] translate-x-6"
                        : "bg-white translate-x-0",
                      "inline-block w-6 h-6 transform rounded-full transition duration-300"
                    )}
                  />
                </Switch>
              </div>

              {/* account address */}
              {account ? (
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                        <div className="flex flex-row space-x-4">
                          <div className="flex-none w-[32px] h-[32px] mt-[10px] rounded-full bg-gradient-to-b from-[#FFCC33] to-[#FFA25F]"></div>

                          <div className="flex flex-col ">
                            <p className="flex-1 text-white dark:text-gray-800 text-sm font-bold">
                              {account}
                            </p>
                            <p className="text-[#7D82B2] text-xs text-left">
                              {accountBalance} ETH
                            </p>
                            <p className="text-[#7D82B2] dark:text-gray-800 text-xs text-left">
                              {tokenBalance} Coodes Erc20
                            </p>
                          </div>
                        </div>
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        <div className="flex flex-col space-y-6">
                          <Link href="/account/myProfile">
                            <a>
                              <div className="flex flex-row space-x-3">
                                <div className="">
                                  <img src="/assets/svg/brand-metamask.svg"></img>
                                </div>
                                <div className="flex-1 flex flex-col">
                                  <p className="text-[#7D82B2] text-xs text-left">
                                    {accountBalance} ETH
                                  </p>
                                  <p className="text-[#7D82B2] dark:text-gray-800 text-xs text-left">
                                    {tokenBalance} Coodes Erc20
                                  </p>
                                </div>
                                <div className="grid place-items-center w-[22px] h-[22px] bg-[#FFCC33] text-[#FAD804] text-xs font-bold rounded-sm">
                                  <FontAwesomeIcon
                                    icon={faCircleUser}
                                  ></FontAwesomeIcon>
                                </div>
                              </div>
                            </a>
                          </Link>

                          <Link href="/market/nft-purchased">
                            <a>
                              <div className="flex flex-row items-center space-x-4 text-white dark:text-gray-800">
                                <div className="text-center text-2xl w-6">
                                  <FontAwesomeIcon
                                    icon={faShoppingBag}
                                  ></FontAwesomeIcon>
                                </div>
                                <div className="flex-1 text-sm">
                                  NFT Purchased
                                </div>
                              </div>
                            </a>
                          </Link>

                          <Link href="/market/nft-resell">
                            <a>
                              <div className="flex flex-row items-center space-x-4 text-white dark:text-gray-800">
                                <div className="text-center text-2xl w-6">
                                  <FontAwesomeIcon
                                    icon={faDollar}
                                  ></FontAwesomeIcon>
                                </div>
                                <div className="flex-1 text-sm">NFT Resell</div>
                              </div>
                            </a>
                          </Link>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ) : (
                ""
              )}
            </div>
          </Disclosure.Panel>

          <SuccessDialog
            show={successOpen}
            closeSuccessModal={closeSuccessModal}
          >
            {{
              msg: "PLease Connect MetaMask With Roposten NetWork",
              title: "Attention",
              buttonTitle: "Cancel",
            }}
          </SuccessDialog>
        </div>
      )}
    </Disclosure>
  );
}
