import React from "react";
import {Icon } from 'semantic-ui-react';


const StepChanger = ({ prevStep, nextStep, changeStep }) => (
  <div className="step-changer__wrapper">
    <ul className="step-changer">
      {prevStep && (
        <li onClick={() => changeStep('prev')}>
          <Icon name="chevron left" />이전
        </li>
      )}
      {nextStep && (
        <li onClick={() => changeStep('next')}>
          다음<Icon name="chevron right"  />
        </li>
      )}
    </ul>
  </div>
);

export default StepChanger;