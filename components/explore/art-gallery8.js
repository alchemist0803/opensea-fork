import Link from "next/link";

export default function ArtGallery8(props) {
  const images = {
    "ART": "https://opensea.io/static/images/categories/art.png",
    "COLLECTIBLES": "https://opensea.io/static/images/categories/collectibles.png",
    "PHOTOGRAPHY": "https://opensea.io/static/images/categories/photography-category.png",
    "SPORT": "https://opensea.io/static/images/categories/sports.png",
    "TRADING CARDS": "https://opensea.io/static/images/categories/trading-cards.png",
    "UTILITY": "https://opensea.io/static/images/categories/utility.png",
    "VIRTUAL WORLDS": "https://opensea.io/static/images/categories/virtual-worlds.png"
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
      {props.categories.map((item, index) => {
        if (item !== "ALL") {
          return (
          <Link
          href={{
            pathname: `/categories`,
          }}
        >
          <div
            key={index}
            className="w-full h-auto overflow-hidden cursor-pointer grid grid-cols-1 bg-[#1E1E1E] dark:bg-white rounded-lg text-white dark:text-gray-800 shadow-md"
          >
          <div className="w-full h-0 pt-[60%] relative">
          <img
                  src={images[item]}
                  alt={item}
                  className="absolute top-0 w-full h-full object-cover"
                ></img>
          </div>
          
            <div className="flex flex-col h-auto">
              <div className="flex flex-row justify-center items-center p-4">
                    <p className=" font-bold">{item}</p>
              </div>
            </div>

            {/* price input dialog  */}
          </div>
        </Link>
        )
        }
      })}
    </div>
  );
}
