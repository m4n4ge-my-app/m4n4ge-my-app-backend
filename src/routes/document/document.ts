import express from 'express'
import * as documentsController from '../../controllers/documents/document.controller'
import { upload } from '../../middleware/mutler'

const documentsRouter = express.Router()

documentsRouter.post('/', upload.single('file'), documentsController.uploadToS3)

export default documentsRouter
