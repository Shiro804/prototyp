import { Model, DataTypes, Sequelize } from "sequelize";

interface TaskQueueAttributes {
  id?: number;
  processStepId: number;
  userId?: number;
  machineId?: number;
  status: "Pending" | "InProgress" | "Complete";
  priority: number;
  startAt?: Date;
  endAt?: Date;
  dependencies?: object; // Can be an array or object depending on the structure
  createdAt?: Date;
  updatedAt?: Date;
}

export class TaskQueue
  extends Model<TaskQueueAttributes>
  implements TaskQueueAttributes
{
  public id!: number;
  public processStepId!: number;
  public userId?: number;
  public machineId?: number;
  public status!: "Pending" | "InProgress" | "Complete";
  public priority!: number;
  public startAt?: Date;
  public endAt?: Date;
  public dependencies?: object;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    TaskQueue.belongsTo(models.ProcessStep, {
      foreignKey: "processStepId",
      as: "processStep",
    });

    TaskQueue.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    TaskQueue.belongsTo(models.Machine, {
      foreignKey: "machineId",
      as: "machine",
    });
  }
}

export default (sequelize: Sequelize) => {
  TaskQueue.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      processStepId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ProcessStep",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Task can be unassigned
        references: {
          model: "User",
          key: "id",
        },
      },
      machineId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional machine assignment
        references: {
          model: "Machine",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("Pending", "InProgress", "Complete"),
        allowNull: false,
        defaultValue: "Pending",
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Default priority value
      },
      startAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dependencies: {
        type: DataTypes.JSON, // Dependencies as a JSON array
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "TaskQueue",
      timestamps: true, // Sequelize will handle createdAt and updatedAt
    }
  );

  return TaskQueue;
};
