import React, { useEffect, useState } from 'react';
import UserModal from '../../components/UserModal/UserModal';
import { SERVER_URL } from '../../constant';
import './UserPage.css';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState();
  const [modalMode, setModalMode] = useState('add');
  const [filter, setFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [user, setUser] = useState([]);

  var filterDisplay = 'ALL';
  
  useEffect(() => {
    fetchUsers();
  }, [filter, page]);

  const fetchUsers = async () => {
    try {
      let url = `${SERVER_URL}/users`;
      if (filter !== 'ALL') {
        url += `/role/${filter}`;
      }
      const response = await fetch(`${url}?page=${page}&size=10`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSave = () => {
    fetchUsers();
  };

  const handleDelete = (user) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${user.firstName} ${user.lastName}"?`);
    if (!confirmDelete) return;

    fetch(SERVER_URL + `/users/${user.userId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete user');
        }
        // Correctly remove the deleted user from the users list
        setUsers((prev) =>
          prev.filter((u) => u.userId !== user.userId)
        );
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      });
  };


  const toggleFilter = () => {
    setPage(0);
    setFilter(prev => {
      switch (prev) {
        case 'ALL': return 'ROLE_MANAGER';
        case 'ROLE_MANAGER': return 'ROLE_CUSTOMER';
        case 'ROLE_CUSTOMER': return 'ROLE_CASHIER';
        case 'ROLE_CASHIER': return 'ALL';
        default: return 'ALL';
      }
    });
  };

  const formatFilterDisplay = (filter) => {
    switch (filter) {
      case 'ALL':
        return 'All';
      case 'ROLE_MANAGER':
        return 'Manager';
      case 'ROLE_CUSTOMER':
        return 'Customer';
      case 'ROLE_CASHIER':
        return 'Cashier';
      default:
        return filter;
    }
  };

  // TODO: What should I do for long emails?
  return (
    <div className="user-page">
      <UserModal
        isOpen={openModal}
        setOpenModal={setOpenModal}
        handleSave={handleSave}
        user={editUser}
        mode={modalMode}
      />

      <div className="user-header">
        <h1>Manage Users</h1>
        <div className="button-group">
          <button
            className="btn btn-add"
            onClick={() => {
              setEditUser(null);
              setModalMode('add');
              setOpenModal(true);
            }}
          >
            Add New User
          </button>
          <button
            className="btn btn-filter"
            onClick={toggleFilter}
          >
            Filter Role: {formatFilterDisplay(filter)}
          </button>
        </div>
      </div>

      <div className="user-list">
        {users.map((user) => (
          <div key={user.userId} className="user-card">
            <div className="user-info">
              <p className="user-name"><strong>{user.firstName} {user.lastName}</strong></p>
              <p className="user-role">{user.role.replace("ROLE_", "").toLowerCase().charAt(0).toUpperCase() + user.role.replace("ROLE_", "").toLowerCase().slice(1)}</p>
              <p className="user-email">{user.email}</p>
            </div>
            <div className="card-buttons">
              <button
                className="btn btn-edit"
                onClick={() => {
                  setEditUser(user);
                  setModalMode('edit');
                  setOpenModal(true);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => handleDelete(user)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button className="btn" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
          Previous
        </button>
        <span className="pagination-info">Page {page + 1} of {totalPages}</span>
        <button className="btn" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page + 1 >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default UserPage;
