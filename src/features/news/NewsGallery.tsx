import { BlurImage } from '../../components/BlurImage';
import { Carousel } from '../../components/Carousel';
import type { GalleryItem } from '../../lib/types';

/** A news section's photos, in the site's carousel. Rows whose file was deleted are dropped. */
export function NewsGallery({ items }: { items: GalleryItem[] }) {
  const photos = [...items]
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .flatMap((item) => (item.directus_files_id ? [item.directus_files_id] : []));
  if (!photos.length) return null;

  return (
    <Carousel gap={16} label="Photos">
      {photos.map((photo) => (
        <div key={photo.id} className="inline-flex w-full flex-none snap-start md:w-[calc(33%-0.4rem)]">
          <BlurImage
            id={photo.id}
            width={800}
            height={576}
            fit="cover"
            alt={photo.description ?? photo.title ?? ''}
            frameClassName="h-72 w-full rounded-xl"
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </Carousel>
  );
}
