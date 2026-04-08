import { defineField, defineType } from 'sanity';

export const promoHeroType = defineType({
  name: 'promoHero',
  title: 'Promo Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        defineField({
          name: 'slide',
          title: 'Slide',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              options: {
                source: 'title',
                maxLength: 96,
              },
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtitle',
              type: 'text',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
            }),
            defineField({
              name: 'highlights',
              title: 'Highlights',
              type: 'array',
              of: [{ type: 'string' }],
            }),
            defineField({
              name: 'ctaText',
              title: 'Call to Action Text',
              type: 'string',
            }),
            defineField({
              name: 'ctaLink',
              title: 'Call to Action Link',
              type: 'string',
            }),
            defineField({
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Image', value: 'image' },
                  { title: 'Video', value: 'video' },
                ],
                layout: 'radio',
              },
              initialValue: 'image',
            }),
            defineField({
              name: 'youtubeUrl',
              title: 'YouTube URL',
              type: 'url',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'posterImage',
              title: 'Video Poster Image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'videoMp4',
              title: 'Video MP4',
              type: 'file',
              options: {
                accept: 'video/mp4',
              },
            }),
            defineField({
              name: 'videoWebm',
              title: 'Video WebM',
              type: 'file',
              options: {
                accept: 'video/webm',
              },
            }),
            defineField({
              name: 'productIds',
              title: 'Product IDs (Jubelio)',
              type: 'array',
              of: [{ type: 'number' }],
            }),
          ],
        }),
      ],
    }),
  ],
});
