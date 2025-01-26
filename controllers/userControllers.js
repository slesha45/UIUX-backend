const userModel = require('../models/userModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createUser = async (req, res) => {
    const { fullName, email, password } = req.body
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }
    try {
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const randomSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, randomSalt)

        const newUser = new userModel({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            plainPassword: password
        })
        await newUser.save()

        res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error creating user" })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }
    try {
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid password" })
        }

        const token = await jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        )

        res.status(201).json({
            message: "User logged in successfully",
            token: token,
            userData: user
        })
    } catch (error) {
        res.status(400).json({ message: "Error logging in user" })
    }
}

const getUserProfile = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const updateUserProfile = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const { fullName, email, currentPassword, newPassword } = req.body;
  
      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
  
      if (currentPassword && newPassword) {
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Current password is incorrect' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
      }
  
      await user.save();
      res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

const getCurrentProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            user: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error,
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
      const users = await userModel.find({}, { plainPassword: 1, fullName: 1, email: 1 }); // Include plain-text password for demo
      res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  };

module.exports = {
    createUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getCurrentProfile,
    getAllUsers
}