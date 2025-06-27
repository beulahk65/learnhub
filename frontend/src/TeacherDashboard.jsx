import { useEffect, useState } from 'react';

function TeacherDashboard() {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');

  const teacher = JSON.parse(localStorage.getItem('user'));
  const teacherEmail = teacher?.email;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch(`http://localhost:4000/api/teacher/courses?email=${teacherEmail}`);
    const data = await res.json();
    setCourses(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, teacherEmail }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchCourses();
    } catch (err) {
      setMessage('Error creating course');
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/teacher/courses/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      alert(data.message || 'Deleted');
      fetchCourses();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <>
      <nav style={navStyle}>
        <div style={{ fontWeight: 'bold' }}>🎓 LearnHub</div>
        <div>
          <span style={{ marginRight: '1rem' }}>{teacher?.name} ({teacher?.role})</span>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            style={navButtonStyle}
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      <div
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/7d/66/04/7d6604111a2fb44b73a4bc8b643e479d.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          padding: '2rem',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0,0,0,0.65)',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '900px',
            margin: '0 auto',
            color: 'white',
          }}
        >
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>
            🧑‍🏫 Teacher Dashboard
          </h2>

          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>➕ Create a Course</h3>
          <form onSubmit={createCourse} style={{ marginBottom: '2rem' }}>
            <input
              name="title"
              placeholder="Course Title"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="description"
              placeholder="Description"
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Create Course
            </button>
          </form>
          {message && (
            <p style={{ color: message.includes('success') ? 'lightgreen' : 'salmon' }}>{message}</p>
          )}

          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📚 Your Courses</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {courses.length > 0 ? (
              courses.map(course => (
                <li
                  key={course._id}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderLeft: '4px solid #00BFFF',
                    borderRadius: '0.5rem',
                  }}
                >
                  <strong>{course.title}</strong> — {course.description}
                  <br />
                  <button
                    style={{ ...buttonStyle, backgroundColor: '#ff4d4f', color: 'white' }}
                    onClick={() => deleteCourse(course._id)}
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p>No courses found.</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '0.5rem',
  border: 'none',
  outline: 'none',
  fontSize: '1rem',
};

const buttonStyle = {
  backgroundColor: 'white',
  color: 'black',
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '1rem 2rem',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  fontFamily: 'Poppins, sans-serif',
};

const navButtonStyle = {
  backgroundColor: '#fff',
  color: '#000',
  padding: '0.4rem 1rem',
  borderRadius: '0.4rem',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default TeacherDashboard;
