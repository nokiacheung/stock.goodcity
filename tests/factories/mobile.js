export default {
  hongKong: function() {
    return Math.floor(Math.random() * 8999922 + 67110000).toString();
  },

  nonHongKong: function() {
    return Math.floor(Math.random() * 8999922 + 671100001).toString();
  }
};
