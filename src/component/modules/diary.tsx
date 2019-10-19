import * as React from 'react';
import bless from 'backendless';
import moment from 'moment';
import { SpeedDialAction } from 'devextreme-react/speed-dial-action';
import { Button } from 'devextreme-react';

export interface IDiaryPageProps {
  currentDate: number;
}

export default class DiaryPage extends React.Component<IDiaryPageProps> {
  textareaRef: React.RefObject<HTMLTextAreaElement> = React.createRef();

  state = {
    addNew: false,
    processing: false,
    entries: []
  };

  loadData = async (date: number) => {
    const dataQuery = bless.DataQueryBuilder.create()
      .setSortBy('entrydate DESC')
      .setWhereClause(
        'entrydate >= ' +
          date +
          'and entrydate < ' +
          moment(date)
            .add(1, 'd')
            .valueOf()
      );
    const entries = await bless.Data.of('diaryentries').find(dataQuery);
    this.setState({ entries });
  };

  componentDidMount() {
    this.loadData(this.props.currentDate);
  }

  lastCurrentDate = 0;
  componentDidUpdate(nextProps: IDiaryPageProps) {
    if (this.lastCurrentDate !== this.props.currentDate) {
      this.loadData(this.props.currentDate);
      this.lastCurrentDate = this.props.currentDate;
    }
  }

  onAddEntryButtonClicked = () => {
    this.setState({ addNew: true });
  };

  onCancelButtonClicked = () => {
    this.setState({ addNew: false });
  };

  onSaveButtonClicked = async () => {
    if (this.textareaRef.current) {
      this.setState({ processing: true });
      const newEntry = {
        entrydate: moment().valueOf(),
        entry: this.textareaRef.current.value
      };
      await bless.Data.of('diaryentries').save(newEntry);
      this.loadData(this.props.currentDate);
      this.setState({ addNew: false });
      this.setState({ processing: false });
    }
  };

  public render() {
    return (
      <div>
        {this.state.addNew && (
          <div>
            <textarea ref={this.textareaRef}></textarea>
            <Button onClick={this.onCancelButtonClicked}>Cancel</Button>
            <Button onClick={this.onSaveButtonClicked}>Save</Button>
            {this.state.processing && <span>Doing things ... </span>}
          </div>
        )}
        <ul>
          {this.state.entries.map((value: any) => {
            return (
              <li key={value.objectId}>
                {value.entrydate} - {value.entry}
              </li>
            );
          })}
        </ul>
        <SpeedDialAction icon={'add'} onClick={this.onAddEntryButtonClicked}></SpeedDialAction>
      </div>
    );
  }
}
