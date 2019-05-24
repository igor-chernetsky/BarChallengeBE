const CustomerSerializer = {
  serialize({ id, name, email, phone }) {
    return {
      id,
      name,
      email,
      phone
    };
  }
};

module.exports = CustomerSerializer;
