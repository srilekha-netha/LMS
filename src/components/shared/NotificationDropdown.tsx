import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { mockNotifications } from '../../data/mockData';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200 animate-fade-in"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {mockNotifications.length > 0 ? (
          <ul>
            {mockNotifications.map((notification) => (
              <li 
                key={notification.id}
                className={`px-4 py-3 border-b border-gray-100 last:border-0 ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${
                    notification.type === 'info' ? 'bg-blue-500' :
                    notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p>No notifications</p>
          </div>
        )}
      </div>
      
      <div className="px-4 py-2 border-t border-gray-100 text-center">
        <button className="text-sm text-primary-600 hover:text-primary-700">
          Mark all as read
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;