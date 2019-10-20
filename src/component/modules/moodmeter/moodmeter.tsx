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
      <div className="mood-meter">
        <div className="mood-meter__explaination">Your mood:</div>
        <div className={this.state.mood === 'frown' ? 'mood-meter__item is-active' : 'mood-meter__item'}>
          <Icon.Frown onClick={this.onChange('frown')}></Icon.Frown>
        </div>
        <div className={this.state.mood === 'meh' ? 'mood-meter__item is-active' : 'mood-meter__item'}>
          <Icon.Meh onClick={this.onChange('meh')}></Icon.Meh>
        </div>
        <div className={this.state.mood === 'smile' ? 'mood-meter__item is-active' : 'mood-meter__item'}>
          <Icon.Smile onClick={this.onChange('smile')}></Icon.Smile>
        </div>
      </div>
    );
  }
}
