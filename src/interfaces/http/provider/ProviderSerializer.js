const ProviderSerializer = {
  serialize({ id, name, email, phone, city, address, lat, lng, description, images, logo }) {
    return {
      id,
      name,
      email,
      phone,
      city,
      address,
      lat,
      lng,
      description,
      images,
      logo
    };
  }
};

module.exports = ProviderSerializer;
