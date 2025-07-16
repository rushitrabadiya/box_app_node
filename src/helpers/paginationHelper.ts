import mongoose from 'mongoose';

interface PaginationResult<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  nextPage: boolean | null;
  prevPage: boolean | null;
  data: T[];
}

export const paginateQuery = async <T>(
  query: mongoose.Query<T[], T>,
  reqQuery: any,
): Promise<PaginationResult<T>> => {
  const page = Math.max(parseInt(reqQuery.page, 10) || 1, 1);
  const limit = Math.max(parseInt(reqQuery.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    query.clone().skip(skip).limit(limit), // clone to reuse
    query.model.countDocuments(query.getFilter()), // base count
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    nextPage: page < totalPages,
    prevPage: page > 1,
    data,
  };
};
