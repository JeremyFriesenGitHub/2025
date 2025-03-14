// https://github.com/shefing/payload-tools/tree/main/packages/authorization
/* eslint-disable node/prefer-global/process */

import type { User } from '@/db/payload-types'
import type { AccessArgs, CollectionConfig } from 'payload'
import { adminGroups } from '../adminGroups'

type IsAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated: IsAuthenticated = ({ req }) => Boolean(req.user)

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  group: adminGroups.featured,
  useAsTitle: 'displayName',
  defaultColumns: [
    'displayName',
    'pronouns',
    'email',
    'updatedAt',
    'createdAt',
    'id',
  ],
  pagination: {
    defaultLimit: 50,
    limits: [10, 20, 50],
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    livePreview: {
      url: `${process.env.CUHACKING_2025_PORTAL_LOCAL_URL}/profile`,
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 320,
          height: 568,
        },
      ],
    },
  },
  fields: [
    {
      type: 'collapsible',
      label: ({ data }) => data?.title || 'Personal Information',
      fields: [
        { name: 'firstName', type: 'text', label: 'First Name', admin: { readOnly: true } },
        { name: 'middleName', type: 'text', label: 'Middle Name', admin: { readOnly: true } },
        { name: 'lastName', type: 'text', label: 'Last Name', admin: { readOnly: true } },
        { name: 'displayName', type: 'text', label: 'Display Name', admin: { readOnly: true } },
        {
          name: 'pronouns',
          type: 'select',
          label: 'Pronouns',
          admin: { readOnly: true },
          options: [
            { label: 'He/Him', value: 'he/him' },
            { label: 'She/Her', value: 'she/her' },
            { label: 'They/Them', value: 'they/them' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          label: 'Avatar',
          admin: { readOnly: true },
        },
      ],
    },
    {
      type: 'collapsible',
      label: ({ data }) => data?.title || 'Brand & Socials',
      fields: [
        // {
        //   name: 'brandRelation',
        //   type: 'relationship',
        //   relationTo: 'brands',
        //   hasMany: false,
        //   label: 'Associated Brand',
        //   admin: {
        //     description:
        //       'This could be a company, university, or student club.',
        //   },
        // },
        { name: 'linkedin', type: 'text', label: 'LinkedIn', admin: { readOnly: true,
        } },
        { name: 'discord', type: 'text', label: 'Discord', admin: { readOnly: true } },
        { name: 'github', type: 'text', label: 'GitHub', admin: { readOnly: true } },
        { name: 'behance', type: 'text', label: 'Behance', admin: { readOnly: true } },
        { name: 'website', type: 'text', label: 'Personal Website', admin: { readOnly: true } },
      ],
    },
    {
      name: 'dietaryRestrictions',
      type: 'select',
      label: '🍽 Dietary Restrictions',
      admin: { position: 'sidebar', readOnly: true },
      options: [
        { label: '🥗 Vegetarian', value: 'vegetarian' },
        { label: '🌱 Vegan', value: 'vegan' },
        { label: '🕌 Halal', value: 'halal' },
        { label: '✡ Kosher', value: 'kosher' },
        { label: '🐟 Pescatarian', value: 'pescatarian' },
        { label: '🥛 Dairy-Free', value: 'dairy-free' },
        { label: '🌾 Gluten-Free', value: 'gluten-free' },
        { label: '🍤 Shellfish-Free', value: 'shellfish-free' },
        { label: '🥜 Nut-Free', value: 'nut-free' },
        { label: '🥩 Keto', value: 'keto' },
        { label: '🧀 Low-Lactose', value: 'low-lactose' },
        { label: '🍚 Low-Carb', value: 'low-carb' },
        { label: '🍖 Paleo', value: 'paleo' },
        { label: '⚡ High-Protein', value: 'high-protein' },
        { label: '🌿 Raw Vegan', value: 'raw-vegan' },
        { label: '🥒 Whole30', value: 'whole30' },
        { label: '🍵 Fasting', value: 'fasting' },
        { label: '❓ Other', value: 'other' },
      ],
      hasMany: true,
    },
    {
      name: 'allergies',
      type: 'select',
      label: '⚠ Allergies',
      admin: { position: 'sidebar', readOnly: true },
      options: [
        { label: '🥜 Peanuts', value: 'peanuts' },
        { label: '🌰 Tree Nuts', value: 'tree-nuts' },
        { label: '🥛 Dairy', value: 'dairy' },
        { label: '🌾 Gluten', value: 'gluten' },
        { label: '🍤 Shellfish', value: 'shellfish' },
        { label: '🐟 Fish', value: 'fish' },
        { label: '🍯 Soy', value: 'soy' },
        { label: '🍳 Eggs', value: 'eggs' },
        { label: '🥩 Red Meat', value: 'red-meat' },
        { label: '🌽 Corn', value: 'corn' },
        { label: '🥦 Sulfites', value: 'sulfites' },
        { label: '🍎 Fruits', value: 'fruits' },
        { label: '🥕 Vegetables', value: 'vegetables' },
        { label: '☕ Caffeine', value: 'caffeine' },
        { label: '🍯 Honey', value: 'honey' },
        { label: '❓ Other', value: 'other' },
      ],
      hasMany: true,
    },
    {
      name: 'tshirtSize',
      type: 'select',
      label: 'T-Shirt Size',
      admin: { position: 'sidebar', readOnly: true },
      options: [
        { label: 'XS', value: 'xs' },
        { label: 'S', value: 's' },
        { label: 'M', value: 'm' },
        { label: 'L', value: 'l' },
        { label: 'XL', value: 'xl' },
        { label: '2XL', value: '2xl' },
        { label: '3XL', value: '3xl' },
      ],
    },
    {
      label: 'Emergency Contact',
      type: 'collapsible',
      admin: { position: 'sidebar', readOnly: true },
      fields: [
        { name: 'emergencyContactFullName', type: 'text', label: 'Full Name' },
        { name: 'emergencyContactCell', type: 'text', label: 'Cell' },
        { name: 'emergencyContactEmailAddress', type: 'email', label: 'Email Address' },
      ],
    },
    {
      name: 'linkedinSub',
      type: 'text',
      admin: {
        readOnly: true,
      //   condition: (data, siblingData, { user }) => {
      //     return false
      },
    },
    {
      name: 'linkedinId',
      type: 'text',
      admin: {
        readOnly: true,
      //   condition: (data, siblingData, { user }) => {
      //     return false
      },
    },
    {
      name: 'linkedinEmailVerified',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'linkedinLocale',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'githubId',
      type: 'text',
      admin: {
        readOnly: true,
      //   condition: (data, siblingData, { user }) => {
      //     return false
      },
    },
    {
      name: 'githubAvatarUrl',
      type: 'text',
    },
    {
      name: 'githubType',
      type: 'text',
    },
    {
      name: 'githubUrl',
      type: 'text',
    },
    {
      name: 'githubHtmlUrl',
      type: 'text',
    },
    {
      name: 'githubName',
      type: 'text',
    },
    {
      name: 'githubBlog',
      type: 'text',
    },
    {
      name: 'githubLocation',
      type: 'text',
    },
    {
      name: 'githubHireable',
      type: 'text',
    },
    {
      name: 'githubPublicRepos',
      type: 'text',
    },
    {
      name: 'githubLinkedIn',
      type: 'text',
    },
    {
      name: 'githubInstagram',
      type: 'text',
    },
    {
      name: 'githubEmail',
      type: 'text',
    },
    {
      name: 'googleSub',
      type: 'text',
      admin: {
        readOnly: true,
      //   condition: (data, siblingData, { user }) => {
      //     return false
      },
    },
    {
      name: 'googleEmailVerified',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}

export const userData = [
  {
    email: 'adam@example.com',
    password: 'securepassword',
    firstName: 'Adam',
    lastName: 'Said',
    displayName: 'Adam Said',
    pronouns: 'he/him',
    mediaUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQFzuS67keWDSA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1730318417047?e=1745452800&v=beta&t=cqIsgTOVOxdRiT464rfT4EGhaTROdf4s5Y9WHr5egIY',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/adamsaid-/',
    tshirtSize: 'm',
  },
  {
    email: 'ryan@example.com',
    password: 'securepassword',
    firstName: 'Ryan',
    lastName: 'Awad',
    displayName: 'Ryan Awad',
    pronouns: 'he/him',
    mediaUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQGvSOt-3nfCNQ/profile-displayphoto-shrink_800_800/B4EZNUwaleHwAc-/0/1732293799188?e=1745452800&v=beta&t=-Vec3wCaAaOfozQBaBeykLG8lU8X9xyqJrCGpx1Xv1s',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/ryanawad/',
    tshirtSize: 'l',
  },
  {
    email: 'isabella@example.com',
    password: 'securepassword',
    firstName: 'Isabella',
    lastName: 'Nguyen',
    displayName: 'Isabella Nguyen',
    pronouns: 'she/her',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczNFEtJwT8NugAIGttYyro85pVB-eKyComthbU_c4kGsv21Q0bJsULJ7CIqerhtB52RwzO6KUb0gR2yvRv3kw9HBgoXUlfTOIxV5rIZMR-EjeTm6M7OAnW694YuNzg2N2YZssPpqV-gOxNjU1sx_nvkk=w973-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/isabella-vi-nguyen/',
    tshirtSize: 's',
  },
  {
    email: 'aashna@example.com',
    password: 'securepassword',
    firstName: 'Aashna',
    lastName: 'Verma',
    displayName: 'Aashna Verma',
    pronouns: 'she/her',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPnBFA29FY5cEvpxDMzb0rnTvbdywy16kJirlRUMfi7PGCI1SjER-sMPnJBSlAENzJe-CMQfCZvW83maSGDL5UIaRaKayf_o3hTkfQLwaxF7W3H7F1SHQ3N_kMkKW6Jgat1BRwKYBtUmRRSZ5P_pLDy=w973-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://aashna-verma.github.io',
    tshirtSize: 'm',
  },
  {
    email: 'esra@example.com',
    password: 'securepassword',
    firstName: 'Esra',
    lastName: 'Marwa',
    displayName: 'Esra Marwa',
    pronouns: 'she/her',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPDYyAyTFY3XGiLSuohOG0fg0URX2EqAG0Pvf8UA5I58ftgOUxAds7LZA5cljIAd5rpXu7O9BgujVHKaf5P4zCynV0HOE-ZQki_tSASJKi_meWiFIlCL4epkdeIfUT_Ua86cXibS_VRfCT3tjh-_hnD=w973-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/esra-abdulwahab-947b332ab/',
    tshirtSize: 'l',
  },
  {
    email: 'selena@example.com',
    password: 'securepassword',
    firstName: 'Selena',
    lastName: 'Quang',
    displayName: 'Selena Quang',
    pronouns: 'she/her',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczNSNXmJAJq-pyJA5_NRV6vq4-lA0BtnfXBsEGL0-2QTQB78UphzSVZCjoXOalGEYNLrlyfOYDFFjgqjx8hqHR0oPiZ_ckSn4FSmQy7oH72WikWjYI5dyMXFznaGm-AuzM6M9XLfEJH6ydg815u8xovH=w973-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/selena-quang-0aa9422b1/',
    tshirtSize: 'm',
  },
  {
    email: 'raef@example.com',
    password: 'securepassword',
    firstName: 'Raef',
    lastName: 'Sarofiem',
    displayName: 'Raef Sarofiem',
    pronouns: 'he/him',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczOUErtyx85CgCIu6vkCViP0ujZ1qcOA48udyCHzj6zSVtZz_Z5Y16c_LH5LQ2MyjoinY9Zg-ZwHMISCjwtliTlqnPC8BH1i3LVRH4jwGQSEPRmL8cvKgQWi5zcTUDWtoJogjPynnuUqEL0nxySKM515=w973-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/raefsarofiem/',
    tshirtSize: 'm',
  },
  {
    email: 'ajaan@example.com',
    password: 'securepassword',
    firstName: 'Ajaan',
    lastName: 'Nalliah',
    displayName: 'Ajaan Nalliah',
    pronouns: 'he/him',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczP2FdXEKCmBRIUeELhu8wyDN2wj7JV3aey-93-2aQBTn4SEiuRO5D7c-FGtbjGUl6kaTuO1aM-NgoEqIQ7NsCiQ1J7oO-qXw-7cmFlzAZp4ewTLyVMTEIphNbmfjdewy1AZK3RqRe1njMdn_flWIyVr=w973-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/ajaan-nalliah-6b2b1029b/',
    tshirtSize: 'l',
  },
  {
    email: 'ishar@example.com',
    password: 'securepassword',
    firstName: 'Ishar',
    lastName: 'Ghura',
    displayName: 'Ishar Ghura',
    pronouns: 'he/him',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczOTN9YofQ1eEGQsOnC5cw4pavbNtHlfLZ-MPDk-a0_RUEHvyGUxir2h31kryxozxX6fxpCqnPKBRurhw7V0cKdKJFAJwEKw8vbLryW5Egj9bzDASiIUS9GadaRLymelEeEn8Un5aOkP-3fZtPmEUpSN=w973-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/ishar-ghura/',
    tshirtSize: 'm',
  },
  {
    email: 'avantika@example.com',
    password: 'securepassword',
    firstName: 'Avantika',
    lastName: 'Rao',
    displayName: 'Avantika Rao',
    pronouns: 'she/her',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczNn4H0AZVNdXnuHk-QiSQt7RIM_SLEeJfmuEXUSxsmAGTrdBt6wciGlts0sQx94tE6NqpM0CrKBS3gAeyip1i5zzy6AUc_tuCKduG2W8078N8cgvauXsYnvd_vuChrLmdfjklkGYSZ5a_OPIv3S-QP3=w973-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/avantika-rao-01a1b2204/',
    tshirtSize: 's',
  },
  {
    email: 'khyonc@example.com',
    password: 'securepassword',
    firstName: 'Khyonc',
    lastName: 'Brown',
    displayName: 'Khyonc Brown',
    pronouns: 'he/him',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczMdX_wPGEMl4Fys82bTIZquBOqA1kAKUhitvhxBVcLH3YylTMo-X7gLUXpoZJ2ROri5srSiCrMr1wcIhxiE7gF1RoL8pr8GGsnr1FGP9klgpf_cxQDy7cgV_jMQKUaSx_sXACY8j8GgIbeEmyNrVtXN=w973-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/khyonc-browne-7a3518258/',
    tshirtSize: 'l',
  },
  {
    email: 'muhammad.maisam@example.com',
    password: 'securepassword',
    firstName: 'Muhammad',
    lastName: 'Maisam',
    displayName: 'Muhammad Maisam',
    pronouns: 'he/him',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczMX5cvMkW4aiUvggwjZ07th8FXyjymISJNx2Bw6avmV0UNU7w7pXG1pIc7h-vfJmRFv5m2U8Ejmwei5S6_oI78lnAUjqH62ctwnXeY3A8wtbncAlALHdJsfwf2GKvLFkzEXu6Paep0n3XCqXx5aRL9-=w973-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/muhammadmaisam01/',
    tshirtSize: 'm',
  },
  {
    email: 'trista.wang@example.com',
    password: 'securepassword',
    firstName: 'Trista',
    lastName: 'Wang',
    displayName: 'Trista Wang',
    pronouns: 'she/her',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPGPIRoLROduZYMRNtuFxmks2p4IjXOZm92QR-gYA_2xeJdpjOkALSIyM4o2y7WskyV_FyIX4O5uiCT3gfpbUmS1DszeFMkMPgWyBVoulVw2aV3JmRTSUSfcc3P8eduT0maOMCKaOpv72rkF5fj9zy1=w973-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/tristaxwang/',
    tshirtSize: 's',
  },
  {
    email: 'joel.cherian@example.com',
    password: 'securepassword',
    firstName: 'Joel',
    lastName: 'Cherian',
    displayName: 'Joel Cherian',
    pronouns: 'he/him',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczM-zryfkT9NiSB_8RnpoI7CXp2jSuKYadSiiXm7XdMwovTHwfr7R6hrdr5UYLmlL7D1PSIqGs_RrJnRzdNxfuc0RUW3KEqXBmB4e9KfVxuOTKTeQqW4MhWLkbOaakogSzZ-teCL4QhR22SyaeXNRglw=w973-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/joel-v-cherian/',
    tshirtSize: 'm',
  },
  {
    email: 'lily.salem@example.com',
    password: 'securepassword',
    firstName: 'Lily',
    lastName: 'Salem',
    displayName: 'Lily Salem',
    pronouns: 'she/her',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPaA1DMXJzWJwJSnF55TbKfP1-picLG0qlt8rDSq6ygR7u-gDfTP4ljEnlVC9C12NoR25t47xSlmLmFkG6TRtuvZGgfzpVdm96pU5SjBmNoNm4F-Ro0icEkZQvsuw_4C7auN9oIU_ihx2rbuKhqO4b1=w1020-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/lily-s-396190262/',
    tshirtSize: 's',
  },
  {
    email: 'ngan.cao@example.com',
    password: 'securepassword',
    firstName: 'Ngan',
    lastName: 'Cao',
    displayName: 'Ngan Cao',
    pronouns: 'she/her',
    mediaUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQGnH32IzAJMjw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726748243924?e=1745452800&v=beta&t=UVQ6JmZ3xh_Yt7rkp9gdKtPiCggL8J6wGQ6UGp1K20M',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/nganc/',
    tshirtSize: 'm',
  },
  {
    email: 'giancarlo.salvador@example.com',
    password: 'securepassword',
    firstName: 'Giancarlo',
    lastName: 'Salvador',
    displayName: 'Giancarlo Salvador',
    pronouns: 'he/him',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczMHEqnKFRc0o94jAfmkCDxHUPQYnzzF7f37PSZBBt4F5tR53GyAaWiQVxb3kY1aiEW4CTYAaCxPeyqTuW9dfQYRhry0cjZ1DYmKo5wly-hLb3JkiRTMlWF0NcddNa3WShYaq1TZ1yBHSBXaUdgfEZSB=w973-h1460-s-no-gm?authuser=0',
    brandRelation: null,
    linkedIn: 'https://www.linkedin.com/in/giancarlo-salvador-310696203/',
    tshirtSize: 'm',
  },
  {
    email: 'bashar.kazma@example.com',
    password: 'securepassword',
    firstName: 'Bashar',
    lastName: 'Kazma',
    displayName: 'Bashar Kazma',
    pronouns: 'he/him',
    linkedIn: 'https://www.linkedin.com/in/bashar-kazma-a7223b208/',
    tshirtSize: 'm',
  },
  {
    email: 'sheila.sieyoji@example.com',
    password: 'securepassword',
    firstName: 'Sheila',
    lastName: 'Sieyoji',
    displayName: 'Sheila Sieyoji',
    pronouns: 'she/her',
    linkedIn: 'https://www.linkedin.com/in/sheila-sieyoji/',
    tshirtSize: 's',
  },
  {
    email: 'muskaan.opel@example.com',
    password: 'securepassword',
    firstName: 'Muskaan',
    lastName: 'Opel',
    displayName: 'Muskaan Opel',
    pronouns: 'she/her',
    mediaUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQGMskAh2EGdWw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1725570711218?e=1745452800&v=beta&t=-414xN3eIx4I4FZw5CFDBPj24a8PskeP3Nbs4DdBUFA',
    linkedIn: 'https://www.linkedin.com/in/muskaan-opel/',
    tshirtSize: 'm',
  },
  {
    email: 'raaed.mirza@example.com',
    password: 'securepassword',
    firstName: 'Raaed',
    lastName: 'Mirza',
    displayName: 'Raaed Mirza',
    pronouns: 'he/him',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPKmUy7qyv72vZaucsZjFY92U-E-w4RAEBll0dLqc8lz9YLkg5pKpLWB_lb0Z2Dti8d02zcJzbEdZ-WQXENWyxzWtKoo1rvJAo-Xa51FOKvdTVfgtWHQHiojeryJisIWDVrSglj4siHLTGygZACd9xM=w973-h1460-s-no-gm?authuser=0',
    linkedIn: 'https://www.linkedin.com/in/raaed-mirza-96a01324b/',
    tshirtSize: 'm',
  },
  {
    email: 'rayhaan.farooq@example.com',
    password: 'securepassword',
    firstName: 'Rayhaan',
    lastName: 'Farooq',
    displayName: 'Rayhaan Farooq',
    pronouns: 'he/him',
    mediaUrl: 'https://media.licdn.com/dms/image/v2/D5603AQE2yMZOidak5Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1732724878570?e=1745452800&v=beta&t=AD0vMOORXiunKiB-ZQwyLC_No1_abXecrfPhcOxUTWk',
    linkedIn: 'https://www.linkedin.com/in/rayhaanfarooq/',
    tshirtSize: 'l',
  },
  {
    email: 'akshavi.baskaran@example.com',
    password: 'securepassword',
    firstName: 'Akshavi',
    lastName: 'Baskaran',
    displayName: 'Akshavi Baskaran',
    pronouns: 'she/her',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczMtupVAte8rqZLg0jSPpRQIY9OAZmX5DGgUlK8ESqUpopi3Ad6Sg8Ky1fM_B-Wi5VvE-KAs6-746keRYOJP_M4VH7vk5XXC4UmW49OXp9-l9OBgFUHy8eYrbIbYBsJ_8ED-TrBw6fn4osLXU775EIjH=w960-h1460-s-no-gm?authuser=0',
    linkedIn: 'https://www.linkedin.com/in/akshavibaskaran/',
    tshirtSize: 's',
  },
  {
    email: 'saim.hashmi@example.com',
    password: 'securepassword',
    firstName: 'Saim',
    lastName: 'Hashmi',
    displayName: 'Saim Hashmi',
    pronouns: 'he/him',
    mediaUrl: 'https://media.licdn.com/dms/image/v2/D5603AQEf51mAN7q4xQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1728509244535?e=1745452800&v=beta&t=MbqxW4OOk2bhxwWfb3IVqhEzdJPrOqDU7e39surPgWI',
    website: 'https://saimhashmi-nextjsportfolio.vercel.app',
    tshirtSize: 'm',
  },
  {
    email: 'zesan.rahim@example.com',
    password: 'securepassword',
    firstName: 'Zesan',
    lastName: 'Rahim',
    displayName: 'Zesan Rahim',
    pronouns: 'he/him',
    mediaUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQHFX2P2vrmj_Q/profile-displayphoto-shrink_800_800/B4DZRwAy7tHUAo-/0/1737046044937?e=1745452800&v=beta&t=_iQMOdKj38mYnta5U5HqlAJvVo8EoLS5VrltU2ZeVsA',
    linkedIn: 'https://www.linkedin.com/in/zesanrahim/',
    tshirtSize: 'm',
  },
  {
    email: 'hasith.dealwis@example.com',
    password: 'securepassword',
    firstName: 'Hasith',
    lastName: 'De Alwis',
    displayName: 'Hasith De Alwis',
    pronouns: 'he/him',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPvNrBhbm4qKthN16w7uBgmQXxLowqA04GLe7BhhF2pQ_nO6UEzJl-8is_C63omPxR1RNkGZzRgasuqxGDM8qZ2ZX1qIguJ6HDJB4gFQkyP8rbxa4P5qL63JEbwrtc5mRO2JnMC_tukw6e0XGg5GBhm=w973-h1460-s-no-gm?authuser=0',
    website: 'https://hasithdev.com',
    tshirtSize: 'm',
  },
  {
    email: 'mumtahin.farabi@example.com',
    password: 'securepassword',
    firstName: 'Mumtahin',
    lastName: 'Farabi',
    displayName: 'Mumtahin Farabi',
    pronouns: 'he/him',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczMXoQvW0q0xYVsAQX3nVy8h-yDvctS4giyfyT564rGYryqv6MuA2MlnBOEDIA9VRFC-C95h58Z-uTVMbDmW6gO3DO-r-s9cmkXRuPyFjVkNlxtvHu4PtFwsf46ZzFNEEdN0SKzWJsAplkyjhg503DTI=w973-h1460-s-no-gm?authuser=0',
    github: 'https://github.com/MFarabi619',
    tshirtSize: 'l',
  },
  {
    email: 'julie.wechsler@example.com',
    password: 'securepassword',
    firstName: 'Julie',
    lastName: 'Wechsler',
    displayName: 'Julie Wechsler',
    pronouns: 'she/her',
    mediaUrl: 'https://media.licdn.com/dms/image/v2/D5603AQHrtYolc2r2iw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1703135371921?e=1745452800&v=beta&t=lYyF6NByBPFYo6neENClyRtD8p8ZIxKsT3RFOqB5Ijk',
    linkedIn: 'https://www.linkedin.com/in/julie-wechsler/',
    tshirtSize: 's',
  },
  {
    email: 'nathan.coulas@example.com',
    password: 'securepassword',
    firstName: 'Nathan',
    lastName: 'Coulas',
    displayName: 'Nathan Coulas',
    pronouns: 'he/him',
    mediaUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQFSKW7ZVp_YAg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1687537705169?e=1745452800&v=beta&t=Td3td2WntyFGv_rUMgpWAlRwny80gYXOjqI0PAXVXWk',
    linkedIn: 'https://www.nathancoulas.com',
    tshirtSize: 'm',
  },
  {
    email: 'aires.zheng@example.com',
    password: 'securepassword',
    firstName: 'Aires',
    lastName: 'Zheng',
    displayName: 'Aires Zheng',
    pronouns: 'he/him',
    mediaUrl: 'https://media.licdn.com/dms/image/v2/D5603AQFpPEcbSQ-DjQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1705438318025?e=2147483647&v=beta&t=DFLOlD53THYXX5-xh9NRNkYAQoBBOgYBmHvINxfzNoo',
    linkedIn: 'https://www.linkedin.com/in/aireszheng/',
    tshirtSize: 'm',
  },
  {
    email: 'charelle.constantino@example.com',
    password: 'securepassword',
    firstName: 'Charelle',
    middleName: 'Jazmin',
    lastName: 'Constantino',
    displayName: 'Charelle Jazmin Constantino',
    pronouns: 'she/her',
    mediaUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQHW2k19bHl7xg/profile-displayphoto-shrink_800_800/B4EZSZUBQwHAAo-/0/1737738950436?e=1745452800&v=beta&t=z7rW44W4R2XNLuOL4P9jur_pLFdtP_OqLD7ELkaML1s',
    linkedIn: 'https://www.linkedin.com/in/charelleconstantino/',
    tshirtSize: 's',
  },
  {
    email: 'hamid.siddiqi@example.com',
    password: 'securepassword',
    firstName: 'Hamid',
    lastName: 'Siddiqi',
    displayName: 'Hamid Siddiqi',
    pronouns: 'he/him',
    mediaUrl: 'https://cdn.myportfolio.com/454dcab6-47f4-42e5-a6de-9ea8205bf3bb/6ed09481-ff18-4136-977e-760af1a5532c_rw_1200.png?h=31b2afa3e7428a16b774e49ebfc64c52',
    linkedIn: 'https://hamidsiddiqi.myportfolio.com/about-me',
    tshirtSize: 'm',
  },
  {
    email: 'hairuo.chen@example.com',
    password: 'securepassword',
    firstName: 'Hairuo',
    lastName: 'Chen',
    displayName: 'Hairuo Chen',
    pronouns: 'they/them',
    mediaUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQHuLKGQCfsneg/profile-displayphoto-shrink_800_800/B4EZQ9F0BmHEAc-/0/1736191721870?e=1745452800&v=beta&t=-yeZeKRThoN-lXEWIVRYAh3rTbOK3shX49DadNCv0u4',
    linkedIn: 'https://hairuochen.framer.website/',
    tshirtSize: 'm',
  },
  {
    email: 'jowi.aoun@example.com',
    password: 'securepassword',
    firstName: 'Jowi',
    lastName: 'Aoun',
    displayName: 'Jowi Aoun',
    pronouns: 'he/him',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczNMuRR92h4vkYQmh6u5E6pFu7rxvukjlxPSDH7zmwIjPwZEO5y029Ymc_qzaiVTbcQ_UoHpeM90VcRv3wuPscGQsBioyM68Q7Z1C77BfAG_h9RjpTh9KbbhaSHt5iuEHGmn-cLSbz3yAEgOvfwN-rt3=w973-h1460-s-no-gm?authuser=0',
    linkedIn: 'https://www.linkedin.com/in/jowiaoun/',
    tshirtSize: 'm',
  },
  {
    email: 'jeremy.friesen@example.com',
    password: 'securepassword',
    firstName: 'Jeremy',
    lastName: 'Friesen',
    displayName: 'Jeremy Friesen',
    pronouns: 'he/him',
    mediaUrl: 'https://lh3.googleusercontent.com/pw/AP1GczMa8qsig0YI0P_RXELhH3tz1CUH9hKku48quoaBw7F2beMgIHPmO0411YvLwd9EM7Rw4moLzYQUuSHGioJg1yH6n3imC0-Hz7cNB4eMMIEV3oYBMSH4LYqN7SJdTzRqBkDef7KPSB3ODb94D2WgF4G-=w973-h1460-s-no-gm?authuser=0',
    linkedIn: 'https://www.linkedin.com/in/jeremyfriesen1/',
    tshirtSize: 'm',
  },
]
