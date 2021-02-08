let transParams = (data) => {
  let params = new URLSearchParams();
  for (let item in data) {
    params.append(item, data["" + item + ""]);
  }
  return params;
};

module.exports = {
  transParams,
};
