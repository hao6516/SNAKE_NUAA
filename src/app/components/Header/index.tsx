import * as React from 'react';
import './style.less';

interface IHeaderProps {}

interface IHeaderState {}

export default class Header extends React.Component<
  IHeaderProps,
  IHeaderState
> {
  render() {
    return (
      <div className='header'>
        <div className='left'>
          <span />
          <div className='cell' />
          <div className='cell' />
          <div className='cell' />
        </div>
        <span style={{color: '#E2CD9C'}}>福蛇纳祥</span>
        <div className='right'>
          <div className='top'>
            <div className='cell' />
            <div className='cell' />
            <div className='cell' />
          </div>
          <div className='bottom'>
            <div className='cell' />
            <div className='cell' />
            <div className='cell' />
          </div>
          <span />
        </div>
      </div>
    );
  }
}
