const { PrismaClient, FileStatus } = require("@prisma/client");
const uploadMulter = require("../Lib/multer");
const { v4: uuidv4 } = require("uuid");
const uploadFile = uploadMulter.single("fileUploaded");
const prisma = new PrismaClient();
const fs = require("fs");
const crypto = require("crypto");

exports.UploadFile = async (req, res) => {
  try {
    uploadFile(req, res, async function (error) {
      console.log("cc", req?.file);
      var errors = {};
      if (error) {
        errors.fileUploaded = error.message;

        return res.status(404).json(errors);
      } else {
        const keys = await prisma.fileMetaDataKey.findMany({
          select: {
            key: true,
          },
        });
        const tabKeys = keys.map((key) => Object.values(key)).flat();

        if (tabKeys?.includes(JSON.parse(req.body.data)?.key)) {
          var filePath = req?.file?.path;
          console.log("filePath", filePath);
          const hashedFile = fs.readFileSync(filePath);
          const md5HashFile = crypto
            .createHash("md5")
            .update(hashedFile)
            .digest("hex");
          console.log("md5HashFile", md5HashFile);
          const fileUploaded = {
            uid: uuidv4(),
            fileName: req?.file?.filename,
            location: "/static/images" + req?.file?.filename,
            format: req?.file?.mimetype.split("/")[1],
            md5Hash: md5HashFile,
            //createdBy pour le moment c'est statique jusqu'à avoir le user_id à partir du token
            createdBy: "Maissa",
            status: FileStatus.ACTIVE,
          };

          const data = await prisma.file.create({
            data: fileUploaded,
          });
          const metaData = await prisma.fileMetaData.create({
            data: {
              uid: uuidv4(),
              uidFile: fileUploaded.uid,
              //key and value added from postman with file for now
              key: JSON.parse(req.body.data)?.key,
              value: JSON.parse(req.body.data)?.value,
            },
          });

          console.log("metaData", metaData);

          res.status(201).send(data);
        } else {
          res.status(404).json({
            message: "The file's key doesn't exist",
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getFile = async (req, res) => {
  try {
    const file = await prisma.file.findUnique({
      where: {
        uid: req.params.uid,
      },
    });
    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    const filePath = `Assets/Base Directory/${file.fileName}`;
    const fileContent = fs.readFileSync(filePath);
    const md5Hash = crypto.createHash("md5").update(fileContent).digest("hex");
    console.log("jj", md5Hash);
    console.log("rr", file.md5Hash);
    if (md5Hash !== file.md5Hash) {
      throw new Error("File content hash does not match with the stored hash");
    }

    res.status(200).json({
      success: true,
      file: file,
      PhysicalLocation: `Assets/Base Directory/${file.fileName}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFile = async (req, res) => {
  try {
    const fileId = req.params.uid;
    const existingFile = await prisma.file.findUnique({
      where: { uid: fileId },
    });

    if (!existingFile) {
      return res.status(404).json({ error: "File not found" });
    }

    const file = await prisma.file.update({
      where: {
        uid: fileId,
      },

      data: {
        //On peut rajouter d'autres champs à modifier selon le besoin,j'ai juste ajouté fileName,location ,format et status
        fileName: req.body.fileName,
        location: "/static/images" + req.body.location,
        format: req.body.format,
        status: req.body.status,
      },
    });
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.deleteFile = async (req, res) => {
  const fileId = req.params.uid;

  const existingFile = await prisma.file.findUnique({
    where: { uid: fileId },
  });

  if (!existingFile) {
    return res.status(404).json({ error: "File not found" });
  }

  const deletedFile = await prisma.file.update({
    where: { uid: fileId },
    data: { status: "DELETED" }
  });

  res.status(200).json(deletedFile);
};
