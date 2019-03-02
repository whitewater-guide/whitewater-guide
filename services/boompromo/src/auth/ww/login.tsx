import { API_HOST } from '../../environment';

export const wwLogin = async (accessToken: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `${API_HOST}/auth/facebook/token?access_token=${accessToken}`,
      {
        credentials: 'include',
      },
    );
    return response.ok ? null : 'Упс! Что-то сломалось.';
  } catch (e) {
    return 'Упс! Что-то сломалось.';
  }
};
