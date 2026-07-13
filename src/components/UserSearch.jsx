import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {FaGithubAlt} from 'react-icons/fa';

const UserSearch = () => {
  const [username, setUsername] = useState('');
  const [submittedUsername, setSubmittedUsername] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['user', submittedUsername],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_GITHUB_API_URL}/users/${submittedUsername}`,
      );
      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await res.json();
      // console.log('Fetched user data:', data);
      return data;
    },
    enabled: !!submittedUsername, // Only run the query if submittedUsername is not empty
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedUsername(username.trim());
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
      {data && (
        <div className='user-card'>
          <img className='avatar' src={data.avatar_url} alt={data.name} />
          <h2 className='name'>{data.name || data.login}</h2>
          <p className='bio'>{data.bio || 'No bio available.'}</p>
          <a
            href={data.html_url}
            className='profile-btn'
            target='_blank'
            rel='noopener noreferrer'
          >
           <FaGithubAlt/> View Profile
          </a>
        </div>
      )}
    </>
  );
};

export default UserSearch;
