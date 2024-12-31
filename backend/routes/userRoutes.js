const express = require('express');
const { createUser, loginUser, getUserById, addBalance } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const path = require('path')

const router = express.Router();
// Protect this route with authentication
router.get('/:id', authenticateToken, getUserById);


// POST /users - Create a new user
router.post('/', createUser);

// POST /users/login - Login user
router.post('/login', loginUser);
router.post('/addBalance',authenticateToken, addBalance);

router.get('/uploads/:imageName', (req, res)=>{
    const imageName =  req.params.imageName;
    res.setHeader('Content-Type', 'image/jpg')
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
})


module.exports = router;
