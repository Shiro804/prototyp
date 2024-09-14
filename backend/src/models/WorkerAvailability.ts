import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the WorkerAvailability model
interface WorkerAvailabilityAttributes {
  id: number;
  userId: number;
  availabilityStatus: "Available" | "Unavailable";
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields when creating a new WorkerAvailability
interface WorkerAvailabilityCreationAttributes
  extends Optional<
    WorkerAvailabilityAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

// Define the WorkerAvailability model class
class WorkerAvailability
  extends Model<
    WorkerAvailabilityAttributes,
    WorkerAvailabilityCreationAttributes
  >
  implements WorkerAvailabilityAttributes
{
  public id!: number;
  public userId!: number;
  public availabilityStatus!: "Available" | "Unavailable";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations
  static associate(models: any) {
    // WorkerAvailability belongs to a User
    WorkerAvailability.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  }
}

// Initialize and define the WorkerAvailability model
export default (sequelize: Sequelize): typeof WorkerAvailability => {
  WorkerAvailability.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      availabilityStatus: {
        type: DataTypes.ENUM("Available", "Unavailable"),
        allowNull: false,
        defaultValue: "Available",
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
      tableName: "WorkerAvailability",
      timestamps: true,
    }
  );

  return WorkerAvailability;
};
