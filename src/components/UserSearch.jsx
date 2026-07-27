import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

// My files
import { fetchGithubUser, searchGithubUser } from '../api/github';
import UserCard from '../components/UserCard';
import RecentSearches from '../components/RecentSearches';

const UserSearch = () => {
  const [username, setUsername] = useState('');
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [recentUsers, setRecentUsers] = useState(() => {
    const storedUsers = localStorage.getItem('recentUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });
  const [debouncedUsername] = useDebounce(username, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Query to fetch specific user
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['user', submittedUsername],
    queryFn: () => fetchGithubUser(submittedUsername),
    enabled: !!submittedUsername, // Only run the query if submittedUsername is not empty
  });
  // Query to fetch suggestions for user search
  const { data: suggestions } = useQuery({
    queryKey: ['github-user-suggestion', debouncedUsername],
    queryFn: () => searchGithubUser(debouncedUsername),
    enabled: debouncedUsername.length > 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;

    setSubmittedUsername(trimmedUsername);
    setUsername('');

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
        <div className='dropdown-wrapper'>
          <input
            type='text'
            placeholder='Enter Github Username...'
            value={username}
            onChange={(e) => {
              const val = e.target.value;
              setUsername(val);
              setShowSuggestions(val.trim().length > 1);
            }}
          />
          {showSuggestions && suggestions?.length > 0 && (
            <ul className='suggestions'>
              {suggestions.slice(0, 5).map((user) => (
                <li
                  key={user.id}
                  onClick={() => {
                    setUsername(user.login);
                    setShowSuggestions(false);

                    if (submittedUsername !== user.login) {
                      setSubmittedUsername(user.login);
                    } else {
                      refetch();
                    }
                  }}
                >
                  <img
                    className='avatar-xs'
                    src={user.avatar_url}
                    alt={user.login}
                  />{' '}
                  {user.login}
                </li>
              ))}
            </ul>
          )}
        </div>
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
