import { FaUserMinus, FaUserPlus, FaGithubAlt } from 'react-icons/fa';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

// My files
import {
  checkIfFollowingUser,
  followGithubUser,
  unfollowGithubUser,
} from '../api/github';

const UserCard = ({ user }) => {
  // Query to check if user is following
  const { data: isFollowing, refetch } = useQuery({
    queryKey: ['follow-status', user.login],
    queryFn: () => checkIfFollowingUser(user.login),
    enabled: !!user.login,
  });
  // Mutation to follow user
  const followMutation = useMutation({
    mutationFn: () => followGithubUser(user.login),
    onSuccess: () => {
      toast.success(`You are now following ${user.login}`);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutation to unfollow user
  const unfollowMutation = useMutation({
    mutationFn: () => unfollowGithubUser(user.login),
    onSuccess: () => {
      toast.success(`You have unfollowed ${user.login}`);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <div className='user-card'>
      <img className='avatar' src={user.avatar_url} alt={user.name} />
      <h2 className='name'>{user.name || user.login}</h2>
      <p className='bio'>{user.bio || 'No bio available.'}</p>
      <div className='user-card-buttons'>
        <button
          onClick={handleFollow}
          className={`follow-btn ${isFollowing ? 'following' : ''}`}
        >
          {isFollowing ? (
            <>
              <FaUserMinus className='follow-icon' /> Unfollow User
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
