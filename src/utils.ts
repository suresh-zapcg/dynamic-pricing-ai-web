export interface SheetRow {
  id: string;
  url: string;
  imageUrl: string;
  price: string;
  stock: string;
  minPrice: string;
  maxPrice: string;
  category: string;
  color: string;
  material: string;
  avgDailySales: string;
  recommendedPrice: string;
  daysOfCover: string;
  aiRecommendedPrice?: string;
}

export const keyMapper: Record<string, keyof SheetRow> = {
  ID: "id",
  URL: "url",
  "IMAGE URL": "imageUrl",
  PRICE: "price",
  STOCK: "stock",
  MINPRICE: "minPrice",
  MAXPRICE: "maxPrice",
  CATEGORY: "category",
  COLOR: "color",
  MATERIAL: "material",
  AVG_DAILY_SALES: "avgDailySales",
  "RECM-PRICE": "recommendedPrice",
  "DAYS OF COVER": "daysOfCover",
};

type PriceDiff = {
  text: string;
  colorClass: string;
};

export function getPriceDiff(currentPrice: number, aiPrice: number): PriceDiff {
  const diff = aiPrice - currentPrice;
  const percentDiff = ((diff / currentPrice) * 100).toFixed(1);

  let colorClass = "text-yellow-500";
  if (diff > 0) colorClass = "text-green-500";
  else if (diff < 0) colorClass = "text-red-500";

  return {
    text: diff !== 0 ? `${percentDiff}%` : "0%",
    colorClass,
  };
}

export const DATA_SHEET_URL =
  "https://sheets.googleapis.com/v4/spreadsheets/1HwtdqC20xLjX4yfu4NFJKw7NS6s8o3yhWOAIqK7uTHQ/values/Sheet1!A:M?key=AIzaSyBw-3KNuTQKzk5x-SnWplWUIoW98tHjGKY";

export const PRICE_API_URL =
  "https://2f90ae8395b7.ngrok-free.app/webhook/82d157ef-2aec-4cdc-82ba-37e79b59a74e";
