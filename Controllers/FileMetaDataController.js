const { PrismaClient, FileStatus } = require("@prisma/client");

const prisma = new PrismaClient();


exports.getMetaData = async (req, res) => {
  try {
    const file = await prisma.fileMetaData.findUnique({
      where: {
        uid: req.params.uid,
      },
      include: {
        file: true,
      },
    });
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json(error.message);
  }
};


exports.updateMetaData = async (req, res) => {
  try {
    const metaDataId = req.params.uid;
    const existingMetaData = await prisma.fileMetaData.findUnique({
      where: { uid: metaDataId },
    });

    if (!existingMetaData) {
      return res.status(404).json({ error: "File's metaData not found" });
    }

    const fileMetaData = await prisma.fileMetaData.update({
      where: {
        uid: metaDataId,
      },

      data: {
        key: req.body.key,
        value: req.body.value,
      },
      include: {
        file: true,
      },
    });
    res.status(200).json(fileMetaData);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.deleteMetaData = async (req, res) => {
  try {
    const metaDataId = req.params.uid;
    const existingMetaData = await prisma.fileMetaData.findUnique({
      where: {
        uid: metaDataId,
      },
    });

    if (!existingMetaData) {
      res.status(404).json({ error: "FileMetaData not found" });
    }

    await prisma.fileMetaData.delete({
      where: {
        uid: metaDataId,
      },
    });
    res.status(200).json({ message: "FileMetaData deleted succefully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.searchFileByMetadata = async (req, res) => {
  try {
    const key = req.body.key;
    const value = req.body.value;

    if (!key || !value) {
      return res
        .status(400)
        .json({ error: "Les champs key et value doivent être non vides." });
    }

    const files = await prisma.fileMetaData.findMany({
      where: {
        //Dans ce cas on va chercher les fichiers ayant les metaData key et value que nous avons spécifiés dans req.body
        //On peut également ajouter le uid si on veut faire la recherche d'un fichier spécifique.
        
        // uid: req.body.uid,
        key: key,
        value: value,
      },
      include: {
        file: true,
      },
    });

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
