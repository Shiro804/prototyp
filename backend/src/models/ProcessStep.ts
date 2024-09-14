import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the ProcessStep model
interface ProcessStepAttributes {
  id: number;
  name: string;
  orderId: number;
  machineId: number;
  status: "Pending" | "InProgress" | "Complete";
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields when creating a new ProcessStep
interface ProcessStepCreationAttributes
  extends Optional<ProcessStepAttributes, "id" | "createdAt" | "updatedAt"> {}

// Define the ProcessStep model class
class ProcessStep
  extends Model<ProcessStepAttributes, ProcessStepCreationAttributes>
  implements ProcessStepAttributes
{
  public id!: number;
  public name!: string;
  public orderId!: number;
  public machineId!: number;
  public status!: "Pending" | "InProgress" | "Complete";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations
  static associate(models: any) {
    // ProcessStep belongs to a ProductionOrder
    ProcessStep.belongsTo(models.ProductionOrder, {
      foreignKey: "orderId",
      as: "productionOrder",
    });

    // ProcessStep belongs to a Machine
    ProcessStep.belongsTo(models.Machine, {
      foreignKey: "machineId",
      as: "machine",
    });

    // ProcessStep has many Workers
    ProcessStep.hasMany(models.Worker, {
      foreignKey: "processStepId",
      as: "workers",
    });

    // ProcessStep has many Events
    ProcessStep.hasMany(models.Event, {
      foreignKey: "processStepId",
      as: "events",
    });

    // ProcessStep can be part of a TaskQueue
    ProcessStep.hasMany(models.TaskQueue, {
      foreignKey: "processStepId",
      as: "taskQueue",
    });
  }
}

// Initialize and define the ProcessStep model
export default (sequelize: Sequelize): typeof ProcessStep => {
  ProcessStep.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ProductionOrder",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      machineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Machine",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: DataTypes.ENUM("Pending", "InProgress", "Complete"),
        allowNull: false,
        defaultValue: "Pending",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "ProcessStep",
      timestamps: true,
    }
  );

  return ProcessStep;
};
