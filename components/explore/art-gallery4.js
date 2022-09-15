import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import InputDialog from '../../components/dialog/input'
import LoaderDialog from '../../components/dialog/loader'
import SuccessDialog from '../../components/dialog/success'
import { useState,useEffect } from 'react'

export default function ArtGallery4(props) {


let [priceOpen, setPriceOpen] = useState(false)
let [loaderOpen, setLoaderOpen] = useState(false)
let [successOpen, setSuccessOpen] = useState(false)    

function closePriceModal() {
    
    setPriceOpen(false)
}

function openPriceModal() {
    setPriceOpen(true)
}

function closeLoaderModal() {
    setLoaderOpen(false)
}

function openLoaderModal() {
    closePriceModal()
    setLoaderOpen(true)

    setTimeout(purchaseSuccesss, 1000)
}

function closeSuccessModal() {
    closePriceModal()
    closeLoaderModal()
    setSuccessOpen(false)
}

function openSuccessModal() {
    setSuccessOpen(true)
}

function purchaseSuccesss() {
    closeLoaderModal()
    openSuccessModal()
}
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            {props.galleries.map((item, index) => (
                 <div key={item.itemId} className='w-full h-auto grid grid-cols-1 bg-[#1E1E1E] border-2 border-[#1E1E1E] dark:bg-white rounded-2xl text-white dark:text-gray-800 dark:border-2 dark:border-gray-200'>
                    <div className='grid grid-cols-1 gap-2 p-4'>
                        <div className='bg-white rounded-xl'>
                        <Link href={{
                            pathname:`/market/${item.tokenId}/`,
                            query: {
                                id: `${item.itemId}`,
                               
                            }
                                }}>
                            <img src={item.image} alt={item.name} className='w-full h-auto'></img>
                            </Link>
                        </div>
                        <div className='flex flex-row'>
                            <h1 className="flex-grow text-base">{item.name}</h1>
                            <Link href={{
                            pathname:`/market/${item.tokenId}/`,
                            query: {
                                id: `${item.itemId}`,
                               
                            }
                                }}>
                            <button className="rounded-full border-2 border-[#FFCC33] dark:border-0 dark:bg-[#FFCC33] w-[1.75rem] h-[1.75rem] text-white">
                        
                                <FontAwesomeIcon icon={faAngleRight} className="" />
                              
                            </button>
                            </Link>
                        </div>
                        <p className="text-[#A2A6D0] text-sm">{item.category}</p>
                        <div className='flex flex-row py-4'>
                            <div className="rounded-full w-[1.5rem] text-center bg-[#FFCC33] text-white">
                                <img src="/assets/coin.png" alt="coin icon" className='max-w-full' />
                            </div>
                            <h1 className="flex-grow text-[#FFCC33] text-base ml-2">{item.price } Token</h1>
                        </div>
                        <p className="text-sm truncate ... ">{item.creator} </p>
                        <p className="text-[#A2A6D0] text-xs">Creator</p>
                    </div>                            
                    
                    <div className="border-t-2 border-[#FFCC33] dark:border-gray-200 p-4">
                        <button className='rounded-full bg-gradient-to-b from-[#1E1E1E] to-[#1E1E1E] text-black text-base w-full px-4 py-2 shadow-md' onClick={openPriceModal}>⚡ {item.buttonTitle}</button>
                    </div>

                       {/* price input dialog  */}
       <InputDialog show={priceOpen} openPriceModal={openPriceModal} closePriceModal={closePriceModal} purchasingNft={openLoaderModal}>{{resellFucnction:props.children.resellFucnction,item:item}}</InputDialog>

                </div>
                
            ))}

{/* loader dialog  */}
<LoaderDialog show={loaderOpen} openLoaderModal={openLoaderModal}></LoaderDialog>

{/* success dialog  */}
{/* <SuccessDialog show={successOpen} closeSuccessModal={closeSuccessModal}>{{msg:"",title:"",buttonTitle:""}}</SuccessDialog> */}

        </div>

        
    )
}