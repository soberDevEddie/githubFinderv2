import { FaUserMinus, FaUserPlus, FaGithubAlt } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';

// My files
import { checkIfFollowingUser } from '../api/github';

const UserCard = ({ user }) => {
  const { data: isFollowing, refetch } = useQuery({
    queryKey: ['follow-status', user.login],
    queryFn: () => checkIfFollowingUser(user.login),
    enabled: !!user.login,
  });

  return (
    <div className='user-card'>
      <img className='avatar' src={user.avatar_url} alt={user.name} />
      <h2 className='name'>{user.name || user.login}</h2>
      <p className='bio'>{user.bio || 'No bio available.'}</p>
      <div className='user-card-buttons'>
        <button
          className={`follow-btn ${isFollowing ? 'following' : ''}`}
          onClick={refetch}
        >
          {isFollowing ? (
            <>
              <FaUserMinus className='follow-icon' /> Following
            </>
          ) : (
            <>
              <FaUserPlus className='follow-icon' /> Follow User
            </>
          )}
        </button>
        <a
          href={user.html_url}
          className='profile-btn'
          target='_blank'
          rel='noopener noreferrer'
        >
          <FaGithubAlt /> View Profile
        </a>
      </div>
    </div>
  );
};

export default UserCard;
