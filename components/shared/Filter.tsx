'use client';
import { cn, formUrlQuery } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

export default function Filter({
  filters,
  otherClasses,
  containerClasses,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramFilter = searchParams.get('filter');
  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'filter',
      value,
    });
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className={cn('relative', containerClasses)}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={cn(
            otherClasses,
            'body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5'
          )}
        >
          <div className='line-clamp-1 flex-1 text-left'>
            <SelectValue placeholder='Select a Filter' />
          </div>
        </SelectTrigger>
        <SelectContent className='text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300'>
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem
                key={item.name}
                value={item.value}
                className='cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400'
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
