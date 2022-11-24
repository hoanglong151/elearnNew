import React from "react";
import Skeleton from "react-loading-skeleton";

let styleWrapper = {
    display: "flex",
    flexDirection: 'row',
    flexWrap: "wrap",
}
let styleSection = {
    border: "1px solid #e1e1e1",
    borderRadius: "5px",
    padding: "10px",
}
const SkeletonBlogCard = () => {
    return (
        <section style={styleSection}>
            <div style={styleWrapper}>
                <div className="w-100 mb-2">
                    <Skeleton width={`100%`} height={200} />
                </div>
                <div className="w-100 mb-2">
                    <Skeleton width={`70%`} height={30} />
                </div>
                <div className="w-100 mb-2">
                    <Skeleton className="mg-r-20" circle={true} height={50} width={50}/>
                    <Skeleton width={200} height={50} />
                </div>
                <div className="w-100 mb-2">
                    <Skeleton width={`100%`} height={40} />
                </div>
                <div className="w-100 mb-2">
                <Skeleton width={`100%`} height={40} />
                </div>
                <div className="w-100 mb-2">
                <Skeleton width={`100%`} height={40} />
                </div>
            </div>
        </section>
    );
};

export default SkeletonBlogCard;