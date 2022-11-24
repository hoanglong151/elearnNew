import React, { useState, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import DocumentSlider from './DocumentSlider';
import Skeleton from 'react-loading-skeleton';
import { getListCategoryLibrary } from '~src/api/teacherAPI';

const TeacherLibrary = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [categories, setCategories] = useState([]);

	const getCategories = async () => {
		setIsLoading(true);
		const res = await getListCategoryLibrary();
		if (res.Code !== 1) return;
		setCategories(res.Data);
		setIsLoading(false);
	};

	useEffect(() => {
		getCategories();
	}, []);

	return (
		<>
			<div className="library-wrap">
				{/*s1*/}
				<div className="row mg-b-30" style="display:none">
					<div className="col-sm-12 col-ms-12 bannerAndSlide">
						<div className="banner-slide">
							<DocumentSlider
								categoryID={2}
								slideTitle="New Cirriculum"
								getNewest={true}
							/>
							{/*/foundation*/}
						</div>
					</div>
				</div>
				{!!categories &&
					categories.length > 0 &&
					[...categories].map(category => (
						<DocumentSlider
							key={`${category.ID}`}
							categoryID={category.ID}
							slideTitle={category.CategoryLibrary}
						/>
					))}
			</div>
		</>
	);
};

const domContainer = document.getElementById('react-teacher-library');
ReactDOM.render(<TeacherLibrary />, domContainer);
