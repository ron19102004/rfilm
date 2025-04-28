import { GetFilmsType } from "@/apis/index.d";
import { transFilmTypeToVN } from "@/apis/trans.f";
import FindByOption from "@/components/custom/find-by-option";
import React from "react";
import { useParams } from "react-router-dom";
const TypeListPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  return (
    <FindByOption
      type={GetFilmsType.LIST}
      value={slug?.toString() || ""}
      titleBar={transFilmTypeToVN(slug?.toString() || "") || ""}
    />
  );
};

export default TypeListPage;
