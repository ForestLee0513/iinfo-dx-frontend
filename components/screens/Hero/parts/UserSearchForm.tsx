import { IconSearch } from "@tabler/icons-react";
import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";

import { useProfileSearchQuery } from "@/api/profile/queries";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SEARCH_SERVICE_HINTS,
  SEARCH_SERVICES,
} from "@/components/screens/Hero/constants";
import { useDebouncedValue } from "@/components/screens/Hero/hooks/useDebouncedValue";

import type { SearchFormValues } from "@/components/screens/Hero/types";

function UserSearchForm() {
  const router = useRouter();
  const { handleChange, handleSubmit, setFieldValue, values } =
    useFormikContext<SearchFormValues>();
  const query = useDebouncedValue(values.identifier.trim());
  const isDebouncing = query !== values.identifier.trim();
  const isAutocompleteOpen = Boolean(values.identifier.trim());
  const search = useProfileSearchQuery({
    q: query,
    service: values.service,
    limit: 8,
  });

  return (
    <form className="mt-5 w-full lg:mt-6" onSubmit={handleSubmit}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">서비스</span>
        <Select
          items={SEARCH_SERVICES}
          value={values.service}
          onValueChange={(next) => {
            setFieldValue("service", next);
          }}
        >
          <SelectTrigger
            id="search-service"
            size="sm"
            className="h-8 rounded-lg border border-input bg-background px-2.5"
            aria-label="검색 서비스 선택"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {Object.entries(SEARCH_SERVICES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="relative">
        <div className="flex h-8 items-center gap-2 rounded-lg border border-input bg-background px-2.5 py-1.5">
          <Input
            type="text"
            name="identifier"
            role="combobox"
            aria-label="사용자 검색"
            aria-autocomplete="list"
            aria-controls="profile-search-results"
            aria-expanded={isAutocompleteOpen}
            aria-busy={isDebouncing || search.isFetching}
            className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            value={values.identifier}
            onChange={handleChange}
            placeholder="검색하고 싶은 사용자를 입력해주세요."
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:bg-transparent hover:text-foreground"
            aria-label="사용자 검색"
          >
            <IconSearch className="size-4" />
          </Button>
        </div>
        {isAutocompleteOpen ? (
          <div className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-input bg-background text-left text-sm shadow-lg">
          {isDebouncing || search.isFetching ? (
            <p className="px-3 py-2 text-muted-foreground">검색 중...</p>
          ) : null}
          {search.isError ? (
            <p className="px-3 py-2 text-muted-foreground">
              검색 결과를 불러오지 못했습니다.
            </p>
          ) : null}
            {!isDebouncing ? (
              <ul id="profile-search-results" role="listbox">
                {search.data?.results.map((result) => {
            const title =
              values.service === "iidx"
                ? result.dj_name ?? result.nickname ?? result.handle ?? result.id
                : result.handle ?? result.nickname ?? result.id;
            const detail =
              values.service === "iidx"
                ? [result.dj_id, result.handle ? `@${result.handle}` : null]
                    .filter(Boolean)
                    .join(" · ")
                : result.nickname;

                  return (
                    <li key={result.id} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={false}
                        className="flex w-full flex-col gap-0.5 border-b border-input px-3 py-2 text-left last:border-b-0 hover:bg-muted"
                        onClick={() => router.push(result.profile_path)}
                      >
                        <span className="font-medium">{title}</span>
                        {detail ? (
                          <span className="text-xs text-muted-foreground">{detail}</span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
            {!isDebouncing && search.isSuccess && search.data.results.length === 0 ? (
            <p className="px-3 py-2 text-muted-foreground">검색 결과가 없습니다.</p>
          ) : null}
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-left text-[0.6875rem] leading-[0.875rem] text-[#8c8c94]">
        {SEARCH_SERVICE_HINTS[values.service]}
      </p>
    </form>
  );
}

export default UserSearchForm;
