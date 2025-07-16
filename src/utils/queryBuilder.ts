interface FilterOptions {
  allowedFields: string[];
  baseQuery?: Record<string, any>;
  searchFields?: string[];
  searchKey?: string;
}

export const buildMongoFilter = (
  input: Record<string, any>,
  options: FilterOptions,
): Record<string, any> => {
  const { allowedFields, baseQuery = {}, searchFields = [], searchKey = 'search' } = options;
  const query: Record<string, any> = { ...baseQuery };

  // Apply direct filters
  for (const field of allowedFields) {
    const value = input[field];
    if (value !== undefined) {
      if (Array.isArray(value)) {
        query[field] = { $in: value };
      } else {
        query[field] = value;
      }
    }
  }

  // Apply $or search for multiple fields
  if (input[searchKey]) {
    const regex = new RegExp(input[searchKey], 'i');
    query.$or = searchFields.map((field) => ({ [field]: regex }));
  }

  return query;
};
