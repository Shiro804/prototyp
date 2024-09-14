import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Attributes for the QualityCheck model
interface QualityCheckAttributes {
  id: number;
  materialId: number;
  result: "Pass" | "Fail";
  checkTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional fields when creating a new QualityCheck
interface QualityCheckCreationAttributes
  extends Optional<
    QualityCheckAttributes,
    "id" | "checkTime" | "createdAt" | "updatedAt"
  > {}

// Define the QualityCheck model class
class QualityCheck
  extends Model<QualityCheckAttributes, QualityCheckCreationAttributes>
  implements QualityCheckAttributes
{
  public id!: number;
  public materialId!: number;
  public result!: "Pass" | "Fail";
  public readonly checkTime!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations
  static associate(models: any) {
    // QualityCheck is associated with Material
    QualityCheck.belongsTo(models.Material, {
      foreignKey: "materialId",
      as: "material",
    });
  }
}

// Initialize and define the QualityCheck model
export default (sequelize: Sequelize): typeof QualityCheck => {
  QualityCheck.init(
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
      result: {
        type: DataTypes.ENUM("Pass", "Fail"),
        allowNull: false,
      },
      checkTime: {
        allowNull: false,
        type: DataTypes.DATE,
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
      tableName: "QualityCheck",
      timestamps: true,
    }
  );

  return QualityCheck;
};
