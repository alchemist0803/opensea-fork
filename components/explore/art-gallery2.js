import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

export default function ArtGallery2(props) {
    const style = props.bgColor ? `group w-full h-auto grid grid-cols-1 cursor-pointer overflow-hidden bg-[${props.bgColor}] dark:bg-white rounded-lg text-white dark:text-gray-800 dark:shadow-lg`
    : "group w-full h-auto grid grid-cols-1 cursor-pointer overflow-hidden bg-[#353840] dark:bg-white rounded-lg text-white dark:text-gray-800 dark:shadow-lg"
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {props.galleries.map((item, index) => (
        <div
          key={item.artId}
          className={style}
        >
          <div className="grid grid-cols-1 gap-2 pb-0">
            <div className="bg-white overflow-hidden w-full relative h-0 pt-[100%] ">
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
                  className="cursor-pointer absolute top-0 w-full h-full transition-all duration-500 group-hover:scale-125"
                ></img>
              </Link>
            </div>
            <Link
              href={{
                pathname: `/market/${item.tokenId}/`,
                query: {
                  id: `${item.itemId}`,
                },
              }}
            >
                <div className="flex flex-row px-4">
                    <h1 className="flex-grow font-semibold text-[14px] text-[#04111d]">{item.name}</h1>
                </div>
            </Link>
            <Link
              href={{
                pathname: `/market/${item.tokenId}/`,
                query: {
                  id: `${item.itemId}`,
                },
              }}
            >
                <div className="flex flex-col items-start px-4">
                <div className=" font-semibold text-[12px]">Price</div>
                <div className="flex flex-row justify-start items-center">
                <img
                    className="w-[16px] h-[16px] mr-1 brightness-200 dark:brightness-100"
                    src="https://static.opensea.io/general/ETH.svg"
                ></img>
                <div className="flex-grow font-semibold overflow-hidden text-ellipsis">
                  {item.price}
                </div>
              </div>
                </div>
              
            </Link>
            <Link href={`/account/${item.creator}`}>
              <a className="text-sm px-4 truncate ...">{item.creator}</a>
            </Link>
          </div>

          <div className="w-[100%] h-[40px]">
            {item.sold ? (
              ""
            ) : (
              <button
                className="bg-[#2081E2] w-full py-2 transition-all duration-300 transform translate-y-10 group-hover:translate-y-2 text-white text-[12px] rounded-b-lg"
                onClick={() => props.children.buyFunction(item)}
              >
                {item.buttonTitle}{" "}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
