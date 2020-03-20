export default {
  Query: {
    hello: function hello(root: {}, args: { name: string }): String {
      return `Hello ${args.name}`;
    }
  }
};
