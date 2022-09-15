import Link from "next/link";

export default function ArtGallery1(props) {
  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {props.galleries.map((item, index) => (
        <Link
          href={{
            pathname: `/market/${item.tokenId}/`,
            query: {
              id: `${item.itemId}`,
            },
          }}
        >
          <div
            key={item.itemId}
            className="relative w-full cursor-pointer h-auto overflow-hidden bg-[#1E1E1E] dark:bg-white grid grid-cols-1 justify-items-center text-center text-white border-2 border-[#1E1E1E] dark:text-gray-800 dark:border-2 dark:border-gray-200 bg-black dark:bg-white rounded-xl"
          >
            <div className="absolute left-4 bottom-3 h-[60px] w-[60px] p-1 bg-black dark:bg-white rounded-md">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full rounded-lg"
              ></img>
            </div>
            <h1 className=" absolute left-[90px] min-w-max bottom-[20px] text-sm sm:text-md xl:text-lg">
              {item.name}
            </h1>

            <img
              src={item.image}
              alt={item.name}
              className="object-fill h-[50vw] w-[100%] sm:h-[30vw] sm:w-100 md:h-[20vw]"
            ></img>
            <div className=" w-full overflow-hidden h-[60px] bg-black dark:bg-white"></div>
          </div>
        </Link>
      ))}
    </div>
  );
}
