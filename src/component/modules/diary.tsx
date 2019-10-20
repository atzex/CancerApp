import * as React from 'react';
import bless from 'backendless';
import moment from 'moment';
import { SpeedDialAction } from 'devextreme-react/speed-dial-action';
import { Button } from 'devextreme-react';
import * as Icon from 'react-feather';

import DiaryEditComponent from './diaryedit';

export interface IDiaryPageProps {
  currentDate: number;
  onMount?: () => void;
}

export default class DiaryPage extends React.Component<IDiaryPageProps> {
  state = {
    editing: false,
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
    this.props.onMount && this.props.onMount();
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
    this.setState({ editing: {} });
  };

  onCancelButtonClicked = () => {
    this.setState({ editing: undefined });
  };

  onSaveButtonClicked = async (data: any) => {
    this.setState({ processing: true });
    await bless.Data.of('diaryentries').save(data);
    this.loadData(this.props.currentDate);
    this.setState({ editing: undefined, processing: false });
  };

  onDeleteButtonClicked = (diaryId: string) => {
    return async (e: any) => {
      e && e.event && e.event.stopPropagation();
      await bless.Data.of('diaryentries').remove(diaryId);
      this.loadData(this.props.currentDate);
    };
  };

  public render() {
    return (
      <div className="diary">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {this.state.editing && (
                <React.Fragment>
                  <DiaryEditComponent diaryentry={this.state.editing} onSave={this.onSaveButtonClicked} onCancel={this.onCancelButtonClicked} />
                  {this.state.processing && <span>Doing things ... </span>}
                </React.Fragment>
              )}
              <div className="diary__entry-list">
                {this.state.entries.map((value: any) => {
                  return (
                    <div
                      className="diary__entry"
                      key={value.objectId}
                      onClick={() => {
                        this.setState({ editing: value });
                      }}
                    >
                      <div className="diary__entry-message">
                        <p>{value.entry}</p>
                      </div>
                      <div className="diary__entry-footer">
                        <div className="diary__entry-mood">
                          <MoodIcon icon={value.entrymood} />
                        </div>
                        <time className="diary__entry-time">{moment(value.entrydate).format('hh:mm:ss a')}</time>
                      </div>
                      <Button className="diary__entry-delete" onClick={this.onDeleteButtonClicked(value.objectId)}>
                        <Icon.Trash2 />
                      </Button>
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

const MoodIcon = (props: any) => {
  if (!props) return null;
  let icon = props.icon;
  return (
    <React.Fragment>
      {icon === 'smile' && <Icon.Smile size={20} />}
      {icon === 'meh' && <Icon.Meh size={20} />}
      {icon === 'frown' && <Icon.Frown size={20} />}
    </React.Fragment>
  );
};
