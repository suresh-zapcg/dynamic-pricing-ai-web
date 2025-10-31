import { getPriceDiff, PRICE_API_URL, type SheetRow } from "../utils";

export function ProductCard({
  product,
  sheetData,
  setSheetData,
  setPriceLoading,
}: {
  product: SheetRow;
  sheetData: SheetRow[];
  setSheetData: (data: SheetRow[]) => void;
  setPriceLoading: (loading: boolean) => void;
}) {
  const fewStocks =
    Number(product.daysOfCover) >= 8 && Number(product.daysOfCover) <= 15;

  const status =
    Number(product.daysOfCover) <= 7
      ? "Clearance"
      : fewStocks
      ? "Only Few Left"
      : "";

  const handleOnApplyAiPricing = () => {
    setPriceLoading(true);
    fetch(PRICE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ID: product.id,
        URL: product.url,
        IMAGE_URL: product.imageUrl,
        PRICE: product.price,
        STOCK: product.stock,
        MINPRICE: product.minPrice,
        MAXPRICE: product.maxPrice,
        CATEGORY: product.category,
        COLOR: product.color,
        MATERIAL: product.material,
        AVG_DAILY_SALES: product.avgDailySales,
        RECOMMENDED_PRICE: product.recommendedPrice,
        DAYS_OF_COVER: product.daysOfCover,
      }),
    })
      .then(async (res) => {
        const aiRecommendedPrice = await res.json();
        const newData = JSON.parse(JSON.stringify(sheetData)) as SheetRow[];

        const productIndex = newData.findIndex(
          (item) => item.id === product.id
        );

        if (productIndex !== -1) {
          newData[productIndex].aiRecommendedPrice = aiRecommendedPrice;
          setSheetData(newData);
        }
      })
      .catch((err) => {
        console.error("Error applying AI pricing:", err);
      })
      .finally(() => {
        setPriceLoading(false);
      });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col shadow-sm hover:shadow-md transition-all hover:-translate-y-[2px]">
      <div className="rounded-lg overflow-hidden mb-3">
        <img
          alt="product-image"
          className="w-full h-60 object-cover"
          src={product.imageUrl}
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[16px] truncate tracking-tight text-gray-900">
          {product.category}
        </h3>

        {status && (
          <span className="flex items-center gap-1 text-[12px] font-medium text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
            <span
              className={`h-2 w-2 rounded-full ${
                status === "Clearance" ? "bg-rose-500" : "bg-amber-500"
              }`}
            />
            {status}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {product.material.split(",").map((tag: string, index: number) => (
          <span
            key={index}
            className="text-[12px] bg-gray-100 text-gray-700 px-2 py-[3px] rounded-full"
          >
            {tag.trim()}
          </span>
        ))}
      </div>

      <div className="text-[14.5px] mb-4 space-y-2">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-gray-600">
            <span className="font-medium">Current Price</span>
            <span className="font-semibold text-gray-900">
              ₹{product.price}
            </span>
          </div>

          <div className="flex justify-between items-center text-gray-600">
            <span className="font-medium">AI Recommended Price</span>
            {product.aiRecommendedPrice && (
              <div className="flex items-center gap-2">
                {(() => {
                  const { text, colorClass } = getPriceDiff(
                    Number(product.price),
                    Number(product.aiRecommendedPrice)
                  );
                  return (
                    <span className={`${colorClass} text-sm font-semibold`}>
                      {text}
                    </span>
                  );
                })()}
                <span className="font-semibold text-gray-900">
                  ₹{product.aiRecommendedPrice}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between text-gray-600 mt-4">
          <span className="font-medium">Range</span>
          <span className="font-semibold text-gray-900">
            ₹{product.minPrice} - ₹{product.maxPrice}
          </span>
        </div>
        {/* <div className="flex justify-between text-gray-600">
          <span className="font-medium">Stock</span>
          <span className="font-semibold text-gray-900">
            {product.stock} units
          </span>
        </div> */}
      </div>

      <button
        className="mt-auto w-full py-3 rounded-lg font-semibold text-[14px] tracking-tight transition-all active:scale-[0.98] 
    bg-gray-900 text-white hover:bg-black 
    disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
        onClick={handleOnApplyAiPricing}
        disabled={!!product.aiRecommendedPrice}
      >
        Apply AI Pricing
      </button>
    </div>
  );
}
