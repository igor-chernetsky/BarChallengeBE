const ProductSerializer = {
  serialize({ id, name, image, description, provider }) {
    return {
      id,
      name,
      image,
      description,
      provider
    };
  }
};

module.exports = ProductSerializer;
