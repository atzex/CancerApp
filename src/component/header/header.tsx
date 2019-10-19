import * as React from 'react';
import { DateBox, Button } from 'devextreme-react';
import moment from 'moment';

export interface IHeaderComponentProps {
  onDateChange: (value: number) => void;
}

export default class HeaderComponent extends React.Component<IHeaderComponentProps> {
  state = {
    current: 0
  };

  buttonLeftClick = () => {
    const newDate = moment(this.state.current);
    newDate.subtract(1, 'd');
    this.setDate(newDate.valueOf());
  };
  buttonRightClick = () => {
    const newDate = moment(this.state.current);
    newDate.add(1, 'd');
    this.setDate(newDate.valueOf());
  };

  setDate(newCurrent: number) {
    this.setState({ current: newCurrent });
    this.props.onDateChange && this.props.onDateChange(newCurrent);
  }

  componentDidMount() {
    const today = moment()
      .set('h', 0)
      .set('m', 0)
      .set('s', 0)
      .set('ms', 0);
    this.setDate(today.valueOf());
  }

  public render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={this.buttonLeftClick}>&lt;</Button>
        <Button>-</Button>
        <DateBox value={this.state.current} type={'date'} />
        <Button>+</Button>
        <Button onClick={this.buttonRightClick}>&gt;</Button>
      </div>
    );
  }
}
