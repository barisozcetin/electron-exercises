import React from 'react';
import PropTypes from 'prop-types';

const PrevTranslations = ({ translations }) => {
	return (
		<div>
			<ul>
				{translations &&
					Object.keys(translations).reverse().map((item, index) => (
						<li key={index}>
							{' '}
							{item} --- {translations[item]}{' '}
						</li>
					))}
			</ul>
		</div>
	);
};

PrevTranslations.propTypes = {
	translations: PropTypes.object
};

export default PrevTranslations;
