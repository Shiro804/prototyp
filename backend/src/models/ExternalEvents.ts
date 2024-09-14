import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the ExternalEvent model
interface ExternalEventAttributes {
  id: number;
  sourceSystem: string;
  eventType: string;
  eventTime?: Date;
  details?: string;
}

// Optional fields when creating a new ExternalEvent
interface ExternalEventCreationAttributes
  extends Optional<ExternalEventAttributes, "id" | "eventTime" | "details"> {}

// Define the ExternalEvent model class
class ExternalEvent
  extends Model<ExternalEventAttributes, ExternalEventCreationAttributes>
  implements ExternalEventAttributes
{
  public id!: number;
  public sourceSystem!: string;
  public eventType!: string;
  public readonly eventTime!: Date;
  public details?: string;
}

// Initialize and define the ExternalEvent model
export default (sequelize: Sequelize): typeof ExternalEvent => {
  ExternalEvent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sourceSystem: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      eventType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      eventTime: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      details: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "ExternalEvent",
      timestamps: false, // No need for createdAt/updatedAt
    }
  );

  return ExternalEvent;
};
