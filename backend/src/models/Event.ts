import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the Event model
interface EventAttributes {
  id: number;
  type: "Transport" | "Process" | "Exception";
  entityId: number;
  timestamp?: Date;
  details?: string;
}

// Optional fields when creating a new Event
interface EventCreationAttributes
  extends Optional<EventAttributes, "id" | "timestamp" | "details"> {}

// Define the Event model class
class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public id!: number;
  public type!: "Transport" | "Process" | "Exception";
  public entityId!: number;
  public readonly timestamp!: Date;
  public details?: string;
}

// Initialize and define the Event model
export default (sequelize: Sequelize): typeof Event => {
  Event.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM("Transport", "Process", "Exception"),
        allowNull: false,
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timestamp: {
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
      tableName: "Event",
      timestamps: false, // No need for createdAt/updatedAt
    }
  );

  return Event;
};
