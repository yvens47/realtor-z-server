const multer = require("multer");

const options = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./public/uploads`);
  },
  filename: (req, file, cb) => {
    const fileName =
      Date.now() +
      "-" +
      file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
    cb(null, fileName);
  }
});

function MulterUpload(storage) {
  return multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/gif"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        req.error = "Allowed only .png, .jpg, .jpeg and .gif";
        cb();
        //next();
        //return cb(new Error("Allowed only .png, .jpg, .jpeg and .gif"));
      }
    }
  });
}

const imageUpload = () => {
  const storage = options;
  const uploads = MulterUpload(storage);

  return uploads;
};

const imageUploadMutiple = () => {};

module.exports = imageUpload;
