import { IconSearch } from "@tabler/icons-react";
import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";

import { useProfileSearchQuery } from "@/api/profile/queries";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
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
        <div className="flex gap-2">
          <Input
            type="text"
            name="identifier"
            role="combobox"
            aria-label="사용자 검색"
            aria-autocomplete="list"
            aria-controls="profile-search-results"
            aria-expanded={isAutocompleteOpen}
            aria-busy={isDebouncing || search.isFetching}
            value={values.identifier}
            onChange={handleChange}
            placeholder="검색하고 싶은 사용자를 입력해주세요."
          />
          <Button
            type="submit"
            size="icon"
            aria-label="사용자 검색"
          >
            <IconSearch className="size-4" />
          </Button>
        </div>
        {isAutocompleteOpen ? (
          <Card size="sm" className="absolute top-full z-20 mt-2 w-full text-left">
            <CardContent>
              {isDebouncing || search.isFetching ? (
                <p className="text-muted-foreground">검색 중...</p>
              ) : null}
              {search.isError ? (
                <p className="text-muted-foreground">
                  검색 결과를 불러오지 못했습니다.
                </p>
              ) : null}
              {!isDebouncing ? (
                <ul id="profile-search-results" role="listbox">
                  {search.data?.results.map((result) => {
                    const title =
                      values.service === "iidx"
                        ? (result.dj_name ??
                          result.nickname ??
                          result.handle ??
                          result.id)
                        : (result.handle ?? result.nickname ?? result.id);
                    const detail =
                      values.service === "iidx"
                        ? [
                            result.dj_id,
                            result.handle ? `@${result.handle}` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")
                        : result.nickname;

                    return (
                      <li key={result.id} role="presentation">
                        <Button
                          type="button"
                          variant="ghost"
                          role="option"
                          aria-selected={false}
                          className="h-auto w-full justify-start whitespace-normal"
                          onClick={() => router.push(result.profile_path)}
                        >
                          <span className="font-medium">{title}</span>
                          {detail ? (
                            <span className="text-xs text-muted-foreground">
                              {detail}
                            </span>
                          ) : null}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              {!isDebouncing &&
              search.isSuccess &&
              search.data.results.length === 0 ? (
                <p className="text-muted-foreground">검색 결과가 없습니다.</p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </div>
      <p className="text-left text-xs text-muted-foreground">
        {SEARCH_SERVICE_HINTS[values.service]}
      </p>
    </form>
  );
}

export default UserSearchForm;
