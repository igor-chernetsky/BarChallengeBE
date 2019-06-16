const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../../../../config');

aws.config.update({
  secretAccessKey: config.awsKeys.secret,
  accessKeyId: config.awsKeys.id,
  region: 'eu-central-1'
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid Mime Type, only JPEG and PNG are allowed'), false);
  }
};

const s3 = new aws.S3({ /* ... */ });
 
const upload = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'drink-challenge-images',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
});

module.exports = upload;