import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import user from './models/user_model.js';
import multer from 'multer';

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/Gallery', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173']
}));

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', async (req, res) => {
  const { user_name, password } = req.body;

  try {
    
    const get_user = await user.findOne({ user_name });
    
    if (get_user && get_user.password === password) {
      const user_detail = {
        name: get_user.name,
        age: get_user.age,
        gender: get_user.gender,
        user_name: get_user.user_name,
        profile_photo: `data:${get_user.img_type};base64,${get_user.profile_photo.toString('base64')}`
      };

      res.status(200).json(user_detail);
    } else {
      res.status(404).json({ message: 'User not found or incorrect password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/signup', upload.single('profile_photo'), async (req, res) => {
  const { name, gender, age, user_name, password } = req.body;

  try {
    let get_user = await user.findOne({ user_name });
    if (get_user) {
      return res.status(409).json({ message: 'This username already exists' });
    }

    const new_user = new user({
      name: name,
      age: age,
      gender: gender,
      user_name: user_name,
      password: password,
      profile_photo: req.file.buffer,
      img_type: req.file.mimetype
    });

    await new_user.save();
    
    res.status(201).json({
      name: name,
      age: age,
      user_name: user_name,
      gender: gender,
      profile_photo: `data:${new_user.img_type};base64,${new_user.profile_photo.toString('base64')}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
