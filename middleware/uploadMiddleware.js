// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Create uploads folder if not exists
// const uploadPath = "uploads/";

// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// // Storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadPath);
//   },

//   filename: (req, file, cb) => {
//     const uniqueName =
//       Date.now() + "-" + Math.round(Math.random() * 1e9);

//     cb(
//       null,
//       uniqueName + path.extname(file.originalname)
//     );
//   },
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpg|jpeg|png|webp/;

//   const isValidExt = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );

//   const isValidMime = allowedTypes.test(file.mimetype);

//   if (isValidExt && isValidMime) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed"));
//   }
// };

// // Upload middleware
// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
//   fileFilter,
// });

// export default upload;
const upload = (req, res, next) => {
  console.log("Upload middleware called");
  next();
}
export default upload;