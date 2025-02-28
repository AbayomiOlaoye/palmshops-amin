import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { MdArrowBack } from "react-icons/md";
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";
import Top from "../Dashboard/Top";

const StockInfo = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { harvested } = useSelector((state) => state?.harvest);
  const { farms } = useSelector((state) => state?.farm);
  const [stockData, setStockData] = useState({});

  const handleGoBack = () => {
    window.history.back();
  }

  useEffect(() => {
    const inventories = [...farms, ...harvested];
    const stock = inventories.find((item) => item._id === id);
    setStockData(stock);
    setIsLoading(false);
  }, [id, farms, harvested]);

  const getDate = (order) => {
    const date = new Date(order);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  const [latitude, longitude] = stockData?.geolocation?.coordinates || [];

  const latDirection = latitude >= 0 ? "N" : "S";
  const lonDirection = longitude >= 0 ? "E" : "W";

  const absLatitude = Math.abs(latitude);
  const absLongitude = Math.abs(longitude);

  const calculateTotal = () => {
    const total = stockData?.pricePerUnit * (stockData?.availableQty || stockData?.expectedYield);
    return total.toLocaleString();
  }

  return (
    <motion.section className="max-w-full"
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
    >
      <Top title="Palm Track" text="Manage and Monitor Farmers' Inventories" />
      <section className="user">
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Stock Information</span>
          </motion.article>
        </div>
        <div className="userContainer grid lg:grid-cols-1 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <div className="userShow">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="userInfo flex flex-col gap-4">
                <div className="work flex flex-col gap-1">
                  <h3 className="font-bold">Farmer&apos;s Data</h3>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Name:</span>
                    <span className="capitalize">{stockData?.userId?.name}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Phone Number:</span>
                    <span className="capitalize">{stockData?.userId?.phone}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Email:</span>
                    <span className="capitalize">{stockData?.userId?.email ? stockData?.userId?.email : 'Nil' }</span>
                  </div>
                </div>
                <div className="work flex flex-col gap-1">
                  <h3 className="font-bold">Location Information</h3>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Address:</span>
                    <span className="capitalize">{stockData?.address}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">LG Area:</span>
                    <span className="capitalize">{stockData?.lga}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">State:</span>
                    <span className="capitalize">{stockData?.state}</span>
                  </div>
                  <div className="info flex gap-24">
                    <span className="w-[150px]">Coordinates:</span>
                    <span className="capitalize">{`${absLatitude}° ${latDirection}, ${absLongitude}° ${lonDirection}` }</span>
                  </div>
                  <div className="info flex gap-24 mb-4">
                    <span className="w-[150px]">View on Map:</span>
                    <a
                      href={`https://www.google.com/maps?q=${absLatitude}°${latDirection},${absLongitude}°${lonDirection}`}
                      target="_blank"
                      className="capitalize underline cursor-pointer text-ek-green font-bold"
                    >
                      Click here
                    </a>
                  </div>
                </div>
                <div className="work flex gap-6 items-center">
                  <div className="info flex flex-col gap-2">
                    <h3 className="font-bold">Crop/Product Information</h3>
                    <div className="info flex gap-24">
                      <span className="w-[150px]">Type:</span>
                      <span className="capitalize">{stockData?.productName ? 'Crops (Harvested)' : 'Crops (On-Farm)'}</span>
                    </div>
                    {stockData?.productName && (
                      <div className="info flex gap-24">
                        <span className="w-[150px]">Name:</span>
                        <span className="capitalize">{stockData?.productName}</span>
                      </div>
                    )}
                    {stockData?.cropPlanted && (
                      <div className="info flex gap-24">
                        <span className="w-[150px]">Name:</span>
                        <span className="capitalize">{stockData?.cropPlanted}</span>
                      </div>
                    )}
                    <div className="info flex gap-24">
                      <span className="w-[150px]">Type of Seedling:</span>
                      <span className="capitalize">{stockData?.typeOfSeedling}</span>
                    </div>
                    {stockData?.fertilizerApplied && (
                      <div className="info flex gap-24">
                        <span className="w-[150px]">Fertilizer Applied:</span>
                        <span className="capitalize">{stockData?.fertilizerApplied}</span>
                      </div>
                    )}
                    {stockData?.expectedHarvestDate && (
                      <div className="info flex gap-24">
                        <span className="w-[150px]">Expected Harvest Date:</span>
                        <span className="capitalize">{getDate(stockData?.expectedHarvestDate)}</span>
                      </div>
                    )}
                    {stockData?.harvestedDate && (
                      <div className="info flex gap-24">
                        <span className="w-[150px]">Harvested Date:</span>
                        <span className="capitalize">{getDate(stockData?.harvestedDate)}</span>
                      </div>
                    )}
                    {stockData?.expectedYield && (
                      <>
                        <div className="info flex gap-24">
                          <span className="w-[150px]">Expected Yield:</span>
                          <span className="capitalize">{stockData?.expectedYield.toLocaleString()}</span>
                        </div>
                        <div className="info flex gap-24">
                          <span className="w-[150px]">Farm Size:</span>
                          <span className="capitalize">{stockData?.farmSize.toLocaleString()}</span>
                        </div>
                        <div className="info flex gap-24">
                          <span className="w-[150px]">Farm Size Unit:</span>
                          <span className="capitalize">{stockData?.farmSizeUnit}</span>
                        </div>
                      </>
                    )}
                    {stockData?.availableQty && (
                      <div className="info flex gap-24">
                        <span className="w-[150px]">Available Quantity:</span>
                        <span className="capitalize">{stockData?.availableQty.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="info flex gap-24">
                      <span className="w-[150px]">Price/Unit:</span>
                      <span className="capitalize">{`₦${stockData?.pricePerUnit.toLocaleString()} / ${stockData?.unit || stockData?.yieldUnit}`}</span>
                    </div>
                    <div className="info flex gap-24">
                      <span className="w-[150px]">Total Price:</span>
                      <span className="capitalize">{`₦${calculateTotal()}`}</span>
                    </div>
                    <div className="info flex gap-24">
                      <span className="w-[150px]">Created:</span>
                      <span>{getDate(stockData.createdAt)}</span>
                    </div>
                    <div className="info flex gap-24">
                      <span className="w-[150px]">Last Update:</span>
                      <span>{getDate(stockData.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="info flex max-w-[40%] gap-24 mb-4">
                    {stockData?.productImage && (
                      <img src={stockData?.productImage} alt="Our stock"  />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </motion.section>
  )
}

export default StockInfo;