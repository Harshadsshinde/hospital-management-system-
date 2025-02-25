import app from "./app.js";
import cloudinary from "cloudinary";
import cors from 'cors';



app.use(cors({
  origin: ['http://localhost:5173','http://localhost:5174'],

  credentials: true, // allows cookies, authentication headers, etc.
}));

cloudinary.v2.config({
   cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
   api_key:process.env.CLOUDINARY_API_KEY,
   api_secret:process.env.CLOUDINARY_API_SECRET,

})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
