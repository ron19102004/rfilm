import React, { Children } from "react";

interface ListProps<L> {
  data: L[];
  render(l: L, index: number): React.ReactNode;
  isReverse?: boolean;
}

const ListView = <L,>({ data, render, isReverse = false }: ListProps<L>) => {
  const list = isReverse ? [...data].reverse() : data;

  if (!Array.isArray(list)) {
    console.error("ListView expected `data` to be an array, got:", typeof list);
    return <div className="text-red-500">Dữ liệu không hợp lệ</div>;
  }
  return Children.toArray(list.map((item, index) => render(item, index)));
};

export default ListView;