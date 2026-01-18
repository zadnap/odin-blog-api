import slugify from 'slugify';
import { prisma } from '../lib/index.js';

const generateUniqueSlug = async (title) => {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    locale: 'vi',
  });

  let slug = baseSlug;
  let count = 1;

  while (true) {
    const exists = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!exists) break;

    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
};

export default generateUniqueSlug;
