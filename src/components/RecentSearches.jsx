import { FaClock, FaUser } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';

// My files
import { fetchGithubUser } from '../api/github';

const RecentSearches = ({ users, onSelect }) => {
  const queryClient = useQueryClient();
  

  return (
    <div className='recent-searches'>
      <div className='recent-header'>
        <FaClock />
        <h3>Recent Searches</h3>
      </div>
      <ul>
        {users.map((user) => (
          <li key={user}>
            <button onMouseEnter={() => {
              queryClient.prefetchQuery({
                queryKey: ['user', user],
                queryFn: () => fetchGithubUser(user),
              });
            }} onClick={() => onSelect(user)}> 
              <FaUser className='user-icon' />
              {user}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches;
