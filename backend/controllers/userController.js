const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Wallet = require('../models/Wallet'); // Import the Wallet model
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
  },
  filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
  }
});

const upload = multer({ storage: storage });

// Create a new user (includes password hashing and wallet creation)
const createUser = async (req, res) => {
  try {
    const { name, email, password, initialWalletAmount } = req.body;
    const image = req.file ? req.file.filename : undefined;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      wallet: null, // Initially set wallet to null, will update after wallet creation
      image
    });

    // Save the user to the database
    await user.save();

    // Create the wallet for the user and set the initial balance
    const walletData = new Wallet({
      userId: user._id,
      balance: initialWalletAmount || 0, // Use provided wallet amount or default to 0
      transactions: [],
    });

    // Save the wallet to the database
    const savedWallet = await walletData.save();

    // Update the user with the wallet reference
    user.wallet = savedWallet._id;
    await user.save();

    // Return success response
    res.status(201).json({
      message: 'User created successfully',
      user,
      wallet: savedWallet,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userId = user._id;

    res.status(200).json({ message: 'Login successful', userId, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Get user by ID (authentication example)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('wallet');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

const addBalance = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid input data. User ID and amount are required.' });
    }

    // Find the user's wallet
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found for this user' });
    }

    // Add the specified amount to the balance
    wallet.balance += amount;

    // Log the transaction
    wallet.transactions.push({
      type: 'credit',
      amount,
      date: new Date(),
    });

    await wallet.save(); // Save the updated wallet

    res.status(200).json({
      message: 'Balance added successfully',
      wallet: {
        userId: wallet.userId,
        balance: wallet.balance,
        transactions: wallet.transactions,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding balance to wallet', error });
  }
};


module.exports = { createUser : [upload.single('image'), createUser], loginUser, getUserById, addBalance };
