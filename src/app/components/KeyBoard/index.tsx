import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import './style.less';

interface IKeyBoardProps {
  handleKeyDown: any;
}

interface IKeyBoardState {}

export default class KeyBoard extends React.Component<
  IKeyBoardProps,
  IKeyBoardState
> {
  handleClick = type => {
    this.props.handleKeyDown(type);
  };
  render() {
    return (
      <div className='keyboard'>
        <div className='left'>
          <div className='top'>
            <ul>
              <li>
                <button onClick={this.handleClick.bind(null, 1)} style={{backgroundColor: '#01344F'}}/>
                <FontAwesome name='volume-off' size="lg"/>
              </li>
              {/* <li>
                <button onClick={this.handleClick.bind(null, 3)} />
                <FontAwesome name='cog' size="lg"/>
              </li> */}
              <li>
                <button onClick={this.handleClick.bind(null, 4)} style={{backgroundColor: '#9F4125'}}/>
                <FontAwesome name='pause' />
              </li>
              <li>
                <button onClick={this.handleClick.bind(null, 0)} style={{backgroundColor: '#382020'}}/>
                <FontAwesome name='undo' />
              </li>
            </ul>
          </div>
          <div className='bottom'>
            <ul>
              <li>
                <button onClick={this.handleClick.bind(null, 2)} />
                <FontAwesome name='play' size="lg"/>
              </li>
            </ul>
          </div>
        </div>
        <div className='right'>
          <div className='direction'>
            <div className='top' >
              <button onClick={this.handleClick.bind(null, 38)} >
                <FontAwesome name='angle-double-up' size="lg"/>
              </button>
            </div>
            <div className='center'>
              <button onClick={this.handleClick.bind(null, 37)}>
                <FontAwesome name='angle-double-left' size="lg"/>
              </button>
              <div className='icon'>
                <div className='top'>
                  <FontAwesome name='caret-up' size="lg"/>
                </div>
                <div className='center'>
                  <FontAwesome name='caret-left' size="lg"/>
                  <FontAwesome name='caret-right' size="lg"/>
                </div>
                <div className='bottom'>
                  <FontAwesome name='caret-down' size="lg"/>
                </div>
              </div>
              <button onClick={this.handleClick.bind(null, 39)}>
                <FontAwesome name='angle-double-right' size="lg"/>
              </button>
            </div>
            <div className='bottom'>
              <button onClick={this.handleClick.bind(null, 40)}>
                <FontAwesome name='angle-double-down' size="lg"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
