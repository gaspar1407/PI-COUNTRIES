const { DataTypes } = require("sequelize");
const { UUIDV4 } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  sequelize.define("activity", {
    ID: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    Nombre: {
      type: DataTypes.STRING,
    },
    Dificultad: {
      type: DataTypes.STRING,
      /* someAttribute: { max: 5, min: 1 }, */
    },
    Duración: {
      type: DataTypes.STRING,
    },
    Temporada: {
      type: DataTypes.ENUM("Otoño", "Invierno", "Primavera", "Verano"),
    },
  });
};
