import PropTypes from 'prop-types';

const Equipment = ({ stockData }) => {

  const getDate = (order) => {
    const date = new Date(order);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

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
      </div>
      <div className="work flex gap-6 items-center">
        <div className="info flex flex-col gap-2">
          <h3 className="font-bold">Equipment Information</h3>
          <div className="info flex gap-24">
            <span className="w-[150px]">Available Option(s):</span>
            <span className="capitalize">{stockData?.sale && 'Sales Contract'}{stockData.lease && ', Lease Contract'}</span>
          </div>
          <div className="info flex gap-24">
            <span className="w-[150px]">Name:</span>
            <span className="capitalize">{stockData?.equipment || stockData?.otherEquipment}</span>
          </div>
          <div className="info flex gap-24">
            <span className="w-[150px]">Description:</span>
            <span className="capitalize">{stockData?.description}</span>
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
      </div>
    </div>
  )
}

Equipment.propTypes = {
  stockData: PropTypes.object.isRequired,
}
export default Equipment;