/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { PieChart, Pie, Legend, Cell, ResponsiveContainer, Label } from "recharts";
import { fetchInventories } from "../../../redux/reducer/inventoryAction";

const Inventory = () => {
  const { inventories = [] } = useSelector((state) => state?.inventory || {});
  const { warehouses = {} } = useSelector((state) => state?.warehouse || {});

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInventories());
  }, [dispatch]);

  // Create a copy of warehouses to avoid mutation
  const warehouseSet = { ...warehouses };

  const formattedData = inventories.map((item) => {
    const product = {
      itemName: item?.itemName,
      itemCode: item?.itemCode,
    };

    item.locations.forEach((location) => {
      const warehouseName = location?.warehouseId?.name;
      warehouseSet[warehouseName] = true; // Record warehouse presence
      product[warehouseName] = location?.closingBalance || 0;
    });

    return product;
  });

  const warehouseNames = Object.keys(warehouseSet);

  const updatedFormattedData = formattedData.map((product) => {
    const updatedProduct = { ...product };

    warehouseNames.forEach((warehouse) => {
      if (!(warehouse in updatedProduct)) {
        updatedProduct[warehouse] = 0;
      }
    });

    return updatedProduct;
  });

  const targetProducts = ["Rice", "Stopper Solution", "Heavy Weight", "Optimum Booster"];

  const filteredProducts = updatedFormattedData.filter((product) =>
    targetProducts.includes(product?.itemName)
  );

  const totalInventory = filteredProducts.map((product) => {
    const total = warehouseNames.reduce((sum, warehouse) => {
      return sum + (product[warehouse] || 0);
    }, 0);

    return {
      name: product?.itemName,
      total,
    };
  });

  const total = totalInventory.reduce((sum, product) => sum + product?.total, 0);

  const COLORS = ["#395219", "#80b838", "#b3e870", "#0a192f"];

  const Bullet = ({ backgroundColor, size }) => (
    <div
      className="CirecleBullet"
      style={{
        backgroundColor,
        width: size,
        height: size,
      }}
    ></div>
  );

  const CustomizedLegend = ({ payload }) => (
    <ul className="LegendList">
      {payload.map((entry, index) => (
        <li key={`item-${index}`}>
          <div className="BulletLabel flex">
            <Bullet backgroundColor={entry?.payload?.fill} size="15px" />
            <div className="BulletLabelText flex">{entry?.value.toLocaleString()}</div>
          </div>
          <div style={{ marginLeft: "20px" }}>{entry?.payload?.value}</div>
        </li>
      ))}
    </ul>
  );

  const CustomLabel = ({ viewBox, labelText, value }) => {
    const { cx, cy } = viewBox;
    return (
      <g>
        <text
          x={cx}
          y={cy}
          className="recharts-text recharts-label"
          textAnchor="middle"
          dominantBaseline="central"
          alignmentBaseline="middle"
          fontSize="15"
        >
          {labelText}
        </text>
        <text
          x={cx}
          y={cy + 25}
          className="recharts-text recharts-label"
          textAnchor="middle"
          dominantBaseline="central"
          alignmentBaseline="middle"
          fill="#0a192f"
          fontSize="26"
          fontWeight="600"
        >
          {value}
        </text>
      </g>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "-20%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ delay: 0.1 }}
      className="max-w-full border rounded-md p-4 mt-4"
    >
      <h1 className="text-2xl font-semibold">Inventory</h1>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={totalInventory}
              dataKey="total"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
            >
              {totalInventory.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <Label
                content={
                  <CustomLabel
                    labelText="Finished Goods"
                    value={total.toLocaleString()}
                  />
                }
                position="center"
              />
            </Pie>
            <Legend layout="horizontal" align="center" verticalAlign="bottom" content={<CustomizedLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default Inventory;
