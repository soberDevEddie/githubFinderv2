import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaClock, FaUser } from 'react-icons/fa';

// My files
import { fetchGithubUser } from '../api/github';
import UserCard from '../components/UserCard';

const UserSearch = () => {
  const [username, setUsername] = useState('');
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [recentUsers, setRecentUsers] = useState([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['user', submittedUsername],
    queryFn: () => fetchGithubUser(submittedUsername),
    enabled: !!submittedUsername, // Only run the query if submittedUsername is not empty
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;

    setSubmittedUsername(trimmedUsername);

    setRecentUsers((prev) => {
      const updatedUsers = [
        trimmedUsername,
        ...prev.filter((user) => user !== trimmedUsername),
      ];
      return updatedUsers.slice(0, 5);
    });
  };

  return (
    <>
      <form className='form' onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Enter Github Username...'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type='submit'>Search</button>
      </form>
      {isLoading && <p className='status'>Loading...</p>}
      {isError && <p className='status error'>{error.message}...</p>}
      {data && <UserCard user={data} />}
      {recentUsers.length > 0 && (
        <div className='recent-searches'>
          <div className='recent-header'>
            <FaClock />
            <h3>Recent Searches</h3>
          </div>
          <ul>
            {recentUsers.map((user) => (
              <li key={user}>
                <button
                  oncClick={() => {
                    setUsername(user);
                    setSubmittedUsername(user);
                  }}
                >
                  <FaUser />
                  {user}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default UserSearch;
