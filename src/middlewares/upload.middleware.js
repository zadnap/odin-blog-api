import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, done) => {
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.mimetype)) {
      done(
        new Error(
          `File type "${file.mimetype}" is not supported. Allowed file types: JPG, PNG.`
        )
      );
    } else {
      done(null, true);
    }
  },
});

export default upload;
