import { changeUserPassword } from '../../services/changePasswordService';

describe('changeUserPassword', () => {
  const email = 'user@example.com';
  const oldPassword = 'oldPass123';
  const newPassword = 'newPass456';
  const mockToken = 'mock-token';

  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => mockToken);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully change password when response is ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    await expect(
      changeUserPassword(email, oldPassword, newPassword)
    ).resolves.toBeUndefined();

    expect(fetch).toHaveBeenCalledWith(
      `https://localhost:7052/api/User/changePassword/${email}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      }
    );
  });

  it('should throw an error when response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(
      changeUserPassword(email, oldPassword, newPassword)
    ).rejects.toThrow('Failed to change password. Please check your old password.');
  });
});
