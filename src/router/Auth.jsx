import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const Auth = ({ children, role }) => {
  const user = useSelector((state) => state.auth.user);
  if (!user || user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

Auth.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string.isRequired,
};

export default Auth;
