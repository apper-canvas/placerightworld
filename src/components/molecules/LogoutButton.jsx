import { useContext } from 'react';
import { AuthContext } from '../../App';
import ApperIcon from '@/components/ApperIcon';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <button 
      onClick={logout}
      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Logout"
    >
      <ApperIcon name="LogOut" className="w-5 h-5" />
    </button>
  );
};

export default LogoutButton;