"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Transport", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      transportMethod: {
        type: Sequelize.ENUM("Manual", "Rollwagen", "Automated"),
        allowNull: false,
      },
      materialId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Material",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      startLocationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Hall",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      endLocationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Hall",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Transport");
  },
};
