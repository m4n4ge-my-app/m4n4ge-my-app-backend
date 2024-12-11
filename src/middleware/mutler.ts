import createHttpError from 'http-errors'
import multer from 'multer'
import path from 'path'

//define storage configuration
const storage = multer.memoryStorage()

//define upload configuration
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    //TODO: Add more file types later
    const fileExtension = path.extname(file.originalname).toLowerCase()
    if (fileExtension === '.pdf') {
      return cb(null, true) // Accept the file
    } else {
      const error = createHttpError(`Mismatched file type: Only PDF files are allowed!`) as any
      error.status = 400
      return cb(error, false)
    }
  }
})

export { upload }
