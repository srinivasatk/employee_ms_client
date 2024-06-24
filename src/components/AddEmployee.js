import React, { useState } from 'react';
import axios from 'axios';

const departmentOptions = [
  'Business Development',
  'Technical',
  'IT Admin',
  // Add more departments as needed
];

const AddEmployee = ({ onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [empName, setEmpName] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Set submitting state to true

    

    try {
      const response = await axios.post('http://localhost:5000/employees', {
        empName,
        department,
        salary: Number(salary),
      });
      onAdd(response.data); // Pass the newly added employee data to parent component
      setEmpName('');
      setDepartment('');
      setSalary('');
      toggleModal();
    } catch (error) {
      console.error('Error adding employee:', error);
    } finally {
      setIsSubmitting(false); // Reset submitting state after request completes
    }
  };

  return (
    <div>
      <button onClick={toggleModal} className="add-employee-button">Add Employee</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <h2>Add Employee</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  pattern="^[A-Za-z\b ]+$" 
                  title="Please enter only letters."
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department:</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="department-select" // Apply custom styling class
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
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Employee'}
                </button>
                <button type="button" className="cancel-button" onClick={toggleModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEmployee;
