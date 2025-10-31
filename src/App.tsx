import { useEffect, useMemo, useState, useRef } from "react";
import { ProductCard } from "./components/product-card";
import { LoadingOverlay } from "./components/loader";
import { PriceLoader } from "./components/price-loader";
import { DATA_SHEET_URL, keyMapper, type SheetRow } from "./utils";

const transformSheetData = (values: string[][]): SheetRow[] => {
  if (!values || values.length === 0) return [];
  const [headers, ...rows] = values;

  return rows.map((row) => {
    const obj = {} as SheetRow;

    headers.forEach((header, i) => {
      const cleanHeader = header.trim().toUpperCase();
      const key = keyMapper[cleanHeader];
      if (key) obj[key] = row[i] ?? "";
    });

    return obj;
  });
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [sheetData, setSheetData] = useState<SheetRow[]>([]);

  const overviewRef = useRef<HTMLDivElement | null>(null);
  const clearanceRef = useRef<HTMLDivElement | null>(null);
  const productsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchDataFromSheet = async () => {
      setLoading(true);

      try {
        const res = await fetch(DATA_SHEET_URL);
        const json = await res.json();

        setSheetData(transformSheetData(json.values || []));
      } catch {
        setSheetData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDataFromSheet();
  }, []);

  const clearanceSaleProducts = useMemo(
    () => sheetData.filter((data) => Number(data.daysOfCover) <= 7),
    [sheetData]
  );

  const productsToDisplay = useMemo(
    () => sheetData.filter((data) => Number(data.daysOfCover) > 7),
    [sheetData]
  );

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 relative">
      {loading && <LoadingOverlay text="Loading" />}
      {priceLoading && <PriceLoader />}

      <header className="backdrop-blur-md bg-white/70 border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <h1 className="text-[20px] font-semibold tracking-tight">
          Dynamic Pricing AI
        </h1>
      </header>

      {Boolean(clearanceSaleProducts.length) && (
        <section
          className="relative w-full h-[70vh] flex items-center justify-center text-center text-white"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative z-10 max-w-2xl px-6">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Massive Clearance Sale is Live!
            </h2>
            <p className="text-gray-200 text-lg mb-6">
              Save big on top products — limited stock, exclusive deals, and
              huge discounts you can’t miss!
            </p>
            <a
              onClick={(e) => {
                e.preventDefault();
                clearanceRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="mt-auto w-full bg-gray-900 text-white text-md py-3 rounded-lg font-semibold tracking-tight hover:bg-black transition-all active:scale-[0.98] cursor-pointer p-4"
            >
              Shop Clearance
            </a>
          </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        <section ref={overviewRef} id="overview" className="scroll-mt-24">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Inventory Overview
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Smart pricing recommendations powered by real-time demand and
              stock insights.
            </p>
          </div>
        </section>

        {Boolean(clearanceSaleProducts.length) && (
          <section
            ref={clearanceRef}
            id="clearance"
            className="scroll-mt-24 mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-[18px] w-[3px] bg-rose-500 rounded-full" />
              <h3 className="text-lg font-medium tracking-tight text-rose-600">
                Clearance
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {clearanceSaleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  sheetData={sheetData}
                  setSheetData={setSheetData}
                  setPriceLoading={setPriceLoading}
                />
              ))}
            </div>
          </section>
        )}

        {Boolean(productsToDisplay.length) && (
          <section ref={productsRef} id="products" className="scroll-mt-24">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-[18px] w-[3px] bg-gray-900 rounded-full" />
              <h3 className="text-lg font-medium tracking-tight">
                All Products
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {productsToDisplay.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  sheetData={sheetData}
                  setSheetData={setSheetData}
                  setPriceLoading={setPriceLoading}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
