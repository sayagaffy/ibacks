import { type SchemaTypeDefinition } from 'sanity'
import { heroBannerType } from './heroBannerType'
import { customerType } from './customerType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [heroBannerType, customerType],
}
