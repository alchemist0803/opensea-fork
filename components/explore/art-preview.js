
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'

import {
    FacebookShareCount,
    HatenaShareCount,
    OKShareCount,
    PinterestShareCount,
    RedditShareCount,
    TumblrShareCount,
    VKShareCount
  } from "react-share";
export default function ArtPreview (props) {
    return (
        <div className='flex flex-col lg:flex-row items-center space-x-0 space-y-8 lg:space-x-8 lg:space-y-0 bg-[#1E1E1E] border-[1px] border-[#1E1E1E] dark:bg-white dark:border-gray-200 rounded-md p-6'>
            <div className='flex-none w-full lg:w-[30%]'>
                <img src={props.children.item.image} className='w-full'></img>
            </div>

            <div className='flex-1 w-full flex flex-col lg:flex-row space-x-0 space-y-8 lg:space-x-8 lg:space-y-0'>
                <div className='flex-grow text-white dark:text-gray-800'>
                    <h1 className='text-4xl font-bold leading-normal'>{props.children.item.name}</h1>

                    <h4 className='text-[#6C71AD] text-2xl'>{props.children.item.category}</h4>

                    <p className='text-[#B4BAEF] dark:text-gray-600 text-base my-6'>{props.children.item.description}</p>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                        <div className='flex-1 flex flex-col space-y-6'>
                            <div className='flex flex-row space-x-4'>
                                <div className='flex-none w-14 h-14 rounded-full bg-gradient-to-b from-[#FFCC33] to-[#FFA25F]'></div>
                                <div className='flex-1 flex flex-col text-ellipsis overflow-hidden'>
                                    <p className='text-[#7D82B2] dark:text-gray-800 text-base'>Sell By</p>
                                    <p className='text-white dark:text-gray-500 text-base font-bold text-ellipsis overflow-hidden whitespace-nowrap'>{props.children.item.seller}</p>
                                </div>
                            </div>

                            {props.children.item.sold?"":      <button className='rounded-xl bg-[#2081e2] text-white text-xs sm:text-base px-6 sm:px-10 py-3.5 sm:py-4 font-semibold shadow-lg' onClick={()=>props.children.buyFunction(props.children.item)}>Buy now</button>
}

                        </div>
                        
                        <div className='flex-1 flex flex-col space-y-6'>
                            <div className='flex flex-row space-x-4'>
                                <div className='flex-none w-14 h-14 rounded-full bg-gradient-to-b from-[#FFCC33] to-[#FFA25F]'></div>
                                <div className='flex flex-col text-ellipsis overflow-hidden'>
                                    <p className='text-[#7D82B2] dark:text-gray-800 text-base'>Created By</p>
                                    <p className='text-white dark:text-gray-500 text-base font-bold text-ellipsis overflow-hidden whitespace-nowrap'>{props.children.item.creator}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className='flex-none items-start'>
                    <div className='flex flex-row'>
                        <div className="rounded-full w-[1.5rem] text-center bg-[#FFCC33] text-white">
                        <img src="/assets/coin.png" alt="coin icon" className='max-w-full' />
                        </div>
                        <h1 className="flex-grow text-[#FFCC33] text-base ml-2">{props.children.item.price} Token</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}