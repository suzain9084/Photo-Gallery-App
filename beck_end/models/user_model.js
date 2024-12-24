import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  user_name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_photo: { type: Buffer, required: true }, 
  img_type: { type: String, required: true }
});

const user = mongoose.model('User', userSchema);

export default user;
