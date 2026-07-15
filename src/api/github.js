export const fetchGithubUser = async (username) => {
  const res = await fetch(
        `${import.meta.env.VITE_GITHUB_API_URL}/users/${username}`,
      );
      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await res.json();
      // console.log('Fetched user data:', data);
      return data;
}
