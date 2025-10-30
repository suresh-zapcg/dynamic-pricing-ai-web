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

export const DATA_SHEET_URL =
  "https://sheets.googleapis.com/v4/spreadsheets/1HwtdqC20xLjX4yfu4NFJKw7NS6s8o3yhWOAIqK7uTHQ/values/Sheet1!A:M?key=AIzaSyBw-3KNuTQKzk5x-SnWplWUIoW98tHjGKY";
