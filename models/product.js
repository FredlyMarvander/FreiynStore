'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasOne(models.Code)
      Product.belongsTo(models.User)
      Product.belongsToMany(models.Features, { through: 'ProductFeatures', foreignKey: "ProductId" })
    }

    static sortType(type, User) {
      let data = Product.findAll({
        include: {
          model: User,
          attributes: ['email']
        },
        where: {
          type
        }
      })


      return data

    }

    get rupiah() {
      let result = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
      }).format(this.price);
      return result
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Name tidak boleh kosong"
        },
        notEmpty: {
          args: true,
          msg: "Name tidak boleh kosong"
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Price tidak boleh kosong"
        },
        notEmpty: {
          args: true,
          msg: "Price tidak boleh kosong"
        },
        min: {
          args: 1,
          msg: "Price harus lebih besar dari 0"
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Type tidak boleh kosong"
        },
        notEmpty: {
          args: true,
          msg: "Type tidak boleh kosong"
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Image tidak boleh kosong"
        },
        notEmpty: {
          args: true,
          msg: "Image tidak boleh kosong"
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Stock tidak boleh kosong"
        },
        notEmpty: {
          args: true,
          msg: "Stock tidak boleh kosong"
        },
        min: {
          args: 1,
          msg: "Stock harus lebih besar dari 0"
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};