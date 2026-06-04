import { NseIndia } from 'stock-nse-india';

const nse = new NseIndia();

async function test() {
  try {
    console.log("Fetching all indices...");
    const indicesData = await nse.getAllIndices();
    console.log("Success! Data length:", indicesData?.data?.length);
    console.log(indicesData?.data?.slice(0, 2));
  } catch (err) {
    console.error("Failed to fetch NSE indices:", err);
  }
}

test();
