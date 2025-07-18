// src/validators/joi.common.ts
import Joi from 'joi';

export const sortStringValidator = Joi.string()
  .pattern(/^(-?\w+(,-?\w+)*)?$/)
  .optional()
  .messages({
    'string.pattern.base': `"sort" must be a comma-separated list of field names, optionally prefixed with '-' for descending`,
  });

// ✅ Validate sort with allowed fields only
//    sort: buildSortValidator(['date', 'day', 'isBooked']),
export const buildSortValidator = (allowedFields: string[]) => {
  const regex = new RegExp(`^(-?(${allowedFields.join('|')})(,-?(${allowedFields.join('|')}))*)?$`);
  return Joi.string()
    .pattern(regex)
    .optional()
    .messages({
      'string.pattern.base': `"sort" must only contain: ${allowedFields.join(', ')}`,
    });
};
export const paginationValidators = {
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
  search: Joi.string(),
  isPaginated: Joi.boolean(),
  sort: Joi.string()
    .pattern(/^(-?\w+(,-?\w+)*)?$/)
    .optional()
    .messages({
      'string.pattern.base': `"sort" must be a comma-separated list of field names, optionally prefixed with '-' for descending`,
    }),
};
export const objectIdValidator = (isRequired = false) => {
  let validator = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message('Invalid ObjectId format');

  return isRequired ? validator.required() : validator.optional();
};
