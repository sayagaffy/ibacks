import { type SchemaTypeDefinition } from 'sanity'
import { heroBannerType } from './heroBannerType'
import { promoHeroType } from './promoHeroType'
import { customerType } from './customerType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [heroBannerType, promoHeroType, customerType],
}
