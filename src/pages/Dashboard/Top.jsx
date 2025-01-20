import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const Top = ({ title, text }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <article className="flex h-28 justify-between px-5">
      <div className="">
        <h1 className="text-xl font-extrabold">{title}</h1>
        <p className="text-ek-gray text-sm">{text}</p>
      </div>
      <div className="notification">
        <div className="flex flex-col">
          <img
            src={user?.image}
            alt="avatar"
            className="h-[50px] w-[50px] rounded-full object-cover"
          />
          <article className="flex flex-col">
            <span className="font-semibold">{user?.name}</span>
            <span className="text-ek-gray text-sm">{user?.jobTitle}</span>
          </article>
        </div>
      </div>
    </article>
  );
}

Top.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
};

export default Top;
