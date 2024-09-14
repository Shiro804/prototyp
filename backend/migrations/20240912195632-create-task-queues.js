"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("TaskQueue", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      processStepId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ProcessStep",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      machineId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Machine",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: Sequelize.ENUM("Pending", "InProgress", "Complete"),
        allowNull: false,
        defaultValue: "Pending",
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0, // Default priority
      },
      startAt: {
        type: Sequelize.DATE,
        allowNull: true, // Start time for the task
      },
      endAt: {
        type: Sequelize.DATE,
        allowNull: true, // End or completion time for the task
      },
      dependencies: {
        type: Sequelize.JSON, // Storing dependencies as a JSON array or object
        allowNull: true,
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
    await queryInterface.dropTable("TaskQueue");
  },
};
