import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import InputDialog from "../dialog/input";
import LoaderDialog from "../dialog/loader";
import SuccessDialog from "../dialog/success";
import { useState, useEffect } from "react";

export default function ArtGallery6(props) {
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
    closePriceModal();
    setLoaderOpen(true);

    setTimeout(purchaseSuccesss, 1000);
  }

  function closeSuccessModal() {
    closePriceModal();
    closeLoaderModal();
    setSuccessOpen(false);
  }

  function openSuccessModal() {
    setSuccessOpen(true);
  }

  function purchaseSuccesss() {
    closeLoaderModal();
    openSuccessModal();
  }
  return (
    <div className="w-full h-auto cursor-pointer">
      <div
        key={props.gallery.itemId}
        className="w-full h-auto overflow-hidden grid grid-cols-1 bg-[#1E1E1E] dark:bg-white rounded-2xl text-white dark:text-gray-800 shadow-md"
      >
        <div className="flex flex-col">
          <div className=" relative bg-white rounded-t-xl h-0 pt-[80%] overflow-hidden">
            <Link
              href={{
                pathname: `/market/${props.gallery.tokenId}/`,
                query: {
                  id: `${props.gallery.itemId}`,
                },
              }}
            >
              <img
                src={props.gallery.image}
                alt={props.gallery.name}
                className=" absolute top-0 w-full h-full object-cover"
              ></img>
            </Link>
          </div>
          <div className="flex flex-row justify-between items-center p-4">
            <div className="flex flex-row h-full justify-start items-center">
              <div className="overflow-hidden p-1 mr-4">
                <img
                  src={props.gallery.image}
                  alt={props.gallery.name}
                  className="w-[50px] h-[50px] rounded-full"
                />
              </div>
              <div className="flex flex-col justify-between h-full items-start">
                <p className=" font-bold">{props.gallery.name}</p>
                <p className=" text-[#2081E2]">{props.gallery.category}</p>
              </div>
            </div>
            <div className="flex flex-row justify-center items-center">
              <FontAwesomeIcon
                icon="fa-solid fa-circle-info"
                className="w-[20px] h-[20px]"
              />
            </div>
          </div>
        </div>

        {/* price input dialog  */}
      </div>

      {/* loader dialog  */}
      <LoaderDialog
        show={loaderOpen}
        openLoaderModal={openLoaderModal}
      ></LoaderDialog>

      {/* success dialog  */}
      <SuccessDialog show={successOpen} closeSuccessModal={closeSuccessModal}>
        {{ msg: "", title: "", buttonTitle: "" }}
      </SuccessDialog>
    </div>
  );
}
