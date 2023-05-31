// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category,{
foreignKey:' ',
});
// Categories have many Products
Category.hasMany(Product, {
  foreignKey:'category_id',
  onDelete:'CASCADE',
});
// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  foreignKey:'',
});
// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  foreignKey:'',
});
module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
