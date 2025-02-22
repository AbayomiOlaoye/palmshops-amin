import PropTypes from 'prop-types';

const Crop = ({ stockData }) => {

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
    const total = stockData?.pricePerUnit * (stockData?.quantity || 0);
    return total.toLocaleString();
  }

  return (
    <div className="userInfo flex flex-col gap-4">
      <div className="work flex flex-col gap-1">
        <h3 className="font-bold">Owner&apos;s Data</h3>
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
            <span className="w-[150px]">Name:</span>
            <span className="capitalize">{stockData?.productName}</span>
          </div>
          <div className="info flex gap-24">
            <span className="w-[150px]">Quantity:</span>
            <span className="capitalize">{stockData?.quantity}</span>
          </div>
          <div className="info flex gap-24">
            <span className="w-[150px]">Price/Unit:</span>
            <span className="capitalize">{`₦${stockData?.pricePerUnit?.toLocaleString()}`}</span>
          </div>
          <div className="info flex gap-24">
            <span className="w-[150px]">Total Price:</span>
            <span className="capitalize">{`₦${calculateTotal()}`}</span>
          </div>
          <div className="info flex gap-24">
            <span className="w-[150px]">Created:</span>
            <span>{getDate(stockData.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

Crop.propTypes = {
  stockData: PropTypes.object.isRequired,
}
export default Crop