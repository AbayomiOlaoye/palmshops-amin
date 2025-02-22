import PropTypes from 'prop-types';

const Farm = ({ stockData }) => {

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
            <span className="w-[150px]">Available Option(s):</span>
            <span className="capitalize">{stockData?.sale && 'Sales Contract'}{stockData.lease && ', Lease Contract'}</span>
          </div>
          <div className="info flex gap-24">
            <span className="w-[150px]">Name:</span>
            <span className="capitalize">{stockData?.cropPlanted}</span>
          </div>
          <div className="info flex gap-24">
            <span className="w-[150px]">Farm Size:</span>
            <span className="capitalize">{stockData?.farmSize.toLocaleString()}</span>
          </div>
          <div className="info flex gap-24">
            <span className="w-[150px]">Farm Size Unit:</span>
            <span className="capitalize">{stockData?.farmSizeUnit}</span>
          </div>
          {stockData?.salesPrice && (
            <div className="info flex gap-24">
              <span className="w-[150px]">Selling Price:</span>
              <span className="capitalize">{`₦${stockData?.salesPrice.toLocaleString()}`}</span>
            </div>
          )}
          {stockData?.leasePrice && (
            <div className="info flex gap-24">
              <span className="w-[150px]">Cost of Leasing:</span>
              <span className="capitalize">{`₦${stockData?.leasePrice.toLocaleString()}`}</span>
            </div>
          )}
          {stockData?.duration && (
            <div className="info flex gap-24">
              <span className="w-[150px]">Lease Duration:</span>
              <span className="capitalize">{stockData?.duration}</span>
            </div>
          )}
          <div className="info flex gap-24">
            <span className="w-[150px]">Created:</span>
            <span>{getDate(stockData.createdAt)}</span>
          </div>
        </div>
        <div className="info flex max-w-[40%] gap-24 mb-4">
          {stockData?.productImage && (
            <img src={stockData?.productImage} alt="Our stock"  />
          )}
        </div>
      </div>
    </div>
  )
}

Farm.propTypes = {
  stockData: PropTypes.object.isRequired,
}
export default Farm;
