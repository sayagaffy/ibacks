import { defineField, defineType } from 'sanity';

export const customerType = defineType({
  name: 'customer',
  title: 'Customer',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'password',
      title: 'Password',
      type: 'string',
      hidden: true, // Sembunyikan secara visual di CMS karena di-hash
    }),
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'jubelioReferenceId',
      title: 'Jubelio Reference ID',
      type: 'string',
      description: 'ID internal pelanggan di Jubelio jika sudah tersinkron',
    }),
  ],
});
