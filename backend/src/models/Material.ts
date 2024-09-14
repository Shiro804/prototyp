import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the Material model
interface MaterialAttributes {
  id: number;
  type: string;
  quantity: number;
  locationId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields when creating a new Material (id, createdAt, and updatedAt are generated automatically)
interface MaterialCreationAttributes
  extends Optional<MaterialAttributes, "id" | "createdAt" | "updatedAt"> {}

// Define the Material model class
class Material
  extends Model<MaterialAttributes, MaterialCreationAttributes>
  implements MaterialAttributes
{
  public id!: number;
  public type!: string;
  public quantity!: number;
  public locationId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations
  static associate(models: any) {
    // Material belongs to a Hall
    Material.belongsTo(models.Hall, { foreignKey: "locationId", as: "hall" });

    // Material has many MaterialBatches
    Material.hasMany(models.MaterialBatch, {
      foreignKey: "materialId",
      as: "materialBatches",
    });
  }
}

// Initialize and define the Material model
export default (sequelize: Sequelize): typeof Material => {
  Material.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
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
      tableName: "Material",
      timestamps: true,
    }
  );

  return Material;
};
