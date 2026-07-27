import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// My files
import { fetchGithubUser } from '../api/github';
import UserCard from '../components/UserCard';
import RecentSearches from '../components/RecentSearches';

const UserSearch = () => {
  const [username, setUsername] = useState('');
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [recentUsers, setRecentUsers] = useState(() => {
    const storedUsers = localStorage.getItem('recentUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

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

  useEffect(() => {
    localStorage.setItem('recentUsers', JSON.stringify(recentUsers));
  }, [recentUsers]);

  return (
    <>
      <form className='form' onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Enter Github Username...'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type='submit' className='btn'>
          Search
        </button>
      </form>
      {isLoading && <p className='status'>Loading...</p>}
      {isError && <p className='status error'>{error.message}...</p>}

      {data && <UserCard user={data} />}

      {recentUsers.length > 0 && (
        <RecentSearches
          users={recentUsers}
          onSelect={(username) => {
            setUsername(username);
            setSubmittedUsername(username);
          }}
        />
      )}
    </>
  );
};

export default UserSearch;
