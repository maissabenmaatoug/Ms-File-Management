const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "Assets/Base Directory",
  filename: function (req, file, cb) {
    const uniqueFile =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1000) +
      path.extname(file.originalname);

    cb(null, file.fieldname + "-" + uniqueFile);
  },
});

const upload = multer({
  storage: storage,
});

// // Function to filter the uploaded files based on their mime type
// const filter = (file, cb) => {
//   // Allowed file types: jpeg, png, jpg ,pdf
//   const fileType = /jpeg|png|jpg/pdf;
//   const extname = fileType.test(path.extname(file.originalname));
//   if (extname) {
//     // If the file type is allowed, accept it
//     cb(null, true);
//   } else {
//     // If the file type is not allowed, reject it with an error
//     return cb(new Error("Invalid mime type"));
//   }
// };

// // Configuring multer with the defined storage, file size limit, and file filter
// const upload = multer({
//     storage: storage,
//     limits: {
//       // Setting a file size limit of 10 MB
//       fileSize: 10000000,
//     },
//     // Applying the custom file filter function
//     fileFilter: function (req, file, cb) {
//       filter(file, cb);
//     },
//   });

module.exports = upload;




