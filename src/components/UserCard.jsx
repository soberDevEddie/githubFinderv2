import { FaGithubAlt } from 'react-icons/fa';

const UserCard = ({ user }) => {
  return (
    <div className='user-card'>
      <img className='avatar' src={user.avatar_url} alt={user.name} />
      <h2 className='name'>{user.name || user.login}</h2>
      <p className='bio'>{user.bio || 'No bio available.'}</p>
      <a
        href={user.html_url}
        className='profile-btn'
        target='_blank'
        rel='noopener noreferrer'
      >
        <FaGithubAlt /> View Profile
      </a>
    </div>
  );
};

export default UserCard;
