const ProviderSerializer = {
  serialize({ id, name, email, phone, address, description, logo }) {
    return {
      id,
      name,
      email,
      phone,
      address,
      description,
      logo
    };
  }
};

module.exports = ProviderSerializer;
