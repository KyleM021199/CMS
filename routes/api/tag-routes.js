const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try{
    const tagsData = await Tag.findAll({
    include: [{ model: Product, through: ProductTag,  as:'tags_products' }],
    });
    if (!tagsData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }
    res.status(200).json(tagsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{
    const tagsData = await Tag.findByPk(req.params.id, {
    include: [{ model: Product, through: ProductTag, as: 'tags_products' }], 
    });
    if (!tagsData) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }
    res.status(200).json(tagsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new tag
  req.body = 
  {
    tag_name: req.body.tag_name,
  }
  Tag.create(req.body)
  .then((tag) => {
    if (req.body.tagIds.length) {
    const productTagIdArr = req.body.tagIds.map((tag_id) => {
      return {
        product_id,
        tag_id: tag.id,
      };
  });
  return ProductTag.bulkCreate(productTagIdArr);
}
  res.status(200).json(tag);
})
.then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  req.body = 
  {
    tag_name: req.body.tag_name,
  }  
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: { id: req.params.id }
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
