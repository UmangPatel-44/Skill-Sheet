import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SkillDetailModal from '../components/Modals/SkillDetail';
import '@testing-library/jest-dom';

describe('SkillDetailModal Component', () => {
  const mockHandleClose = jest.fn();
  const mockHandleDelete = jest.fn();

  const mockSkill = {
    userSkillId: 101,
    name: 'JavaScript',
    level: 'Advanced',
    experience: 5,
    category: 'Frontend',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders skill details correctly when shown', () => {
    render(
      <SkillDetailModal
        show={true}
        handleClose={mockHandleClose}
        handleDelete={mockHandleDelete}
        skill={mockSkill}
      />
    );

    expect(screen.getByText('Skill Details')).toBeInTheDocument();
    expect(screen.getByText(/JavaScript/)).toBeInTheDocument();
    expect(screen.getByText(/Advanced/)).toBeInTheDocument();
    expect(screen.getByText(/5 years/)).toBeInTheDocument();
    expect(screen.getByText(/Frontend/)).toBeInTheDocument();
  });

  it('calls handleDelete with correct skill ID when Delete is clicked', () => {
    render(
      <SkillDetailModal
        show={true}
        handleClose={mockHandleClose}
        handleDelete={mockHandleDelete}
        skill={mockSkill}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockHandleDelete).toHaveBeenCalledWith(101);
  });

  it('calls handleClose when Close is clicked', () => {
    render(
      <SkillDetailModal
        show={true}
        handleClose={mockHandleClose}
        handleDelete={mockHandleDelete}
        skill={mockSkill}
      />
    );

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('returns null if skill is not provided', () => {
    const { container } = render(
      <SkillDetailModal
        show={true}
        handleClose={mockHandleClose}
        handleDelete={mockHandleDelete}
        skill={null}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
