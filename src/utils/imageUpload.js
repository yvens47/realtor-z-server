const multer = require("multer");
const multerS3 = require("multer-s3");
//s3
const aws = require("aws-sdk");
const uuid = require("uuid");

// aws storage object
aws.config.setPromisesDependency();
aws.config.update({
  accessKeyId: "AKIAZWTT42QKOBYMALOG",
  secretAccessKey: "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",
  region: ""

})
const BUCKET_NAME = "realtor-zfddbc35f-bd08-4ee5-85e5-1998a1fdf585";
const s3 = new aws.S3({
  apiVersion: '2006-03-01'
});







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

const imageUploadWithAWS = () => {
  return multer({
    storage: multerS3({
      s3: s3,
      ACL: 'public-read',

      bucket: BUCKET_NAME + "/houses",
      metadata: function (req, file, cb) {
        cb(null, {
          fieldName: file.fieldname
        });
      },
      key: function (req, file, cb) {

        console.log(file);
        cb(null, Date.now().toString())
      },


    })
  })
};

module.exports = Upload = {
  imageUploadWithAWS,
  imageUpload


};