const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try{
    const categoriesData = await Category.findAll({
    include: [{ model: Category }, { model: Product }],
    });
    if (!categoriesData) {
      res.status(404).json({ message: 'No catrgories found with that id!' });
      return;
    }
    res.status(200).json(categoriesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    const categoryData = await Category.findByPk({
    include: [{ model: Category }, { model: Product }],
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
try{
const categoryData = await Category.create(req.body);
res.status(200).json(categoryData);
}catch (err){
res.status(400).json(err);
}
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body,{
    where: {
      id: req.params.id,
    }
  })
  .then((category) => {
    if (req.body.category_id && req.body.category_id.length){
      Category.findAll({
        where: { category_id: req.params.id }
      }).then((categories) => {
        // create filtered list of new tag_ids
        const categoriesIds = categories.map(({ category_id }) => category_id);
        const newcategories = req.body.categoryIds
        .filter((category_id) => !categoriesIds.includes(category_id))
        .map((category_id) => {
          return {
            product_id: req.params.id,
            category_id,
          };
        });

          // figure out which ones to remove
        const categoriesToRemove = categories
        .filter(({ category_id }) => !req.body.categoryIds.includes(category_id))
        .map(({ id }) => id);
                // run both actions
        return Promise.all([
          Category.destroy({ where: { id: categoriesToRemove } }),
          Category.bulkCreate(newcategories),
        ]);
      });
    }
  })
  
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: { id: req.params.id }
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
