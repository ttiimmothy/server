import multer from "multer"
import path from "path"

export const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (req.path.startsWith("/api/documents/encrypted/document")) {
      // Store files for encrypted routes
      // NOTE: __dirname get the path of the root in project level instead of whole filesystem level
      callback(null, path.resolve(__dirname, "../encrypted/uploads/documents"));
    } else {
      callback(null, path.resolve(__dirname, "../uploads"))
    }
  },
  filename: (req, file, callback) => {
    callback(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`)
  }
})
export const upload = multer({storage})