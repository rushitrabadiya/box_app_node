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
  let sort: Record<string, 1 | -1> | undefined;

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
  if (input.sort) {
    sort = {};
    const sortFields = input.sort.split(',');
    for (const field of sortFields) {
      if (field.startsWith('-')) {
        sort[field.substring(1)] = -1;
      } else {
        sort[field] = 1;
      }
    }
  }

  return { query, sort };
};
