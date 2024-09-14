import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the SimulationLog model
interface SimulationLogAttributes {
  id: number;
  eventType: string;
  details?: string;
  timestamp?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields when creating a new SimulationLog
interface SimulationLogCreationAttributes
  extends Optional<
    SimulationLogAttributes,
    "id" | "details" | "timestamp" | "createdAt" | "updatedAt"
  > {}

// Define the SimulationLog model class
class SimulationLog
  extends Model<SimulationLogAttributes, SimulationLogCreationAttributes>
  implements SimulationLogAttributes
{
  public id!: number;
  public eventType!: string;
  public details?: string;
  public readonly timestamp!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize and define the SimulationLog model
export default (sequelize: Sequelize): typeof SimulationLog => {
  SimulationLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
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
      tableName: "SimulationLog",
      timestamps: true, // Automatically manage createdAt and updatedAt
    }
  );

  return SimulationLog;
};
