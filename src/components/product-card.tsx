import type { SheetRow } from "../utils";

export function ProductCard({ product }: { product: SheetRow }) {
  const fewStocks =
    Number(product.daysOfCover) >= 8 && Number(product.daysOfCover) <= 15;

  const status =
    Number(product.daysOfCover) <= 7
      ? "Clearance"
      : fewStocks
      ? "Only Few Left"
      : "";

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
        <div className="flex justify-between text-gray-600">
          <span className="font-medium">Current Price</span>
          <span className="font-semibold text-gray-900">${product.price}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span className="font-medium">Range</span>
          <span className="font-semibold text-gray-900">
            ${product.minPrice} - ${product.maxPrice}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span className="font-medium">Stock</span>
          <span className="font-semibold text-gray-900">
            {product.stock} units
          </span>
        </div>
      </div>

      <button className="mt-auto w-full bg-gray-900 text-white py-3 rounded-lg font-semibold text-[14px] tracking-tight hover:bg-black transition-all active:scale-[0.98] cursor-pointer">
        Apply AI Pricing
      </button>
    </div>
  );
}
