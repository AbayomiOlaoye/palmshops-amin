/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
} from "recharts";
import { auth } from "../../../apiCall";

const SalesShot = () => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formattedData = sales.reduce((acc, item) => {
    const key = `${item.product} (${item.warehouse})`;
    const existing = acc.find((entry) => entry.name === key);
    if (existing) {
      existing.value += item.totalQuantity;
    } else {
      acc.push({ name: key, value: item.totalQuantity });
    }
    return acc;
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await auth.get("/sales/weekly-sales");
        setSales(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSales();
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#80b838">{`Qty ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#0a192f">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const handlePieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "-20%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ delay: 0.1 }}
      className="max-w-full border rounded-md p-4 mt-4"
    >
      <h1 className="text-2xl font-semibold">Weekly Sales {sales && <span className="">{`(Week ${sales[0]?.week})`}</span>}</h1>
      <div style={{ width: "100%", height: 400 }}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#395219"
                dataKey="value"
                onMouseEnter={handlePieEnter}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default SalesShot;
