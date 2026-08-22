/**
 * Simple Authentication Controller with demo roles
 */
const login = async (req, res) => {
  try {
    const { email, password, role = 'admin' } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Admin / Staff credentials
    if (cleanEmail.includes('admin') || role === 'admin') {
      const user = {
        id: 'admin_1',
        name: 'Canteen Staff Admin',
        email: cleanEmail,
        role: 'admin',
        locationId: 'campus-canteen',
        token: 'jwt_mock_admin_token_' + Date.now(),
      };
      return res.status(200).json({
        success: true,
        message: 'Logged in successfully as Canteen Administrator.',
        user,
      });
    }

    // Student user
    const studentName = cleanEmail.split('@')[0].replace('.', ' ') || 'Student User';
    const user = {
      id: 'student_' + Date.now(),
      name: studentName.charAt(0).toUpperCase() + studentName.slice(1),
      email: cleanEmail,
      role: 'student',
      locationId: 'campus-canteen',
      token: 'jwt_mock_student_token_' + Date.now(),
    };

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully as Student.',
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed due to an internal server error.',
    });
  }
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    message: 'Session verified.',
  });
};

module.exports = {
  login,
  getMe,
};
