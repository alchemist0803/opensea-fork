import Link from "next/link"
import ArtGallery6 from "../explore/art-gallery6"
export default function Paragraph1() {
    const galleries = {
        itemId: 12,
        tokenId: 12,
        image: "https://mrbebo.infura-ipfs.io/ipfs/QmZ5Zn4XLo5naMKPT8WFuL488a7NH5jMpyUYBvzTwbnDXc",
        name: "Labore eveniet tota",
        category: "COLLECTIBLES",
        price: 33
    }
    const customClass = "flex flex-col space-y-8 md:flex-row md:space-y-0 md:items-center m-4 sm:mx-12 bg-[url('https://lh3.googleusercontent.com/dXecuSgwiewetA_zRXBp5chv7-8fY9r8vUtW_vP09DL-bh87VeGfwuHVQFxMwfuoETElXoU7ny3qzXLPNvznog7AIEz74LZ0wxcj5II=s250')]";
    const title = "Create your ERC20 Token Discover, Collect, and Sell Extraordinary NFTs with Tokens"
    const description = " first and largest NFT marketplace work with your Custom token like BUSD or USDT"

    return (
        <div className=' flex flex-col space-y-8 md:flex-row md:space-y-0 md:items-center m-12 my-16'>
            {/* left element */}
            <div className=' absolute left-0 top-0 w-full h-full z-10 opacity-30 blur gradient-mask-b-0 bg-[#fff] bg-cover bg-center-center bg-[url("https://mrbebo.infura-ipfs.io/ipfs/QmZ5Zn4XLo5naMKPT8WFuL488a7NH5jMpyUYBvzTwbnDXc")]'></div>
            <div className='flex-1 flex flex-col items-center md:items-start z-20'>
                <h1 className='text-white dark:text-gray-800 text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold leading-tight'>{title}</h1>
                <p className='text-[#8a939b] text-base leading-tight mt-2 sm:mt-6'>{description}</p>
                <div className='flex-1 flex flex-row gap-4 mt-[4vw]'>
                    <div className=''>
                    <Link href="./categories">

                        <button className='rounded-xl bg-[#2081e2] text-white text-xs sm:text-base px-6 sm:px-10 py-3.5 sm:py-4 font-semibold shadow-lg'>Collection</button>
                    </Link>
                    </div>
                    <div>
                    <Link href="./create-nft">
                        <button className='rounded-xl bg-[#353840] text-white dark:bg-white dark:text-[#2081e2] dark:border-solid dark:border-[1px] dark:border-[#e5e8eb] text-xs sm:text-base px-6 sm:px-10 py-3.5 sm:py-4 font-semibold dark:border-gray-300 shadow-lg'>Create NFT</button>
                   </Link>
                    </div>
                </div>
            </div>

            {/* right element : background image */}
            <div className='flex-1 flex items-center z-20 mr-4'>
                <ArtGallery6 gallery={galleries}></ArtGallery6>
                {/* <img src="/assets/svg/head.svg" alt="BgEthereumNFT" className='w-full h-auto object-cover'></img> */}
            </div>
        </div>
    )
}