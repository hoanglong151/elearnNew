import React from 'react';
import ReactDOM from 'react-dom';

const LibraryCard = ({ title, imageUrl, category, urlDownload }) => {
    return (
        <React.Fragment>
            <div className="swiper-slide">
                <div className="card-library">
                    <a href={urlDownload} rel="noopener" target="_blank" className="d-block">
                        <img src={`${imageUrl || "../assets/img/book-holder.jpeg"}`} onError={(e) => { e.target.onerror = null; e.target.src = "../assets/img/book-holder.jpeg" }} alt="Library image" className="img-100" />
                    </a>
                    <h5 className="py-2">
                        <a href={urlDownload} rel="noopener" target="_blank">{title}</a>
                    </h5>
                    <p className="smalltext-item-foundation mg-b-0">{category}</p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default LibraryCard;