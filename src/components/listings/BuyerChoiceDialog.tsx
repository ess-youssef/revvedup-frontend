import { sell } from '@/lib/api/listings';
import { users } from '@/lib/api/users';
import { User } from '@/lib/interfaces';
import { getFullName, useDebouncedState } from '@/utils';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { ListBox } from 'primereact/listbox';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDebounceValue } from 'usehooks-ts';

interface BuyerChoiceDialogProps {
  id: number,
  closeDialog: () => void
}

export default function BuyerChoiceDialog({ id, closeDialog }: BuyerChoiceDialogProps) {

  const client = useQueryClient();
  const [search, debouncedSearch, setSearch] = useDebouncedState("", 300);
  const [buyer, setBuyer] = useState<string | null>(null);
  const { data, isLoading, error, fetchNextPage } = useInfiniteQuery({
    queryKey: ["buyerUsers", debouncedSearch],
    queryFn: (context) => users(context.pageParam, debouncedSearch === "" ? null : debouncedSearch),
    initialPageParam: 1,
    getNextPageParam: (lastPageData) => {
      const { current_page, last_page } = lastPageData.meta;
      return current_page === last_page ? null : current_page + 1
    }
  });

  const { mutate, isPending } = useMutation({
    // @ts-ignore
    mutationFn: (sellData) => sell(id, sellData),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["myListings"]
      });
      closeDialog();
    }
  });

  const itemTemplate = (user: User) => {
    return (
      <p className="text-gray-900 font-medium">{getFullName(user)} <span className="font-normal text-gray-600 text-sm">@{user.username}</span></p>
    );
  }

  const doSell = () => {
    if (buyer === null) {
      return;
    }
    // @ts-ignore
    mutate({ buyer });
  }

  return (
    <div className="space-y-5">
      <IconField>
        <InputIcon className="pi pi-search"></InputIcon>
        <InputText className="w-full" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
      </IconField>
      <div>
        { isLoading && <p className="text-gray-600 text-xs">Loading...</p> }
        { data && (
          <>
            <ListBox
              value={buyer}
              options={data.pages.flatMap(page => page.data)}
              itemTemplate={itemTemplate}
              optionValue="username"
              dataKey="id"
              onChange={(e) => setBuyer(e.value)}
              listStyle={{
                maxHeight: "15rem"
              }}
            />
            <Button className="w-full mt-2" label="Load more users" size="small" onClick={() => fetchNextPage()} text />
            <Button className="w-full mt-5" label="Sell" disabled={buyer === null} loading={isPending} onClick={doSell} />
          </>
        ) }
      </div>
    </div>
  );
}