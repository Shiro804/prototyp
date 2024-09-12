"use strict";
module.exports = (sequelize, DataTypes) => {
  const SimulationLog = sequelize.define(
    "SimulationLog",
    {
      eventType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "SimulationLog",
      timestamps: true,
    }
  );

  return SimulationLog;
};
