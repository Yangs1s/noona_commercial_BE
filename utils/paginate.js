// util에서는 모델을 직접 받아올수 없어서 인자로 받아옴
const paginate = async (Model, page, limit, cond) => {
  const maxLimit = Math.min(limit, 50);
  if (maxLimit < limit) {
    throw new Error("한 페이지당 최대 50개의 상품만 조회할 수 있습니다.");
  }
  const skip = page ? (page - 1) * limit : 0;
  const totalCount = await Model.countDocuments(cond);
  return { skip, totalCount, maxLimit };
};

module.exports = paginate;
