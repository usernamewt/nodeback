let express = require("express")
let router = express.Router();
let multer = require("multer")
// 上传文件统一接口
const stroage = multer.diskStorage({
    destination: function (req, file, cd) {
        if(process.env.environment && process.env.environment==="PRO"){
          console.log("process.env.environment:",process.env.environment)
          cd(null, "/root/images");
        }else{
          cd(null, "./public/images");
        }
      },
      filename: function (req, file, cb) {
        var fileFormat = file.originalname.split(".");
        cb(null, `${Date.now()}.` + fileFormat[fileFormat.length - 1]);
      },
})

let upload = multer({ storage: stroage });
router.post("/api/upload", upload.any(), function (req, res, next) {
  console.log(req.files);
  let url = `http://${req.headers.host}/images/${req.files[0].filename}`;
  if (!req.files) return res.json({ code: 400, message: "Upload failed" });
  return res.json({ code: 200, message: "Uploaded successfully", url: url });
});
module.exports = router;