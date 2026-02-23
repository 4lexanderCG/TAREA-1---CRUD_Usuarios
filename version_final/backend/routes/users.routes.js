const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const { search } = req.query;

  if (search) {
    db.query(
      "SELECT * FROM users WHERE nombre LIKE ? OR apellidos LIKE ? OR dni LIKE ?",
      [`%${search}%`, `%${search}%`, `%${search}%`],
      (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
      }
    );
  } else {
    db.query("CALL GetUsers()", (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results[0]);
    });
  }
});

router.post("/", (req, res) => {
  const { nombre, apellidos, dni, direccion, telefono, correo } = req.body;

  db.query(
    "CALL InsertUser(?, ?, ?, ?, ?, ?)",
    [nombre, apellidos, dni, direccion, telefono, correo],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Usuario creado" });
    }
  );
});

router.put("/:id", (req, res) => {
  const { nombre, apellidos, dni, direccion, telefono, correo } = req.body;

  db.query(
    "CALL UpdateUser(?, ?, ?, ?, ?, ?, ?)",
    [req.params.id, nombre, apellidos, dni, direccion, telefono, correo],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Usuario actualizado" });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.query("CALL DeleteUser(?)", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Usuario eliminado" });
  });
});

module.exports = router;