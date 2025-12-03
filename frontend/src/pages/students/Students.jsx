import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { advisorAPI, progressAPI } from '../../services/api';
import Card from '../../components/common/Card';
import { MdVisibility, MdMessage, MdAdd, MdSearch, MdClose } from 'react-icons/md';
import './Students.css';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsRes = await advisorAPI.getProjects();
      const projectsData = projectsRes.data;
      setProjects(projectsData);

      // Gather all students from projects with their project info
      const studentsWithProjects = [];

      for (const project of projectsData) {
        // Get progress for each project
        let progress = 0;
        try {
          const progressRes = await progressAPI.getProjectProgress(project._id);
          progress = progressRes.data.completionPercentage || 0;
        } catch (err) {
          console.error('Error fetching progress:', err);
        }

        // Add each student with their project info
        if (project.students && project.students.length > 0) {
          project.students.forEach(student => {
            studentsWithProjects.push({
              ...student,
              projectId: project._id,
              projectName: project.name,
              progress: progress,
            });
          });
        }
      }

      setStudents(studentsWithProjects);

      // Try to fetch all available students for adding to projects
      try {
        const allStudentsRes = await advisorAPI.getAllStudents();
        setAllStudents(allStudentsRes.data || []);
      } catch (err) {
        console.error('Error fetching all students:', err);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedProject || !selectedStudent) {
      alert('Please select both a project and a student');
      return;
    }

    setAdding(true);
    try {
      await advisorAPI.addStudent({
        projectId: selectedProject,
        studentId: selectedStudent,
      });

      // Refresh data
      await fetchData();
      setShowAddModal(false);
      setSelectedProject('');
      setSelectedStudent('');
    } catch (error) {
      console.error('Error adding student:', error);
      alert(error.response?.data?.message || 'Failed to add student');
    } finally {
      setAdding(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.projectName?.toLowerCase().includes(searchLower)
    );
  });

  // Get students not already in the selected project
  const availableStudents = allStudents.filter(student => {
    const project = projects.find(p => p._id === selectedProject);
    if (!project) return true;
    return !project.students?.some(s => s._id === student._id);
  });

  const handleViewStudent = (projectId) => {
    navigate(`/tasks?project=${projectId}`);
  };

  const handleMessageStudent = (projectId) => {
    navigate(`/discussion?project=${projectId}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="students-page">
      <div className="page-header">
        <h1 className="page-title">Students Management</h1>
        <div className="header-actions">
          <div className="search-box">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, ID or Project...."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button className="add-btn" onClick={() => setShowAddModal(true)}>
        <MdAdd /> Add New Student
      </button>

      <Card className="students-table-card">
        <h2 className="table-title">Student List</h2>
        <table className="students-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Project</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">No students found.</td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => (
                <tr key={`${student._id}-${student.projectId}-${index}`}>
                  <td className="student-info">
                    <span className="student-name">{student.name}</span>
                    <span className="student-id">{student.email?.split('@')[0] || 'N/A'}</span>
                  </td>
                  <td className="project-name">{student.projectName}</td>
                  <td className="progress-cell">
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{student.progress}%</span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="action-btn view"
                      title="View Project"
                      onClick={() => handleViewStudent(student.projectId)}
                    >
                      <MdVisibility />
                    </button>
                    <button
                      className="action-btn message"
                      title="Send Message"
                      onClick={() => handleMessageStudent(student.projectId)}
                    >
                      <MdMessage />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Student to Project</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <MdClose />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Select Project</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  disabled={!selectedProject}
                >
                  <option value="">Select a student</option>
                  {availableStudents.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={handleAddStudent}
                disabled={adding || !selectedProject || !selectedStudent}
              >
                {adding ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
