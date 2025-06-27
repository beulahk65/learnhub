import { useEffect, useState } from 'react';

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const studentEmail = user?.email;

  const [allCourses, setAllCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [sections, setSections] = useState({});
  const [message, setMessage] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/courses');
      const data = await res.json();
      setAllCourses(data);
    } catch {
      setMessage('❌ Failed to load courses');
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/student/enrollments?studentEmail=${studentEmail}`);
      const data = await res.json();
      setEnrollments(data);
    } catch {
      setMessage('❌ Failed to load enrollments');
    }
  };

  const enrollInCourse = async (courseId) => {
    try {
      const res = await fetch('http://localhost:4000/api/student/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, studentEmail }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchEnrollments();
    } catch {
      setMessage('❌ Enrollment failed');
    }
  };

  const markComplete = async (courseId) => {
    try {
      const res = await fetch('http://localhost:4000/api/student/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, studentEmail }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchEnrollments();
    } catch {
      setMessage('❌ Failed to mark course as completed');
    }
  };

  const downloadCertificate = (courseId) => {
    window.open(`http://localhost:4000/api/student/certificate/${courseId}?studentEmail=${studentEmail}`, '_blank');
  };

  const fetchSections = async (courseId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/courses/${courseId}/sections`);
      const data = await res.json();
      setSections(prev => ({ ...prev, [courseId]: data }));
    } catch {
      setMessage('❌ Failed to load sections');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  const validEnrollments = enrollments.filter(e => e.courseId !== null);
  const enrolledCourseIds = validEnrollments.map(e => e.courseId._id);
  const availableCourses = allCourses.filter(course => !enrolledCourseIds.includes(course._id));

  return (
    <>
      <nav style={navStyle}>
        <div style={{ fontWeight: 'bold' }}>🎓 LearnHub</div>
        <div>
          <span style={{ marginRight: '1rem' }}>{user?.name} ({user?.role})</span>
          <button onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }} style={navButtonStyle}>
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
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '1100px',
            margin: '0 auto',
            color: 'white',
          }}
        >
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '2rem' }}>
            🎓 Welcome, {user?.name || 'Student'}
          </h2>

          <section>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📘 Available Courses</h3>
            {availableCourses.length > 0 ? (
              <ul>
                {availableCourses.map(course => (
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
                    <strong>{course.title}</strong> – {course.description}
                    <br />
                    <button
                      onClick={() => enrollInCourse(course._id)}
                      style={buttonStyle}
                    >
                      Enroll
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>✅ You're enrolled in all available courses!</p>
            )}
          </section>

          <hr style={{ margin: '2rem 0', borderColor: '#ccc' }} />

          <section>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>✅ Enrolled Courses</h3>
            {validEnrollments.length > 0 ? (
              validEnrollments.map(enroll => (
                <div
                  key={enroll._id}
                  style={{
                    marginBottom: '2rem',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    borderLeft: '4px solid #27ae60',
                  }}
                >
                  <h4>{enroll.courseId.title}</h4>
                  <p>{enroll.courseId.description}</p>
                  <p>
                    Status:{" "}
                    {enroll.completed ? '✅ Completed' : '🕒 In Progress'}
                  </p>

                  {!sections[enroll.courseId._id] && (
                    <button
                      onClick={() => fetchSections(enroll.courseId._id)}
                      style={buttonStyle}
                    >
                      📂 View Sections
                    </button>
                  )}

                  {sections[enroll.courseId._id] && (
                    <ul>
                      {sections[enroll.courseId._id].length > 0 ? (
                        sections[enroll.courseId._id].map(section => (
                          <li key={section._id}>
                            <strong>{section.title}</strong>: {section.content}
                            {section.videoUrl && (
                              <div>
                                <a
                                  href={section.videoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ color: '#87CEFA' }}
                                >
                                  📺 Watch Video
                                </a>
                              </div>
                            )}
                          </li>
                        ))
                      ) : (
                        <p>📭 No sections yet.</p>
                      )}
                    </ul>
                  )}

                  {!enroll.completed && (
                    <button
                      onClick={() => markComplete(enroll.courseId._id)}
                      style={{ ...buttonStyle, marginTop: '0.5rem' }}
                    >
                      ✅ Mark Course Completed
                    </button>
                  )}

                  {enroll.completed && (
                    <button
                      onClick={() => downloadCertificate(enroll.courseId._id)}
                      style={{ ...buttonStyle, marginTop: '0.5rem' }}
                    >
                      📜 Download Certificate
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No enrolled courses yet.</p>
            )}
          </section>

          {message && (
            <p style={{ color: message.includes('success') ? 'lightgreen' : 'salmon' }}>
              <strong>{message}</strong>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

const buttonStyle = {
  backgroundColor: 'white',
  color: 'black',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  border: 'none',
  marginTop: '0.5rem',
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

export default StudentDashboard;
