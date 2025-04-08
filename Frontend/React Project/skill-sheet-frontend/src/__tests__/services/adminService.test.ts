import axios from 'axios';
import { getUsers, deleteUser, addUser } from '../../services/adminService';
// import { jest } from '@jest/globals';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock global fetch
global.fetch = jest.fn();

describe('User API', () => {
  const mockToken = 'mocked_token';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return user data on success', async () => {
      const mockUserData = [{ name: 'John', email: 'john@example.com' }];
      mockedAxios.get.mockResolvedValueOnce({ data: mockUserData });

      const result = await getUsers(mockToken);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://localhost:7052/api/User',
        { headers: { Authorization: `Bearer ${mockToken}` } }
      );
      expect(result).toEqual(mockUserData);
    });

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API failure'));

      await expect(getUsers(mockToken)).rejects.toThrow('Failed to fetch users');
    });
  });

  describe('deleteUser', () => {
    it('should call delete with correct URL and headers', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await deleteUser('test@example.com', mockToken);
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        'https://localhost:7052/api/User/test%40example.com',
        { headers: { Authorization: `Bearer ${mockToken}` } }
      );
    });

    it('should throw error on failure', async () => {
      mockedAxios.delete.mockRejectedValueOnce(new Error('API error'));

      await expect(deleteUser('test@example.com', mockToken)).rejects.toThrow(
        'Failed to delete user'
      );
    });
  });

  describe('addUser', () => {
    it('should return response data on success', async () => {
      const mockUser = { name: 'Jane', email: 'jane@example.com' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockUser),
      };

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse as any);

      const result = await addUser(mockUser, mockToken);
      expect(fetch).toHaveBeenCalledWith('https://localhost:7052/api/User', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(mockUser),
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error if response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(addUser({}, mockToken)).rejects.toThrow('Failed to add user');
    });

    it('should throw custom error on fetch failure', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(addUser({}, mockToken)).rejects.toThrow('Network error');
    });
  });
});
