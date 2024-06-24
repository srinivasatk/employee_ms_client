import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddEmployee from './AddEmployee';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'; // Import icons for edit and delete buttons

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]); // State to hold filtered employees
  const [editMode, setEditMode] = useState(false);
  const [editEmployee, setEditEmployee] = useState({
    _id: '',
    empName: '',
    department: '',
    salary: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission
  const [deleteConfirm, setDeleteConfirm] = useState(null); // State to track delete confirmation
  const [searchTerm, setSearchTerm] = useState(''); // State to hold search term

  const departmentOptions = [
    'Business Development',
    'Technical',
    'IT Admin',
    // Add more departments as needed
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    // Filter employees based on search term when it changes
    const filteredList = employees.filter(employee =>
      employee.empName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filteredList);
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleEdit = (employee) => {
    setEditMode(true);
    setEditEmployee({
      _id: employee._id,
      empName: employee.empName,
      department: employee.department,
      salary: employee.salary,
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditEmployee({
      _id: '',
      empName: '',
      department: '',
      salary: '',
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Set submitting state to true

    try {
      await axios.patch(`http://localhost:5000/employees/${editEmployee._id}`, {
        empName: editEmployee.empName,
        department: editEmployee.department,
        salary: Number(editEmployee.salary),
      });
      fetchEmployees(); // Refresh the list after update
      handleCancelEdit(); // Exit edit mode
    } catch (error) {
      console.error('Error updating employee:', error);
    } finally {
      setIsSubmitting(false); // Reset submitting state after request completes
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      fetchEmployees(); // Refresh the list after deletion
      setDeleteConfirm(null); // Close confirmation dialog after deletion
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const confirmDelete = (employeeId) => {
    setDeleteConfirm(employeeId);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatSalary = (salary) => {
    // Function to format salary to Indian Rupees (INR)
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    });
    return formatter.format(salary);
  };

  return (
    <div className="employee-list">
      <AddEmployee onAdd={fetchEmployees} />

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search employees by name..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee Id</th>
            <th>Name</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.employeeId}</td>
              <td>{employee.empName}</td>
              <td>{employee.department}</td>
              <td>{formatSalary(employee.salary)}</td>
              <td>
                {!editMode ? (
                  <>
                    <button className="edit-button" onClick={() => handleEdit(employee)}>
                      <AiOutlineEdit />
                    </button>
                    <button className="delete-button" onClick={() => confirmDelete(employee._id)}>
                      <AiOutlineDelete />
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editMode && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCancelEdit}>&times;</span>
            <h2>Edit Employee</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  pattern="^[A-Za-z\b ]+$" 
                  title="Please enter only letters."
                  value={editEmployee.empName}
                  onChange={(e) => setEditEmployee({ ...editEmployee, empName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department:</label>
                <select
                  className="department-select"
                  value={editEmployee.department}
                  onChange={(e) => setEditEmployee({ ...editEmployee, department: e.target.value })}
                  required
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Salary:</label>
                <input
                  type="number"
                  value={editEmployee.salary}
                  onChange={(e) => setEditEmployee({ ...editEmployee, salary: e.target.value })}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={cancelDelete}>&times;</span>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this employee?</p>
            <div className="modal-buttons">
              <button className="submit-button" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              <button className="cancel-button" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
