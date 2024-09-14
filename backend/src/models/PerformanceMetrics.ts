import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the PerformanceMetric model
interface PerformanceMetricAttributes {
  id: number;
  entityId: number;
  metricName: string;
  value: number;
  timestamp?: Date;
}

// Optional fields when creating a new PerformanceMetric
interface PerformanceMetricCreationAttributes
  extends Optional<PerformanceMetricAttributes, "id" | "timestamp"> {}

// Define the PerformanceMetric model class
class PerformanceMetric
  extends Model<
    PerformanceMetricAttributes,
    PerformanceMetricCreationAttributes
  >
  implements PerformanceMetricAttributes
{
  public id!: number;
  public entityId!: number;
  public metricName!: string;
  public value!: number;
  public readonly timestamp!: Date;
}

// Initialize and define the PerformanceMetric model
export default (sequelize: Sequelize): typeof PerformanceMetric => {
  PerformanceMetric.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      metricName: {
        type: DataTypes.STRING,
        allowNull: false,
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
      tableName: "PerformanceMetric",
      timestamps: false, // No need for createdAt/updatedAt
    }
  );

  return PerformanceMetric;
};
