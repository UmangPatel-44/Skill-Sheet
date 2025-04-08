import axios from 'axios';
import { fetchUsersByRole, loginUser } from '../../services/authService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('authApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUsersByRole', () => {
    it('should return a list of user emails when API call is successful', async () => {
      const mockUsers = [
        { email: 'user1@example.com' },
        { email: 'user2@example.com' },
      ];
      mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockUsers });

      const result = await fetchUsersByRole('User');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://localhost:7052/api/User/users?role=User'
      );
      expect(result).toEqual(['user1@example.com', 'user2@example.com']);
    });

    it('should return an empty array when API call fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchUsersByRole('Admin');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://localhost:7052/api/User/users?role=Admin'
      );
      expect(result).toEqual([]);
    });
  });

  describe('loginUser', () => {
    it('should return user data on successful login', async () => {
      const mockResponse = { token: 'mock-token', role: 'User' };
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await loginUser('user@example.com', 'password123', 'User');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://localhost:7052/api/Auth/login',
        {
          email: 'user@example.com',
          password: 'password123',
          role: 'User',
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error on failed login', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(
        loginUser('user@example.com', 'wrongpassword', 'User')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
