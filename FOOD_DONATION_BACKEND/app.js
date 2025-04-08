require('dotenv').config();
const express = require('express');
require('./config/dbconfig');
const { RandomNumber } = require('./utils/otphelper');
const { SendEmail } = require('./utils/emailHelper');
const OtpModel = require('./models/otpScheema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Food = require('./models/foodDonate');
const cors = require('cors');
const { sendEmailNotification } = require('./utils/emailHelper2');
const bodyParser = require('body-parser');
const axios = require('axios');
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const AI_STUDIO_API_KEY = process.env.AI_STUDIO_API_KEY; 
const User = require('./models/userScheema');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.get('/', (req, res) => {
  res.send('AI Backend is Running!');
});

app.post('/otps', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Received Email:', email);

    if (!email) {
      return res.status(400).json({
        status: 'failure',
        message: 'Email is not present in the parameter',
      });
    }

    const userExists = await User.findOne({ email });
    console.log('User Exists in DB:', userExists); // Debugging log

    if (userExists) {
      return res.status(400).json({
        status: 'failure',
        message: 'User already exists, OTP not sent',
      });
    }

    const otp = RandomNumber();
    console.log('Generated OTP:', otp);

    await SendEmail(email, otp);

    const newSalt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp.toString(), newSalt);
    console.log('Hashed OTP:', hashedOtp);

    await OtpModel.create({ email, otp: hashedOtp });

    return res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Error in OTP:', error.message);
    return res.status(500).json({
      status: 'failure',
      message: 'Internal server error',
    });
  }
});

app.post('/users/register', async (req, res) => {
  try {
    const { email, otp, password, name, role, phone, address } = req.body;
    console.log(otp, password);

    if (!email || !otp || !password || !name || !role || !phone || !address) {
      return res.status(400).json({
        status: 'fail',
        message:
          'All fields (email, otp, password, name, role, phone, address) are required.',
      });
    }

    const validRoles = ['resturant', 'ngo', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        status: 'fail',
        message: `Invalid role. Allowed values: ${validRoles.join(', ')}`,
      });
    }

    const isEmailExists = await OtpModel.findOne({ email }).sort('-createdAt');

    if (!isEmailExists) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid email or OTP expired',
      });
    }

    // Compare OTP
    const isOtpCorrect = await bcrypt.compare(
      otp.toString(),
      isEmailExists.otp
    );

    if (!isOtpCorrect) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid OTP',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
    });

    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.log('Error in user registration:', error.message);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error: ' + error.message,
      });
    }

    return res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        status: 'fail',
        message: 'email and password are required',
      });
      return;
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      res.status(400).json({
        status: 'fail',
        message: 'incorrect email or password',
      });
      return;
    }

    const { password: newpassword, name, _id, role } = userExists;

    const verifiedPassword = await bcrypt.compare(password, newpassword);

    if (!verifiedPassword) {
      res.status(400).json({
        status: 'fail',
        message: 'password incorrect',
      });
      return;
    }

    const token = jwt.sign(
      {
        email,
        id: _id,
        name,
        role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '1d',
      }
    );

    // console.log(token);

    res.cookie('authorization', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.status(200).json({
      status: 'success',
      data: {
        email,
        name,
      },
    });
  } catch (error) {
    console.log('error in log in: ', error.message);
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
});

app.get('/user/logout', (req, res) => {
  res.clearCookie('authorization');
  res.json({
    status: 'success',
    message: 'logout sucessfully',
  });
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: 'Message cannot be empty.' });
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${AI_STUDIO_API_KEY}`,
      {
        contents: [{ parts: [{ text: userMessage }] }],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const botReply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";
    res.json({ reply: botReply });
  } catch (error) {
    console.error(
      'Error calling AI Studio API:',
      error.response?.data || error.message
    );
    res.status(500).json({ reply: 'AI service is currently unavailable.' });
  }
});

app.use(cookieParser());

const authorizationMiddleWare = (req, res, next) => {
  try {
    const token = req.cookies.authorization;
    console.log('Auth Token:', token);

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized: No token provided',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decodedToken) => {
      if (error) {
        console.log('JWT Verification Error:', error.message);
        return res.status(401).json({
          status: 'fail',
          message: 'Authorization failed: Invalid token',
        });
      }

      console.log('Decoded Token:', decodedToken); // Debug log
      if (!decodedToken.email || !decodedToken.id) {
        console.log('JWT payload does not contain user ID or email');
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid token structure',
        });
      }

      req.user = decodedToken; // Correctly attach user data
      console.log('User attached to req:', req.user);
      next();
    });
  } catch (error) {
    console.error('Middleware Error:', error.message);
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

app.get('/users/me', authorizationMiddleWare, (req, res) => {
  try {
    console.log('req user:', req.user);
    const { email, name, role } = req.user;
    res.status(200).json({
      status: 'success',
      data: {
        email,
        name,
        role,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.post('/donate', authorizationMiddleWare, async (req, res) => {
  try {
    const {
      foodName,
      quantity,
      location,
      foodType,
      expiryDate,
      description,
      donorContact,
      donorEmail,
    } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    if (
      !foodName ||
      !quantity ||
      !location ||
      !foodType ||
      !expiryDate ||
      !donorContact ||
      !donorEmail
    ) {
      return res
        .status(400)
        .json({ message: 'All required fields must be provided' });
    }

    const newFood = new Food({
      donor: req.user.id,
      donorContact,
      donorEmail,
      foodName,
      quantity,
      foodType,
      expiryDate,
      description,
      location,
    });

    await newFood.save();

    res
      .status(201)
      .json({ message: 'Food donation successful', food: newFood });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/available', async (req, res) => {
  try {
    const availableFood = await Food.find({ status: 'Available' }).populate(
      'donor',
      'name address phone'
    );
    res.status(200).json(availableFood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/request/:foodId', authorizationMiddleWare, async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.foodId,
      { status: 'Requested' },
      { new: true, runValidators: false }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // Send email to the receiver

    if (typeof sendEmailNotification !== 'function') {
      console.error('sendEmailNotification is not recognized as a function!');
    } else {
      console.log('sendEmailNotification is a valid function');
    }

    console.log(sendEmailNotification);
    await sendEmailNotification(updatedFood);

    res.json({
      message: 'Food request successful. A confirmation email has been sent.',
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/** 4. Mark Food as Picked Up (PUT) **/
app.put('/pickup/:foodId', authorizationMiddleWare, async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId);
    if (!food || food.status !== 'Requested')
      return res.status(400).json({ message: 'Invalid food request' });

    food.status = 'Picked Up';
    await food.save();

    res.json({ message: 'Food picked up successfully', food });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/donor/food', authorizationMiddleWare, async (req, res) => {
  try {
    console.log('User Email from Auth Middleware:', req.user?.email);

    if (!req.user || !req.user.email) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: User email missing' });
    }

    const donatedFood = await Food.find({ donorEmail: req.user.email });

    console.log(donatedFood);

    if (!donatedFood.length) {
      return res.json({ message: 'No donations found', donatedFood: [] });
    }

    res.json({ donatedFood });
  } catch (error) {
    console.error('Error fetching donor food:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});