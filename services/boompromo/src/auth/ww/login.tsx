export const wwLogin = async (accessToken: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `${
        process.env.REACT_APP_API_HOST
      }/auth/facebook/token?access_token=${accessToken}`,
      {
        credentials:
          process.env.NODE_ENV === 'production' ? 'same-origin' : 'include',
      },
    );
    return response.ok ? null : 'Упс! Что-то сломалось.';
  } catch (e) {
    return 'Упс! Что-то сломалось.';
  }
};
