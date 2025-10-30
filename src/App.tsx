import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ProductCard } from "./components/product-card";
import { LoadingOverlay } from "./components/loader";
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
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [sheetData, setSheetData] = useState<SheetRow[]>([]);

  const activeSection = useRef<string>("");
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

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "/", ref: overviewRef },
        { id: "/clearance", ref: clearanceRef },
        { id: "/products", ref: productsRef },
      ];
      const offset = window.innerHeight * 0.4;
      const current = sections.find((section) => {
        const el = section.ref.current;
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= offset && rect.bottom >= offset;
      });

      if (current && current.id !== activeSection.current) {
        activeSection.current = current.id;
        window.history.replaceState(null, "", current.id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (location.pathname === "/") scrollTo(overviewRef);
    if (location.pathname === "/clearance") scrollTo(clearanceRef);
    if (location.pathname === "/products") scrollTo(productsRef);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 relative">
      {loading && <LoadingOverlay text="Loading" />}
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
              "url('https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=1600&q=80')",
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
              Grab your favorite items before and Save big on limited stock
              items — exclusive discounts before they’re gone. Don’t miss the
              best deals of the season!
            </p>
            <a
              href="#clearance"
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
              Smart pricing recommendations based on stock & demand signals.
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
                <ProductCard key={product.id} product={product} />
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
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
