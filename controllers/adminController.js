const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = role;
        await user.save();

        res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.deleteOne({ _id: user._id });
        res.json({ message: "User removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getUsers, getUserById, updateUserRole, deleteUser };
