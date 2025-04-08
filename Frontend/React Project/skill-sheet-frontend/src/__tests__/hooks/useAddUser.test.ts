import { renderHook, act } from '@testing-library/react';
import { useAddUser } from '../../hooks/useAddUser';
import { addUser as mockAddUser } from '../../services/adminService';

jest.mock('../../services/adminService');
const mockedAddUser = mockAddUser as jest.Mock;

describe('useAddUser hook', () => {
  const onUserAdded = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'mock-token');
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAddUser(onUserAdded, onClose));

    expect(result.current.formData).toEqual({
      name: '',
      email: '',
      password: '',
      role: ''
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.passwordError).toBe(null);
  });

  it('should validate password on change and set error', () => {
    const { result } = renderHook(() => useAddUser(onUserAdded, onClose));

    act(() => {
      result.current.handleChange({
        target: { id: 'password', value: 'short' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.passwordError).toBe('Password must be between 8 and 64 characters.');
  });

  it('should update form data on input change', () => {
    const { result } = renderHook(() => useAddUser(onUserAdded, onClose));

    act(() => {
      result.current.handleChange({
        target: { id: 'name', value: 'Jane Doe' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.name).toBe('Jane Doe');
  });

  it('should not submit if passwordError exists', async () => {
    const { result } = renderHook(() => useAddUser(onUserAdded, onClose));

    act(() => {
      result.current.handleChange({
        target: { id: 'password', value: 'weakpass' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn()
      } as unknown as React.FormEvent);
    });

    expect(mockedAddUser).not.toHaveBeenCalled();
  });

  it('should call addUser and reset form on successful submit', async () => {
    mockedAddUser.mockResolvedValueOnce(true);

    const { result } = renderHook(() => useAddUser(onUserAdded, onClose));

    // Fill out form
    act(() => {
      result.current.handleChange({
        target: { id: 'name', value: 'Jane' }
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({
        target: { id: 'email', value: 'jane@example.com' }
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({
        target: { id: 'role', value: 'User' }
      } as React.ChangeEvent<HTMLSelectElement>);
      result.current.handleChange({
        target: { id: 'password', value: 'ValidPass1!' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent);
    });

    expect(mockedAddUser).toHaveBeenCalledWith(
      {
        name: 'Jane',
        email: 'jane@example.com',
        role: 'User',
        password: 'ValidPass1!'
      },
      'mock-token'
    );

    expect(onUserAdded).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('should set error on failed submit', async () => {
    mockedAddUser.mockRejectedValueOnce(new Error('API error'));

    const { result } = renderHook(() => useAddUser(onUserAdded, onClose));

    act(() => {
      result.current.handleChange({
        target: { id: 'password', value: 'ValidPass1!' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn()
      } as unknown as React.FormEvent);
    });

    expect(result.current.error).toBe('API error');
  });
});
