/**
 *
 * MoleculeSpinner
 *
 */

import React from 'react';
import MoleculeLoader from './MoleculeLoader.json';
import Lottie from 'react-lottie';

interface OwnProps { }

const MoleculeSpinner: React.FunctionComponent<OwnProps> = (
  props: OwnProps,
) => (
    <Lottie
      options={{
        loop: true,
        animationData: MoleculeLoader,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        },
      }}
      height={100}
      width={100}
      isClickToPauseDisabled />)

export default MoleculeSpinner;
