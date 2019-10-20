import * as React from 'react';

import MoodMeterComponent from './moodmeter/moodmeter';
import { Button } from 'devextreme-react';

export interface IDiaryEditComponentProps {
  diaryentry: any;
  onCancel: () => void;
  onSave: (data: any) => void;
}

export default class DiaryEditComponent extends React.Component<IDiaryEditComponentProps> {
  textareaRef: React.RefObject<HTMLTextAreaElement> = React.createRef();
  moodmeterRef: React.RefObject<MoodMeterComponent> = React.createRef();
  state = {
    entry: '',
    datetime: 0,
    mood: '',
    processing: false
  };

  componentDidMount() {
    this.textareaRef.current && this.textareaRef.current.focus();
    this.setState({
      entry: (this.props.diaryentry || {}).entry || '',
      datetime: (this.props.diaryentry || {}).entrydate || Date.now(),
      mood: (this.props.diaryentry || {}).entrymood || 'unknown'
    });
  }
  onSave = () => {
    const entry = {
      entry: this.state.entry,
      entrydate: (this.props.diaryentry || {}).entrydate || this.state.datetime,
      entrymood: this.state.mood,
      objectId: (this.props.diaryentry || {}).objectId
    };
    this.props.onSave && this.props.onSave(entry);
  };
  onCancel = () => {
    this.props.onCancel && this.props.onCancel();
  };

  public render() {
    return (
      <div className="diary__new-entry">
        <textarea
          className="diary__new-entry-textarea"
          value={this.state.entry}
          onChange={(e: any) => {
            this.setState({ entry: e.target.value });
          }}
          ref={this.textareaRef}
          placeholder="Please type..."
        ></textarea>
        <MoodMeterComponent
          value={this.state.mood}
          onChange={(mood: string) => {
            this.setState({ mood });
          }}
        />
        <Button className="btn btn-primary has-gradient btn-lg btn-block" onClick={this.onSave}>
          Save
        </Button>
        <Button className="btn btn-link btn-lg btn-block" onClick={this.onCancel}>
          Cancel
        </Button>
      </div>
    );
  }
}
