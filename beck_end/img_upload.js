import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from 'cors';
import user from "./models/user_model.js";

const app = express()
const port = 3001
const connection = mongoose.connect('mongodb://localhost:27017/Gallery')

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5174",
    origin: "http://localhost:5173"
}))

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true }, 
    upload_img: { type: Buffer, required: true },
    img_type: { type: String, required: true }
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.post('/upload', upload.single('upload_img'), async (req, res) => {
    const { name, date, user_name } = req.body;

    const UserColl = mongoose.model(user_name, userSchema); 

    try {
        const new_img = new UserColl({
            name: name,
            date: new Date(date),
            upload_img: req.file.buffer,
            img_type: req.file.mimetype
        });
        await new_img.save();
        return res.status(201).json({ message: 'Image uploaded successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Error saving image', error: error.message });
    }
});



app.get("/get_photos", async (req, res) => {
    let user_name = req.query.user_name;

    const UserColl = mongoose.model(user_name, userSchema);
    let imgs = await UserColl.find();
    
    if (imgs.length === 0) {
        return res.status(404).json({ "message": "No images found" });
    }

    let img_json = [];
    for (let i = 0; i < imgs.length; i++) {
        img_json.push({
            id: imgs[i]._id,
            name: imgs[i].name,
            date: imgs[i].date,
            img_src: `data:${imgs[i].img_type};base64,${imgs[i].upload_img.toString('base64')}`
        });
    }

    res.status(200).send(img_json);
});


app.delete("/delete/:user_name/:id", async (req,res) => {
    try{
        let user_name = req.params.user_name
        const UserColl = mongoose.model(user_name, userSchema); 
        let id = req.params.id
        await UserColl.deleteOne({ _id: id })
        res.status(200).json({"message": "image was deleted"})
    }catch(error){
        console.log(error)
        res.status(500).json({"message": error})
    }
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});