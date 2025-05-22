const dotenv = require('dotenv');
dotenv.config();
const {adminModel} = require('../Module/adminModel'); // Added 'const'
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { password, userId } = req.body;
  console.log(userId, password);
  
  // Validate input
  if (!userId || !password) {
    return res.status(400).json({ 
      success: false,
      message: "UserId and password are required" 
    });
  }

  try {
    // 1. Find user
    const user = await adminModel.findOne({ userId });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid User" 
      });
    }

    // 2. Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false,
        message: "Incorrect Password" 
      });
    }

    // 3. Generate JWT token
    const tokenPayload = {
      id: user._id,
      userId: user.userId,
      // Add other necessary user data but avoid sensitive information
    };
    
    const newToken = jwt.sign(
      tokenPayload,
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // 4. Update user's online status & token
    user.isOnline = true;
    user.token = newToken;
    await user.save();

    // 5. Set HTTP-only cookie
    res.cookie("jwt", newToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // 6. Send success response
    return res.status(200).json({ 
      success: true,
      message: "Login Successful",
      data: {
        id: user._id,
        userId: user.userId,
        // Include other non-sensitive user data as needed
      },
      content:user,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

module.exports = { login };