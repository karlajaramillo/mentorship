function updloadImage(req, res) {
  try {
    const { path: imageUrl } = req.file;
    res.status(200).json({ imageUrl });
  } catch (err) {
    res.status(400).json(err);
  }
}

module.exports = { updloadImage };

