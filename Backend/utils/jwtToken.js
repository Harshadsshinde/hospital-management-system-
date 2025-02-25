export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  // Determine the cookie name based on the user's role
  const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';
  
  // Convert COOKIE_EXPIRE to a number (default to 1 if not set)
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 1;
  
  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
