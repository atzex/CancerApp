import * as React from 'react';
import bless from 'backendless';
import moment from 'moment';
import { Button, SpeedDialAction, DateBox } from 'devextreme-react';
import * as Icon from 'react-feather';

import FindingItemsPopupComponent from './findingitemspopup';

export interface IFindingsPageProps {
  currentDate: number;
  location?: any;
  onMount?: () => void;
}

export default class FindingsPage extends React.Component<IFindingsPageProps> {
  dateboxRef: React.RefObject<DateBox> = React.createRef();
  textboxRef: React.RefObject<HTMLInputElement> = React.createRef();
  inputfileRef: React.RefObject<HTMLInputElement> = React.createRef();
  _isMounted = false;

  state = {
    addNew: false,
    processing: false,
    findings: [],
    findingToLoad: ''
  };

  loadData = async (date: number) => {
    if (!this._isMounted) return;
    const dataQuery = bless.DataQueryBuilder.create()
      .setSortBy('findingdate DESC')
      .setWhereClause(
        'findingdate >= ' +
          date +
          'and findingdate < ' +
          moment(date)
            .add(1, 'd')
            .valueOf()
      );
    const findings = await bless.Data.of('findings').find(dataQuery);
    if (!this._isMounted) return;
    this.setState({ findings });
  };

  componentDidMount() {
    this._isMounted = true;
    this.props.onMount && this.props.onMount();
    this.loadData(this.props.currentDate);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  lastCurrentDate = 0;
  lastFindingId: any = undefined;
  componentDidUpdate(nextProps: IFindingsPageProps) {
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

  onDeleteButtonClicked = (findingId: string) => {
    return async (e: any) => {
      console.log(findingId);
      e && e.event && e.event.stopPropagation();
      await bless.Data.of('findingfiles').bulkDelete("findingref = '" + findingId + "'");
      await bless.Data.of('findings').remove(findingId);
      this.loadData(this.props.currentDate);
    };
  };

  onSaveButtonClicked = async () => {
    if (this.textboxRef.current && this.inputfileRef.current) {
      this.setState({ processing: true });
      const files = this.inputfileRef.current.files;
      const uploadResults = [];
      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const uploadResult: any = await bless.Files.upload(file, 'findings', true);
          uploadResult.filename = file.name;
          uploadResults.push(uploadResult);
        }
      }
      const newEntry = {
        findingdate: moment().valueOf(),
        findingtags: this.textboxRef.current.value
      };
      const saveresult: any = await bless.Data.of('findings').save(newEntry);
      if (uploadResults.length) {
        for (let result of uploadResults) {
          const fileentry = {
            filename: result.filename,
            file: result.fileURL,
            findingref: saveresult.objectId
          };
          await bless.Data.of('findingfiles').save(fileentry);
        }
      }
      this.loadData(this.props.currentDate);
      this.setState({ addNew: false });
      this.setState({ processing: false });
    }
  };

  public render() {
    return (
      <div className="findings">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {this.state.addNew && (
                <div className="findings__new-entry">
                  <DateBox className="findings__new-entry-datebox" defaultValue={Date.now()} ref={this.dateboxRef} type={'date'} />
                  <input className="findings__new-entry-text" type="text" ref={this.textboxRef} placeholder="Please add tags..." />
                  {/* <input className="findings__new-entry-file" ref={this.inputfileRef} type="file" multiple /> */}
                  <div className="input-group">
                    <div className="custom-file">
                      <input ref={this.inputfileRef} type="file" multiple className="custom-file-input" id="findingsFiles" aria-describedby="findingsFiles" />
                      <label className="custom-file-label" htmlFor="findingsFiles">
                        Browse
                      </label>
                    </div>
                  </div>
                  <Button className="btn btn-primary has-gradient btn-block btn-lg" onClick={this.onSaveButtonClicked}>
                    Save
                  </Button>
                  <Button className="btn btn-link btn-block btn-lg" onClick={this.onCancelButtonClicked}>
                    Cancel
                  </Button>
                  {this.state.processing && <span>Doing things ... </span>}
                </div>
              )}
              <div className="findings__entry-list">
                {this.state.findings.map((value: any) => {
                  return (
                    <div
                      className="findings__entry"
                      key={value.objectId}
                      onClick={() => {
                        this.setState({ findingToLoad: value.objectId });
                      }}
                    >
                      <div className="findings__entry-message">
                        <p>{value.findingtags}</p>
                      </div>
                      <time className="findings__entry-time">{moment(value.findingdate).format('hh:mm:ss a')}</time>
                      <Button className="findings__entry-delete" onClick={this.onDeleteButtonClicked(value.objectId)}>
                        <Icon.Trash2 />
                      </Button>
                    </div>
                  );
                })}
              </div>
              {this.state.findingToLoad && (
                <FindingItemsPopupComponent
                  findingToLoad={this.state.findingToLoad}
                  onClose={() => {
                    this.setState({ findingToLoad: '' });
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <SpeedDialAction icon={'add'} onClick={this.onAddEntryButtonClicked}></SpeedDialAction>
      </div>
    );
  }
}
