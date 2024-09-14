import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the GPSTracker model
interface GPSTrackerAttributes {
  id: number;
  transportId: number;
  latitude: number;
  longitude: number;
  timestamp?: Date;
}

// Optional fields when creating a new GPSTracker
interface GPSTrackerCreationAttributes
  extends Optional<GPSTrackerAttributes, "id" | "timestamp"> {}

// Define the GPSTracker model class
class GPSTracker
  extends Model<GPSTrackerAttributes, GPSTrackerCreationAttributes>
  implements GPSTrackerAttributes
{
  public id!: number;
  public transportId!: number;
  public latitude!: number;
  public longitude!: number;
  public readonly timestamp!: Date;

  // Define associations
  static associate(models: any) {
    // GPSTracker belongs to a TransportSystem
    GPSTracker.belongsTo(models.TransportSystem, {
      foreignKey: "transportId",
      as: "transportSystem",
    });
  }
}

// Initialize and define the GPSTracker model
export default (sequelize: Sequelize): typeof GPSTracker => {
  GPSTracker.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      transportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "TransportSystem",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      longitude: {
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
      tableName: "GPSTracker",
      timestamps: false, // No need for createdAt/updatedAt
    }
  );

  return GPSTracker;
};
