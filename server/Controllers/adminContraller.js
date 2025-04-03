
const dotenv = require('dotenv');
dotenv.config();

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
  
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid User" });
      }
      const token = user.token;
      if (!token) {
        await userModel.deleteOne({ _id: user._id });
        return res.status(400).json({ message: "Invalid User Token" });
      }
  
      const hashedpassword = await bcrypt.compare(password, user.password);
      if (!hashedpassword) {
        return res.status(400).json({ message: "Incorrect Password" });
      }
  
      const newToken = jwt.sign(
        { email: user.email, id: user._id },
        process.env.SECRET_KEY
      );
      user.isOnline= true
      user.token = newToken;
      await user.save();
  
      res.cookie("jwt", user.token, {
        httpOnly: true,
        sameSite: "none", 
        secure: true, 
        maxAge: 60 * 60 * 1000, // 1 hour
        // maxAge:  60000, // 1 min
      });
      return res.status(200).json({ message: "Login Successfully" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "server Error" });
    }
  };

  module.exports = {login};
