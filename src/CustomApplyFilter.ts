/**
 * @param data 필터링 할 배열
 * @param objectKeys 필터링 할 key 값
 * @param userInput 사용자 입력값
 */
type ApplyFilter<T extends Record<string, unknown>> = {
  data: T[];
  objectKeys: Array<keyof T>;
  userInput: string;
};

const applyFilter = <T extends Record<string, unknown>>({
  data,
  objectKeys,
  userInput,
}: ApplyFilter<T>) => {
  return data.filter((el) =>
    objectKeys.some((key) => {
      const elVal = el[key as keyof T];

      // string, number 타입의 키만 필터링
      if (typeof elVal !== "string" && typeof elVal !== "number") return false;

      if (!elVal) return false;

      return elVal.toString().toLowerCase().includes(userInput.toLowerCase());
    })
  );
};

/**
 * @param data 필터링 할 배열
 * @param comparator 정렬 함수
 * @param filter 필터링 조건
 * @param excludeKeys 필터링에 포함하지 않을 key 값
 */
type Filter<T extends Record<string, unknown>> = {
  data: T[];
  comparator: (a: any, b: any) => number;
  filter: { key: keyof T | "all"; value: string };
  excludeKeys?: Array<keyof T>;
};

export default function CustomApplyFilter<T extends Record<string, unknown>>(
  userFilter: Filter<T>
) {
  const {
    data,
    comparator,
    excludeKeys,
    filter: { key, value },
  } = userFilter;

  if (data.length === 0) {
    return [];
  }

  // 기본 데이터 정렬 ( asc, desc )
  const stabilizedData: [T, number][] = data.map((el, index) => [el, index]);

  stabilizedData.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  const sortedData = stabilizedData.map((el) => el[0]);

  if (key === "all") {
    // 필터링에 포함하지 않을 key 값 정리
    const filterKeys = (Object.keys(sortedData[0]) as (keyof T)[]).filter(
      (el) => !excludeKeys?.includes(el)
    );

    return applyFilter({
      data: sortedData,
      objectKeys: filterKeys,
      userInput: value,
    });
  }

  return applyFilter({ data: sortedData, objectKeys: [key], userInput: value });
}
