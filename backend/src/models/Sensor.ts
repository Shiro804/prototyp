import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the Sensor model
interface SensorAttributes {
  id: number;
  type: "Temperature" | "Pressure";
  machineId: number;
  value: number;
  timestamp?: Date;
}

// Optional fields when creating a new Sensor
interface SensorCreationAttributes
  extends Optional<SensorAttributes, "id" | "timestamp"> {}

// Define the Sensor model class
class Sensor
  extends Model<SensorAttributes, SensorCreationAttributes>
  implements SensorAttributes
{
  public id!: number;
  public type!: "Temperature" | "Pressure";
  public machineId!: number;
  public value!: number;
  public readonly timestamp!: Date;

  // Define associations
  static associate(models: any) {
    // Sensor belongs to a Machine
    Sensor.belongsTo(models.Machine, {
      foreignKey: "machineId",
      as: "machine",
    });
  }
}

// Initialize and define the Sensor model
export default (sequelize: Sequelize): typeof Sensor => {
  Sensor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM("Temperature", "Pressure"),
        allowNull: false,
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
      value: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      timestamp: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "Sensor",
      timestamps: false, // No need for createdAt/updatedAt
    }
  );

  return Sensor;
};
