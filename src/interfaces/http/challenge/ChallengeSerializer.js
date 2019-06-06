const ChallengeSerializer = {
  serialize({ id, name, description, provider, products, status }) {
    return {
      id,
      name,
      description,
      provider,
      products,
      status
    };
  }
};

module.exports = ChallengeSerializer;
