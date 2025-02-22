import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { MdArrowBack } from "react-icons/md";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Top from "../../Dashboard/Top";
import { auth } from '../../../apiCall';
import Crop from "./Crop";
import Equipment from "./Equipment";
import Farm from "./Farm";

const ItemCrop = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [stockData, setStockData] = useState({});

  const handleGoBack = () => {
    window.history.back();
  }

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        let crop = null, farm = null, equipment = null;

        try {
          crop = await auth.get(`/trackcrop/${id}`);
          console.log("Crop data:", crop?.data);
        } catch (err) {
          console.warn("Error fetching crop:", err);
        }

        if (crop?.data) {
          setStockData({ ...crop.data, type: 'Crops' });
          return;
        }

        try {
          farm = await auth.get(`/trackfarm/${id}`);
          console.log("Farm data:", farm?.data);
        } catch (err) {
          console.warn("Error fetching farm:", err);
        }
        if (farm?.data) {
          setStockData({ ...farm.data, type: 'Farms' });
          return;
        }

        try {
          equipment = await auth.get(`/trackequipment/${id}`);
          console.log("Equipment data:", equipment?.data);
        } catch (err) {
          console.warn("Error fetching equipment:", err);
        }

        if (equipment?.data) {
          setStockData({ ...equipment.data, type: 'Equipment' });
          return;
        }

        setStockData(null);
        toast.info(`Item with ID ${id} not found in any collection.`);

      } catch (error) {
        console.error('General error fetching item:', error);
        toast.error(error?.response?.data?.message || 'Error fetching item');
        setStockData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  return (
    <motion.section className="max-w-full"
      initial={{ opacity: 0, x: '-20%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ delay: 0.1 }}
    >
      <Top title="HR" text="Manage stock Information" />
      <section className="user">
        <div className="action-nav flex justify-between items-center">
          <motion.article
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className="back flex items-center gap-4 text-2xl"
          >
            <MdArrowBack className="cursor-pointer" onClick={handleGoBack} />
            <span className="font-medium">Item Information</span>
          </motion.article>
        </div>
        <div className="userContainer grid lg:grid-cols-1 w-full mt-3 rounded-xl shadow-lg bg-white py-10 p-8">
          <div className="userShow">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                {stockData?.type === 'Crops' && (
                  <Crop stockData={stockData} />
                )}
                {stockData?.type === 'Farms' && (
                  <Farm stockData={stockData} />
                )}
                {stockData?.type === 'Equipment' && (
                  <Equipment stockData={stockData} />
                )}
                {stockData === null && (
                  <div>Item not found</div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </motion.section>
  )
}

export default ItemCrop;