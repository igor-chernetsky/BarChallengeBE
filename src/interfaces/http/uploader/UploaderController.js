const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');
const upload = require('./uploader');

const singleUpload = upload.single('image');

const UploaderController = {
  get router() {
    const router = Router();

    router.post('/', this.postImage);

    return router;
  },

  postImage(req, res, next) {
    singleUpload(req, res, (err) => {
      if (err) {
        return res.status(400).send({errors: [{title: 'File Upload Error', detail: err.message}]});
      }
      return res.json({'imageUrl': req.file.location});
    });
  }
}

module.exports = UploaderController;