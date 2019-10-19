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
    this.textareaRef.current && this.textareaRef.current.focus();
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
      <div className="diary">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {this.state.addNew && (
                <div className="diary__new-entry">
                  <textarea className="diary__new-entry-textarea" ref={this.textareaRef} placeholder="Please type..."></textarea>
                  <Button className="btn btn-primary has-gradient btn-lg btn-block" onClick={this.onSaveButtonClicked}>
                    Save
                  </Button>
                  <Button className="btn btn-link btn-lg btn-block" onClick={this.onCancelButtonClicked}>
                    Cancel
                  </Button>
                  {this.state.processing && <span>Doing things ... </span>}
                </div>
              )}
              <div className="diary__entry-list">
                {this.state.entries.map((value: any) => {
                  return (
                    <div className="diary__entry" key={value.objectId}>
                      <div className="diary__entry-message">
                        <p>{value.entry}</p>
                      </div>
                      <time className="diary__entry-time">{moment(value.entrydate).format('hh:mm:ss a')}</time>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <SpeedDialAction icon={'add'} onClick={this.onAddEntryButtonClicked}></SpeedDialAction>
      </div>
    );
  }
}
