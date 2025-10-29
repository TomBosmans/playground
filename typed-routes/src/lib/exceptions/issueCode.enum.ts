const IssueCode = {
  invalid_type: "invalid_type",
  too_small: "too_small",
  too_big: "too_big",
  invalid_literal: "invalid_literal",
  unrecognized_keys: "unrecognized_keys",
  not_a_date: "not_a_date",
  invalid_enum_value: "invalid_enum_value",
  invalid_arguments: "invalid_arguments",
  invalid_string: "invalid_string",
  invalid_number: "invalid_number",
  invalid_boolean: "invalid_boolean",
  invalid_object: "invalid_object",
  invalid_array: "invalid_array",
  invalid_date: "invalid_date",
  custom: "custom",
  not_unique: "not_unique",
  invalid_union: "invalid_union",
  invalid_union_discriminator: "invalid_union_discriminator",
  invalid_return_type: "invalid_return_type",
  invalid_intersection_types: "invalid_intersection_types",
  not_multiple_of: "not_multiple_of",
  not_finite: "not_finite",
} as const

type IssueCode = (typeof IssueCode)[keyof typeof IssueCode]
export default IssueCode
