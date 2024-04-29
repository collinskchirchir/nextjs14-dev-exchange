'use client';
import { cn, formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder?: string;
  otherClasses?: string;
}

export default function LocalSearchbar({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q');

  const [search, setSearch] = useState(query || '');
  useEffect(() => {
    // implement debounce
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'q',
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        // if the query doesn't exist
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['q'],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathname, router, searchParams, query]);
  return (
    <div
      className={cn(
        'background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4',
        otherClasses
      )}
    >
      {iconPosition === 'left' && (
        <Image
          src={imgSrc}
          alt='search icon'
          width={24}
          height={24}
          className='cursor-pointer'
        />
      )}
      <Input
        type='text'
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none'
      />
      {iconPosition === 'right' && (
        <Image
          src={imgSrc}
          alt='search icon'
          width={24}
          height={24}
          className='cursor-pointer'
        />
      )}
    </div>
  );
}
