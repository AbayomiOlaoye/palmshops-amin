import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { MdLogout } from "react-icons/md";
import { signOut } from '../../redux/reducer/authActions';

const Top = ({ title, text }) => {
  const dispatch = useDispatch();

  return (
    <article className="flex h-28 justify-between px-5">
      <div className="">
        <h1 className="text-xl font-extrabold">{title}</h1>
        <p className="text-ek-gray text-sm">{text}</p>
      </div>
      <div className="notification">
      <MdLogout title='Log out' className="cursor-pointer text-2xl text-ek-deep" onClick={() => dispatch(signOut())} />
      </div>
    </article>
  );
}

Top.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
};

export default Top;
