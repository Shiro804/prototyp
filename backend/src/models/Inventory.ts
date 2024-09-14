import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the Inventory model
interface InventoryAttributes {
  id: number;
  materialId: number;
  quantity: number;
  locationId: number;
  updatedAt?: Date;
}

// Optional fields when creating a new Inventory
interface InventoryCreationAttributes
  extends Optional<InventoryAttributes, "id" | "updatedAt"> {}

// Define the Inventory model class
class Inventory
  extends Model<InventoryAttributes, InventoryCreationAttributes>
  implements InventoryAttributes
{
  public id!: number;
  public materialId!: number;
  public quantity!: number;
  public locationId!: number;
  public readonly updatedAt!: Date;

  // Define associations
  static associate(models: any) {
    // Inventory belongs to a Material
    Inventory.belongsTo(models.Material, {
      foreignKey: "materialId",
      as: "material",
    });

    // Inventory belongs to a Hall (location)
    Inventory.belongsTo(models.Hall, {
      foreignKey: "locationId",
      as: "location",
    });
  }
}

// Initialize and define the Inventory model
export default (sequelize: Sequelize): typeof Inventory => {
  Inventory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      materialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Material",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Hall",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "Inventory",
      timestamps: false, // No need for createdAt, only updatedAt
    }
  );

  return Inventory;
};
