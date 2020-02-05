import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TextField from '@material-ui/core/TextField';
import ProjectSupportModal from '../index';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from 'theme';
import { BrowserRouter } from 'react-router-dom';
// import { mountWrap } from './contextWrap';

configure({adapter: new Adapter()});

describe('<ProjectSupportModal />', () => {

  beforeAll(() => {
  });
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<BrowserRouter><MuiThemeProvider theme={theme}><ProjectSupportModal 
        closeModal={() => {}}
        modalState={true}
        daiBalance={100e18}
        contributionRate={75}
        txInProgress={false}
        supportProject={() => {}}
        marketAddress={'0x0'}
        maxResearchContribution={1000e18}
      /></MuiThemeProvider></BrowserRouter>);
  });

  it('should show no error when first entered', () => {
    expect(wrapper.find(TextField).at(0).props().error).toBe(
        false);
    expect(wrapper.find(TextField).at(0).props().helperText).toBe(
        null);
  });

  // it('should show error when nothing entered', () => {
  //   act(() => {
  //     wrapper.find(TextField).at(0).simulate('blur', {target: {value: '123'}});
  //   });
  //   wrapper.update();
  //   expect(wrapper.find(TextField).at(0).props().error).toBe(
  //       true);
  //   expect(wrapper.find(TextField).at(0).props().helperText).toBe(
  //       "Wrong Name format.");
  // });

  // it('should show no error when correctly entered', () => {
  //   act(() => {
  //     wrapper.find(TextField).at(0).simulate('blur', {target: {value: 'James'}});
  //   });
  //   wrapper.update();
  //   expect(wrapper.find(TextField).at(0).props().error).toBe(
  //       false);
  //   expect(wrapper.find(TextField).at(0).props().helperText).toBe(
  //       null);
  // });

});