import React from "react";
import Skeleton from "react-loading-skeleton";

let styleWrapper = {
  display: "flex",
  flexDirection: 'column',
  flexWrap: "wrap",
}
const SkeletonProfileSidebar = () => {
  return (
    <div className="profile-sidebar pd-lg-r-25">
      <div className="sidebar-overlay"></div>
      <div style={styleWrapper}>
        <div className="w-100 mg-b-15">
          <Skeleton circle={true} width={100} height={100} />
        </div>
        <div className="w-100 mg-b-40">
          <Skeleton width={`80%`} height={30} />
        </div>
        <div className="w-100 mb-2 pd-l-10 text-left">
          <Skeleton width={80} height={20} />
        </div>
        <div className="w-100 mb-2 pd-l-10 text-left">
          <Skeleton width={80} height={20} />
        </div>
        <div className="w-100 mb-2 pd-l-10 text-left">
          <Skeleton width={120} height={20} />
        </div>
        <div className="w-100 mb-2 pd-l-10 text-left">
          <Skeleton width={90} height={20} />
        </div>
        <div className="w-100 mb-2 pd-l-10 text-left">
          <Skeleton width={150} height={20} />
        </div>
        <div className="w-100 mb-2 pd-l-10 text-left">
          <Skeleton width={120} height={20} />
        </div>
        <div className="w-100 mb-2 pd-l-10 text-left">
          <Skeleton width={80} height={20} />
        </div>
        <div className="w-100 mb-4 pd-l-10 text-left">
          <Skeleton width={150} height={20} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonProfileSidebar;