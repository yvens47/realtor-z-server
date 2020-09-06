const multer = require("multer");
const multerS3 = require("multer-s3");
//s3
const aws = require("aws-sdk");
const uuid = require("uuid");

const options = {
  accessKeyId: process.env.AccessKeyId,
  secretAccessKey: process.env.SecretAccessKey,
  region: "us-east-1"

}
aws.config.update(options)
const s3 = new aws.S3();


function MulterUpload(storage) {

  return multer({
    storage: storage,

  });
}

const imageUpload = () => {
  const storage = multer.diskStorage({
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
  });;
  const uploads = MulterUpload(storage);

  return uploads;
};

function uploader(bucket) {
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: bucket,
      acl: "public-read",
      metadata: function (req, file, cb) {
        cb(null, {
          fieldName: file.fieldname
        });
      },
      key: function (req, file, cb) {
        cb(null, file.originalname);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/gif") {
        cb(null, true);
      } else {
        cb(null, false);
        req.error = "Allowed only .png, .jpg, .jpeg and .gif";
        cb();
        next();
        return cb(new Error("Allowed only .png, .jpg, .jpeg and .gif"));
      }
    }
  });
}



module.exports = Upload = {

  imageUpload,
  uploader



};