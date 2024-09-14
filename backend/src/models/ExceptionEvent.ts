import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the ExceptionEvent model
interface ExceptionEventAttributes {
  id: number;
  eventId: number;
  severity: "Low" | "Medium" | "Critical";
  description: string;
  createdAt?: Date;
}

// Optional fields when creating a new ExceptionEvent
interface ExceptionEventCreationAttributes
  extends Optional<ExceptionEventAttributes, "id" | "createdAt"> {}

// Define the ExceptionEvent model class
class ExceptionEvent
  extends Model<ExceptionEventAttributes, ExceptionEventCreationAttributes>
  implements ExceptionEventAttributes
{
  public id!: number;
  public eventId!: number;
  public severity!: "Low" | "Medium" | "Critical";
  public description!: string;
  public readonly createdAt!: Date;

  // Define associations
  static associate(models: any) {
    // ExceptionEvent belongs to an Event
    ExceptionEvent.belongsTo(models.Event, {
      foreignKey: "eventId",
      as: "event",
    });
  }
}

// Initialize and define the ExceptionEvent model
export default (sequelize: Sequelize): typeof ExceptionEvent => {
  ExceptionEvent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Event",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      severity: {
        type: DataTypes.ENUM("Low", "Medium", "Critical"),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "ExceptionEvent",
      timestamps: false, // No need for createdAt/updatedAt
    }
  );

  return ExceptionEvent;
};
