import React from "react";
import Skeleton from "react-loading-skeleton";

const SkeletonPassword = () => {
  return (<>
  <Skeleton height={30} width={'100%'} className="mg-b-10"/>
  <Skeleton height={30} width={'100%'} className="mg-b-10"/>
  <Skeleton height={30} width={150} className="mg-b-10"/>
  </>)
};

export default SkeletonPassword;