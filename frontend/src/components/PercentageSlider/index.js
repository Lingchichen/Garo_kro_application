import React from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './style.css';

const PercentageSlider = props => (
  <div className="percentage-slider">
    <InputRange formatLabel={value => `${value}%`} {...props} />
  </div>
);

export default PercentageSlider;
