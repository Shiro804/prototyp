import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// These are the attributes that the Material model will have
interface MaterialAttributes {
  id: number;
  type: string;
  quantity: number;
  locationId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// These attributes are optional when creating a new Material
interface MaterialCreationAttributes
  extends Optional<MaterialAttributes, "id"> {}

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

  // Association definitions
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

// Define the Material model
export default (sequelize: Sequelize) => {
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
