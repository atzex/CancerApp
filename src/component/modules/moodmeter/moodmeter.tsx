import * as React from 'react';
import * as Icon from 'react-feather';

export interface IMoodMeterComponentProps {
  value?: string;
  onChange?: (mood: string) => void;
}

export default class MoodMeterComponent extends React.Component<IMoodMeterComponentProps> {
  state = {
    mood: 'unknown'
  };

  componentDidUpdate() {
    if (this.state.mood !== this.props.value) {
      this.setState({ mood: this.props.value });
    }
  }

  onChange(mood: string) {
    return () => {
      this.setState({ mood });
      this.props.onChange && this.props.onChange(mood);
    };
  }

  public render() {
    return (
      <React.Fragment>
        <Icon.Frown style={{ backgroundColor: this.state.mood === 'frown' ? 'red' : undefined }} onClick={this.onChange('frown')}></Icon.Frown>
        <Icon.Meh style={{ backgroundColor: this.state.mood === 'meh' ? 'red' : undefined }} onClick={this.onChange('meh')}></Icon.Meh>
        <Icon.Smile style={{ backgroundColor: this.state.mood === 'smile' ? 'red' : undefined }} onClick={this.onChange('smile')}></Icon.Smile>
      </React.Fragment>
    );
  }
}
