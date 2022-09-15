import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

export default function ArtGallery3(props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {props.galleries.map((item, index) => (
        <div
          key={item.itemId}
          className="group w-full h-auto grid grid-cols-1 cursor-pointer overflow-hidden bg-[#353840] dark:bg-white rounded-lg text-white dark:text-gray-800 dark:shadow-lg"
        >
          <div className="grid grid-cols-1 gap-2 p-4">
            <div className="bg-white rounded-lg overflow-hidden w-full h-[400px] sm:h-[200px] ">
              <Link
                href={{
                  pathname: `/market/${item.tokenId}/`,
                  query: {
                    id: `${item.itemId}`,
                  },
                }}
              >
                <img
                  onClick={() =>
                    props.refresh
                      ? props.refresh(item.tokenId, item.itemId)
                      : ""
                  }
                  src={item.image}
                  alt={item.name}
                  className="cursor-pointer w-full h-full transition-all duration-500 group-hover:scale-125"
                ></img>
              </Link>
            </div>
            <div className="flex flex-row">
              <h1 className="flex-grow text-base">{item.name}</h1>
            </div>
            <p className="text-[#A2A6D0] text-sm">{item.category}</p>
            <div className="flex flex-row">
              <div className="rounded-full w-[1.5rem] text-center bg-[#FFCC33] text-white">
                <img
                  src="/assets/coin.png"
                  alt="coin icon"
                  className="max-w-full"
                />
              </div>
              <h1 className="flex-grow text-[#FFCC33] text-base ml-2">
                {item.price} Token
              </h1>
            </div>
            <p className="text-sm truncate ...">{item.creator}</p>
            <p className="text-[#A2A6D0] text-xs">creator</p>
          </div>
        </div>
      ))}
    </div>
  );
}
